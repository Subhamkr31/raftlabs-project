import { User } from '../models/User'; // Adjust the import based on your project structure
import { ApolloError } from 'apollo-server-express';
import bcrypt from 'bcrypt'; // For password hashing
import jwt from 'jsonwebtoken'; // For generating JWT tokens
import { redisClient } from '../config/redis';

const CACHE_EXPIRATION = 300; // 5 minutes in seconds

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const PASSWORD_MIN_LENGTH = 8;

export const userResolver = {
  Query: {
    getUsers: async () => {
      try {
        // Try to get from Redis cache
        const cachedUsers = await redisClient.get('users:all');
        if (cachedUsers) {
          console.log('Cache hit: Returning users from cache');
          return JSON.parse(cachedUsers);
        }

        // If not in cache, get from database
        const users = await User.find();
        
        // Store in Redis cache
        await redisClient.setEx('users:all', CACHE_EXPIRATION, JSON.stringify(users));
        console.log('Cache miss: Users stored in cache');
        
        return users;
      } catch (error) {
        console.error('Cache error:', error);
        // Fallback to database if cache fails
        return await User.find();   
      }
    },
  },    
  Mutation: {
    register: async (_: any, { username, password }: { username: string; password: string }) => {
      try {
        // Input validation
        if (!username || !password) {
          throw new ApolloError("Username and password are required", "VALIDATION_ERROR");
        }
        
        if (username.length < USERNAME_MIN_LENGTH || username.length > USERNAME_MAX_LENGTH) {
          throw new ApolloError(
            `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`,
            "VALIDATION_ERROR"
          );
        }

        if (password.length < PASSWORD_MIN_LENGTH) {
          throw new ApolloError(
            `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
            "VALIDATION_ERROR"
          );
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new ApolloError("User already exists", "USER_ALREADY_EXISTS");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
          username,
          password: hashedPassword,
        });

        await newUser.save();

        // Invalidate users cache when new user is added
        await redisClient.del('users:all');

        // Return AuthPayload
        return {
    
          user: {
            _id: newUser._id,
            username: newUser.username
          }
        };
      } catch (error) {
        if (error instanceof ApolloError) throw error;
        console.error('Registration error:', error);
        throw new ApolloError("Failed to register user", "REGISTRATION_ERROR");
      }
    },
    login: async (_: any, { username, password }: { username: string; password: string }) => {
      try {
        // Input validation
        if (!username || !password) {
          throw new ApolloError("Username and password are required", "VALIDATION_ERROR");
        }

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
          throw new ApolloError("Invalid credentials", "INVALID_CREDENTIALS");
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new ApolloError("Invalid credentials", "INVALID_CREDENTIALS");
        }

        // Generate a JWT token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || 'task_manager1', { expiresIn: '1h' });

        // Return the token and user information
        return {
          token,
          user: {
            _id: user._id,
            username: user.username,
          },
        };
      } catch (error) {
        if (error instanceof ApolloError) throw error;
        console.error('Login error:', error);
        throw new ApolloError("Failed to login", "LOGIN_ERROR");
      }
    },
  },
}; 
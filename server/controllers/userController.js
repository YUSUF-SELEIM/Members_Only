import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

// Validation rules for sign-up
export const validateSignUp = [
    body('name').
    notEmpty().
    withMessage('Name is required')
    ,

    body('email')
    .notEmpty().withMessage('Email is required')
    .if((value, { req }) => value !== '') // Check if the field is not empty
    .trim() // Trim whitespace
    .isEmail() // Check if it's a valid email
    .withMessage('Email is invalid')
    .custom(async (value, { req }) => {
        if (value) {
            const existingUser = await User.findOne({ email: value });
            if (existingUser) {
                throw new Error('Email already exists');
            }
        }
    }),

    body('password')
    .notEmpty().withMessage('Password is required')
    .if((value, { req }) => value !== '') // Check if the field is not empty
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),

body('confirmPassword')
    .notEmpty().withMessage('Password Confirmation is required')
    .if((value, { req }) => value !== '') // Check if the field is not empty
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .custom((value, { req }) => {
        const { password } = req.body;
        if (value !== password) {
            throw new Error('Passwords do not match');
        }
        return true; // Indicates the validation passed
    }),




];
export const signUp = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password ,confirmPassword} = req.body;
        console.log(name,email,confirmPassword,password)

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        // Save the user to the database
        const result = await user.save();
        
        res.send("User created successfully");
    } catch (error) {
        // Handle errors
        console.error('Error creating user:', error);
        return next(error);
    }
});

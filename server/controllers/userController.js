import User from "../models/User.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { Strategy as LocalStrategy } from 'passport-local';
import passport from 'passport';

// Validation rules for sign-up
export const validateSignUp = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .if((value, { req }) => value !== "") // Check if the field is not empty
        .trim() // Trim whitespace
        .isEmail() // Check if it's a valid email
        .withMessage("Email is invalid")
        .custom(async (value, { req }) => {
            if (value) {
                const existingUser = await User.findOne({ email: value });
                if (existingUser) {
                    throw new Error("Email already exists");
                }
            }
        }),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .if((value, { req }) => value !== "") // Check if the field is not empty
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),

    body("confirmPassword")
        .notEmpty()
        .withMessage("Password Confirmation is required")
        .if((value, { req }) => value !== "") // Check if the field is not empty
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters")
        .custom((value, { req }) => {
            const { password } = req.body;
            if (value !== password) {
                throw new Error("Passwords do not match");
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
        const { name, email, password, confirmPassword } = req.body;
        console.log(name, email, confirmPassword, password);
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user instance
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });
        // Save the user to the database
        const result = await user.save();
        res.send("User created successfully");
    } catch (error) {
        // Handle errors
        console.error("Error creating user:", error);
        return next(error);
    }
});

// login
passport.use(
    new LocalStrategy(async (username, password, done) => {
        console.log("Email is  ", username);
        console.log("Password is  ", password);
        try {
            const user = await User.findOne({ email: { $regex: new RegExp('^' + username + '$', 'i') } });
            console.log("User is  ", user);
            if (!user) {
                return done(null, false, {
                    errors: [
                        { type: 'field', value: '', msg: 'Incorrect email', path: 'username', location: 'body' },
                    ]
                });
            };
            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return done(null, false, {
                    errors: [
                        { type: 'field', value: '', msg: 'Incorrect password', path: 'password', location: 'body' },
                    ]
                });
            };
            return done(null, user);
        } catch (err) {
            return done(err);
        };

    })
);

// Validation rules for sign-up
export const validateLogIn = [
    body("username")
        .notEmpty()
        .withMessage("Email is required")
        .if((value, { req }) => value !== "") // Check if the field is not empty
        .trim() // Trim whitespace
        .isEmail() // Check if it's a valid email
        .withMessage("Email is invalid")
    ,
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .if((value, { req }) => value !== "") // Check if the field is not empty
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),

];

export const logIn = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                errors: [
                    { type: 'field', value: '', msg: 'Invalid email or password', path: 'username', location: 'body' },
                ]
            });
        }
        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).json({ message: 'Logged in successfully' });
        });
    })(req, res, next);
});

passport.serializeUser((user, done) => {
    console.log("serialized User is  ", user.id);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        //extensive use of that
        const user = await User.findById(id);
        console.log("deserialized", user);
        done(null, user);
    } catch (err) {
        done(err);
    };
});

export const getProfile = asyncHandler(passport.authenticate('local'), async (req, res) => {
    console.log(req.user);
    // Access req.user.email safely
    const userEmail = req.user.email;
    res.send('Welcome to your profile, ' + userEmail);
});

export const getUser = asyncHandler(async (req, res) => {
    try {
        // Retrieve user ID from the request object (assuming it's stored in req.user.id)
        const userId = req.user.id;
        // Retrieve user data from the database by user ID
        const user = await User.findById(userId);
        // If user data is not found, return a 400 response
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        // Send the user data as a JSON response
        res.status(200).json(user);
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export const logOut = asyncHandler(async (req, res, next) => {
    console.log("Logging out");
    req.logout((err) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        // Clear the session cookie
        res.clearCookie('connect.sid', {
            httpOnly: true, // Set to true for improved security
            secure: true, // Set to true in production for HTTPS-only
            sameSite: 'none', // Set to 'lax' or 'strict' in production });
        });
        // Respond with a success message or redirect to another page
        res.status(200).send({ message: 'Logout successful' });
    });
});
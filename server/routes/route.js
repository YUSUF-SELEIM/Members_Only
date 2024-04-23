import express from 'express';
const router = express.Router();
import { signUp , validateSignUp } from '../controllers/userController.js';
import  passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';
import session from 'express-session';
import User from '../models/User.js';
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import MongoStore from 'connect-mongo';

router.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://yusufabdelfattah207:xRcBV80rikJQvLaA@cluster0.jb173jl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0' }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: false,
    },
    
  })
);
router.use(passport.session());
router.use(express.urlencoded({ extended: false }));

router.post('/sign-up',validateSignUp ,signUp);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log("Email is  ", username);
    console.log("Password is  ", password); 
    try {
      const user = await User.findOne({ email: username });
      console.log("User is  ", user);
      if (!user) {
          return done(null, false, { message: "Incorrect email" });
      };
      const match = await bcrypt.compare(password, user.password);
  
      if (!match) {
          return done(null, false, { message: "Incorrect password" });
      };
      return done(null, user);
      } catch(err) {
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

router.post('/log-in', validateLogIn, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' ,path: 'username'});
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
    console.log("deserialized",user);
    done(null, user);
  } catch(err) {
    done(err);
  };
});
router.get('/profile', passport.authenticate('local'), (req, res) => {
  console.log(req.user);
  // Access req.user.email safely
  const userEmail = req.user.email;
  res.send('Welcome to your profile, ' + userEmail);
});
router.get('/user', async (req, res) => {
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

export default router;
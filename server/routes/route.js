import express from 'express';
import dotenv from "dotenv";
import { signUp, validateSignUp, logIn ,validateLogIn ,getProfile ,getUser ,logOut} from '../controllers/userController.js';
import { savePost ,getPosts} from '../controllers/postController.js';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';

dotenv.config({path: '../.env'});
const router = express.Router();

router.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: 'lax', // Set to 'lax' or 'strict' in production
      secure: false, // Set to true in production for HTTPS-only
      httpOnly: false,
      domain:'https://membersonly-production-d8d9.up.railway.app'
    },
  })
);

router.use(passport.session());
router.use(express.urlencoded({ extended: false }));

router.post('/sign-up', validateSignUp, signUp);

router.post('/log-in',validateLogIn ,logIn);
router.get('/profile', getProfile); 
router.get('/user', getUser); 
router.delete("/log-out", logOut);

router.post('/new-post', savePost);
router.get('/posts', getPosts);

export default router;
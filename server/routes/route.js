import express from 'express';
const router = express.Router();
import { signUp , validateSignUp } from '../controllers/userController.js';

// router.get('/', function(req, res, next) {
//   res.send('index');
// });

router.post('/sign-up',validateSignUp ,signUp);

export default router;
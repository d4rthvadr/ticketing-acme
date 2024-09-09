import express, { type Request, type Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middlewares/validations/requestValidation';
import { User, type UserDocument } from '../models/user';
import { BadRequestError } from '../shared/error';
import { getUser } from '../db/repositories/user';
import { Password } from '../utils/password';
import { signJwtToken } from '../utils/jwt';

const router = express.Router();
// /api/users/signup
router.post(
  '/signup',
  [
    body('email')
      .trim()
      .notEmpty()
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // TODO: use actual logger instead
      throw new BadRequestError('User already exists');
    }

    try {
      const user: UserDocument = User.build({
        email,
        password,
      });

      await user.save();

      const userJwt = signJwtToken(user);

      req.session = {
        ...req.session,
        jwt: userJwt,
      };

      return res.status(201).send({ user });
    } catch (err) {
      console.log('Error', err);
      throw err;
    }
  },
);

// /api/users/signin
router.post(
  '/signin',
  [
    body('email').notEmpty().isEmail().withMessage('Email must be valid'),
    body('password').notEmpty().withMessage('Password is required:)'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const existingUser: UserDocument = await getUser({
        email,
      });

      if (!existingUser) {
        throw new BadRequestError('Invalid credentials');
      }

      const passwordMatch = await Password.compare(
        password,
        existingUser.password,
      );

      if (!passwordMatch) {
        throw new BadRequestError('Invalid credentials');
      }

      const userJwt = signJwtToken(existingUser);
      req.session = {
        ...req.session,
        jwt: userJwt,
      };

      return res.send({});
    } catch (err) {
      throw err;
    }
  },
);

router.post('/signout', async (req: Request, res: Response) => {
  req.session = null;
  return res.send({});
});

export default router;

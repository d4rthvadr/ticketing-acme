import express, { type Request, type Response } from 'express';
import { body } from 'express-validator';
import { User, type UserDocument } from '../models/user';
import { getUser } from '../db/repositories/user';
import { Password } from '../utils/password';
import { signJwtToken, validateRequest } from '@vtex-tickets/common';

const jwtSecret: string = process.env.JWT_SECRET;

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
      console.log('User already exists');
      // TODO: use actual logger instead
      return res.status(400).send({ errors: ['User already exists'] });
    }

    const user: UserDocument = User.build({
      email,
      password: await Password.toHash(password),
    });

    await user.save();

    const userJwt = signJwtToken(
      {
        id: user?._id?.toString(),
        email: user.email,
      },
      jwtSecret,
    );

    req.session = {
      ...req.session,
      jwt: userJwt,
    };

    console.log('User signed up', req.session);

    return res.status(201).send({ user });
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
    const { email, password } = req.body;

    const existingUser: UserDocument = await getUser({
      email,
    });

    if (!existingUser) {
      return res
        .status(400)
        .send({ message: 'Account not found or invalid credentials' });
    }

    const passwordMatch = await Password.compare(
      existingUser.password,
      password,
    );

    if (!passwordMatch) {
      return res
        .status(400)
        .send({ errors: ['Account not found or invalid credentials'] });
    }

    req.session = {
      ...req.session,
      jwt: signJwtToken(
        {
          id: existingUser?._id?.toString(),
          email: existingUser.email,
        },
        jwtSecret,
      ),
    };

    console.log('User signed in', req.session);

    return res.status(200).send({});
  },
);

router.post('/signout', async (req: Request, res: Response) => {
  req.session = null;
  return res.send({});
});

export default router;

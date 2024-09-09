import express, { type Request, type Response } from 'express';
import { currentUser, requireAuth } from './../middlewares/jwt';

const router = express.Router();

router.get(
  '/currentuser',
  currentUser,
  requireAuth,
  (req: Request, res: Response) => {
    const currentUser = req.user;

    // enrich currentUser with additional fields if necessary

    return res.send({ currentUser: currentUser || null });
  },
);

export default router;

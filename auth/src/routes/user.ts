import { currentUser, requireAuth } from '@vtex-tickets/common';
import type { Request, Response } from 'express';
import express from 'express';

const router = express.Router();

// api/users/currentuser
router.get(
  '/currentuser',
  requireAuth,
  currentUser,
  (req: Request, res: Response) => {

    // enrich currentUser with additional fields if necessary

    return res.send({ currentUser: req?.user || null });
  },
);

export default router;

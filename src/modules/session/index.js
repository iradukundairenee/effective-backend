import { Router } from 'express';
import {
  createSession,
  destroySession,
  getSessionsByUser,
} from './session.controller';
import {
  isAdminOrManager,
  isAuthenticated,
} from '../middleware/auth.middleware';

const sessionRouter = Router();

sessionRouter.post('/start', isAuthenticated, createSession);
sessionRouter.patch('/end', isAuthenticated, destroySession);
sessionRouter.get(
  '/getByUser/:userId',
  isAuthenticated,
  isAdminOrManager,
  getSessionsByUser,
);

export default sessionRouter;

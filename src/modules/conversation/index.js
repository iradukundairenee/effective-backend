import { Router } from 'express';
import conversation from './conversation.controller';

const conversationRouter = Router();

const { addConversation, getProjectConversation } = conversation;

conversationRouter.post('/add/:projectId', addConversation);

conversationRouter.get(
  '/getProjectConversation/:projectId',
  getProjectConversation,
);

export default conversationRouter;

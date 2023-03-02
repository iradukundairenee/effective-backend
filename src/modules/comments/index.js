import { Router } from 'express';
import comment from './comment.controller';

const commentRouter = Router();

const { getAllComment, addComment, proposalComents } = comment;

commentRouter.get('/getComments', getAllComment);
commentRouter.post('/add/:proposalId', addComment);
commentRouter.get('/getSingleComment/:proposalId', proposalComents);

export default commentRouter;

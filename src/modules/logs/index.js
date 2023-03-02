import { Router } from 'express';
import logs from './logs.controller';
import checkIfProductExist from '../middleware/product.midleware';

const { addLog, addLogs, getLogs } = logs;
const logsRouter = Router();

logsRouter.post('/many/', addLogs);
logsRouter.post('/:productId', checkIfProductExist, addLog);
logsRouter.get('/all/:productId', checkIfProductExist, getLogs);

export default logsRouter;

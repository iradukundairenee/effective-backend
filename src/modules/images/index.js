import { Router } from 'express';
import multer from 'multer';
import upload3DImages from './image.controller';

const upload = multer();

const imageRouter = Router();

imageRouter.post('/', upload.array('image', 2), upload3DImages);

export default imageRouter;

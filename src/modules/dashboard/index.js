import { Router } from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
import { DashboardController } from './dashboard.controller';

const route = Router();
const { getAssetsCount } = DashboardController;

route.get('/', isAuthenticated, getAssetsCount);

export default route;

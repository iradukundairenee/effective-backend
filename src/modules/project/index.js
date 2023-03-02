import { Router } from 'express';
import ProjectCtrl from './project.controller';
import {
  validateProjectBody,
  updateProjectStatus,
} from './project.validation';
import {
  checkManagerRoleAndProjectExists,
  doesProjectExist,
  isAddProductValid,
} from './project.middleware';
import {
  isAdmin,
  isAuthenticated,
  isClient,
  isNotVisitor,
} from '../middleware/auth.middleware';

const {
  createProject,
  updateProject,
  getProjects,
  archiveProject,
  getProjectHistories,
  getProjectDetail,
  createNewLog,
  addProductToProject,
  getProductProjects,
  completeProject,
} = ProjectCtrl;
const projectRouter = Router();

projectRouter.post('/', isClient, validateProjectBody, createProject);

projectRouter.get('/', getProjects);

projectRouter.get('/:id', doesProjectExist, getProjectDetail);

projectRouter.get(
  '/:id/histories',
  doesProjectExist,
  getProjectHistories,
);

projectRouter.patch(
  '/:id',
  isNotVisitor,
  validateProjectBody,
  doesProjectExist,
  updateProject,
);

projectRouter.patch(
  '/complete-project/:id',
  isAuthenticated,
  isAdmin,
  validateProjectBody,
  doesProjectExist,
  completeProject,
);

projectRouter.patch(
  '/approve-project/:id',
  updateProjectStatus,
  checkManagerRoleAndProjectExists,
  updateProject,
);
projectRouter.post('/:id/histories', doesProjectExist, createNewLog);
projectRouter.post(
  '/:id/products',
  doesProjectExist,
  isAddProductValid,
  addProductToProject,
);
projectRouter.get('/:id/products', getProductProjects);
projectRouter.patch(
  '/archiveProject/:id',
  doesProjectExist,
  archiveProject,
);

export default projectRouter;

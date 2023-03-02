import { Router } from 'express';
import crm from './employees/employee.controller';
import ProjectController from './project/project.controller';
import UsersController from './users/users.controller';
import SubscriptionController from './subscription/subscription.controller';

const crmRouter = Router();
const { listProjectsDetails, SingleProjectsDetails } =
  ProjectController;
const { getAllEmployees } = crm;
const { registerUser, getUsers, updateUser } = UsersController;
const { getCurrentSubscription } = SubscriptionController;

crmRouter.get('/users', getUsers);
crmRouter.post('/createUser', registerUser);
crmRouter.get('/employees', getAllEmployees);
crmRouter.patch('/updateUser/:id', updateUser);
crmRouter.get('/projects/:type/:userId', listProjectsDetails);
crmRouter.get('/project/:id/:projectId', SingleProjectsDetails);
crmRouter.get('/subscription/:id', getCurrentSubscription);
export default crmRouter;

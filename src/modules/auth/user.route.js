import { Router } from 'express';
import AuthController from './auth.controller';
import {
  validateUserBody,
  validateSecurePassword,
  validateLoginBody,
  validateNewPassword,
  validateChangePassword,
} from './auth.validation';
import {
  checkEmailExists,
  checkPasswordCredentials,
  checkUserCredential,
  doesUserExist,
} from './auth.middleware';
import {
  isAuthenticated,
  isAdmin,
  isAdminOrManager,
} from '../middleware/auth.middleware';

const userRouter = Router();

userRouter.post(
  '/register',
  isAuthenticated,
  isAdminOrManager,
  validateUserBody,
  checkEmailExists,
  AuthController.createAccount,
);
userRouter.get(
  '/user/:id',
  isAuthenticated,
  AuthController.getSpecificUserData,
);
userRouter.patch(
  '/users/:userId',
  isAuthenticated,
  isAdminOrManager,
  doesUserExist,
  validateUserBody,
  checkEmailExists,
  AuthController.updateUserInfo,
);
userRouter.delete(
  '/users/:userId',
  isAuthenticated,
  isAdmin,
  doesUserExist,
  AuthController.deleteUser,
);
/**
 * @openapi
 *
 * /api/v1/auth/login:
 *  post:
 *   summary: Log in
 *   description: Log in
 *   tags:
 *   - User
 *   parameters:
 *   - in: body
 *     name: cube
 *     description: Enter your email and password
 *     schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *        password:
 *         type: string
 *   responses:
 *    201:
 *     description: Logged in Successfully
 *    401:
 *     description: Invalid email and password
 */
userRouter.post(
  '/login',
  validateLoginBody,
  checkUserCredential,
  AuthController.login,
);
userRouter.patch(
  '/secure-password',
  validateSecurePassword,
  checkPasswordCredentials,
  AuthController.updatingPassword,
);
userRouter.patch(
  '/set-password',
  validateNewPassword,
  AuthController.setNewPassword,
);
userRouter.post('/send-reset-link', AuthController.sendResetPassword);
userRouter.post(
  '/validatePasswordResetToken',
  AuthController.verifyResetToken,
);

userRouter.post(
  '/reset-password',
  validateNewPassword,
  AuthController.resetPassword,
);
userRouter.patch(
  '/edit-profile',
  isAuthenticated,
  AuthController.editAccount,
);
userRouter.delete(
  '/delete-profile-pic',
  isAuthenticated,
  AuthController.deleteProfilePicture,
);
userRouter.get('/users', isAuthenticated, AuthController.getUsers);
userRouter.post(
  '/seed',
  isAuthenticated,
  isAdminOrManager,
  AuthController.seed,
);
userRouter.patch(
  '/change-password',
  isAuthenticated,
  validateChangePassword,
  AuthController.changePassword,
);

userRouter.get(
  '/domain-names/:userId',
  isAuthenticated,
  AuthController.getUserDomains,
);

userRouter.post(
  '/domain-names/:userId',
  isAuthenticated,
  AuthController.addUserDomains,
);

userRouter.post('/logout', isAuthenticated, AuthController.Logout);

export default userRouter;

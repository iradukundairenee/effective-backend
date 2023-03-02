import {
  OK,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from 'http-status';
import { randomBytes } from 'crypto';
import ResponseUtil from '../../utils/response.util';
import User from '../../database/model/user.model';
import BcryptUtil from '../../utils/Bcrypt.util';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import data from '../../database/seed/users/users';
import TokenUtil from '../../utils/jwt.util';
import { sendConfirmationEmail } from '../mail/mail.controller';
import { resetPassword } from '../../utils/resetPasswordTemplate';
import { resetPasswordSuccess } from '../../utils/resetPasswordSucessTemplate';
import { serverResponse } from '../../utils/response';
import CurrencyCustomer from '../../database/model/customerCurrency.model';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * This class will contains all function to handle account
 * required to create account for now
 */
class AuthController {
  /**
   * This function to handle create ccount request.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status and some data of created account.
   */
  static async createAccount(req, res) {
    try {
      req.body.resetKey = randomBytes(40).toString('hex');
      const user = await User.create(req.body);
      await sendConfirmationEmail(
        user,
        'A.R.I Secure Password',
        'setPassword',
      );
      return ResponseUtil.handleSuccessResponse(
        CREATED,
        'User account created successfully',
        user,
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }

  /**
   * This function to handle update user request.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status and some data of updated account.
   */
  static async updateUserInfo(req, res) {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);
      const { firstName, lastName } = req.body;
      req.body.fullName = `${firstName} ${lastName}`;
      await user.updateOne(req.body);

      const resMsg = 'User account update successfully';
      return serverResponse(res, 200, resMsg);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  /**
   * This function to get user's domain names.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {array} The users domain names.
   */
  static async getUserDomains(req, res) {
    try {
      const { userId } = req.params;
      const { _id, role } = req.userData;

      let queryUserId = _id;

      if (role === 'Client' && _id !== userId)
        return serverResponse(res, 400, 'not authorized');

      if (role === 'Admin' || role === 'Manager')
        queryUserId = userId;

      const user = await User.findById(queryUserId);
      const { domainNames } = user;
      return serverResponse(res, 200, 'Success', domainNames);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  /**
   * This function to create user's domain names.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {array} New user's domain names.
   */
  static async addUserDomains(req, res) {
    try {
      const { userId } = req.params;
      const { _id, role } = req.userData;
      const { domainNames } = req.body;

      const newDomains = [];
      await domainNames.forEach((domainName) =>
        newDomains.push(domainName.replace(/.+\/\/|www.|\+/g, '')),
      );

      if (role === 'Client' && _id !== userId)
        return serverResponse(res, 400, 'not authorized');

      if (domainNames.length === 0)
        return serverResponse(res, 400, 'no domain names provided');

      if (role === 'Admin' || role === 'Manager') {
        const user = await User.findById(userId);
        if (!user) return serverResponse(res, 404, 'user not found');

        const newUserDomainName = await User.updateOne(
          { _id: user._id },
          { domainNames: newDomains },
          { upsert: true },
        );
        return serverResponse(res, 200, 'Success', newUserDomainName);
      }

      const newUserDomainName = await User.updateOne(
        { _id },
        { domainNames: newDomains },
        { upsert: true },
      );
      return serverResponse(res, 200, 'Success', newUserDomainName);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  /**
   * This function to handle delete user request.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status.
   */
  static async deleteUser(req, res) {
    const { userId } = req.params;
    try {
      await CurrencyCustomer.findOneAndRemove({ user: userId });
      await User.findByIdAndRemove(userId);
      return ResponseUtil.handleSuccessResponse(
        CREATED,
        'User account deleted successfully',
        {},
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }
  /**
   * @description this function is invoked to login
   * @param {object} req request
   * @param {object} res response
   * @return {object} returns an object containing a success message and token
   */

  static async login(req, res) {
    const { email } = req.body;
    try {
      const user = await InstanceMaintain.findOneData(User, {
        email,
      });
      const userData = { ...user._doc };
      delete userData.password;
      return ResponseUtil.handleSuccessResponse(
        OK,
        'Successfully logged in',
        {
          user: userData,
          token: TokenUtil.generateToken(userData),
        },
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }

  static async editAccount(req, res) {
    try {
      const { _id: id } = req.body;
      const oldUuser = await User.findOne({ _id: id });
      if (!oldUuser) {
        return ResponseUtil.handleErrorResponse(
          BAD_REQUEST,
          "User doesn't exist",
          res,
        );
      }
      const toUpdate = {
        ...req.body,
        fullName: req.body.firstName + ' ' + req.body.lastName,
      };
      const user = await User.findByIdAndUpdate(id, toUpdate, {
        new: true,
      });
      const updatedUser = { token: req.body.token, user };
      return ResponseUtil.handleSuccessResponse(
        OK,
        'User has been updated',
        updatedUser,
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }

  static async deleteProfilePicture(req, res) {
    try {
      const { _id: userId } = req.userData || {};
      const user = await User.findById(userId);
      if (user) {
        user.profileImage = '';
        await user.save();

        return res.status(OK).json({
          status: OK,
          message: 'Profile picture deleted successfully',
        });
      }
      return res.status(NOT_FOUND).json({
        status: NOT_FOUND,
        message: 'You dont have permission to perform the actio',
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: INTERNAL_SERVER_ERROR,
        message: 'Failed to delete profile picture',
      });
    }
  }

  /**
   * This function is for updating the user password.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status and some data of created account.
   */
  static async updatingPassword(req, res) {
    const { email, password } = req.body;
    try {
      await InstanceMaintain.findOneAndUpdateData(
        User,
        { email },
        {
          password: BcryptUtil.hashPassword(password),
        },
      );

      const user = await InstanceMaintain.findOneData(User, {
        email,
      });
      if (user && user.role === 'visitor') {
        await InstanceMaintain.findOneAndUpdateData(
          User,
          { email },
          { role: 'client' },
          { new: true },
        );
      }
      const updatedData = { ...user._doc };
      delete updatedData.password;

      ResponseUtil.setSuccess(
        OK,
        'Successful updated your password',
        updatedData,
      );
      return ResponseUtil.send(res);
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }

  /**
   * This function is for setting a new password user password.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status and some data of created account.
   */
  static async setNewPassword(req, res) {
    const { token, password } = req.body;
    try {
      const user = await User.findOne({ resetKey: token }).select({
        password: 0,
        resetKey: 0,
      });
      if (user) {
        user.password = BcryptUtil.hashPassword(password);
        user.resetKey = null;

        await user.save();

        ResponseUtil.setSuccess(OK, 'Successful set new password');
        return ResponseUtil.send(res);
      }
      ResponseUtil.setError(NOT_FOUND, 'Token not found');
      return ResponseUtil.send(res);
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }

  /**
   * This function is for sending reset link email.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object}
   */
  static async sendResetPassword(req, res) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email }).select({
        password: 0,
        resetKey: 0,
      });
      if (user && user.role !== 'visitor') {
        user.resetKey = randomBytes(40).toString('hex');
        await user.save();
        const msg = {
          to: user.email,
          from: process.env.MAIL_FROM,
          subject: 'A.R.I reset password',
          html: resetPassword(user),
        };
        await sgMail.send(msg);
        ResponseUtil.setSuccess(
          OK,
          'Visit your email for the reset link',
        );
        return ResponseUtil.send(res);
      }
      ResponseUtil.setError(
        NOT_FOUND,
        'No user found with the email',
      );
      return ResponseUtil.send(res);
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }

  /*
   * This function is for verifying the password reset token a user.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object}
   */
  static async verifyResetToken(req, res) {
    const { token } = req.body;
    try {
      const user = await User.findOne({
        resetKey: token,
      });
      if (user) {
        ResponseUtil.setSuccess(OK, 'Token valid');
        return ResponseUtil.send(res);
      }
      ResponseUtil.setSuccess(OK, 'Token not valid');
      return ResponseUtil.send(res);
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }

  /**
   * This function is for resetting a user password.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object}
   */
  static async resetPassword(req, res) {
    const { token, password } = req.body;
    try {
      const user = await User.findOne({ resetKey: token }).select({
        password: 0,
        resetKey: 0,
      });
      if (user && user.role !== 'visitor') {
        user.password = BcryptUtil.hashPassword(password);
        user.resetKey = null;

        await user.save();
        const msg = {
          to: user.email,
          from: process.env.MAIL_FROM,
          subject: 'Email Password Changed',
          html: resetPasswordSuccess(user),
        };
        await sgMail.send(msg);
        ResponseUtil.setSuccess(OK, 'Successful set new password');
        return ResponseUtil.send(res);
      }
      ResponseUtil.setError(NOT_FOUND, 'Token not found');
      return ResponseUtil.send(res);
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }

  static async seed(req, res) {
    await User.deleteMany({});
    const userSeed = await InstanceMaintain.createData(
      User,
      data.users,
    );
    ResponseUtil.setSuccess(201, 'Users seeded', userSeed);
    return ResponseUtil.send(res);
  }

  /**
   * This function to handle all getting users.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status and some data of created account.
   */
  static async getUsers(req, res) {
    try {
      const { role } = req.query;
      const { _id: userId, role: userRole } = req.userData || {};
      let conditions = {};
      if (role) {
        conditions = { ...conditions, role };
      }
      if (userRole === 'Client') {
        conditions = { _id: userId };
      }
      const users = await User.find(conditions)
        .sort({ createdAt: -1 })
        .select({ password: 0, resetKey: 0 });
      return ResponseUtil.handleSuccessResponse(
        OK,
        'User accounts have been retrieved',
        users,
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }

  static async getSpecificUserData(req, res) {
    const { id } = req.params;
    try {
      const userData = await User.findOne({ _id: id });
      return ResponseUtil.handleSuccessResponse(
        OK,
        'User data has been retrieved',
        userData,
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }

  static async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      const { _id } = req.userData;
      const user = await User.findById(_id);
      const currentPAssword = user.password;
      if (BcryptUtil.comparePassword(oldPassword, currentPAssword)) {
        const password = BcryptUtil.hashPassword(newPassword);
        user.password = password;
        await user.save();
        ResponseUtil.setSuccess(OK, 'Password changed');
      } else {
        return ResponseUtil.handleErrorResponse(
          BAD_REQUEST,
          'Old password is incorrect',
          res,
        );
      }
      return ResponseUtil.send(res);
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }

  // eslint-disable-next-line no-empty-function
  static async Logout(req, res) {
    if (delete req.session) {
      return res.send('logout success');
    }
  }
}

export default AuthController;

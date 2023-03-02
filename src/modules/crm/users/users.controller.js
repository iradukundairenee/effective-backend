import { randomBytes } from 'crypto';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from 'http-status';
import User from '../../../database/model/user.model';
import Session from '../../../database/model/session.model';
import ResponseUtil from '../../../utils/response.util';
import { createdUser } from '../../../utils/createdUserTemplate';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class UsersController {
  /**
   * This function to handle all getting users with their projects.
   * @param {object} req The http request.
   * @param {object} res The response.
   */
  static async getUsers(req, res) {
    try {
      const users = await User.aggregate([
        { $match: { role: 'Client' } },
        {
          $unset: ['password', 'resetKey'],
        },
        {
          $lookup: {
            from: 'projects',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$user', '$$userId'] },
                },
              },
            ],
            as: 'projects',
          },
        },
        {
          $lookup: {
            from: 'projects',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$user', '$$userId'] },
                },
              },
              {
                $match: {
                  $expr: { $eq: ['$status', 'pending'] },
                },
              },
            ],
            as: 'pendingProjects',
          },
        },
        {
          $lookup: {
            from: 'products',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$customer', '$$userId'],
                  },
                },
              },
            ],
            as: 'products',
          },
        },
        {
          $lookup: {
            from: 'customercoupons',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$user', '$$userId'],
                  },
                },
              },
            ],
            as: 'coupons',
          },
        },
        {
          $lookup: {
            from: 'subscribers',
            let: { subscriber: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$userId', '$$subscriber'],
                  },
                },
              },
              {
                $match: {
                  $expr: {
                    $eq: ['$status', 'Active'],
                  },
                },
              },
            ],
            as: 'subscription',
          },
        },
      ]).sort({ createdAt: -1 });

      const getSessions = async (user) => {
        const userSessions = await Session.find({
          userId: user._id,
        }).sort({ startedAt: -1 });

        user.sessions = userSessions.length || 0;
        return user;
      };

      const usersWithSessions = await Promise.all(
        users.map(async (user) => {
          return getSessions(user);
        }),
      );

      return ResponseUtil.handleSuccessResponse(
        OK,
        'User accounts have been retrieved',
        usersWithSessions,
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

  static async registerUser(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (user) {
        return ResponseUtil.handleErrorResponse(
          BAD_REQUEST,
          'User already exists',
          res,
        );
      }
      const newUser = await User.create(req.body);
      newUser.resetKey = randomBytes(40).toString('hex');
      newUser.save();
      const msg = {
        to: email,
        from: process.env.MAIL_FROM,
        subject: 'Welcome to AR Innovations',
        html: createdUser(newUser),
      };
      sgMail.send(msg);
      return ResponseUtil.handleSuccessResponse(
        OK,
        'New user created',
        newUser,
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

  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findOne({ _id: id });
      if (!user) {
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
      const updateUser = await User.findByIdAndUpdate(id, toUpdate, {
        new: true,
      });
      return ResponseUtil.handleSuccessResponse(
        OK,
        'User has been updated',
        updateUser,
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
}

export default UsersController;

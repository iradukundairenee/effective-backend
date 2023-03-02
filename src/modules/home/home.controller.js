import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import ResponseUtil from '../../utils/response.util';
import Project from '../../database/model/project.schema';
// import Invoice from '../../database/model/invoice.model';
import Quote from '../../database/model/quote.model';
import User from '../../database/model/user.model';
import Subscription from '../../database/model/subscription.model';
import Notification from '../../database/model/notification.model';
import { serverResponse } from '../../utils/response';

/**
 * Home controller class
 */
class HomeController {
  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to retrieve counts
   */
  static async getDashboardCounts(req, res) {
    const { _id: userId, role } = req.userData;
    try {
      let conditions = { user: userId };
      let quoteConditions = conditions;

      if (role !== 'Client') {
        conditions = {};
        quoteConditions = {};
      }
      if (role === 'Client') {
        quoteConditions = {
          ...quoteConditions,
          status: { $ne: 'Draft' },
        };
      }

      const projects = await Project.countDocuments(conditions);
      const users = await User.countDocuments();
      const subscriptions = await Subscription.countDocuments(
        conditions,
      );
      const quotes = await Quote.countDocuments(quoteConditions);

      const counts = {
        projects,
        users,
        subscriptions,
        quotes,
      };
      return serverResponse(res, 200, 'Successful', counts);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to retrieve notifications
   */
  static async getNotifications(req, res) {
    const { _id: userId, role } = req.userData;
    const { type = null } = req.query;
    let notifications;

    try {
      let conditions = { createdBy: { $ne: userId } };

      if (role === 'Manager') {
        conditions = {
          ...conditions,
          manager: userId,
        };
      }

      if (role === 'Client') {
        conditions = {
          ...conditions,
          user: userId,
          description: { $ne: 'Proposal download' },
        };
      }

      if (type === 'count') {
        notifications = await Notification.countDocuments({
          ...conditions,
          reads: { $ne: userId },
        });
      } else {
        notifications = await Notification.find(conditions)
          .populate({
            path: 'createdBy',
            select: 'fullName companyName',
            model: User,
          })
          .sort({
            createdAt: -1,
          });
        await Notification.updateMany(conditions, {
          $addToSet: { reads: userId },
        });
      }

      ResponseUtil.setSuccess(OK, 'Success', notifications);
      return ResponseUtil.send(res);
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }

  static home(_req, res) {
    try {
      return ResponseUtil.handleSuccessResponse(
        OK,
        'Up and Running',
        '',
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.message,
        res,
      );
    }
  }
}

export default HomeController;

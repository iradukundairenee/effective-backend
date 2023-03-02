import User from '../../../database/model/user.model';
import Session from '../../../database/model/session.model';
import { serverResponse } from '../../../utils/response';

class CrmController {
  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to retrieve employees
   */

  static async getAllEmployees(req, res) {
    try {
      const employees = await User.aggregate([
        { $match: { role: 'Manager' } },
        {
          $unset: ['password', 'resetKey'],
        },
        {
          $lookup: {
            from: 'projects',
            let: { managerId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$manager', '$$managerId'] },
                },
              },
            ],
            as: 'projects',
          },
        },
        {
          $lookup: {
            from: 'projects',
            let: { managerId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$manager', '$$managerId'] },
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
      ]).sort({ createdAt: -1 });

      const getSessions = async (user) => {
        const userSessions = await Session.find({
          userId: user._id,
        }).sort({ startedAt: -1 });

        user.sessions = userSessions.length || 0;
        return user;
      };

      const employeesWithSessions = await Promise.all(
        employees.map(async (user) => {
          return getSessions(user);
        }),
      );

      return serverResponse(
        res,
        200,
        'Success',
        employeesWithSessions,
      );
    } catch (error) {
      return serverResponse(res, 500, 'Error', error);
    }
  }
}

export default CrmController;

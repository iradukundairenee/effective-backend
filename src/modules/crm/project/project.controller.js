import mongoose from 'mongoose';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import { serverResponse } from '../../../utils/response';
import Project from '../../../database/model/project.schema';
import User from '../../../database/model/user.model';
import Product from '../../../database/model/product.model';

const { ObjectId } = mongoose.Types;

class ProjectController {
  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to create a project proposal
   */
  static async listProjectsDetails(req, res) {
    const { type, userId } = req.params;
    try {
      const projects = await Project.aggregate([
        { $match: { [type]: ObjectId(userId) } },

        {
          $lookup: {
            from: 'projectproducts',
            let: { projectId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$project', '$$projectId'] },
                },
              },
              {
                $lookup: {
                  from: 'products',
                  let: { id: '$product' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$_id', '$$id'] },
                      },
                    },
                  ],
                  as: 'productDetails',
                },
              },
            ],
            as: 'products',
          },
        },
      ]).sort({ createdAt: -1 });
      return serverResponse(res, 200, 'Success', projects);
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        error,
      });
    }
  }

  static async SingleProjectsDetails(req, res) {
    const { projectId, id } = req.params;
    try {
      const projects = await Project.find({
        _id: projectId,
        user: id,
      })
        .populate({
          path: 'user',
          select: 'fullName firstName lastName',
          model: User,
        })
        .populate({
          path: 'product',
          select: 'name price',
          model: Product,
        })
        .sort({
          createdAt: -1,
        });
      return serverResponse(res, 200, 'Success', projects);
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        status: INTERNAL_SERVER_ERROR,
        message: 'Something went wrong',
        error,
      });
    }
  }
}
export default ProjectController;

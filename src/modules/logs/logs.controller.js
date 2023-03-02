import {
  OK,
  CREATED,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} from 'http-status';
import Log from '../../database/model/logs.model';
import User from '../../database/model/user.model';
import { serverResponse } from '../../utils/response';
import Product from '../../database/model/product.model';

class LogsController {
  static async addLog(req, res) {
    const { _id } = req.userData;
    const { productId } = req.params;
    const { description } = req.body;

    if (!description)
      return serverResponse(res, BAD_REQUEST, 'provide description');

    const log = await Log.create({
      description,
      user: _id,
      product: productId,
    });

    if (!log) return serverResponse(res, BAD_REQUEST, 'Bad request');
    return serverResponse(res, CREATED, 'success', log);
  }

  // create multiple logs
  static async addLogs(req, res) {
    try {
      if (!req.body.length)
        return serverResponse(res, BAD_REQUEST, 'no log provided');

      const { _id } = req.userData;
      const { user, product } = req.body[0];

      if (_id !== user)
        return serverResponse(res, BAD_REQUEST, 'wrong user id');

      // check if product exist
      const productExist = await Product.findById(product);
      if (!productExist)
        return serverResponse(res, NOT_FOUND, 'asset not found');

      const logs = await Log.insertMany(req.body);
      return serverResponse(res, CREATED, 'success', logs);
    } catch (error) {
      return serverResponse(
        res,
        INTERNAL_SERVER_ERROR,
        'internal server error',
        error,
      );
    }
  }

  // get logs
  static async getLogs(req, res) {
    try {
      const { productId } = req.params;

      const logs = await Log.find({ product: productId })
        .populate({
          path: 'user',
          select: 'firstName lastName',
          model: User,
        })
        .sort({
          createdAt: -1,
        });

      if (!logs.length)
        return serverResponse(res, NOT_FOUND, 'no logs found');

      return serverResponse(res, OK, 'Success', logs);
    } catch (error) {
      return serverResponse(
        res,
        INTERNAL_SERVER_ERROR,
        'internal server error',
        error,
      );
    }
  }
}

export default LogsController;

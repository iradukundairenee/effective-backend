/* eslint-disable import/prefer-default-export */
import { NOT_FOUND, INTERNAL_SERVER_ERROR } from 'http-status';
import User from '../../database/model/user.model';
import Quote from '../../database/model/quote.model';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import ResponseUtil from '../../utils/response.util';

export const checkSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await InstanceMaintain.findDataId(User, id)
   
  } catch (error) {
    ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
    return ResponseUtil.send(res);
  }
  next();
};

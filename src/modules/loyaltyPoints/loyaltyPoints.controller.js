import { serverResponse } from '../../utils/response';
import LoyaltyPoints from '../../database/model/loyaltyPoints.model';
import Currency from '../../database/model/currency.model';

class LoyaltyPointsController {
  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to retrieve loyalty points
   */

  static async getLoyaltyPoints(req, res) {
    try {
      const loyaltyPoints = await LoyaltyPoints.find().populate({
        path: 'currencyType',
        select: 'currencyName currencyCode icon',
        model: Currency,
      });
      return serverResponse(res, 200, 'Success', loyaltyPoints);
    } catch (error) {
      return serverResponse(res, 400, error);
    }
  }

  static async getSingleLoyaltyPoints(req, res) {
    try {
      const { pointsId } = req.params;
      const loyaltyPoints = await LoyaltyPoints.findById(
        pointsId,
      ).populate({
        path: 'currencyType',
        select: 'currencyCode',
        model: Currency,
      });
      return serverResponse(res, 200, 'Success', loyaltyPoints);
    } catch (error) {
      return serverResponse(res, 400, error);
    }
  }

  static async createLoyalyPoints(req, res) {
    try {
      const { code } = req.body;
      const loyaltyPoint = await LoyaltyPoints.findOne({ code });

      if (loyaltyPoint) {
        return serverResponse(
          res,
          400,
          'loyalty points already exists',
        );
      }
      const newLoyaltyPoint = await LoyaltyPoints.create(req.body);
      return serverResponse(res, 200, 'Created', newLoyaltyPoint);
    } catch (error) {
      return serverResponse(res, 400, error);
    }
  }

  static async updateLoyalyPoints(req, res) {
    try {
      const { pointsId } = req.params;
      const loyaltyPoint = await LoyaltyPoints.findById(pointsId);

      if (!loyaltyPoint) {
        return serverResponse(
          res,
          404,
          "loyalty points doesn't exists",
        );
      }
      const updatedLoyaltyPoint =
        await LoyaltyPoints.findByIdAndUpdate(pointsId, req.body, {
          new: true,
        });
      return serverResponse(res, 201, 'Updated', updatedLoyaltyPoint);
    } catch (error) {
      return serverResponse(res, 400, error);
    }
  }
}

export default LoyaltyPointsController;

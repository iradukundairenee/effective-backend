import { BAD_REQUEST, INTERNAL_SERVER_ERROR, OK } from 'http-status';
import Coupon from '../../database/model/coupon.model';
import CustomerCoupon from '../../database/model/customerCoupons';
import ResponseUtil from '../../utils/response.util';

export const createCoupon = async (req, res) => {
  try {
    const { customerList, couponCode } = req.body;
    const coupon = await Coupon.findOne({ couponCode });
    if (coupon) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        message: 'Coupon already exists',
      });
    }
    const newCoupon = await Coupon.create(req.body);
    const customers = customerList.map((cust) => ({
      user: cust._id,
      coupon: newCoupon._id,
    }));

    await CustomerCoupon.create(customers);
    return res.status(201).json({
      status: 201,
      message: 'Successful',
      newCoupon,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: 500,
      message: 'something went wrong',
      error,
    });
  }
};

export const addCouponOnCustomer = async (req, res) => {
  try {
    const { couponId, userId } = req.params;
    const newCoupon = await CustomerCoupon.create({
      user: userId,
      coupon: couponId,
    });
    return res.status(201).json({
      status: 201,
      message: 'Successful',
      newCoupon,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: INTERNAL_SERVER_ERROR,
      message: 'something went wrong',
      error,
    });
  }
};

export const removeUserOnCoupon = async (req, res) => {
  try {
    const { couponId, userId } = req.params;
    const userWithCoupon = await CustomerCoupon.find({
      user: userId,
      coupon: couponId,
    });
    if (!userWithCoupon) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        message: "User with this coupon doesn't exists",
      });
    }
    const deleted = await CustomerCoupon.deleteOne({
      user: userId,
    });
    if (deleted.deletedCount === 0) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        message: 'failed to delete this customer',
      });
    }
    return res.status(OK).json({
      status: OK,
      message: 'Successfully Deleted',
      deleted,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
      error,
    });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().populate({
      path: 'currencyType',
      select: 'currencyCode',
    });
    return res.status(200).json({
      status: 200,
      message: 'Successful',
      coupons,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: INTERNAL_SERVER_ERROR,
      message: 'something went wrong',
      error,
    });
  }
};

export const getCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const coupon = await Coupon.findById(couponId).populate({
      path: 'currencyType',
      select: 'currencyCode icon',
    });

    return res.status(200).json({
      status: 200,
      message: 'Successful',
      coupon,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: INTERNAL_SERVER_ERROR,
      message: 'something went wrong',
      error,
    });
  }
};

export const getCouponCustomers = async (req, res) => {
  try {
    const { couponId } = req.params;
    const customers = await CustomerCoupon.find({
      coupon: couponId,
    }).populate({
      path: 'user',
      select: 'fullName companyName profileImage',
    });
    return res.status(200).json({
      status: 200,
      message: 'Successful',
      customers,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: INTERNAL_SERVER_ERROR,
      message: 'something went wrong',
      error,
    });
  }
};

export const getClientCoupon = async (req, res) => {
  try {
    const { _id: userId } = req.userData;
    const coupons = await CustomerCoupon.find({
      user: userId,
    }).populate({
      path: 'coupon',
      select: 'couponCode percentageValue discountAmount couponType',
    });
    ResponseUtil.handleSuccessResponse(
      OK,
      'Coupons have been retrieved',
      coupons,
      res,
    );
  } catch (error) {
    return ResponseUtil.handleErrorResponse(
      INTERNAL_SERVER_ERROR,
      'something went wrong',
      error,
    );
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { couponId } = req.params;
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      couponId,
      req.body,
      {
        new: true,
      },
    );
    return res.status(OK).json({
      status: OK,
      message: 'Successful',
      updatedCoupon,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
      error,
    });
  }
};

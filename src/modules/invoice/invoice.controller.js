import {
  INTERNAL_SERVER_ERROR,
  CREATED,
  OK,
  NOT_FOUND,
  BAD_REQUEST,
} from 'http-status';
import * as fs from 'fs';
import pdf from 'pdf-creator-node';
import path from 'path';
import moment from 'moment';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import Invoice from '../../database/model/invoice.model';
import User from '../../database/model/user.model';
import CurrencyCustomer from '../../database/model/customerCurrency.model';
import Currency from '../../database/model/currency.model';
import Quote from '../../database/model/quote.model';
import Coupon from '../../database/model/coupon.model';
import LoyaltyPoints from '../../database/model/loyaltyPoints.model';
import Project from '../../database/model/project.schema';
import Subscription from '../../database/model/subscriptionPlan.model';
import Item from '../../database/model/Items';
import ProposalItem from '../../database/model/proposalItem';
import ResponseUtil from '../../utils/response.util';
import invoiceHelper from './invoice.helper';
import { logProject } from '../../utils/log.project';
import { serverResponse } from '../../utils/response';
import CustomerCoupon from '../../database/model/customerCoupons';
import createLog from '../../utils/track.allctivities';
/**
 * This class will contains all function to handle account
 * required to create account for now
 */
class InvoiceController {
  /**
   * This function to handle generate invoice request.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status and some data of created account.
   */
  static async generateInvoice(req, res) {
    try {
      req.body.order = req.body.orderId;
      await invoiceHelper.generatePDF(req.body);
      const data = await InstanceMaintain.createData(
        Invoice,
        req.body,
      );
      ResponseUtil.setSuccess(
        CREATED,
        'Invoice generated successfully, check your email',
        data,
      );
      return ResponseUtil.send(res);
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }

  static async applyCouponOnInvoice(req, res) {
    try {
      const { invoiceId } = req.params;
      const { _id: userId } = req.userData;
      const { coupon } = req.body;
      const userHaveCoupon = await CustomerCoupon.find({
        coupon,
        userId,
      });
      if (!userHaveCoupon) {
        return ResponseUtil.handleErrorResponse(
          BAD_REQUEST,
          "This coupon isn't related to this user",
          res,
        );
      }
      const addedCoupon = await Invoice.findByIdAndUpdate(
        invoiceId,
        { coupon },
        { new: true },
      );
      await createLog(req, {
        userId,
        invoiceId: addedCoupon._id,
        title: 'Applied coupon on invoice',
      });
      return ResponseUtil.handleSuccessResponse(
        OK,
        'Added coupon on invoice',
        addedCoupon,
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

  static async applyPointsOnInvoice(req, res) {
    try {
      const { invoiceId } = req.params;
      const { points } = req.body;
      const { _id: userId } = req.userData;
      const userPoints = await User.findById(userId, 'loyaltyPoints');

      if (points > userPoints.loyaltyPoints.accruedPoints) {
        return ResponseUtil.handleErrorResponse(
          BAD_REQUEST,
          "You can't use points more than you have",
          res,
        );
      }

      await Invoice.findByIdAndUpdate(
        invoiceId,
        { loyaltyPoints: points },
        { new: true },
      );

      const updatedPoints = await User.findByIdAndUpdate(
        userId,
        {
          loyaltyPoints: {
            ...userPoints.loyaltyPoints,
            accruedPoints:
              userPoints.loyaltyPoints.accruedPoints - points,
            redeemedPoints:
              parseInt(userPoints.loyaltyPoints.redeemedPoints, 10) +
              parseInt(points, 10),
          },
        },
        { new: true },
      );

      await createLog(req, {
        userId,
        invoiceId: updatedPoints._id,
        title: ' Applied points on invoice',
      });

      return ResponseUtil.handleSuccessResponse(
        OK,
        'Points added successful',
        updatedPoints,
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
   * @description this function is invoked to pay invoice
   * @param {object} req request
   * @param {object} res response
   * @return {object} returns an object containing invoice and order details
   */
  static async paymentOfInvoice(req, res) {
    try {
      const { id: invoiceId } = req.params;
      const { amount, status } = req.body;
      const { role, _id: userId } = req.userData;
      // get invoice id to be updated
      const invoice = await Invoice.findById(invoiceId)
        .populate({
          path: 'quote',
          select: 'billingCycle',
          model: Quote,
        })
        .populate({
          path: 'project',
          select: 'manager user name type',
          model: Project,
        });
      if (invoice && invoice.quote) {
        invoice.amount = amount;
        invoice.status = status;
        await invoice.save();
        if (status === 'paid') {
          const date = new Date();
          const period =
            invoice.quote.billingCycle === 'Monthly' ? 30 : 365;
          date.setDate(date.getDate() + period);
          const expirationDate =
            invoice.quote.billingCycle === 'OneTime' ? null : date;
          const newSubscription = {
            quote: invoice.quote._id,
            startDate: new Date(),
            expirationDate,
            status,
            user: invoice.user,
            project: invoice.project._id,
            billingCycle: invoice.quote.billingCycle,
          };
          await Subscription.create(newSubscription);
          const entities = {
            project: invoice.project,
            user: { _id: invoice.user },
            manager: { _id: invoice.project.manager },
            createdBy: req.userData,
          };
          const content = {
            details:
              'Invoice status changed to PAID and subscription created',
            invoiceId,
          };
          await createLog(req, {
            userId,
            invoiceId: updatedPoints._id,
            title: ' Applied points on invoice ',
          });

          await logProject(
            entities,
            content,
            'subscription_create',
            role,
          );
        }
        return ResponseUtil.handleSuccessResponse(
          OK,
          'Success',
          invoice,
          res,
        );
      }
      return ResponseUtil.handleErrorResponse(
        NOT_FOUND,
        'Invoice not found',
        res,
      );
    } catch (error) {
      ResponseUtil.setError(INTERNAL_SERVER_ERROR, error.toString());
      return ResponseUtil.send(res);
    }
  }

  static async updateInvoiceStatusAfterPayment(req, res) {
    try {
      const { status, amount } = req.body;
      const { invoiceId } = req.params;

      const invoice = await Invoice.findById(invoiceId)
        .populate({
          path: 'quote',
          select: 'billingCycle',
          model: Quote,
        })
        .populate({
          path: 'project',
          select: 'manager user name type',
          model: Project,
        });
      if (!invoice) {
        return ResponseUtil.handleErrorResponse(
          BAD_REQUEST,
          "There's no invoice with this id",
        );
      }
      const paidInvoice = await Invoice.findByIdAndUpdate(invoiceId, {
        status,
        amount: amount.toString(),
      });
      return ResponseUtil.handleSuccessResponse(
        OK,
        'Success',
        paidInvoice,
        res,
      );
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
      );
    }
  }

  /**
   * This function to handle all getting invoices.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status of all invoices.
   */
  static async getAllInvoices(req, res) {
    try {
      const { _id: userId, role } = req.userData;

      let conditions = {};
      if (role === 'Client') {
        conditions = { user: userId };
      }

      if (role === 'Manager') {
        conditions = { manager: userId };
      }

      const invoices = await Invoice.find(conditions)
        .sort({ createdAt: -1 })
        .populate({
          path: 'user',
          select: 'fullName companyName, currency',
          model: User,
        })
        .populate({
          path: 'quote',
          select: 'amounts',
          model: Quote,
        })
        .populate({
          path: 'project',
          select: 'name type',
          model: Project,
          populate: {
            path: 'manager',
            select: 'fullName',
            model: User,
          },
        });

      return ResponseUtil.handleSuccessResponse(
        OK,
        'All invoices have been retrieved',
        invoices,
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
   * This function to handle all getting invoices.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status of all invoices.
   */
  static async getInvoice(req, res) {
    try {
      const { invoiceId } = req.params;

      const invoiceDetails = await Invoice.findById({
        _id: invoiceId,
      })
        .populate({
          path: 'user',
          select: 'currency',
          model: User,
        })
        .populate({
          path: 'quote',
          select: 'discount discountType amounts',
          model: Quote,
        })
        .populate({
          path: 'coupon',
          select: 'discountAmount percentageValue couponType',
          model: Coupon,
        })
        .populate({
          path: 'loyaltPoints',
          select: 'generatedPoints purchasedAmount',
          model: LoyaltyPoints,
        });
      const items = await ProposalItem.find({
        proposalId: invoiceDetails.quote._id,
      }).populate({
        path: 'itemId',
        model: Item,
      });
      return serverResponse(res, 200, 'Success', {
        items,
        invoiceDetails,
      });
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  /**
   * This function to handle create invoice pdf.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} Invoice pdf.
   */
  static async createInvoicePdf(req, res) {
    try {
      const html = fs.readFileSync('invoicetemplate.html', 'utf8');
      const bitmap = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../assets/square_transparent.png',
        ),
      );
      const logo = bitmap.toString('base64');
      const user = await User.findById(
        req.body[0].invoiceDetails?.user?._id,
      );

      const currency = req.body[0].invoiceDetails.user.currency.icon;

      const document = {
        html,
        data: {
          userFullName: user.fullName,
          companyName: user.companyName,
          companyAddress: user.address,
          companyCity: user.city,
          companyCountry: user.country,
          companyPhone: user.phoneNumber,
          companyEmail: user.email,
          invoiceNumber: req.body[0].idNumber,
          status: req.body[0].status,
          invoiceDate: moment(req.body[0].createdAt).format(
            'YYYY-MM-DD',
          ),
          due_date: moment(req.body[0].due_date).format('YYYY-MM-DD'),
          subTotal:
            (req.body[0].invoiceDetails?.quote.amounts.subtotal).toLocaleString(
              undefined,
              { minimumFractionDigits: 2 },
            ),
          items: req.body[5],
          taxes: req.body[2],
          itemsDiscount:
            req.body[0].invoiceDetails?.quote.amounts.discount,
          itemsTotal: `${(req.body[0].invoiceDetails?.quote.amounts.total).toLocaleString(
            undefined,
            { minimumFractionDigits: 2 },
          )}`,
          discount:
            (req.body[0].invoiceDetails?.quote.discount).toLocaleString(
              undefined,
              { minimumFractionDigits: 2 },
            ),
          discountPercentage:
            req.body[0].invoiceDetails?.quote.discountType ===
              'Percentage'
              ? '%'
              : '',
          discountFlat:
            req.body[0].invoiceDetails?.quote.discountType === 'Flat'
              ? currency
              : '',
          currency,
          logo,
        },
        path: './invoice.pdf',
      };
      await pdf.create(document, {
        options: {
          rmat: 'A4',
          orientation: 'portrait',
        },
        childProcessOptions: {
          env: {
            OPENSSL_CONF: '/dev/null',
          },
        },
      });
      return serverResponse(res, 200, 'Invoice pdf created');
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  /**
   * This function to handle download invoice.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} Invoice download.
   */
  static async downloadInvoice(req, res) {
    try {
      const { invoiceId } = req.params;
      await Invoice.findById(invoiceId)
        .populate({
          path: 'user',
          select: 'email fullName',
          model: User,
        })
        .populate({
          path: 'project',
          select: 'user name type',
          model: Project,
          populate: {
            path: 'manager',
            select: 'email fullName',
            model: User,
          },
        });
      const file = fs.readFileSync('./invoice.pdf');
      res.contentType('application/pdf');
      res.send(file);

      setTimeout(() => {
        fs.unlink('./invoice.pdf', (err) => {
          if (err) {
            console.info('\x1b[31m', err);
          }
        });
      }, [10000]);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  /**
   * This function update the invoice status.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} Invoice status.
   */
  static async updateInvoiceStatus(req, res) {
    try {
      const { invoiceId } = req.params;
      const { status } = req.body;
      const invoice = await Invoice.findById({ _id: invoiceId });

      if (!invoice) {
        return res.status(404).json({
          status: 404,
          message: 'the invoice does not exist',
        });
      }

      if (invoice.status === status) {
        return res.status(400).json({
          status: 400,
          message: `the invoice is already ${status}`,
        });
      }

      download = download.toObject();
      const pdfBody = {
        order: download,
        createdAt: moment(
          download?.createdAt || download.quote?.createdAt,
        ).format('MMMM Do YYYY, HH:mm'),
        due_date: moment(
          download?.expiryDate || download.quote?.expiryDate,
        ).format('MMMM Do YYYY, HH:mm'),
        amounts: download?.amounts || download?.quote.amounts,
        items: download.items || download?.quote.items,
        project: download.project,
        userId: download.user,
        message,
        type: downloadType,
        taxes: download?.taxes || download.quote?.taxes,
        isFixed: download?.isFixed || download.quote?.isFixed,
        discount: download?.discount || download.quote?.discount,
      };

      await invoiceHelper.generatePDF(pdfBody, true);
      const dlFile =
        downloadType === 'invoice' ? 'ARi-invoice' : 'ARi-proposal';
      return res.download(`./${dlFile}.pdf`);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }
}

export default InvoiceController;

import { INTERNAL_SERVER_ERROR, OK } from 'http-status';
import config from '../../config/config';
import Invoice from '../../database/model/invoice.model';
import Project from '../../database/model/project.schema';
import Subscriber from '../../database/model/subscription.model';
import InvoiceEmail from '../../utils/invoiceEmailActivity';
import ResponseUtil from '../../utils/response.util';
import {
  subscriptionEmail,
  changeSubscriptionEmail,
} from '../../utils/subscriptionEmailActivity';
import { validationMail } from '../../utils/validationMail';

const sgMail = require('@sendgrid/mail');

const sendgridAPIKey =
  process.env.SENDGRID_API_KEY || config.sendgrid_api_key;
sgMail.setApiKey(sendgridAPIKey);

const sendConfirmationEmail = async (
  user,
  subject = '',
  action = '',
  content = '',
) => {
  try {
    const url = `${process.env.FRONTEND_URL}/set-password/${user.resetKey}`;
    const data = {
      from: process.env.MAIL_FROM,
      to: `${user.email}`,
      subject,
      html: validationMail(url, action, content),
    };
    await sgMail.send(data);
  } catch (error) {
    throw error;
  }
};

const mail = async (req, res) => {
  try {
    const {
      fullname,
      email,
      phone,
      package: package_type,
      message,
    } = req.body;

    let data;
    if (message) {
      data = {
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: 'Contact form submission',
        html: `<div><p>${message}</p><p><b>Contact Email:</b> ${email}<br/>`,
      };
    }

    if (package_type) {
      data = {
        from: process.env.MAIL_FROM,
        to: process.env.MAIL_TO,
        subject: 'AKADOMORW ORDER REQUEST',
        html: `<div><p><b>Name:</b> ${fullname}</b><br/><b>Package:</b> ${package_type}<br/><b>Phone:</b> ${phone}<br/><b>Email:</b> ${email}  </p></div>`,
      };
    }

    await sgMail.send(data);
    return res.status(OK).json({ status: OK, message: 'email sent' });
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
      error,
    });
  }
};

const notifySubscriptionPayment = async (req, res) => {
  try {
    const { plan, hadAnother } = req.body;
    const { email } = req.userData;
    let oldSubscriptionPlan;
    if (hadAnother) {
      oldSubscriptionPlan = await Subscriber.findById(
        hadAnother,
      ).populate({
        path: 'subscriptionPlanId',
        select: 'SubscriptionPlanName billingCycle',
      });
    }
    const subscriptionPlan = await Subscriber.findOne({
      userId: plan?.data?.userId,
      status: 'Active',
    }).populate({
      path: 'subscriptionPlanId',
      select: 'SubscriptionPlanName billingCycle',
    });
    let data;
    if (subscriptionPlan) {
      data = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Subscription Receipt',
        html: oldSubscriptionPlan
          ? changeSubscriptionEmail(
              req.userData,
              subscriptionPlan,
              oldSubscriptionPlan,
            )
          : subscriptionEmail(req.userData, subscriptionPlan),
      };
    }

    const sent = await sgMail.send(data);
    return ResponseUtil.handleSuccessResponse(
      OK,
      'Successfully sent',
      sent,
      res,
    );
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
      error,
    });
  }
};

const notifyInvoicePayment = async (req, res) => {
  try {
    const { invoiceId, session } = req.body;
    const { email, _id: userId } = req.userData;

    const invoice = await Invoice.findOne({
      user: userId,
      _id: invoiceId,
    })
      .populate({
        path: 'quote',
        select: 'billingCycle taxes',
      })
      .populate({
        path: 'project',
        select: 'manager user name type',
      });
    const project = await Project.findById(invoice.project._id);
    // if (!project)
    const subscriptionPlan = await Subscriber.findOne({
      userId,
      status: 'Active',
    }).populate({
      path: 'subscriptionPlanId',
      select: 'SubscriptionPlanName billingCycle',
    });
    let data;
    if (subscriptionPlan) {
      data = {
        from: process.env.MAIL_FROM,
        to: email,
        subject: 'Invoice Payment Receipt',
        html: InvoiceEmail(req.userData, {
          subscriptionPlan,
          invoice,
          session,
        }),
      };
    }
    project.status = 'started';
    await project.save();

    const sent = await sgMail.send(data);
    return ResponseUtil.handleSuccessResponse(
      OK,
      'Successfully sent',
      {
        subscriptionPlan,
        invoice,
        sent,
      },
      res,
    );
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: INTERNAL_SERVER_ERROR,
      message: 'Something went wrong',
      error,
    });
  }
};

const sendInvoice = async (email, message, attachments) => {
  try {
    const data = {
      from: process.env.MAIL_FROM,
      to: email,
      subject: 'A.R.I Invoice',
      attachments,
      html: `<div><p>${message}</p><p><b>Contact Email:</b> ${process.env.MAIL_FROM}<br/>`,
    };
    if (process.env.NODE_ENV === 'production') {
      await sgMail.send(data);
    }
  } catch (error) {
    throw error;
  }
};
const sendUserEmail = async (
  user = {},
  subject = '',
  content = '',
) => {
  const data = {
    from: process.env.MAIL_FROM,
    to: `${user.email}`,
    subject,
    html: content,
  };
  await sgMail.send(data).then(
    () => {},
    (error) => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    },
  );
};
export {
  sendConfirmationEmail,
  mail,
  sendInvoice,
  sendUserEmail,
  notifySubscriptionPayment,
  notifyInvoicePayment,
};

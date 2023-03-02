/* eslint-disable import/no-mutable-exports */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import mongoose from 'mongoose';
import cron from 'node-cron';
import app from './app';
import logger from './config/logger.config';
import config from './config/config';
import Subscriber from './database/model/subscription.model';
import SubscriptionHelper from './modules/subscription/subscription.helper';
import { subscriptionEmailReminder } from './utils/subscriptionEmailActivity';

const sgMail = require('@sendgrid/mail');

const sendgridAPIKey =
  process.env.SENDGRID_API_KEY || config.sendgrid_api_key;
sgMail.setApiKey(sendgridAPIKey);
const PORT =
  process.env.NODE_ENV !== 'test' ? process.env.PORT : 5000;

const server = app.listen(PORT, async () => {
  mongoose
    .connect(config.mongoose.url, config.mongoose.options)
    .then(() => {
      cron.schedule('0 1 * * *', async () => {
        const day = 24 * 60 * 60 * 1000;
        const today = new Date();
        // find expiring subscription
        const comingMonth = Date.now() + 30 * 24 * 60 * 60 * 1000;
        const expiresInMonth = await Subscriber.find({
          endDate: { $lt: comingMonth },
          status: { $in: ['Active'] },
        })
          .populate({
            path: 'userId',
            select: 'email lastName, firstName',
          })
          .populate({
            path: 'subscriptionPlanId',
            select: 'SubscriptionPlanName',
          });
        for (let i = 0; i < expiresInMonth.length; i++) {
          const { userId, status, subscriptionPlanId, endDate } =
            expiresInMonth[i];
          const expdate = new Date(endDate);
          const remainingDays = Math.round(
            Math.abs((expdate - today) / day),
          );
          let msg;
          if (userId && subscriptionPlanId && status === 'Active') {
            if (
              remainingDays === 1 ||
              remainingDays === 7 ||
              remainingDays === 15 ||
              remainingDays === 30
            ) {
              const data = {
                user: userId.firstName,
                SubscriptionPlanName:
                  subscriptionPlanId.SubscriptionPlanName,
                remainingDays,
              };
              msg = {
                from: process.env.MAIL_FROM,
                to: userId.email,
                subject: 'Subscription reminder',
                html: subscriptionEmailReminder(data),
              };
            }
          }
          sgMail.send(msg);
        }
      });
      logger.info('Connected to MongoDB');
      logger.info(`Listening to port ${PORT}`);
    });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

export default server;

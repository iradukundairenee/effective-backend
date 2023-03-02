import moment from 'moment';
import * as fs from 'fs';
import path from 'path';
import pdf from 'pdf-creator-node';
import Quote from '../../database/model/quote.model';
import Project from '../../database/model/project.schema';
import Currency from '../../database/model/currency.model';
import User from '../../database/model/user.model';
import Invoice from '../../database/model/invoice.model';
import { LicenseAgreement } from '../../database/model/licenseAgreement.model';
import invoiceHelper from '../invoice/invoice.helper';
import { logProject } from '../../utils/log.project';
import createLog from '../../utils/track.allctivities';
import { license } from '../../utils/constants/licenseAgreement';
import { emailTemplate } from '../../utils/validationMail';
import { proposalDeliveredTemplate } from '../../utils/proposalDeliveredTemplate';
import { proposalAcceptedTemplate } from '../../utils/proposalAcceptedTemplate';
import { proposalDeniedTemplate } from '../../utils/proposalDeniedTemplate';
import { projectStatusApproved } from '../../utils/projectStatusApproved';
import { sendUserEmail } from '../mail/mail.controller';
import { serverResponse } from '../../utils/response';
import Item from '../../database/model/Items';
import ProposalItem from '../../database/model/proposalItem';
import CurrencyCustomer from '../../database/model/customerCurrency.model';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Quote controller class
 */
class QuoteController {
  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to create a quote
   */
  static async createQuote(req, res) {
    const { projectId, ...restBody } = req.body;
    try {
      const { _id: userId } = req.userData;

      const licenseExists = await LicenseAgreement.findOne();

      if (!licenseExists) {
        var newLicense = await LicenseAgreement.create({
          agreement: license,
        });
      }

      const project = await Project.findById(projectId)
        .populate({
          path: 'user',
          select: 'fullName firstName lastName email',
          model: User,
        })
        .populate({
          path: 'manager',
          select: 'fullName firstName lastName',
          model: User,
        });
      if (!project) {
        return serverResponse(res, 404, 'Project not found');
      }
      if (project.status !== 'pending') {
        return serverResponse(
          res,
          400,
          "You can't propose on a project that's not pending",
        );
      }

      const quote = await Quote.create({
        user: project.user,
        project: projectId,
        manager: project.manager,
        licenseText:
          licenseExists !== null ? licenseExists._id : newLicense._id,
        ...restBody,
      });
      await createLog(req, {
        userId,
        quoteId: quote._id,
        title: `Created proposal for ${project?.name}`,
      });
      const msg = {
        to: project.user.email,
        from: process.env.MAIL_FROM,
        subject: 'A.R.I Project Update',
        html: projectStatusApproved(
          project.name,
          project._id,
          project.user?.fullName,
        ),
      };
      await sgMail.send(msg);
      const invoice = {
        user: quote.user,
        quote: quote._id,

        project: quote.project,
        type: 'Project',
        due_date: quote.expiryDate,
        amount: quote.project.budget,
      };
      await invoiceHelper.generateInvoice(invoice);
      return serverResponse(res, 200, 'Success', quote);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  // add proposal tax
  static async addTax(req, res) {
    try {
      const { amount } = req.body;
      const { quoteId } = req.params;
      const { _id: userId } = req.userData;
      const quote = await Quote.findById(quoteId);

      if (amount >= 100)
        return serverResponse(res, 400, 'tax should not be 100% or');

      if (!quote)
        return serverResponse(res, 404, 'proposal not found');

      await Quote.updateOne(
        { _id: quoteId },
        {
          $push: { taxes: req.body },
        },
      );
      await createLog(req, {
        userId,
        quoteId: quote._id,
        title: `Added tax to proposal`,
      });

      const updatedQuote = await Quote.findById(quoteId);
      const { subtotal, discount } = updatedQuote.amounts;

      const totalTaxes = 0;
      // await updatedQuote.taxes.filter(
      //   (tax) => (totalTaxes = tax.amount + totalTaxes),
      // );

      const taxAmount = (totalTaxes / 100) * subtotal;

      const total = subtotal + taxAmount - discount;

      const newAmounts = {
        subtotal,
        tax: taxAmount,
        discount,
        total,
      };

      await Quote.updateOne(
        { _id: quoteId },
        { amounts: newAmounts },
      );

      return serverResponse(res, 200, 'tax created successfully');
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  // update proposal tax
  static async updateTax(req, res) {
    try {
      const { title, amount } = req.body;
      const { _id: userId } = req.userData;
      const { quoteId, taxId } = req.params;

      const quote = await Quote.findById(quoteId);

      if (!quote)
        return serverResponse(res, 404, 'proposal not found');

      const updateTax = await Quote.updateOne(
        {
          _id: quoteId,
          'taxes._id': taxId,
        },
        {
          $set: {
            'taxes.$.title': title,
            'taxes.$.amount': amount,
          },
        },
        { multi: true },
      );
      await createLog(req, {
        userId,
        quoteId: quote._id,
        title: `Updated tax on proposal`,
      });

      const updatedQuote = await Quote.findById(quoteId);
      const { subtotal, discount } = updatedQuote.amounts;

      let totalTaxes = 0;
      await updatedQuote.taxes.filter(
        // eslint-disable-next-line no-return-assign
        (tax) => (totalTaxes = tax.amount + totalTaxes),
      );

      const taxAmount = (totalTaxes / 100) * subtotal;

      const total = subtotal + taxAmount - discount;

      const newAmounts = {
        subtotal,
        tax: taxAmount,
        discount,
        total,
      };

      await Quote.updateOne(
        { _id: quoteId },
        { amounts: newAmounts },
      );

      if (updateTax.nModified === 0)
        return serverResponse(res, 404, 'tax not found');

      return serverResponse(res, 200, 'tax updated successfully');
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  // remove proposal tax
  static async removeTax(req, res) {
    try {
      const { quoteId, taxId } = req.params;
      const { _id: userId } = req.userData;
      const quote = await Quote.findById(quoteId);

      if (!quote)
        return serverResponse(res, 404, 'proposal not found');

      await Quote.updateOne(
        { _id: quoteId },
        {
          $pull: { taxes: { _id: taxId } },
        },
      );

      await createLog(req, {
        userId,
        quoteId: quote._id,
        title: `Removed tax from proposal`,
      });

      const updatedQuote = await Quote.findById(quoteId);
      const { subtotal, discount } = updatedQuote.amounts;

      // let totalTaxes = 0;
      // await updatedQuote.taxes.filter(
      //   (tax) => (totalTaxes = tax.amount + totalTaxes),
      // );

      const taxAmount = (totalTaxes / 100) * subtotal;

      const total = subtotal + taxAmount - discount;

      const newAmounts = {
        subtotal,
        tax: taxAmount,
        discount,
        total,
      };

      await Quote.updateOne(
        { _id: quoteId },
        { amounts: newAmounts },
      );

      return serverResponse(res, 200, 'tax removed successfully');
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  // add proposal tax
  static async updateDiscount(req, res) {
    try {
      const { quoteId } = req.params;
      const { discount, discountType } = req.body;

      const quote = await Quote.findById(quoteId).populate({
        path: 'user',
        select: 'currency',
        model: User,
      });
      const { subtotal } = quote.amounts;
      const { taxPercentage } = quote.user?.currency;

      if (!quote)
        return serverResponse(res, 404, 'proposal not found');

      let newDiscount = discount;
      if (discountType === 'Percentage')
        newDiscount = (await (discount / 100)) * subtotal;

      const newTax = (taxPercentage / 100) * subtotal;

      const total = subtotal + newTax - newDiscount;

      const newAmounts = {
        subtotal,
        taxPercentage,
        discount: newDiscount,
        total,
      };

      await Quote.updateOne(
        { _id: quoteId },
        { amounts: newAmounts, discountType, discount },
      );
      await createLog(req, {
        userId: req.userData._id,
        quoteId: quote._id,
        title: `Updated discount on proposal`,
      });

      return serverResponse(res, 200, 'discount added successfully');
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  /**
   * @description this function is invoked to update quote
   * @param {object} req request
   * @param {object} res response
   * @return {object} returns an object containing quote updated
   */
  static async updateQuote(req, res) {
    try {
      const { id: quoteId } = req.params;
      const { role, _id: userId } = req.userData;
      const { amounts, status, comment, billingCycle, items } =
        req.body;
      const quote = await Quote.findById(quoteId)
        .populate({
          path: 'user',
          select: 'email fullName companyName',
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
      const entities = {
        project: quote.project,
        user: quote.user,
        manager: quote.project.manager,
        createdBy: req.userData,
      };
      let content = { info: comment };
      let logAction = 'quote_update';

      content.quoteId = quoteId;
      if (status === 'Pending') {
        content.details = `New Proposal - ${quote.project.name}`;
        logAction = 'quote_pending';
      }

      if (status === 'Draft' && items.length > 0) {
        content.details = 'Proposal items updated';
        content.info = items.reduce((info, item) => {
          let itemInfo = `Item name: ${item.name}, price: ${item.price},`;
          itemInfo += ` qty: ${item.quantity}<br/>`;
          return info + itemInfo;
        }, '');
      }

      if (status === 'Accepted') {
        const createdAt = moment().format('MMMM Do YYYY, HH:mm');
        const date = new Date();
        date.setHours(date.getHours() + 24);
        const invoice = {
          quote: quoteId,
          due_date: date,
          amount: quote.amounts.total,
          user: quote.user._id,
          billingCycle,
          project: quote.project._id,
        };
        const newInvoice = await Invoice.create(invoice);
        const pdfBody = {
          order: newInvoice,
          createdAt,
          due_date: moment(date).format('MMMM Do YYYY, HH:mm'),
          amounts,
          project: quote.project,
          customerEmail: quote.user.email,
          userId: quote.user._id,
          message: 'Pay the invoice within 24 hours',
          taxes: quote.taxes,
          items: quote.items,
          isFixed: quote.isFixed,
          discount: quote.discount,
        };
        await invoiceHelper.generatePDF(pdfBody);
        logAction = 'invoice_create';
        content.details = 'Proposal approved and invoice created';
        content.invoiceId = newInvoice._id;

        // Notify admin
        const subject = 'A.R.I proposal update';
        let tempMail = `<b>${content.details}</b><br/>`;
        tempMail += comment || '';
        const user = await User.findOne({ role: 'Admin' });
        if (user) {
          content = emailTemplate(user, tempMail);
          await sendUserEmail(user, subject, content);
        }
      }

      if (status === 'Declined') {
        await Project.findByIdAndUpdate(quote.project._id, {
          status: 'pending',
        });
        logAction = 'quote_declined';
        content.details =
          'Proposal declined and project set to PENDING';
      }
      if (status !== 'Draft') {
        await logProject(entities, content, logAction, role);
      }

      if (items) {
        await Quote.findByIdAndUpdate(quoteId, {
          $push: { items: req.body.items },
        });

        const updatedQuote = await Quote.findById(quoteId);
        const { tax, discount } = updatedQuote.amounts;

        let subtotal = 0;
        await updatedQuote.items.filter(
          (item) => (subtotal = item.total + subtotal),
        );

        const total = subtotal + tax - discount;

        const newAmounts = {
          subtotal,
          tax,
          discount,
          total,
        };

        await Quote.updateOne(
          { _id: quoteId },
          { amounts: newAmounts },
        );
      }

      await createLog(req, {
        userId,
        quoteId: quote._id,
        title: `Updated proposal`,
      });

      return serverResponse(res, 200, 'Success');
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  /**
   * This function to update proposal text.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status of all quotes.
   */
  static async updateProposalText(req, res) {
    try {
      const { quoteId } = req.params;
      const { propasalText } = req.body;
      const quote = await Quote.findById(quoteId);
      if (!quote)
        return serverResponse(res, 404, 'proposal not found');
      await Quote.updateOne({ _id: quoteId }, { propasalText });
      await createLog(req, {
        userId: req.userData._id,
        quoteId: quote._id,
        title: 'Updated proposal text',
      });

      return serverResponse(
        res,
        200,
        'proposal text updated successfully',
      );
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async updateLicenseAgreement(req, res) {
    try {
      const { licenseText } = req.body;
      const license = await LicenseAgreement.findOne();
      if (!license) {
        return serverResponse(res, 404, 'License not found');
      } else {
        license.agreement = licenseText;
        await license.save();
        await createLog(req, {
          userId: req.userData._id,
          title: 'Update License agreement',
        });

        return serverResponse(
          res,
          200,
          'License agreement updated successfully',
        );
      }
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  /**
   * This function to handle all getting quotes.
   * @param {object} req The http request.
   * @param {object} res The response.
   * @returns {object} The status of all quotes.
   */
  static async getAllQuotes(req, res) {
    try {
      const { _id: userId, role } = req.userData;

      let conditions = { user: userId, status: { $ne: 'Draft' } };
      if (role === 'Client') {
        conditions = { user: userId };
      }
      if (role === 'Manager') {
        conditions = { manager: userId };
      }
      if (role === 'Admin') {
        conditions = {};
      }
      const quotes = await Quote.find(conditions)
        .sort({ createdAt: -1 })
        .populate({
          path: 'project',
          select: 'name type',
          model: Project,
        })
        .populate({
          path: 'user',
          select: 'fullName companyName profileImage, currency',
          model: User,
        });
      return serverResponse(res, 200, 'Success', quotes);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async getQuoteDetails(req, res) {
    try {
      const { role } = req.userData;
      const { quoteId } = req.params;
      const quoteDetail = await Quote.findById({
        _id: quoteId,
      })
        .populate({
          path: 'user',
          model: User,
          select: 'currency',
        })
        .populate({
          path: 'licenseText',
          model: LicenseAgreement,
          select: 'agreement',
        });

      if (quoteDetail.status === 'Draft' && role === 'Client')
        return serverResponse(res, 400, 'Unauthorized');

      return serverResponse(res, 200, 'Success', quoteDetail);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async updateItems(req, res) {
    const { itemId } = req.params;
    const { quoteId } = req.params;
    const { _id: userId } = req.userData;
    const { name, quantity, price } = req.body;
    try {
      const quote = await Quote.findOneAndUpdate(
        {
          _id: quoteId,
          items: { $elemMatch: { _id: itemId } },
        },
        {
          $set: {
            'items.$.name': name,
            'items.$.quantity': quantity,
            'items.$.price': price,
            'items.$.total': price * quantity,
          },
        },
        { new: true, safe: true, upsert: true },
      );
      await createLog(req, {
        userId,
        quoteId: quote._id,
        title: 'Update an item on proposal',
      });

      const updatedQuote = await Quote.findById(quoteId);
      const { tax, discount } = updatedQuote.amounts;

      let subtotal = 0;
      await updatedQuote.items.filter(
        (item) => (subtotal = item.total + subtotal),
      );

      const total = subtotal + tax - discount;

      const newAmounts = {
        subtotal,
        tax,
        discount,
        total,
      };

      await Quote.updateOne(
        { _id: quoteId },
        { amounts: newAmounts },
      );

      return serverResponse(res, 200, 'Success', quote);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async deleteItem(req, res) {
    const { itemId } = req.params;
    const { quoteId } = req.params;
    const { _id: userId } = req.userData;
    try {
      const deletedItem = await Quote.findOneAndUpdate(
        {
          _id: quoteId,
          items: { $elemMatch: { _id: itemId } },
        },
        {
          $pull: { items: { _id: itemId } },
        },
        { new: true, safe: true, upsert: true },
      );
      await createLog(req, {
        userId,
        quoteId: deletedItem._id,
        title: 'Delete an item on proposal',
      });

      const updatedQuote = await Quote.findById(quoteId);
      const { tax, discount } = updatedQuote.amounts;

      let subtotal = 0;
      await updatedQuote.items.filter(
        (item) => (subtotal = item.total + subtotal),
      );

      const total = subtotal + tax - discount;

      const newAmounts = {
        subtotal,
        tax,
        discount,
        total,
      };

      await Quote.updateOne(
        { _id: quoteId },
        { amounts: newAmounts },
      );

      return serverResponse(res, 200, 'Success', deletedItem);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async sendQuote(req, res) {
    const { quoteId } = req.params;
    const { role } = req.userData;
    const { _id: userId } = req.userData;
    try {
      const quote = await Quote.findById(quoteId)
        .populate({
          path: 'user',
          select: 'email fullName companyName',
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
      const content = {
        details: 'New Proposal',
        info: 'Proposal Delivered',
        quoteId,
      };

      if (quote.status === 'Draft') {
        await quote.update(
          { _id: quoteId, status: 'Delivered' },
          { new: true, safe: true, upsert: true },
        );
        await createLog(req, {
          userId,
          quoteId: quote._id,
          title: 'Sent a proposal to client',
        });
        let tempMail = `<b>${content.details}</b><br/>`;
        // eslint-disable-next-line no-unused-vars
        tempMail += `${content.info || ''}`;
        const msg = {
          to: quote.user.email,
          from: process.env.MAIL_FROM,
          subject: 'A.R.I project update',
          text: content.info,
          html: proposalDeliveredTemplate(quote),
        };
        sgMail.send(msg).then().catch();
      }

      const entities = {
        project: quote.project,
        user: quote.user,
        manager: quote.project.manager,
        createdBy: req.userData,
      };

      await logProject(entities, content, 'quote_update', role);
      return serverResponse(res, 200, 'Success');
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async acceptQuote(req, res) {
    const { quoteId } = req.params;
    const { role, _id: userId } = req.userData;
    try {
      const inv = await Invoice.findOne({ user: userId });
      const quote = await Quote.findById(quoteId)
        .populate({
          path: 'user',
          select: 'email fullName companyName',
          model: User,
        })
        .populate({
          path: 'project',
          select: 'user name type budget',
          model: Project,
          populate: {
            path: 'manager',
            select: 'email fullName',
            model: User,
          },
        });
      const entities = {
        project: quote.project,
        user: quote.user,
        manager: quote.project?.manager,
        createdBy: req.userData,
      };
      const content = {
        details: 'Proposal Accepted',
        info: 'Proposal Accepted',
        quoteId,
      };
      const invoice = {
        user: quote.user,
        quote: quote._id,
        project: quote.project,
        type: 'Project',
        due_date: quote.expiryDate,
        amount: quote.project.budget,
      };

      const { manager } = quote.project;
      const admin = await User.findOne({ role: 'Admin' });

      let email = manager?.email;
      if (!manager) email = admin.email;

      if (quote.status === 'Delivered') {
        await quote.update(
          { _id: quoteId, status: 'Accepted' },
          { new: true, safe: true, upsert: true },
        );
        await createLog(req, {
          userId,
          quoteId: quote._id,
          title: `Accepted proposal on project ${quote?.project?.name} `,
        });
        await invoiceHelper.generateInvoice(invoice);
        await createLog(req, {
          userId,
          invoiceId: inv._id,
          title: `Generated invoice for project ${quote?.project?.name} `,
        });
        let tempMail = `<b>${content.details}</b><br/>`;
        // eslint-disable-next-line no-unused-vars
        tempMail += `${content.info || ''}`;
        const msg = {
          to: email,
          from: process.env.MAIL_FROM,
          subject: 'A.R.I project update',
          text: content.info,
          html: proposalAcceptedTemplate(quote),
        };
        sgMail.send(msg).then().catch();
      }

      await logProject(entities, content, 'quote_update', role);
      return serverResponse(res, 200, 'Success');
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async getLicenseAgreement(req, res) {
    try {
      const license = await LicenseAgreement.findOne();
      return serverResponse(res, 200, 'Success', license);
    } catch (error) {
      return serverResponse(res, 400, error.toString());
    }
  }

  static async rejectQuote(req, res) {
    const { quoteId } = req.params;
    const { role, _id: userId } = req.userData;
    try {
      const quote = await Quote.findById(quoteId)
        .populate({
          path: 'user',
          select: 'email fullName companyName',
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

      const entities = {
        project: quote.project,
        user: quote.user,
        manager: quote.project.manager,
        createdBy: req.userData,
      };

      const content = {
        details: 'Proposal Rejected',
        info: 'Proposal Rejected',
        quoteId,
      };

      const { manager } = quote.project;
      const admin = await User.findOne({ role: 'Admin' });

      let email = manager?.email;
      if (!manager) email = admin.email;

      if (quote.status === 'Delivered') {
        await quote.update(
          { _id: quoteId, status: 'Declined' },
          { new: true, safe: true, upsert: true },
        );

        await createLog(req, {
          userId,
          quoteId: quote._id,
          title: `Rejected proposal on project ${quote?.project?.name} `,
        });

        let tempMail = `<b>${content.details}</b><br/>`;
        // eslint-disable-next-line no-unused-vars
        tempMail += `${content.info || ''}`;
        const msg = {
          to: email,
          from: process.env.MAIL_FROM,
          subject: 'A.R.I project update',
          text: content.info,
          html: proposalDeniedTemplate(quote),
        };
        sgMail.send(msg).then().catch();
      }
      await logProject(entities, content, 'quote_update', role);
      return serverResponse(res, 200, 'Success');
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async createPdf(req, res) {
    try {
      const html = fs.readFileSync('proposaltemplate.html', 'utf8');
      const bitmap = fs.readFileSync(
        path.resolve(
          __dirname,
          '../../../assets/square_transparent.png',
        ),
      );
      const logo = bitmap.toString('base64');
      const invoice = await Invoice.findOne({
        quote: req.body[0].quote?._id,
      });

      const user = await User.findById(req.body[0].quote.user);
      const userCurrency = await CurrencyCustomer.find({
        user: req.body[0].quote.user,
      }).populate({
        path: 'currency',
      });

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
          currencyCompanyName: userCurrency[0].currency.companyName,
          currencyCompanyAddress: userCurrency[0].currency.address1,
          currencyCompanyCity: userCurrency[0].currency.city,
          currencyCompanyCountry: userCurrency[0].currency.country,
          currencyCompanyUrl: userCurrency[0].currency.companyUrl,
          taxName: userCurrency[0].currency.taxName,
          taxAmount: userCurrency[0].currency.taxPercentage,
          taxTotal: req.body[2][0].total,
          status: invoice?.status || 'No invoice',
          proposalDate: moment(req.body[0].quote.createdAt).format(
            'YYYY-MM-DD',
          ),
          due_date: moment(req.body[0].quote.expiryDate).format(
            'YYYY-MM-DD',
          ),
          proposalNumber: req.body[0].quote.idNumber,
          subTotal: req.body[0].quote.amounts.subtotal.toLocaleString(
            undefined,
            { minimumFractionDigits: 2 },
          ),
          items: req.body[6],
          taxes: req.body[2],
          itemsDiscount: req.body[3].toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          itemsTotal: req.body[4].toLocaleString(undefined, {
            minimumFractionDigits: 2,
          }),
          discountPercentage:
            req.body[0].quote.discountType === 'Percentage'
              ? '%'
              : '',
          discountFlat:
            req.body[0].quote.discountType === 'Flat'
              ? userCurrency[0].currency?.icon
              : '',
          discount: req.body[0].quote.discount,
          description: req.body[5],
          currency: userCurrency[0].currency?.icon,
          logo,
        },
        path: './proposal.pdf',
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
      return serverResponse(res, 200, 'Pdf created');
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }

  static async downloadPdf(req, res) {
    try {
      const { quoteId } = req.params;
      const { role } = req.userData;
      const quote = await Quote.findById(quoteId)
        .populate({
          path: 'user',
          select: 'email fullName companyName',
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

      const entities = {
        project: quote.project,
        user: quote.user,
        manager: quote.project.manager,
        createdBy: req.userData,
      };

      const content = {
        details: 'Proposal download',
        info: 'Proposal downloaded succesfully',
        quoteId,
      };

      const file = fs.readFileSync('./proposal.pdf');
      res.contentType('application/pdf');
      res.send(file);

      await logProject(entities, content, 'quote_download', role);

      await createLog(req, {
        userId: req.userData._id,
        quoteId: quote._id,
        title: `Downloaded proposal on project ${quote?.project?.name} `,
      });

      setTimeout(() => {
        fs.unlink('./proposal.pdf', (err) => {
          if (err) {
            return serverResponse(res, 500, err);
          }
        });
      }, [10000]);
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }
}

export default QuoteController;

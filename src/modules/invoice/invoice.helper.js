/* eslint-disable prettier/prettier */
import fs from 'fs';
import pdf from 'pdf-creator-node';
import { BAD_REQUEST } from 'http-status';
import { sendInvoice } from '../mail/mail.controller';
import Invoice from '../../database/model/invoice.model';
import InstanceMaintain from '../../database/maintains/instance.maintain';
import User from '../../database/model/user.model';
import ResponseUtil from '../../utils/response.util';

/**
 * This class will contains all helpers function to handle invoice generation
 * required to generate invoice when order made successfully
 */
class InvoiceHelpers {
  static async saveInvoice(body) {
    const savedInvoice = await InstanceMaintain.createData(Invoice, {
      orderId: body.orderId,
      due_date: body.due_date,
      amount: body.amount,
      status: body.status || 'pending',
    });
    return savedInvoice;
  }

  static async generatePDF(body, isDownload = false) {
    const { message, type = 'invoice', items = [] } = body;
    const dlFile =
      type === 'invoice' ? 'ARi-invoice' : 'ARi-proposal';
    try {
      const fileName = `./${dlFile}.pdf`;
      const html = fs.readFileSync(`${type}.html`, 'utf8');
      const user = await User.findById(body.userId);
      let contents =
        '<div style="font-weight:900;margin-top:00px;text-align:center;">';
      contents += message;
      contents += '</div>';

      const options = {
        format: 'A2',
        orientation: 'portrait',
        footer: {
          height: '20mm',
          contents,
        },
      };

      const totalAmount = `$${body.amounts?.total?.toLocaleString(
        'en-US',
      )}`;
      let tax = 0;
      let taxText = '';
      body.taxes.forEach((t, tIndex, taxesArr) => {
        tax += t.amount;
        taxText += `${t.title}: ${t.amount}%`;
        if (tIndex !== taxesArr.length - 1) {
          taxText += ',';
        }
      });
      const invoice = {
        due_date: body.due_date,
        createdAt: body.createdAt,
        total: totalAmount,
        subTotal: `$${body.amounts?.subtotal?.toLocaleString(
          'en-US',
        )}`,
        projectName: body.project?.name,
        projectType: body.project?.type,
        idNumber: body.order?.idNumber || 4,
        status: body.order?.status,
        amountDue: totalAmount,
      };
      let discountPct = `${body.discount}%`;
      if (body.isFixed) {
        discountPct = `$${body.discount}`;
      }
      const theTotal =
        body.amounts?.subtotal - body.amounts?.discount;
      const taxe = {
        taxes: taxText || '0',
        percent: tax ? `${tax}%` : 0,
        amount: `$${body.amounts?.tax?.toLocaleString('en-US')}`,
        taxesList: body.taxes.map((t) => {
          const amount = (theTotal * t.amount) / 100;
          return {
            tax: `${t.title} ${t.amount}% $${amount.toLocaleString(
              'en-US',
            )}`,
          };
        }),
      };

      const discount = {
        percent: discountPct,
        amount: `$${body.amounts?.discount?.toLocaleString('en-US')}`,
      };

      const theItems = items.map((item) => ({
        ...item,
        price: `$${item.price.toLocaleString('en-US')}`,
        total: `$${item.total.toLocaleString('en-US')}`,
      }));
      const document = {
        html,
        data: {
          invoice,
          user: user.toObject(),
          idNumber: invoice.idNumber,
          propasalText: body.order.propasalText || '',
          customerNote: body.order.customerNote || '',
          items: theItems,
          taxe,
          discount,
        },
        path: fileName,
      };

      const invoiceDoc = await pdf.create(document, options);

      if (isDownload) {
        return invoiceDoc;
      }
      fs.readFile(fileName, async (err, data) => {
        const attachments = [
          {
            filename: `${dlFile}.pdf`,
            content: data.toString('base64'),
            type: 'application/pdf',
            disposition: 'attachment',
            contentId: body.idNumber,
          },
        ];
        await sendInvoice(
          user.email,
          'This is your invoice reach from Time Capsule 3D',
          attachments,
        );
      });
    } catch (error) {
      throw Error(error);
    }
  }

  static async generateInvoice(body) {
    try {
      const invoice = await InstanceMaintain.createData(
        Invoice,
        body,
      );

      ResponseUtil.setSuccess(
        CREATED,
        'Invoice generated successfully',
        invoice,
        log
      );
    } catch (error) {
      ResponseUtil.setError(
        BAD_REQUEST,
        'Error',
        error
      )
    }
  }
}

export default InvoiceHelpers;

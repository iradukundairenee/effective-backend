import mongoose from 'mongoose';
import Comment from '../../database/model/Comment';
import User from '../../database/model/user.model';
import { serverResponse } from '../../utils/response';
import { logProject } from '../../utils/log.project';
import Quote from '../../database/model/quote.model';
import Project from '../../database/model/project.schema';
import createLog from '../../utils/track.allctivities';
import { commentEmailTemplate } from '../../utils/commentEmailTemplate';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
class CommentController {
  static async getAllComment(req, res) {
    try {
      const comment = await Comment.find();
      res.status(200).json({
        message: 'success ',
        data: comment,
      });
    } catch (error) {
      res.status(404).json({
        error: error.message,
      });
    }
  }

  static async proposalComents(req, res) {
    try {
      const { proposalId } = req.params;
      const comment = await Comment.find({ proposalId })
        .sort({ createdAt: -1 })
        .populate({
          path: 'userId',
          select: 'fullName, lastName profileImage',
          model: User,
        });
      res.status(200).json({
        message: 'success ',
        data: comment,
      });
    } catch (error) {
      res.status(404).json({
        error: error.message,
      });
    }
  }

  static async addComment(req, res) {
    try {
      const { proposalId } = req.params;
      const { role } = req.userData;
      const { _id: userId } = req.userData;
      const quote = await Quote.findById(proposalId)
        .populate({
          path: 'user',
          select: 'email fullName profileImage companyName',
          model: User,
        })
        .populate({
          path: 'project',
          select: 'user name type',
          model: Project,
          populate: {
            path: 'manager',
            select: 'email fullName profileImage',
            model: User,
          },
        });

      const entities = {
        project: quote.project,
        user: quote.user,
        manager: quote.project?.manager,
        createdBy: req.userData,
      };

      const comment = new Comment({
        _id: new mongoose.Types.ObjectId(),
        userId: req.userData._id,
        proposalId: req.params.proposalId,
        comment: req.body.comment,
      });

      const content = {
        info: 'Proposal New Comment',
        details: 'Proposal New Comment',
        quoteId: proposalId,
      };

      const newComment = await comment.save();
      await createLog(req, {
        userId,
        commentId: newComment._id,
        title: `Created comment on proposal for project ${quote?.project?.name}`,
      });

      if (quote.project?.manager && quote.status !== 'Draft')
        await logProject(entities, content, 'quote_update', role);

      const { manager } = quote.project;
      const admin = await User.findOne({ role: 'Admin' });

      let email = manager?.email;
      let fullName = manager?.fullName;
      let profileImage = manager?.profileImage;

      if (!manager) {
        profileImage = admin.profileImage;
        email = admin.email;
        fullName = admin.fullName;
      }

      let tempMail = `<b>${content.details}</b><br/>`;
      // eslint-disable-next-line no-unused-vars
      tempMail += `${content.info || ''}`;
      if (role === 'Client') {
        const msg = {
          to: email,
          from: process.env.MAIL_FROM,
          subject: 'Comment on your proposal',
          html: commentEmailTemplate(
            fullName,
            quote.project?.name,
            "",
            req.body?.comment,
            `${process.env.FRONTEND_URL}/dashboard/quotes/${proposalId}`,
            comment.createdAt,
            quote.user?.profileImage?.length
              ? quote.user?.profileImage
              : 'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg',
          ),
        };
        sgMail.send(msg);
      }

      if (role !== 'Client' && quote.status !== 'Draft') {
        const msg = {
          to: quote.user.email,
          from: process.env.MAIL_FROM,
          subject: 'New comment',
          text: content.info,
          html: commentEmailTemplate(
            quote.user.fullName,
            quote.project.name,
            "",
            req.body.comment,
            `${process.env.FRONTEND_URL}/dashboard/quotes/${proposalId}`,
            comment.createdAt,
            profileImage?.length
              ? profileImage
              : 'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg',
          ),
        };
        sgMail.send(msg);
      }

      return serverResponse(
        res,
        200,
        'Success comment created',
        newComment,
      );
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }
}

export default CommentController;

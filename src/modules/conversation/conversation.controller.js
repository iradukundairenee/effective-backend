import mongoose from 'mongoose';
import Conversation from '../../database/model/conversation';
import User from '../../database/model/user.model';
import { serverResponse } from '../../utils/response';
import { logProject } from '../../utils/log.project';
import Project from '../../database/model/project.schema';
import createLog from '../../utils/track.allctivities';
import { commentEmailTemplate } from '../../utils/commentEmailTemplate';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class conversationController {
  static async getProjectConversation(req, res) {
    try {
      const { projectId } = req.params;
      const conversations = await Conversation.find({
        projectId,
      }).populate({
        path: 'user',
        select: '_id lastName, firstName profileImage',
        model: User,
      });
      const conversation = conversations.reverse();
      res.status(200).json({
        message: 'success ',
        data: conversation,
      });
    } catch (error) {
      res.status(404).json({
        error: error.message,
      });
    }
  }

  static async addConversation(req, res) {
    try {
      const { projectId } = req.params;
      const { role } = req.userData;
      const { _id: userId } = req.userData;
      const project = await Project.findById(projectId)
        .populate({
          path: 'user',
          select:
            'email fullName firstName lastName profileImage, companyName',
          model: User,
        })
        .populate({
          path: 'manager',
          select: 'email fullName firstName lastName profileImage',
          model: User,
        });

      const conversation = new Conversation({
        _id: new mongoose.Types.ObjectId(),
        user: req.userData._id,
        projectId: req.params.projectId,
        title: req.body.title,
        message: req.body.message,
      });

      const { manager } = project;
      const admin = await User.findOne({ role: 'Admin' });

      let email = manager?.email;
      let fullName = manager?.fullName;
      let profileImage = manager?.profileImage;

      if (!manager) {
        profileImage = admin.profileImage;
        email = admin.email;
        fullName = admin.fullName;
      }

      const newConversation = await conversation.save();
      if (role === 'Client') {
        if (project.manager) {
          const msg = {
            to: project.manager.email,
            from: process.env.MAIL_FROM,
            subject: 'New conversation on your project',
            html: commentEmailTemplate(
              project.manager.fullName,
              project.name,
              req.body.title,
              req.body.message,
              `${process.env.FRONTEND_URL}/dashboard/projects/${projectId}`,
              newConversation.createdAt,
              project.user?.profileImage?.length
                ? project.user?.profileImage
                : 'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg',
            ),
          };
          sgMail.send(msg);
        } else {
          const msg = {
            to: admin.email,
            from: process.env.MAIL_FROM,
            title: 'New conversation',
            subject: 'New conversation on your project',
            html: commentEmailTemplate(
              admin.fullName,
              project.name,
              req.body.title,
              req.body.message,
              `${process.env.FRONTEND_URL}/dashboard/projects/${projectId}`,
              newConversation.createdAt,
              admin?.profileImage?.length
                ? project.user?.profileImage
                : 'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg',
            ),
          };
          sgMail.send(msg);
        }
      } else if (role === 'Admin') {
        const clientMsg = {
          to: project.user.email,
          from: process.env.MAIL_FROM,
          subject: 'Comment on your project',
          html: commentEmailTemplate(
            project.user.fullName,
            project.name,
            req.body.title,
            req.body.message,
            `${process.env.FRONTEND_URL}/dashboard/projects/${projectId}`,
            newConversation.createdAt,
            admin?.profileImage?.length
              ? admin?.profileImage
              : 'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg',
          ),
        };
        sgMail.send(clientMsg);
        if (project.manager) {
          const managerMsg = {
            to: project.manager.email,
            from: process.env.MAIL_FROM,
            subject: 'Comment on your project',
            html: commentEmailTemplate(
              project.manager.fullName,
              project.name,
              req.body.title,
              req.body.message,
              `${process.env.FRONTEND_URL}/dashboard/projects/${projectId}`,
              newConversation.createdAt,
              admin?.profileImage?.length
                ? admin?.profileImage
                : 'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg',
            ),
          };
          sgMail.send(managerMsg);
        }
      } else {
        const msg = {
          to: project.user.email,
          from: process.env.MAIL_FROM,
          subject: 'New conversation on your project',
          html: commentEmailTemplate(
            project.user.fullName,
            project.name,
            req.body.title,
            req.body.message,
            `${process.env.FRONTEND_URL}/dashboard/projects/${projectId}`,
            newConversation.createdAt,
            profileImage?.length
              ? profileImage
              : 'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg',
          ),
        };
        sgMail.send(msg);
      }

      await createLog(req, {
        userId,
        conversationId: newConversation._id,
        title: `Created a conversation on project ${project?.name}`,
      });
      const entities = {
        project,
        user: project.user,
        manager: project.manager,
        createdBy: req.userData,
      };
      const content = {
        info: 'Project New conversation',
        details: 'Project New conversation',
      };
      await logProject(entities, content, role);
      return serverResponse(
        res,
        200,
        'Success conversation created',
        newConversation,
      );
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }
}

export default conversationController;

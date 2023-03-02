import {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
} from 'http-status';
import ResponseUtil from '../../utils/response.util';
import Project from '../../database/model/project.schema';
import { projectAssignedManagerForManager } from '../../utils/projectAssignedManager(Manager)';
import { projectAssignedManagerForClient } from '../../utils/projectAssignedManager(Client)';
import User from '../../database/model/user.model';
import { logProject } from '../../utils/log.project';
import Notification from '../../database/model/notification.model';
import { serverResponse } from '../../utils/response';
import { commentEmailTemplate } from '../../utils/commentEmailTemplate';
import Product from '../../database/model/product.model';
import ProjectProduct from '../../database/model/projectProduct.model';
import { projectCreatedByClient } from '../../utils/projectCreatedByClient';
import createLog from '../../utils/track.allctivities';
import Invoice from '../../database/model/invoice.model';

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Service controller class
 */
class ProjectController {
  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to create a project proposal
   */
  static async createProject(req, res) {
    const { _id: userId, role } = req.userData;
    req.body.image = req.image;
    req.body.imageId = req.imageId;
    req.body.user = userId;
    const logAction = 'create_project';
    const content = { info: null };

    try {
      const user = await User.findById(userId);
      const project = await Project.create(req.body);
      const entities = { project, createdBy: req.userData, user };
      content.info = project.description;
      await logProject(entities, content, logAction, role);

      await createLog(req, {
        userId,
        projectId: project._id,
        title: `Created project ${project?.name} `,
      });
      ResponseUtil.setSuccess(
        CREATED,
        'Project proposal has been created successfully',
        project,
      );

      const currentProject = await Project.findById(
        project._id,
      ).populate({
        path: 'user',
        select: 'fullName firstName lastName companyName',
        model: User,
      });

      const admin = await User.findOne({ role: 'Admin' });
      const msg = {
        to: admin.email,
        from: process.env.MAIL_FROM,
        subject: 'A.R.I Project Update',
        html: projectCreatedByClient(
          project.name,
          project._id,
          currentProject.user.fullName,
        ),
      };
      await sgMail.send(msg);
      return ResponseUtil.send(res);
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to retrieve project proposals
   */
  static async getProjects(req, res) {
    const { _id: userId, role } = req.userData;
    const { status, client } = req.query;

    let conditions = { user: userId };
    if (role === 'Manager') {
      conditions = { manager: userId };
    }
    if (role === 'Admin') {
      conditions = {};
    }
    if (status) {
      conditions = { ...conditions, status: { $ne: status } };
    }
    if (client) {
      conditions = {
        ...conditions,
        user: client,
        status: { $ne: 'Archived' },
      };
    }
    if (role === 'Client') {
      conditions = {
        ...conditions,
        status: { $ne: 'Archived' },
        user: userId,
      };
    }
    const projects = await Project.find(conditions)
      .populate({
        path: 'user',
        select:
          'fullName firstName lastName companyName profileImage',
        model: User,
      })
      .sort({
        createdAt: -1,
      });
    ResponseUtil.setSuccess(OK, 'Success', projects);
    return ResponseUtil.send(res);
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to retrieve project proposal
   */
  static async getProjectDetail(req, res) {
    const { id: projectId } = req.params;
    const projects = await Project.findById(projectId).populate({
      path: 'user',
      select: 'fullName firstName lastName',
      model: User,
    });
    ResponseUtil.setSuccess(OK, 'Success', projects);
    return ResponseUtil.send(res);
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to update a project proposal
   */
  static async updateProject(req, res) {
    try {
      const { id } = req.params;
      const { role, _id: userId } = req.userData;
      const project = await Project.findById(id).populate({
        path: 'user',
        select: 'fullName firstName lastName email ',
        model: User,
      });
      let logAction = 'project_edit';
      const entities = { project, createdBy: req.userData };
      const content = { info: null };

      if (role === 'Manager') {
        project.status = req.body.status;
        await project.save();
        logAction = 'project_status';
        entities.manager = req.userData;
        entities.user = project.user;
      }

      if (role === 'Client') {
        await project.update(req.body);
        content.info = req.body.description;
      }

      if (role === 'Admin') {
        // update project manager
        project.manager = req.body.managerId;
        await project.save();

        // update project invoice manager
        await Invoice.bulkWrite([
          {
            updateMany: {
              filter: { project: project._id },
              update: {
                $set: {
                  manager: req.body.managerId,
                },
              },
            },
          },
        ]);

        entities.manager = { _id: req.body.managerId };
        entities.user = project.user;
        logAction = 'project_manager';
        const manager = await User.findById(req.body.managerId);
        const msg = {
          to: manager?.email,
          from: process.env.MAIL_FROM,
          subject: 'A.R.I Project Update',
          html: projectAssignedManagerForManager(
            manager?.fullName,
            project.name,
            project._id,
            project.user.fullName,
          ),
        };

        await sgMail.send(msg);
        const clientMsg = {
          to: project.user.email,
          from: process.env.MAIL_FROM,
          subject: 'A.R.I Project Update',
          html: projectAssignedManagerForClient(
            manager?.fullName,
            project.name,
            project._id,
            project.user.fullName,
          ),
        };
        await sgMail.send(clientMsg);
      }

      await logProject(entities, content, logAction, role);
      await createLog(req, {
        userId,
        projectId: project._id,
        title: `Updated project ${project?.name}`,
      });

      ResponseUtil.setSuccess(
        OK,
        'Project proposal has been updated successfully',
        project,
      );
      return ResponseUtil.send(res);
    } catch (error) {
      return ResponseUtil.handleErrorResponse(
        INTERNAL_SERVER_ERROR,
        error.toString(),
        res,
      );
    }
  }

  static async completeProject(req, res) {
    try {
      const { id } = req.params;
      const project = await Project.findById(id);
      if (!project) {
        return ResponseUtil.handleErrorResponse(
          NOT_FOUND,
          error.toString(),
          res,
        );
      }
      if (project.status === 'pending') {
        return ResponseUtil.handleErrorResponse(
          BAD_REQUEST,
          "You can't complete a project that haven't started",
          res,
        );
      }
      const updatedProject = await Project.updateOne(
        { _id: id },
        {
          status: 'completed',
        },
      );
      ResponseUtil.handleSuccessResponse(
        OK,
        'Project completed successfully',
        updatedProject,
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
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to archive the project status
   */
  static async archiveProject(req, res) {
    const { id } = req.params;
    const { _id: userId } = req.userData;
    const project = await Project.findById(id);
    project.status = 'Archived';
    await project.save();
    await createLog(req, {
      userId,
      projectId: project._id,
      title: `Archived project ${project?.name}`,
    });
    ResponseUtil.setSuccess(
      OK,
      'Project has been archived successfully',
      project,
    );
    return ResponseUtil.send(res);
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to retrieve project conversations
   */
  static async getProjectHistories(req, res) {
    const { id: projectId } = req.params;

    const conditions = { project: projectId };

    const histories = await Notification.find(conditions)
      .populate({
        path: 'createdBy',
        select: 'fullName companyName',
        model: User,
      })
      .sort({
        createdAt: -1,
      });
    ResponseUtil.setSuccess(OK, 'Success', histories);
    return ResponseUtil.send(res);
  }

  /**
   * @param  {object} req
   * @param  {object} res
   * @returns {object} function to create new project log
   */
  static async createNewLog(req, res) {
    const { id: projectId } = req.params;
    const { _id: userId, role } = req.userData;
    const { title, description } = req.body;
    if (!title) {
      return serverResponse(res, 400, 'Title should not be empty');
    }
    const project = await Project.findById(projectId)
      .populate({
        path: 'user',
        select:
          'fullName firstName lastName email companyName profileImage',
        model: User,
      })
      .populate({
        path: 'manager',
        select: 'fullName firstName lastName email, profileImage',
        model: User,
      });

    const newLog = {
      description: title,
      content: description,
      user: project.user,
      manager: project.manager,
      userRole: role,
      project: projectId,
      createdBy: userId,
      isCustom: true,
    };

    await Notification.create(newLog);
    let notifierIds = [];
    let toBeNotified = '';
    if (role === 'Manager') {
      notifierIds = [project.user];
      toBeNotified = 'User';
    }
    if (role === 'Admin') {
      notifierIds = [project.user, project.manager];
      toBeNotified = 'User and Manager';
    }
    if (role === 'Client') {
      notifierIds = [project.manager];
      toBeNotified = 'Manager';
      if (!project.manager) {
        const admin = await User.findOne({ role: 'Admin' });
        // eslint-disable-next-line no-unused-vars
        notifierIds = [admin._id];
        // eslint-disable-next-line no-unused-vars
        toBeNotified = 'Admin';
      }
    }

    if (role === 'Client') {
      const msg = {
        to: project.manager.email,
        from: process.env.MAIL_FROM,
        subject: 'Comment on your project',
        html: commentEmailTemplate(
          project.manager?.fullName,
          project.name,
          '',
          req.body.description,
          `${process.env.FRONTEND_URL}/dashboard/projects/${projectId}`,
          comment.createdAt,
          project.manager?.profileImage?.length
            ? project.manager?.profileImage
            : 'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg',
        ),
      };
      sgMail.send(msg);
    } else if (role === 'Admin') {
      const clientMsg = {
        to: project.user.email,
        from: process.env.MAIL_FROM,
        subject: 'Comment on your project',
        html: commentEmailTemplate(
          project.user.fullName,
          project.name,
          '',
          req.body.description,
          `${process.env.FRONTEND_URL}/dashboard/projects/${projectId}`,
          comment.createdAt,
          project.user?.profileImage?.length
            ? project.user?.profileImage
            : 'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg',
        ),
      };
      sgMail.send(clientMsg);
      const managerMsg2 = {
        to: project.manager.email,
        from: process.env.MAIL_FROM,
        subject: 'Comment on your project',
        html: commentEmailTemplate(
          project.manager?.fullName,
          project.name,
          '',
          req.body.description,
          `${process.env.FRONTEND_URL}/dashboard/projects/${projectId}`,
          comment.createdAt,
          project.manager?.profileImage?.length
            ? project.manager?.profileImage
            : 'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg',
        ),
      };
      await sgMail.send(managerMsg2);
    } else {
      const msg = {
        to: project.user.email,
        from: process.env.MAIL_FROM,
        subject: 'New comment on your project',
        html: commentEmailTemplate(
          project.user.fullName,
          project.name,
          '',
          req.body.description,
          `${process.env.FRONTEND_URL}/dashboard/projects/${projectId}`,
          comment.createdAt,
          project.user?.profileImage?.length
            ? project.user?.profileImage
            : 'https://as1.ftcdn.net/v2/jpg/03/53/11/00/1000_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg',
        ),
      };
      sgMail.send(msg);
    }
  }

  static async addProductToProject(req, res) {
    const { id: projectId } = req.params;
    const { product, website, domainName } = req.body;
    try {
      await ProjectProduct.findOneAndUpdate(
        { project: projectId, product },
        { website, domainName },
        { upsert: true },
      );
      return serverResponse(res, 201, 'Product added');
    } catch (error) {
      return serverResponse(res, 500, 'Something went wrong');
    }
  }

  static async getProductProjects(req, res) {
    const { id } = req.params;
    const { type } = req.query;
    try {
      let conditions = { project: id };
      if (type === 'product') {
        conditions = { product: id };
      }
      const projProducts = await ProjectProduct.find(conditions)
        .populate({
          path: 'product',
          select: 'name customer imageIcon createdAt',
          model: Product,
          populate: {
            path: 'customer',
            select: 'firstName companyName role',
            model: User,
          },
        })
        .populate({
          path: 'project',
          select: 'name',
          model: Project,
        })
        .sort({ createdAt: -1 });
      return serverResponse(res, 200, 'Success', projProducts);
    } catch (error) {
      return serverResponse(res, 500, 'Something went wrong');
    }
  }
}

export default ProjectController;

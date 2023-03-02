import { OK } from 'http-status';
import Product from '../../database/model/product.model';
import { serverResponse } from '../../utils/response';
import ResponseUtil from '../../utils/response.util';
import Analytics from '../../database/model/productAnalytic.model';

export class DashboardController {
  static async getAssetsCount(req, res) {
    try {
      const { _id: userId, role } = req.userData;
      const { company, project, time } = req.query;
      let views;
      let viewCounts;
      let conditions = {};
      if (role === 'Client') {
        conditions = { customer: userId };
      }
      views = await Analytics.find(conditions);
      // .populate({
      //   path: 'product project customer',
      //   select: 'name manager name companyName',
      // });
      viewCounts = views;
      if (role === 'Manager') {
        views = views.filter(
          (view) => view.project.manager === userId,
        );
        viewCounts = views;
      }
      const projects = Array.from(
        new Set(
          views &&
            views.map((view) => view.project && view.project.name),
        ),
      );
      if (
        company &&
        company !== 'allCompanies' &&
        role !== 'Client'
      ) {
        views = views.filter(
          (view) => view.customer.companyName === company,
        );
        viewCounts = views;
      }
      if (project && project !== 'allProjects') {
        views = views.filter((view) => view.project.name === project);
        viewCounts = views;
      }
      if (time && time !== 'allTime') {
        const today = new Date();
        if (time === 'today') {
          views = views.filter((item) => {
            const start = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate(),
            );
            const date = new Date(item.createdAt);
            return date >= start && date <= today;
          });
        }
        if (time === 'week') {
          views = views.filter((item) => {
            const start = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - 7,
            );
            const date = new Date(item.createdAt);
            return date >= start && date <= today;
          });
        }
        if (time === 'month') {
          views = views.filter((item) => {
            const start = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate() - 30,
            );
            const date = new Date(item.createdAt);
            return date >= start && date <= today;
          });
        }
      }

      const products = await Product.find(conditions)
        .populate({
          path: 'project',
          select: 'manager name',
        })
        .populate({
          path: 'customer',
          select: 'companyName',
        });
      const counts = { products, viewCounts };
      const dashboard = { views, counts, projects };

      return ResponseUtil.handleSuccessResponse(
        OK,
        'Successful',
        dashboard,
        res,
      );
    } catch (error) {
      return serverResponse(res, 500, error.toString());
    }
  }
}
export const AssetsCount = () => {};

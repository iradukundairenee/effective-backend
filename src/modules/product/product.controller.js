/* eslint-disable import/prefer-default-export */
import moment from 'moment';
import { existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { serverResponse } from '../../utils/response';
import Product from '../../database/model/product.model';
import User from '../../database/model/user.model';
import Project from '../../database/model/project.schema';
import ProjectProduct from '../../database/model/projectProduct.model';
import { logProject } from '../../utils/log.project';
import {
  createAnalytics,
  organizeAnalytics,
} from '../../utils/product.util';
import Analytics from '../../database/model/productAnalytic.model';
import { deleteProductImages } from '../../utils/helpers';
import createLog from '../../utils/track.allctivities';
import SubscriptionPlan from '../../database/model/subscriptionPlan.model';
import Subscriber from '../../database/model/subscription.model';

export class ProductController {
  static async addNewProduct(req, res) {
    const { role, _id: userId } = req.userData || {};
    const { project, website, domainName } = req.body;
    const assetIcon = process.env.ASSET_ICON;
    try {
      readdirSync(assetIcon).forEach((icon) => {
        req.body.imageIcon = icon;
      });
      const newProduct = await Product.create(req.body);
      await ProjectProduct.create({
        project,
        website,
        domainName,
        product: newProduct._id,
      });
      const theProject = await Project.findById(project);
      const logAction = 'asset_add';
      const entities = {
        project: theProject,
        createdBy: req.userData,
        name: theProject.name,
        manager: { _id: theProject.manager },
        user: { _id: theProject.user },
      };
      const content = {
        title: '3D asset added',
        info: '3D asset added',
      };
      await logProject(entities, content, logAction, role);
      await createLog(req, {
        userId,
        productId: newProduct._id,
        projectId: theProject._id,
        title: `Created new 3D Asset ${newProduct?.name} `,
      });
      return serverResponse(res, 201, 'Created', newProduct);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  static async editProduct(req, res) {
    try {
      const { productId } = req.params;
      const { _id: userId, role } = req.userData || {};
      const { website, domainName, project } = req.body;
      const isAdmin = role === 'Admin' || role === 'Manager';
      const product = await Product.findById(productId);
      if (!isAdmin && product.customer.toString() !== userId) {
        const errorMsg = 'You are not allowed to perform the action';
        return serverResponse(res, 403, errorMsg);
      }

      const projProduct = await ProjectProduct.findOne({
        product: productId,
      });
      await product.updateOne(req.body);
      const theProject = await Project.findById(project);
      await createLog(req, {
        userId,
        productId: product._id,
        projectId: theProject._id,
        title: `Updated 3D Asset ${product?.name}`,
      });
      if (projProduct?.project !== project) {
        if (projProduct) {
          await projProduct.updateOne({
            project,
            website,
            domainName,
          });
        } else {
          await ProjectProduct.create({
            project,
            website,
            domainName,
            product: productId,
          });

          const logAction = 'asset_add';
          const entities = {
            project: theProject,
            createdBy: req.userData,
            manager: { _id: theProject.manager },
            user: { _id: theProject.user },
          };
          const content = {
            title: '3D asset added',
            info: '3D asset added',
          };
          await logProject(entities, content, logAction, role);
        }
      }
      return serverResponse(res, 200, 'Updated');
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  static async changeStatusProduct(req, res) {
    try {
      const { productId } = req.params;
      const { status } = req.body;
      const { _id } = req.userData;
      const countStatus = await Product.count({ status: 'Public' });

      const subscriptions = await Subscriber.findOne({
        userId: _id,
        status: 'Active',
      });
      if (!subscriptions) {
        return res
          .status(400)
          .json({ message: 'you have no subscription' });
      }
      const subscriptionPlan = await SubscriptionPlan.findOne({
        _id: subscriptions.subscriptionPlanId,
        Status: 'active',
      });
      if (
        subscriptionPlan.TypeSubscriptionPlan === 'asset-Based' &&
        subscriptionPlan.NumberofAssets > countStatus
      ) {
        await Product.updateOne(
          { _id: productId },
          { $set: { status } },
        );
        return res.status(200).json({ message: 'Updated' });
      }
      if (subscriptionPlan.TypeSubscriptionPlan === 'click-Based') {
        await Product.updateOne(
          { _id: productId },
          { $set: { status } },
        );
        return res.status(200).json({ message: 'Updated' });
      }
      return res
        .status(400)
        .json({ message: 'Number of assets exceeded' });
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  static async deleteProduct(req, res) {
    const { productId } = req.params;
    try {
      const product = await Product.findById(productId);
      const parentProduct = await Product.findOne({
        _id: product.parentId,
      }).exec();
      const { duplicate } = parentProduct;
      const productImage = product.image;
      await parentProduct.updateOne({
        duplicate: duplicate - 1,
      });
      await product.remove();
      await Analytics.remove({ product: productId });
      // Delete skybox and environment images
      const msg = await deleteProductImages(productImage);
      return serverResponse(res, 200, msg);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  static async getProductImages(req, res) {
    const { fileName } = req.body;
    const imagesStorage = process.env.IMAGES_ZONE;
    try {
      if (!existsSync(fileStorage)) {
        mkdirSync(fileStorage, { recursive: true });
      }
      const images = {};
      readdirSync(imagesStorage)
        .filter((file) => file.includes(fileName))
        .forEach((img) => {
          if (img.endsWith('.glb')) {
            images.glb = img;
          } else {
            images.usdz = img;
          }
        });
      return serverResponse(res, 200, 'success', images);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  static async getProductDetails(req, res) {
    const { productId } = req.params;
    try {
      const product = await Product.findById(productId)
        .populate({
          path: 'customer',
          select: 'fullName companyName imageFiles',
          model: User,
        })
        .populate({
          path: 'project',
          select: 'name',
          model: Project,
        });

      let { code } = product.qrCodeRef;
      const { usageNo } = product.qrCodeRef;

      if (
        !product.qrCodeRef ||
        product.qrCodeRef.code.length === 0 ||
        usageNo >= 10
      ) {
        code = (Math.random() + 1).toString(36).substring(2);
        // create qrCodeRef
        await Product.updateOne(
          { _id: productId },
          { qrCodeRef: { code, usageNo: 0 } },
        );
      }

      return serverResponse(res, 200, 'success', {
        productObj: product,
        code,
      });
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  static async viewProduct(req, res) {
    const { productId } = req.params;
    const { parentUrl } = req.query;
    const { role } = req.userData || {};
    const images3DStorage = process.env.IMAGES_3D_ZONE;
    try {
      let projectProd;
      const isDuplicate = await Product.findById(productId);

      if (isDuplicate?.parentId !== null) {
        projectProd = await ProjectProduct.findOne({
          product: isDuplicate.parentId,
        });
      } else {
        projectProd = await ProjectProduct.findOne({
          product: productId,
        });
      }
      // find product project

      const project = await Project.findOne({
        _id: projectProd?.project,
      }).populate({
        path: 'user',
        model: User,
      });

      const { domainNames, email } = project.user;

      // a client is not allowed make this request
      if (
        role === 'Client' &&
        !parentUrl &&
        !/@arinnovations.io\s*$/.test(email)
      )
        return serverResponse(res, 401, 'Not authorized');

      if (!parentUrl && !role && !/@arinnovations.io\s*$/.test(email))
        return serverResponse(res, 400, 'parentUrl is not found');

      let isDomainNameAllowed;
      if (parentUrl) {
        const newParentUrl = parentUrl.replace(/.+\/\/|www.|\+/g, '');
        isDomainNameAllowed = await domainNames?.includes(
          newParentUrl,
        );
      }

      if (parentUrl && !isDomainNameAllowed)
        return serverResponse(res, 401, 'Not authorized');

      const product = await Product.findById(productId);
      if (product.status.toLowerCase() === 'private') {
        return serverResponse(res, 400, 'Private Asset');
      }

      await createAnalytics(req, product);

      return serverResponse(res, 200, 'success', product);
    } catch (error) {
      console.log(error);
      return serverResponse(res, 500, error.message);
    }
  }

  static async qrProduct(req, res) {
    const { productId, code } = req.params;
    try {
      const product = await Product.findById(productId);

      if (product.qrCodeRef.code !== code)
        return serverResponse(res, 400, 'Invalid QR Code');

      if (product.qrCodeRef.usageNo >= 10)
        return serverResponse(res, 400, 'QR Code expired');

      const newQrCodeRef = {
        code: product.qrCodeRef.code,
        usageNo: product.qrCodeRef.usageNo + 1,
      };

      // update qrCodeRef
      await Product.updateOne(
        { _id: productId },
        { qrCodeRef: newQrCodeRef },
      );

      await createAnalytics(req, product);

      return serverResponse(res, 200, 'success', product);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  static async getProducts(req, res) {
    const { _id: userId, role } = req.userData;
    const { project } = req.query;
    const images3DStorage = process.env.IMAGES_3D_ZONE;
    let conditions = { customer: userId, parentId: null };
    if (role === 'Manager' || role === 'Admin') {
      conditions = { parentId: null };
    }
    if (project) {
      conditions = { ...conditions, project };
    }

    try {
      let products;
      const sortOptions = { sort: [['project.name', 'asc']] };
      products = await Product.find(conditions)
        .populate({
          path: 'customer',
          select: 'fullName companyName',
          model: User,
        })
        .populate({
          path: 'project',
          select: 'name manager',
          model: Project,
          sortOptions,
          populate: {
            path: 'manager',
            select: 'fullName',
          },
        })
        .sort({
          createdAt: -1,
        });

      if (products.length > 0) {
        products = products.map((product) => {
          const fileName = product.image.src;
          const images = {};
          readdirSync(images3DStorage)
            .filter((file) => file.includes(fileName))
            .forEach((img) => {
              if (img.endsWith('.usdz')) {
                images.usdz = img;
              } else {
                images.glb = img;
              }
            });

          const productObj = product.toObject();
          productObj.imagesSrc = images;
          return productObj;
        });
      }
      return serverResponse(res, 200, 'Success', products);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  static async updateAttributes(req, res) {
    try {
      const { productId } = req.params;
      const product = await Product.findById(productId);

      req.body.src = product.image.src;
      product.image = req.body;
      await product.save();
      const mesg = 'Successfully updated';
      return serverResponse(res, 200, 'Success', mesg);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  static async deleteAttrImage(req, res) {
    try {
      const { productId, imageFileName } = req.params;
      await Product.updateOne(
        { _id: productId },
        { $pull: { 'image.imageFiles': { imageFileName } } },
      );
      /**
       * Delete the file frm the directory
       */
      const { IMAGES_ZONE } = process.env;
      unlinkSync(`${IMAGES_ZONE}/${imageFileName}`);

      const msg = 'Image deleted';

      return serverResponse(res, 200, msg, imageFileName);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  static async addProductAnalytic(req, res) {
    try {
      const { productId } = req.params;
      const product = await Product.findById(productId);

      const newClick = await createAnalytics(req, product);
      return serverResponse(res, 200, 'Success', newClick);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  static async getProductAnalytics(req, res) {
    try {
      let analytics;
      const { project } = req.query;
      const images3DStorage = process.env.IMAGES_3D_ZONE;
      const { _id: userId } = req.userData;
      let country;
      let conditions = { customer: userId, parentId: null };

      if (Array.isArray(req.query.country)) {
        country = req.query.country;
      } else {
        country = [req.query.country];
      }

      const { device } = req.query;
      conditions = {
        customer: userId,
        parentId: null,
        country,
        device,
      };
      const { role } = req.userData || {};
      // eslint-disable-next-line no-constant-condition
      if (role === 'Admin' || role === 'Manager') {
        conditions = {
          parentId: null,
          device,
          country,
        };
        if (!country || !device) {
          conditions = { parentId: null };
        }
      }
      if (role === 'Client') {
        conditions = {
          customer: userId,
          parentId: null,
          device,
          country,
        };
        if (!country || !device) {
          conditions = { customer: userId, parentId: null };
        }
      }
      if (project) {
        conditions = { ...conditions, project };
      }
      // eslint-disable-next-line prefer-const
      analytics = await Analytics.find(conditions);
      // .populate({
      //   path: 'product',
      //   select: 'name imageIcon duplicate parentId',
      //   model: Product,
      // })
      // .populate({
      //   path: 'project',
      //   select: 'name manager',
      //   model: Project,
      // })
      // .populate({
      //   path: 'customer',
      //   select: 'companyName role',
      //   model: User,
      // })
      // .lean();
      const result = await analytics.filter(
        (item) => item.product?.parentId === null,
      );
      const filteredManager = await result.filter((item) => {
        const managerId = item.project?.manager;
        const idOfManager = managerId?.toString();
        return idOfManager === userId;
      });
      if (role === 'Manager') {
        const organized = organizeAnalytics(filteredManager);
        return serverResponse(res, 200, 'Success', organized);
      }
      const organized = organizeAnalytics(result);
      return serverResponse(res, 200, 'Success', organized);
    } catch (error) {
      console.log(error, 'kuri getiiiiiiii');
      return serverResponse(res, 500, error.message);
    }
  }

  static async getCountries(req, res) {
    // try {
    //   let country;
    //   let conditions;

    //   if (Array.isArray(req.query.country)) {
    //     country = req.query.country;
    //   } else {
    //     country = [req.query.country];
    //   }

    //   const { device } = req.query;
    //   const { _id: userId, role } = req.userData || {};

    //   conditions = {
    //     customer: userId,
    //     parentId: null,
    //     country,
    //     device,
    //   };

    //   if (role === 'Admin' || 'Manager') {
    //     conditions = { parentId: null, device, country };
    //     if (!country || !device) {
    //       conditions = { parentId: null };
    //     }
    //   }
    //   const analytics = await Analytics.find(conditions);
    //   // .populate({
    //   //   path: 'product',
    //   //   select: 'name imageIcon duplicate parentId',
    //   //   model: Product,
    //   // })
    //   // .populate({
    //   //   path: 'project',
    //   //   select: 'name manager',
    //   //   model: Project,
    //   // })
    //   // .populate({
    //   //   path: 'customer',
    //   //   select: 'companyName role',
    //   //   model: User,
    //   // })
    //   // .lean();
    //   const result = await analytics.filter(
    //     (item) => item.product?.parentId === null,
    //   );
    //   const organized = organizeAnalytics(result);

    //   const countries = organized.reduce(
    //     (acc, item) => [...acc, ...item.countries],
    //     [],
    //   );
    //   return serverResponse(res, 200, 'Success', countries);
    // } catch (error) {
    //   return serverResponse(res, 500, error.message);
    // }
  }

  static async getFilterAnalytics(req, res) {
    try {
      const { device, country } = req.body;
      const { _id: userId, role } = req.userData || {};
      let conditions = { customer: userId, parentId: null };
      if (role === 'Admin') {
        conditions = { parentId: null };
      }
      if (role === 'Manager') {
        conditions = { parentId: null };
      }
      const { project, time } = req.query;
      if (project) {
        filters = { ...filters, project };
      }
      if (time && time !== 'allTime') {
        let startDate = moment().startOf('day').toDate();
        const endDate = moment().endOf('day').toDate();
        if (time === '7days') {
          startDate = moment().subtract(7, 'd').toDate();
        } else if (time === '30days') {
          startDate = moment().subtract(30, 'd').toDate();
        }
        filters = {
          ...filters,
          createdAt: { $gte: startDate, $lte: endDate },
        };
      }
      const analytics = await Analytics.find(conditions);
      // .populate({
      //   path: 'product',
      //   select: 'name imageIcon duplicate parentId',
      //   model: Product,
      // })
      // .populate({
      //   path: 'project',
      //   select: 'name manager',
      //   model: Project,
      // })
      // .populate({
      //   path: 'customer',
      //   select: 'companyName role',
      //   model: User,
      // })
      // .lean();
      if (device || country || {}) {
        const result = await analytics.filter((item) => {
          const deviceString = item.device.toString();
          const countryString = item.country.toString();
          if (device === deviceString) {
            return (
              (item.product.parentId === null &&
                deviceString === device) ||
              countryString === country
            );
          }
        });
        const filtered = await result.filter((item) => {
          const managerId = item.project.manager;
          const idOfManager = managerId.toString();
          return idOfManager === userId;
        });
        if (role === 'Manager') {
          const organized = organizeAnalytics(filtered);
          return serverResponse(res, 200, 'Success', organized);
        }
        const organized = organizeAnalytics(filtered);

        return serverResponse(res, 200, 'Success', organized);
      }
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  static async getSingleAnalytics(req, res) {
    try {
      const { productId } = req.params;
      const { _id: userId, role } = req.userData || {};
      let conditions = { customer: userId, parentId: null };
      if (role === 'Manager' || role === 'Admin') {
        conditions = { parentId: null };
      }
      const { project, time } = req.query;
      if (project) {
        filters = { ...filters, project };
      }
      if (time && time !== 'allTime') {
        let startDate = moment().startOf('day').toDate();
        const endDate = moment().endOf('day').toDate();
        if (time === '7days') {
          startDate = moment().subtract(7, 'd').toDate();
        } else if (time === '30days') {
          startDate = moment().subtract(30, 'd').toDate();
        }
        filters = {
          ...filters,
          createdAt: { $gte: startDate, $lte: endDate },
        };
      }
      const analytics = await Analytics.find({
        product: productId,
      });
      return serverResponse(res, 200, 'Success', analytics);
    } catch (error) {
      console.log(error, 'error');
      return serverResponse(res, 500, error.message);
    }
  }

  static async duplicateAsset(req, res) {
    try {
      const { _id: userId } = req.userData;
      const { productId } = req.params;
      const product = await Product.findById(productId);
      const {
        name,
        price,
        sku,
        image,
        imageIcon,
        status,
        bgColor,
        customer,
        project,
        description,
        duplicate,
        _id,
      } = product;

      const duplicateProduct =
        (await product.updateOne({ duplicate: duplicate + 1 })) &&
        (await Product.create({
          name: `${name}~${duplicate + 1}`,
          price,
          sku,
          image,
          imageIcon,
          status,
          bgColor,
          customer,
          project,
          description,
          parentId: _id,
        }));
      await createLog(req, {
        userId,
        productId: _id,
        title: `Duplicated 3D asset ${name}`,
        duplicateId: product._id,
      });
      return serverResponse(res, 200, 'Duplicated', duplicateProduct);
    } catch (error) {
      return serverResponse(res, 500, 'error', error.message);
    }
  }

  static async getDuplicates(req, res) {
    try {
      const { productId } = req.params;
      const conditions = { parentId: productId };
      const allProductDuplicates = await Product.find(conditions)
        .populate({
          path: 'customer',
          select: 'fullName companyName',
          model: User,
        })
        .populate({
          path: 'project',
          select: 'name',
          model: Project,
        });

      return serverResponse(
        res,
        200,
        'Success',
        allProductDuplicates,
      );
    } catch (error) {
      return serverResponse(res, 500, 'error', error.message);
    }
  }

  static async getClientProducts(req, res) {
    const { _id: userId } = req.userData;
    try {
      const products = await Product.find({ customer: userId })
        .populate({
          path: 'customer',
          select: 'fullName companyName',
          model: User,
        })
        .sort({
          createdAt: -1,
        });
      return serverResponse(res, 200, 'Success', products);
    } catch (error) {
      return serverResponse(res, 400, 'Err', error);
    }
  }

  static async getDuplicatesAnalytics(req, res) {
    try {
      const { productId } = req.params;
      const analytics = await Analytics.find();
      const filteredAnalytics = analytics.filter((item) => {
        if (item.product && item.product.parentId) {
          return item.product.parentId.toString() === productId;
        }
        return false;
      });
      const organized = organizeAnalytics(filteredAnalytics);
      return serverResponse(res, 200, 'success', organized);
    } catch (error) {
      console.log(error, 'error');
      return serverResponse(res, 500, 'error', error.message);
    }
  }
}

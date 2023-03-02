import { Router } from 'express';
import multer from 'multer';
import { ProductController } from './product.controller';
import {
  checkIfToken,
  isAuthenticated,
  isAdminOrManager,
} from '../middleware/auth.middleware';
import {
  doesProductExist,
  isProductValid,
} from './product.middleware';
import upload3DImages from '../images/image.controller';

const upload = multer();

const productRouter = Router();
const {
  qrProduct,
  getProducts,
  addNewProduct,
  changeStatusProduct,
  editProduct,
  deleteProduct,
  getProductImages,
  updateAttributes,
  getProductDetails,
  deleteAttrImage,
  addProductAnalytic,
  getProductAnalytics,
  getSingleAnalytics,
  duplicateAsset,
  getDuplicates,
  getClientProducts,
  getDuplicatesAnalytics,
  viewProduct,
  getFilterAnalytics,
  getCountries,
} = ProductController;

productRouter.post(
  '/',
  isAuthenticated,
  isAdminOrManager,
  isProductValid,
  addNewProduct,
);
productRouter.get('/', isAuthenticated, getProducts);
productRouter.get('/countries', isAuthenticated, getCountries);
productRouter.get(
  '/:productId',
  isAuthenticated,
  doesProductExist,
  getProductDetails,
);
productRouter.patch(
  '/:productId',
  isAuthenticated,
  doesProductExist,
  editProduct,
);
productRouter.patch(
  '/status/:productId',
  isAuthenticated,
  doesProductExist,
  changeStatusProduct,
);
productRouter.delete(
  '/:productId',
  isAuthenticated,
  isAdminOrManager,
  doesProductExist,
  deleteProduct,
);
productRouter.post(
  '/upload/:fileType',
  isAuthenticated,
  isAdminOrManager,
  upload.array('productFiles'),
  upload3DImages,
);
productRouter.get(
  '/files/:productId',
  doesProductExist,
  getProductImages,
);
productRouter.patch(
  '/attributes/:productId',
  isAuthenticated,
  // isAdminOrManager,
  doesProductExist,
  updateAttributes,
);
productRouter.delete(
  '/:productId/image/:imageFileName',
  isAuthenticated,
  isAdminOrManager,
  doesProductExist,
  deleteAttrImage,
);
productRouter.get(
  '/get/analytics',
  isAuthenticated,
  getProductAnalytics,
);
productRouter.get(
  '/get/filterAnalytics',
  isAuthenticated,
  getFilterAnalytics,
);

productRouter.get(
  '/get/analytics/:productId',
  isAuthenticated,
  getSingleAnalytics,
);
productRouter.post(
  '/:productId/analytics',
  doesProductExist,
  addProductAnalytic,
);
productRouter.post(
  '/:productId',
  isAuthenticated,
  doesProductExist,
  duplicateAsset,
);
productRouter.get(
  '/:productId/duplicates',
  isAuthenticated,
  doesProductExist,
  getDuplicates,
);

productRouter.get(
  '/client/products/',
  isAuthenticated,
  getClientProducts,
);

productRouter.get(
  '/analyticsDuplicate/:productId',
  isAuthenticated,
  doesProductExist,
  getDuplicatesAnalytics,
);
productRouter.get(
  '/viewProduct/:productId',
  doesProductExist,
  checkIfToken,
  viewProduct,
);

productRouter.get(
  '/qr/:productId/:code',
  doesProductExist,
  qrProduct,
);

export default productRouter;

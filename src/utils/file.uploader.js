import { existsSync, mkdirSync, writeFileSync } from 'fs';
import multer from 'multer';
import path from 'path';
import { randomBytes } from 'crypto';
import { ACCEPTED_FILE_SIZE, isFileAllowed } from './helpers';
import { serverResponse } from './response';
import Product from '../database/model/product.model';
import User from '../database/model/user.model';

// eslint-disable-next-line import/prefer-default-export
export const uploadFiles = (req, res) => {
  let fileStorage = null;
  const { fileType } = req.params;
  const { productId, imgType, userId } = req.query;
  const randStr = randomBytes(10).toString('hex');
  let numberOfFiles = 1;
  if (fileType === 'image3d') {
    fileStorage = process.env.IMAGES_3D_ZONE;
    numberOfFiles = 2;
  } else if (fileType === 'attr-image') {
    fileStorage = process.env.IMAGES_ZONE;
  } else if (fileType === 'profile-img') {
    fileStorage = process.env.PROFILES_ZONE;
  } else if (fileType === 'asset-icon') {
    fileStorage = process.env.ASSET_ICON;
  } else return serverResponse(res, 400, 'Unknown file upload');
  if (!existsSync(fileStorage)) {
    mkdirSync(fileStorage, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: (_req, file, callBack) => {
      return callBack(null, fileStorage);
    },
    filename: (_req, file, callBack) => {
      if (fileStorage !== process.env.ASSET_ICON) {
        const ext = path.extname(file.originalname).split('.')[1];
        const fileName = file.originalname.split('.')[0];
        let mediaLink = `${fileName}-${Date.now()}.${ext}`;
        if (fileStorage === process.env.IMAGES_3D_ZONE) {
          mediaLink = `${fileName}-${randStr}@${Date.now()}.${ext}`;
        }
        return callBack(null, mediaLink);
      }
      const fileName = _req.body.productFiles[2];
      return callBack(null, fileName);
    },
  });
  const upload = multer({
    storage,
    limits: { fileSize: ACCEPTED_FILE_SIZE },
    fileFilter: (_req, file, filterCallBack) => {
      isFileAllowed(file, fileStorage, (error, allowed) => {
        return filterCallBack(error, allowed);
      });
    },
  }).array('productFiles', numberOfFiles);

  upload(req, res, async (uploadError) => {
    if (uploadError instanceof multer.MulterError || uploadError) {
      const errorMsg = uploadError.message || uploadError;
      return serverResponse(res, 500, errorMsg);
    }
    if (fileType !== 'asset-icon' && !req.files?.length) {
      return serverResponse(res, 400, 'No file selected');
    }
    let fileName =
      fileType !== 'asset-icon'
        ? req.files[0].filename
        : req.body.productFiles[2];
    if (productId && fileStorage === process.env.IMAGES_ZONE) {
      await Product.updateOne(
        { _id: productId },
        {
          $addToSet: {
            'image.imageFiles': {
              imageType: imgType,
              imageFileName: fileName,
              canBeDeleted: true,
            },
          },
        },
      );
    }
    if (userId && fileStorage === process.env.PROFILES_ZONE) {
      await User.updateOne(
        { _id: userId },
        { profileImage: fileName },
      );
    }

    if (fileStorage === process.env.IMAGES_3D_ZONE) {
      fileName = req.files[0]?.filename.split('@')[0];
    }

    if (productId && fileStorage === process.env.ASSET_ICON) {
      const file = fileName.replace(/^data:image\/\w+;base64,/, '');
      const buff = Buffer.from(file, 'base64');
      const iconName = `asset-icon-${Date.now()}.png`;
      writeFileSync(`${fileStorage}/${iconName}`, buff);
      await Product.updateOne(
        { _id: productId },
        { imageIcon: iconName },
      );
    }
    return serverResponse(res, 200, 'Files uploaded', fileName);
  });
};

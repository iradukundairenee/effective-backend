/* eslint-disable prefer-destructuring */
/* eslint-disable no-cond-assign */
import { readdir, readdirSync, unlink, unlinkSync } from 'fs';
import path, { resolve } from 'path';
import { Types } from 'mongoose';
// import ipAddr from 'ipaddr.js';

export const isFileAllowed = (file, filePath, fileCallBack) => {
  const images = process.env.IMAGES_ZONE;
  const profiles = process.env.PROFILES_ZONE;
  const images3D = process.env.IMAGES_3D_ZONE;
  const imageIcon = process.env.ASSET_ICON;

  // Allowed exts
  const allowed3DImages = /glb|gltf|usdz/;
  const allowedImages = /jpeg|jpg|png/;
  // Check ext
  let extname = false;
  // Check mime
  let mimetype = false;
  let errorMessage = '';
  if (
    filePath === images ||
    filePath === profiles ||
    filePath === imageIcon
  ) {
    extname = allowedImages.test(
      path.extname(file.originalname).toLowerCase(),
    );
    mimetype = allowedImages.test(file.mimetype);
    errorMessage = 'Error: only (jpeg, jpg or png) images allowed';
  }

  if (filePath === images3D) {
    extname = allowed3DImages.test(
      path.extname(file.originalname).toLowerCase(),
    );
    mimetype =
      file.mimetype === 'application/octet-stream' ||
      file.mimetype === 'model/vnd.usdz+zip';
    errorMessage = 'Error: only (glb or usdz) files allowed';
  }

  if (mimetype && extname) {
    return fileCallBack(null, true);
  }
  return fileCallBack(errorMessage);
};
const MB = 1024 * 1024;
export const ACCEPTED_FILE_SIZE = 50 * MB; // 50 mbs

export const deleteDirFilesUsingPattern = (
  pattern = 'dssd',
  dirPath = '',
) => {
  // default directory is the current directory

  // get all file names in directory
  const regPattern = new RegExp(pattern, 'g');
  readdir(resolve(dirPath), (error, fileNames) => {
    if (error) throw error;

    // iterate through the found file names
    // eslint-disable-next-line no-restricted-syntax
    for (const name of fileNames) {
      // if file name matches the pattern
      if (regPattern.test(name)) {
        // try to remove the file and log the result
        unlink(resolve(name), (err) => {
          if (err) throw err;
        });
      }
    }
  });
};
export const schemaErrors = (schema, body) => {
  const { error } = schema.validate(body);

  if (error) {
    const errors = error.details.map((err) => err.message);
    return errors;
  }
  return false;
};
export const isValidObjectId = (id) => {
  if (Types.ObjectId.isValid(id)) {
    if (String(new Types.ObjectId(id)) === id) return true;
    return false;
  }
  return false;
};
export const getDomainFromUrl = (url) => {
  let result = null;
  let match = null;
  const urlRegex =
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?=]+)/im;
  if ((match = url.match(urlRegex))) {
    result = match[1];
    if ((match = result.match(/^[^.]+\.(.+\..+)$/))) {
      result = match[1];
    }
  }
  return result;
};
export const calculateAmounts = ({
  items = [],
  taxes = [],
  discount = 0,
  isFixed,
}) => {
  const grandTotal = Number(
    items.reduce((sum, item) => sum + item.total, 0),
  );
  const totDiscount = isFixed
    ? Number(discount)
    : (grandTotal * Number(discount)) / 100;
  const subTotal = grandTotal - totDiscount;
  const tax = taxes.reduce((a, b) => a + Number(b.amount), 0);
  const totTax = (subTotal * tax) / 100;
  const amounts = {
    subtotal: grandTotal.toFixed(2),
    tax: totTax.toFixed(2),
    discount: totDiscount.toFixed(2),
    total: (subTotal + totTax).toFixed(2),
  };
  return amounts;
};
export const haveTaxesChanged = (prev = [], curr = []) => {
  const totalPrev = prev.reduce((sum, t) => sum + t.amount, 0);
  const totalCurr = curr.reduce((sum, t) => sum + t.amount, 0);
  return totalPrev !== totalCurr;
};
export const getRequestIp = (reqIp) => {
  let remoteAddress = reqIp;
  if (ipAddr.isValid(reqIp)) {
    const addr = ipAddr.parse(reqIp);
    if (addr.isIPv4MappedAddress()) {
      remoteAddress = addr.toIPv4Address().toString();
    }
  }
  return remoteAddress;
};
export const deleteProductImages = async ({
  src = '',
  imageFiles = [],
}) => {
  const imagesZone = process.env.IMAGES_ZONE;
  const images3DZone = process.env.IMAGES_3D_ZONE;
  try {
    readdirSync(images3DZone).forEach((img) => {
      if (img.includes(src)) {
        unlinkSync(`${images3DZone}/${img}`);
      }
    });
    imageFiles.forEach((image) => {
      if (image.canBeDeleted) {
        unlinkSync(`${imagesZone}/${image.imageFileName}`);
      }
    });
    return 'Images Deleted';
  } catch (error) {
    return 'There was an when deleting images';
  }
};

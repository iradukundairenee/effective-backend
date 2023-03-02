import { randomBytes } from 'crypto';
import User from '../../database/model/user.model';
import { serverResponse } from '../../utils/response';
import uploadImages from '../../utils/spaces/uploadImage';

const { SPACES_NAME } = process.env;

const upload3DImages = async (req, res) => {
  try {
    const { files } = req;
    const { fileType } = req.params;
    const { productId, imgType, userId } = req.query;
    const randStr = randomBytes(10).toString('hex');

    const imageUrls = { glb: '', usdz: '' };
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = Date.now() + randStr + file?.originalname;
      // eslint-disable-next-line no-await-in-loop
      const result = await uploadImages({
        Bucket: SPACES_NAME,
        Key: fileName,
        Body: file?.buffer,
        ACL: 'public-read',
        ContentType: file?.mimetype,
        ContentEncoding: file?.encoding,
        Metadata: {
          'x-amz-meta-my-key': Date.now().toString(),
        },
      });
      if (result.Location.includes('.glb'))
        imageUrls.glb = `https://cube.nyc3.digitaloceanspaces.com/${fileName}`;
      else
        imageUrls.usdz = `https://cube.nyc3.digitaloceanspaces.com/${fileName}`;
    }

    if (productId && fileType === 'attr-image') {
      await User.updateOne(
        { _id: userId },
        {
          $addToSet: {
            imageFiles: {
              imageName: files[0]?.originalname,
              imageType: imgType,
              imageUrl: imageUrls.usdz,
              canBeDeleted: true,
            },
          },
        },
      );
    }

    //  on update user profile
    if (userId && fileType === 'profile-img') {
      await User.updateOne(
        { _id: userId },
        { profileImage: imageUrls.usdz },
      );
    }

    if (fileType !== 'asset-icon' && !req.files?.length) {
      return serverResponse(res, 400, 'No file selected');
    }

    return serverResponse(res, 200, 'success', { imageUrls });
  } catch (error) {
    return serverResponse(res, 500, 'Error', error);
  }
};

export default upload3DImages;

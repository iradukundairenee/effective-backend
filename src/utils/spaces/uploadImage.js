import s3 from '../../config/space.config';

const uploadImages = (params) => {
  return new Promise((resolve, reject) =>
    s3.upload(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    }),
  );
};

export default uploadImages;

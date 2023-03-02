import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from 'http-status';
import { serverResponse } from '../../utils/response';
import Product from '../../database/model/product.model';

const checkIfProductExist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product)
      return serverResponse(res, BAD_REQUEST, 'product not found');

    return next();
  } catch (error) {
    return serverResponse(
      res,
      INTERNAL_SERVER_ERROR,
      'server error',
      error,
    );
  }
};

export default checkIfProductExist;

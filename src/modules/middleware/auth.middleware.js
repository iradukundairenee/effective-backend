import { UNAUTHORIZED, FORBIDDEN } from 'http-status';
import TokenUtil from '../../utils/jwt.util';
import ResponseUtil from '../../utils/response.util';

/**
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 * @returns {object} protect route
 */
export const isAuthenticated = async (req, res, next) => {
  try {
    const bearerHeader = req.headers.authorization;

    if (typeof bearerHeader !== 'undefined') {
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];
      req.token = bearerToken;
      const { name } = TokenUtil.verifyToken(req.token);

      if (name === 'JsonWebTokenError') {
        ResponseUtil.setError(
          UNAUTHORIZED,
          'Unauthorized, invalid token',
        );
        return ResponseUtil.send(res);
      }

      if (name === 'TokenExpiredError') {
        ResponseUtil.setError(
          UNAUTHORIZED,
          'Unauthorized, Token has expired signin again to get new token',
        );
        return ResponseUtil.send(res);
      }
      req.userData = TokenUtil.verifyToken(req.token);

      return next();
    }

    ResponseUtil.setError(
      FORBIDDEN,
      'You can not proceed without setting authorization token',
    );
    return ResponseUtil.send(res);
  } catch (error) {
    return ResponseUtil.send(res);
  }
};

/**
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 * @returns {object} protect route
 */
export const isNotVisitor = (req, res, next) => {
  if (req.userData && req.userData.role !== 'visitor') {
    return next();
  }
  ResponseUtil.setError(
    UNAUTHORIZED,
    'Unauthorized, You cannot perform this action',
  );
  return ResponseUtil.send(res);
};
/**
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 * @returns {object} protect route
 */
export const isClient = (req, res, next) => {
  if (req.userData && req.userData.role === 'Client') {
    return next();
  }
  ResponseUtil.setError(
    UNAUTHORIZED,
    'Unauthorized, The action is for clients',
  );
  return ResponseUtil.send(res);
};
/**
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 * @returns {object} protect route
 */
export const isManager = (req, res, next) => {
  if (req.userData && req.userData.role === 'Manager') {
    return next();
  }
  ResponseUtil.setError(
    UNAUTHORIZED,
    'Unauthorized, The action is for managers',
  );
  return ResponseUtil.send(res);
};
/**
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 * @returns {object} protect route
 */
export const isAdmin = (req, res, next) => {
  if (req.userData && req.userData.role === 'Admin') {
    return next();
  }
  ResponseUtil.setError(
    UNAUTHORIZED,
    'Unauthorized, The action is for admins',
  );
  return ResponseUtil.send(res);
};
/**
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 * @returns {object} protect route
 */
export const isAdminOrManager = (req, res, next) => {
  const user = req.userData;
  const { fileType } = req.params;
  if (user && (user.role === 'Admin' || user.role === 'Manager')) {
    return next();
  }
  if (fileType === 'profile-img') return next();
  ResponseUtil.setError(
    UNAUTHORIZED,
    'Unauthorized, The action is for admins',
  );
  return ResponseUtil.send(res);
};

/**
 * @param  {object} req
 * @param  {object} res
 * @param  {object} next
 * @returns {object} check if request has token and update user
 */
export const checkIfToken = (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    const { name } = TokenUtil.verifyToken(req.token);

    if (
      name !== 'JsonWebTokenError' &&
      name !== 'TokenExpiredError'
    ) {
      req.userData = TokenUtil.verifyToken(req.token);
    }
    return next();
  }
};

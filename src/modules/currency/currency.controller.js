import Item from '../../database/model/Items';
import User from '../../database/model/user.model';
import Currency from '../../database/model/currency.model';
import CurrencyCustomer from '../../database/model/customerCurrency.model';

const createCurrency = async (req, res) => {
  try {
    const newCurrency = await Currency.create(req.body);
    return res.status(201).json({
      status: 201,
      message: 'Successful',
      newCurrency,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: 'something went wrong',
      error: err,
    });
  }
};

const getSingleCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await Currency.findById(id);
    if (!currency) {
      return res.status(404).json({
        status: 404,
        message: 'Currency not found',
      });
    }
    return res.status(200).json({
      status: 200,
      message: 'Successful',
      currency,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: 'something went wrong',
      error: err,
    });
  }
};

const addCurrencyToProfile = async (req, res) => {
  try {
    const { userId, currencyId } = req.params;
    const newCurrency = await CurrencyCustomer.create({
      user: userId,
      currency: currencyId,
    });
    return res.status(201).json({
      status: 201,
      message: 'Successful',
      newCurrency,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: 'something went wrong',
      error: err,
    });
  }
};

const updateCurrency = async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await Currency.findById(id);
    if (!currency) {
      return res.status(404).json({
        status: 404,
        message: 'Currency not found',
      });
    }
    const updatedCurrency = await Currency.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      },
    );

    const {
      currencyName,
      currencyCode,
      icon,
      taxName,
      taxPercentage,
    } = req.body;

    // update currency at user model
    await User.bulkWrite([
      {
        updateMany: {
          filter: { 'currency._id': id },
          update: {
            $set: {
              'currency._id': id,
              'currency.currencyName': currencyName,
              'currency.currencyCode': currencyCode,
              'currency.icon': icon,
              'currency.taxName': taxName,
              'currency.taxPercentage': taxPercentage,
            },
          },
        },
      },
    ]);

    // update currency  at Item table
    await Item.bulkWrite([
      {
        updateMany: {
          filter: { 'currency._id': id },
          update: {
            $set: {
              'currency._id': id,
              'currency.currencyName': currencyName,
              'currency.currencyCode': currencyCode,
              'currency.icon': icon,
              'currency.taxName': taxName,
              'currency.taxPercentage': taxPercentage,
            },
          },
        },
      },
    ]);

    return res.status(200).json({
      status: 200,
      message: 'Successful',
      updatedCurrency,
    });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: 'something went wrong',
      error: err,
    });
  }
};

const getCurrency = async (req, res) => {
  try {
    const allCurrency = await Currency.find();
    if (!allCurrency.length)
      return res.status(404).json({ message: 'not found ' });
    return res.status(200).json({ data: allCurrency });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: 'something went wrong',
      error: err,
    });
  }
};

const getProfileCurrencies = async (req, res) => {
  try {
    const { currencyId } = req.params;
    const allCurrency = await CurrencyCustomer.count({
      currency: currencyId,
    });
    return res.status(200).json({ data: allCurrency });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: 'something went wrong',
      error: err,
    });
  }
};

const getCurrencyByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    let userCurrency;
    if (userId) {
      userCurrency = await CurrencyCustomer.find({
        user: userId,
      }).populate({
        path: 'currency',
      });
    } else {
      userCurrency = await CurrencyCustomer.find()
        .populate({
          path: 'currency',
          select: '_id icon currencyCode',
        })
        .populate({
          path: 'user',
          select: { password: 0, resetKey: 0 },
        });
    }
    return res.status(200).json({ data: userCurrency });
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: 'something went wrong',
      error: err,
    });
  }
};

export default {
  createCurrency,
  updateCurrency,
  getSingleCurrency,
  getCurrency,
  getProfileCurrencies,
  addCurrencyToProfile,
  getCurrencyByUser,
};

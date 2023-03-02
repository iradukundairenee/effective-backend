import Item from '../../database/model/Items';
import User from '../../database/model/user.model';
import Quote from '../../database/model/quote.model';
import { serverResponse } from '../../utils/response';
import createLog from '../../utils/track.allctivities';
import ProposalItem from '../../database/model/proposalItem';
import adjustAmounts from '../../utils/proposalHelper/proposalItemsHelper';

export default class ItemController {
  // create item
  static async createItem(req, res) {
    const { item, price } = req.body;

    try {
      if (!item) return serverResponse(res, 400, 'no item provided');
      if (!price)
        return serverResponse(res, 400, 'no price provided');

      const isItemExist = await Item.findOne({ item });
      if (isItemExist)
        return serverResponse(res, 400, 'item already exists');

      const newItem = await Item.create(req.body);

      return serverResponse(
        res,
        201,
        'item created successfully',
        newItem,
      );
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  // get all items
  static async getItems(req, res) {
    const items = await Item.find().sort({ createdAt: -1 });
    return serverResponse(
      res,
      200,
      'item created successfully',
      items,
    );
  }

  // update item
  static async updateItem(req, res) {
    const { item } = req.body;
    const { itemId } = req.params;

    try {
      const isItemExist = await Item.findById(itemId);
      if (!isItemExist)
        return serverResponse(res, 404, 'item not found');

      const isItemNameExist = await Item.find({ item });

      if (isItemNameExist[0]._id != itemId)
        return serverResponse(res, 400, 'item name exist already');

      const updateItem = await Item.updateOne(
        { _id: itemId },
        { ...req.body },
      );

      if (updateItem.newItem === 0)
        return serverResponse(res, 400, 'unable to update item');

      return serverResponse(
        res,
        200,
        'item created successfully',
        updateItem,
      );
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  /* 
  item proposals
  add proposal Item 
  */
  static async addProposalItem(req, res) {
    const { quantity } = req.body;
    const { _id: userId } = req.userData;
    const { proposalId } = req.params;

    try {
      if (!quantity)
        return serverResponse(res, 400, 'no quantity provided');

      const isProposalExist = await Quote.findById(proposalId);
      if (!isProposalExist)
        return serverResponse(res, 400, 'proposal not found');

      const addItem = await Quote.updateOne(
        { _id: proposalId },
        { $push: { items: { ...req.body } } },
      );

      // adjust amounts
      await adjustAmounts(proposalId);

      // create log
      await createLog(req, {
        userId,
        quoteId: proposalId,
        title: `Added item on proposal`
      });

      return serverResponse(
        res,
        200,
        'proposal item created successfully',
        addItem,
      );
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  //  remove proposal Item
  static async removeProposalItem(req, res) {
    const { _id: userId } = req.userData;
    const { proposalId, itemId } = req.params;

    try {
      await Quote.findOneAndUpdate(
        {
          _id: proposalId,
          items: { $elemMatch: { _id: itemId } },
        },
        {
          $pull: { items: { _id: itemId } },
        },
        { new: true, safe: true, upsert: true },
      );

      // adjust amounts
      await adjustAmounts(proposalId);

      await createLog(req, {
        userId,
        quoteId: proposalId,
        title: 'Removed item on proposal',
      });

      return serverResponse(
        res,
        200,
        'proposal item deleted successfully',
      );
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  // update proposal Item
  static async updateProposalItem(req, res) {
    const { quantity } = req.body;
    const { _id: userId } = req.userData;
    const { proposalId, itemId } = req.params;

    try {
      if (!quantity)
        return serverResponse(res, 400, 'no quantity provided');

      const isProposalExist = await Quote.findById(proposalId);
      if (!isProposalExist)
        return serverResponse(res, 400, 'proposal not found');

      const proposal = await Quote.findOneAndUpdate(
        {
          _id: proposalId,
          items: { $elemMatch: { _id: itemId } },
        },
        {
          $set: {
            'items.$.quantity': quantity,
          },
        },
        { new: true, safe: true, upsert: true },
      );

      await adjustAmounts(proposalId);

      await createLog(req, {
        userId,
        quoteId: proposalId,
        title: 'Updated item on proposal',
      });

      return serverResponse(
        res,
        200,
        'proposal item updated successfully',
        proposal,
      );
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  // get proposal items
  static async getProposalItems(req, res) {
    const { proposalId } = req.params;

    const items = await ProposalItem.find({ proposalId }).populate({
      path: 'itemId',
      model: Item,
    });
    return serverResponse(
      res,
      200,
      'item created successfully',
      items,
    );
  }

  //  get all items that are not used
  static async getUnUsedItems(req, res) {
    try {
      const items = await Item.aggregate([
        {
          $lookup: {
            from: 'proposalitems',
            localField: '_id',
            foreignField: 'itemId',
            as: 'unused',
          },
        },
        {
          $match: {
            unused: { $eq: [] },
          },
        },
      ]);
      return serverResponse(res, 200, items);
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }

  //  get all items that are not added to the proposal yet
  static async getUnAddedItems(req, res) {
    try {
      const { proposalId } = req.params;

      const usedItems = await Quote.findOne({
        _id: proposalId,
      }).populate({
        path: 'user',
        select: 'currency',
        model: User,
      });

      const { currencyName } = usedItems.user.currency;

      const allItems = await Item.find({
        'currency.currencyName': currencyName,
      });

      await allItems.filter((item, index) =>
        usedItems.items.filter((usedItem) => {
          if (usedItem.item._id.equals(item._id)) {
            allItems.splice(index, 1);
          }
        }),
      );

      return serverResponse(
        res,
        200,
        'item created successfully',
        allItems,
      );
    } catch (error) {
      return serverResponse(res, 500, error.message);
    }
  }
}

import Quote from '../../database/model/quote.model';
import User from '../../database/model/user.model';

const adjustAmounts = async (proposalId) => {
  const updatedQuote = await Quote.findById(proposalId).populate({
    path: 'user',
    select: 'currency',
    model: User,
  });
  const { tax, discount } = updatedQuote.amounts;
  const { taxPercentage } = updatedQuote.user.currency;

  let subtotal = 0;
  await updatedQuote.items.filter((item) => {
    const total = item.quantity * item.item.price;
    subtotal = total + subtotal;
  });

  const newTax = (taxPercentage / 100) * subtotal;

  const total = subtotal + newTax - discount;

  const newAmounts = {
    subtotal,
    tax,
    discount,
    total,
  };

  await Quote.updateOne({ _id: proposalId }, { amounts: newAmounts });
};

export default adjustAmounts;

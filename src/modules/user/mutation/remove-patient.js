/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const { CustomApolloError } = require('../../../lib/error-handler');
const {
  getCustomerById,
  updateCustomerData,
  updateBook,
  getBookById,
} = require('../../../repository/customer-repository');
const { getMessage } = require('../../../utils/messages');
const userLogger = require('../user-logger');

const removeCustomer = async (_, args, ctx) => {
  try {
    const { customerId } = args;

    const isCustomerExist = await getCustomerById(customerId, ctx);
    if (!isCustomerExist) {
      throw new CustomApolloError(getMessage('CUSTOMER_NOT_FOUND'));
    }

    const getBookId = isCustomerExist.bookId;
    const book = await getBookById(getBookId, ctx);
    const { customers, dueAmount } = book;
    if (dueAmount > 0) {
      throw new CustomApolloError(getMessage('CANNOT_DELETE_CUSTOMER_WITH_DUE_AMOUNT'));
    }

    // Remove this customer from all family members' familyMembers list
    const { familyMembers } = isCustomerExist;
    for (const familyMemberId of familyMembers) {
      const familyMember = await getCustomerById(familyMemberId, ctx);
      if (!familyMember) {
        continue;
      }
      await updateCustomerData(
        familyMemberId,
        { $pull: { familyMembers: customerId } },
        ctx,
      );
    }

    // Remove customer from book or delete book if no customers left
    const updatedCustomers = customers.filter(id => id.toString() !== customerId.toString());
    if (updatedCustomers.length === 0) {
      await updateBook(isCustomerExist.bookId, { isDeleted: true }, ctx);
    } else {
      await updateBook(isCustomerExist.bookId, { $pull: { customers: customerId } }, ctx);
    }

    // Finally, mark customer as deleted
    await updateCustomerData(customerId, { isDeleted: true }, ctx);
    return true;
  } catch (error) {
    userLogger(`Error from removeCustomer > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = removeCustomer;


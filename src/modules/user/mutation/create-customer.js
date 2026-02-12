/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const {
  addCustomer, updateCustomerData, createBook, updateBook,
  getBookById,
} = require('../../../repository/customer-repository');
const userLogger = require('../user-logger');

const createCustomer = async (_, { data }, ctx) => {
  try {
    const { id: userId } = ctx.user;

    const {
      name,
      age,
      countryCode,
      phoneNumber,
      sex,
      address,
      bookNumber,
      bookId,
      shopId,
      branchId,
    } = data;

    const customerPayload = {
      name,
      age,
      countryCode,
      phoneNumber,
      sex,
      address,
      bookNumber,
      shopId,
      branchId,
      userId,
      bookId,
    };

    const createdCustomer = await addCustomer(customerPayload, ctx);
    const { id: customerId } = createdCustomer;

    if (!bookId) {
      const createdBook = await createBook(
        {
          bookNumber,
          customers: [customerId],
          shopId,
          branchId,
          userId,
        },
        ctx,
      );
      const { id: newBookId } = createdBook;
      await updateCustomerData(customerId, { bookId: newBookId }, ctx);
    } else {
      await updateBook(
        bookId,
        {
          $addToSet: { customers: customerId },
        },
        ctx,
      );

      const book = await getBookById(bookId, ctx);
      const { customers } = book;

      for (const existingCustomerId of customers) {
        if (existingCustomerId.toString() === customerId.toString()) {
          continue;
        }

        await updateCustomerData(
          existingCustomerId,
          { $addToSet: { familyMembers: customerId } },
          ctx,
        );
        await updateCustomerData(
          customerId,
          { $addToSet: { familyMembers: existingCustomerId } },
          ctx,
        );
      }
    }

    return { customer: createdCustomer };
  } catch (error) {
    userLogger(`Error from createCustomer > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = createCustomer;


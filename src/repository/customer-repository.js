const defaultLogger = require('../logger');
const models = require('../schema');

const addCustomer = async (data, ctx) => {
  try {
    const { Customer: CustomerModel } = models;
    const customer = await CustomerModel.create(data);
    return customer;
  } catch (error) {
    defaultLogger(`Error from addCustomer > ${error}`, ctx, 'error');
    throw error;
  }
};

const updateCustomerData = async (customerId, data, ctx) => {
  try {
    const { Customer: CustomerModel } = models;
    const customer = await CustomerModel.findByIdAndUpdate(customerId, data, { new: true });
    return customer;
  } catch (error) {
    defaultLogger(`Error from updateCustomerData > ${error}`, ctx, 'error');
    throw error;
  }
};

const getCustomerById = async (customerId, ctx) => {
  try {
    const { Customer: CustomerModel } = models;
    const customer = await CustomerModel.findById(customerId);
    return customer;
  } catch (error) {
    defaultLogger(`Error from getCustomerById > ${error}`, ctx, 'error');
    throw error;
  }
};

const createBook = async (data, ctx) => {
  try {
    const { Book: BookModel } = models;
    const book = await BookModel.create(data);
    return book;
  } catch (error) {
    defaultLogger(`Error from createBook > ${error}`, ctx, 'error');
    throw error;
  }
};

const updateBook = async (bookId, data, ctx) => {
  try {
    const { Book: BookModel } = models;
    const book = await BookModel.findByIdAndUpdate(bookId, data, { new: true });
    return book;
  } catch (error) {
    defaultLogger(`Error from updateBook > ${error}`, ctx, 'error');
    throw error;
  }
};

const getBookById = async (bookId, ctx) => {
  try {
    const { Book: BookModel } = models;
    const book = await BookModel.findById(bookId);
    return book;
  } catch (error) {
    defaultLogger(`Error from getBookById > ${error}`, ctx, 'error');
    throw error;
  }
};

const fetchCustomers = async ({
  shopId, branchId, limit, offset, search, ctx,
}) => {
  try {
    const { Customer: CustomerModel } = models;
    const query = { isDeleted: false };

    if (shopId) {
      query.shopId = shopId;
    }

    if (branchId) {
      query.branchId = branchId;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { bookNumber: { $regex: search, $options: 'i' } },
      ];
    }
    const customers = await CustomerModel.find(query)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });
    const totalCount = await CustomerModel.countDocuments(query);
    return { customers, totalCount };
  } catch (error) {
    defaultLogger(`Error from fetchCustomers > ${error}`, ctx, 'error');
    throw error;
  }
};

const fetchBooks = async ({
  shopId, limit, offset, search, ctx,
}) => {
  try {
    const { Book: BookModel } = models;
    const query = { isDeleted: false };
    if (shopId) {
      query.shopId = shopId;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
      ];
    }
    const books = await BookModel.find(query)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });
    const totalCount = await BookModel.countDocuments(query);
    return { books, totalCount };
  } catch (error) {
    defaultLogger(`Error from fetchBooks > ${error}`, ctx, 'error');
    throw error;
  }
};

module.exports = {
  addCustomer,
  updateCustomerData,
  getCustomerById,
  createBook,
  updateBook,
  getBookById,
  fetchCustomers,
  fetchBooks,
};

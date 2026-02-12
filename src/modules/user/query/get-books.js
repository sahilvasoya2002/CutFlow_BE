/* eslint-disable no-underscore-dangle */
const {
  fetchBooks,
} = require('../../../repository/customer-repository');
const userLogger = require('../user-logger');

const getBooks = async (_, { data }, ctx) => {
  try {
    const {
      shopId, limit, offset, search,
    } = data;

    const { books, totalCount } = await fetchBooks({
      shopId, limit, offset, search, ctx,
    });

    return { books, totalCount };
  } catch (error) {
    userLogger(`Error from getBooks > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = getBooks;

/* eslint-disable no-underscore-dangle */
const { CustomApolloError } = require('../../../lib/error-handler');
const {
  updateShopData, getShopById,
} = require('../../../repository/branch-repository');
const { getMessage } = require('../../../utils/messages');
const userLogger = require('../user-logger');

const updateShop = async (_, { data }, ctx) => {
  try {
    const { shopId, name, logo } = data;

    const existingShop = await getShopById(shopId, ctx);
    if (!existingShop) {
      throw new CustomApolloError(getMessage('SHOP_NOT_FOUND'));
    }

    const shop = await updateShopData(
      shopId,
      {
        name,
        logo,
      },
      ctx,
    );

    return { shop };
  } catch (error) {
    userLogger(`Error from updateShop > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = updateShop;

const { CustomApolloError } = require('../lib/error-handler');
const getUser = require('../utils/auth/get-user');
const { getMessage } = require('../utils/messages');

const directiveResolvers = {
  isUserAuthenticatedManagementAccess: async (next, source, args, ctx) => {
    ctx.systemUser = true;
    const user = await getUser(ctx);
    if (!user) {
      throw new CustomApolloError(getMessage('USER_NOT_FOUND'));
    }
    ctx.user = user;
    return next();
  },
};

module.exports = { directiveResolvers };

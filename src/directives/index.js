/* eslint-disable no-param-reassign */
/* eslint-disable security/detect-object-injection */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */

const isUserAuthenticationManagementAccessDirectiveTransformer = require('./user-authentication');

const directivesObj = {
  isUserAuthenticatedManagementAccess: isUserAuthenticationManagementAccessDirectiveTransformer,
};

const applyDirective = schema => {
  for (const directive in directivesObj) {
    schema = directivesObj[directive](schema, directive);
  }
  return schema;
};

module.exports = applyDirective;

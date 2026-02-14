const { join } = require('path');

const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');

// Load all .graphql files (schema)
const typesArray = loadFilesSync(
  join(__dirname, './**/*.graphql'),
);

// Load all resolver files from modules
const resolverArray = loadFilesSync(
  join(__dirname, '../modules/**/*.resolvers.*'),
);

const typeDefs = mergeTypeDefs(typesArray);
const resolvers = mergeResolvers(resolverArray);

module.exports = { typeDefs, resolvers };

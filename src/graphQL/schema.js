const { merge } = require("lodash");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { Shared } = require("./utils/typeDefsShared");
const TimestampType = require("./utils/customTypes/Timestamp");
const GraphQLJSON = require("graphql-type-json");
const { GraphQLUpload } = require("graphql-upload");
const {
  typeDef: Feedback,
  resolvers: feedbackResolvers,
} = require("./feedback");

const Query = `
  type Query {
    _empty: String
  }
  scalar Timestamp
  scalar JSON
  scalar Upload
`;

const uploadResolvers = {
  Upload: GraphQLUpload,
};

const timestampResolvers = {
  Timestamp: TimestampType,
};

const jsonResolvers = {
  JSON: GraphQLJSON,
};

module.exports = makeExecutableSchema({
  typeDefs: [Query, Shared, Feedback],
  resolvers: merge(
    uploadResolvers,
    timestampResolvers,
    jsonResolvers,
    feedbackResolvers
  ),
});

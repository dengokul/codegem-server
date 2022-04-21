const { gql } = require("apollo-server");
const DB = require("../config/db");
const { MyError } = require("../helpers/errorHandler");

exports.typeDef = gql`
  type ResponsePayload {
    responseCode: String!
    data: JSON
  }

  input SaveFeedbackRequest {
    shareVal: String!
    members: JSON!
    tags: JSON
    shareTo: JSON
  }

  extend type Query {
    getAllFeedback: ResponsePayload
  }

  type Mutation {
    saveFeedback(input: SaveFeedbackRequest): ResponsePayload
  }
`;

exports.resolvers = {
  Query: {
    getAllFeedback: async (root, args) => {
      try {
        const [reportsRow] = await DB.query(
          `SELECT *
            FROM feedback
            ORDER BY createdAt DESC
            LIMIT 20 OFFSET 0
            `
        );
        return {
          responseCode: "1",
          data: reportsRow,
        };
      } catch (err) {
        console.log('err', err)
        throw new MyError("Somethig went wrong");
      }
    }
  },

  Mutation: {
    saveFeedback: async (root, args) => {
      try {
        const { input } = args;
        const { shareVal, members, tags, shareTo } = input;
        if (!shareVal || !members) return new MyError("invalid data");
        const insertData = {
          shareVal,
          members: JSON.stringify(members),
          tags: JSON.stringify(tags),
          shareTo: JSON.stringify(shareTo),
        };
        var [rows] = await DB.query("INSERT INTO feedback SET ?", insertData);

        return {
          responseCode: "1",
          data: [rows],
        };
      } catch (err) {
        console.log(err);
        throw new MyError("Somethig went wrong");
      }
    }
  },
};

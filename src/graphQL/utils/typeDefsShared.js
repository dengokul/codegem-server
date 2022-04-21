const { gql } = require("apollo-server");

exports.Shared = gql`
  type TotalCount {
    totalCount: Int
  }

  input Paginate {
    offset: Int
    limit: Int
    currentPage: Int
  }
`;

const { ApolloServer } = require("apollo-server-express");
const schema = require("./graphQL/schema");
const winston = require("winston");
const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { getCurrentUser } = require("./controllers/authController");
const errorHandler = require("./helpers/errorHandler");
const { graphqlUploadExpress } = require("graphql-upload");

dotenv.config();
const app = express();

app.use(graphqlUploadExpress());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

async function startApolloServer() {
  const server = new ApolloServer({
    schema,
    context: async ({ req, res }) => {
      let accessToken = null;
      let currentUser = null;
      try {
        accessToken = req.headers.authorization;
        if (accessToken) {
          currentUser = await getCurrentUser(accessToken);
        }
      } catch (err) {
        console.error(`Unable to authenticate user with token:${err}`);
      }
      return { currentUser, req, res };
    },
    introspection: true,
    playground: true,
  });
  await server.start();
  server.applyMiddleware({
    app,

    // By default, apollo-server hosts its GraphQL endpoint at the
    // server root. However, *other* Apollo Server packages host it at
    // /graphql. Optionally provide this to match apollo-server.
    path: "/graphql",
  });
  // // global error handler
  app.use(errorHandler);

  process.on("uncaughtException", function (err) {
    logger.error({
      message: `uncaughtException: ${err.message}`,
      time: new Date()
    });
  });
  process.on("unhandledRejection", function (reason) {
    logger.error({
      message: `unhandledRejection: ${reason.message}`,
      time: new Date()
    });
  });

  app.use(express.static(path.join(__dirname, '../../client')));
  app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../../client', 'index.html'))
  });

  await new Promise((resolve) => app.listen({ port: 8080 }, resolve));
  console.log(`Server running at http://localhost:8080${server.graphqlPath}`);
}
startApolloServer();

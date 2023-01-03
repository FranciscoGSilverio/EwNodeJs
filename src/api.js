const Hapi = require("@hapi/hapi");
const Context = require("./db/strategies/base/contextStrategy");
const MongoDb = require("./db/strategies/mongodb/mongo");
const HeroSchema = require("./db/strategies/mongodb/schemas/heroesSchema");
const HeroRoute = require("./routes/heroRoute");
const AuthRoute = require("./routes/authRoute");

const HapiSwagger = require("hapi-swagger");
const Vision = require("@hapi/vision");
const Inert = require("@hapi/inert");

const HapiJwt = require("hapi-auth-jwt2");

const JWT_SECRET = "SECRET_123";

const getServer = () => {
  if (process.env.NODE_ENV !== "test") {
    const app = new Hapi.Server({
      port: 5000,
    });

    return app;
  }

  const testApp = new Hapi.Server({});

  return testApp;
};

const mapRoutes = (instance, methods) => {
  return methods.map((method) => instance[method]());
};

async function main() {
  const app = getServer();
  const connection = MongoDb.connect();
  const context = new Context(new MongoDb(connection, HeroSchema));

  const swaggerOptions = {
    info: {
      title: "Heroes API",
      version: "v1.0",
    },
  };

  await app.register([
    HapiJwt,
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  app.auth.strategy("jwt", "jwt", {
    key: JWT_SECRET,

    validate: (data, request) => {
      return {
        isValid: true,
      };
    },
  });

  app.auth.default("jwt");

  app.route([
    ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
    ...mapRoutes(new AuthRoute(JWT_SECRET), AuthRoute.methods()),
  ]);

  await app.start();

  console.log("Server up and running");

  return app;
}

module.exports = main();

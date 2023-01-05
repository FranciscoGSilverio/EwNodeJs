const { config } = require("dotenv");
const { join } = require("path");
const { ok } = require("assert");

const env = process.env.NODE_ENV || "dev";

ok(
  env === "prod" || env === "dev" || env === "test",
  "Enrironment unsupported"
);

const configPath = join(__dirname, "../config", `.env.${env}`);

config({
  path: configPath,
});

console.log("this is your current environment", env);

const Hapi = require("@hapi/hapi");
const Context = require("./db/strategies/base/contextStrategy");
const MongoDb = require("./db/strategies/mongodb/mongo");
const HeroSchema = require("./db/strategies/mongodb/schemas/heroesSchema");
const HeroRoute = require("./routes/heroRoute");
const AuthRoute = require("./routes/authRoute");
const UtilsRoute = require("./routes/utilRoute");

const Postgres = require("./db/strategies/postgres/postgres");
const UserSchema = require("./db/strategies/postgres/schemas/userSchema");

const HapiSwagger = require("hapi-swagger");
const Vision = require("@hapi/vision");
const Inert = require("@hapi/inert");

const HapiJwt = require("hapi-auth-jwt2");

const JWT_SECRET = process.env.JWT_KEY;

const getServer = () => {
  if (process.env.NODE_ENV !== "test") {
    const app = new Hapi.Server({
      port: process.env.PORT,
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

  const postgresConnection = await Postgres.connect();
  const userSchema = await Postgres.defineModel(postgresConnection, UserSchema);
  const postgresContext = new Context(
    new Postgres(postgresConnection, userSchema)
  );

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

    validate: async (data, request) => {
      const [result] = await postgresContext.read({
        username: data.username.toLowerCase(),
      });

      if (!result) return { isValid: false };

      return {
        isValid: true,
      };
    },
  });

  app.auth.default("jwt");

  app.route([
    ...mapRoutes(new HeroRoute(context), HeroRoute.methods()),
    ...mapRoutes(
      new AuthRoute(JWT_SECRET, postgresContext),
      AuthRoute.methods()
    ),
    ...mapRoutes(new UtilsRoute(), UtilsRoute.methods()),
  ]);

  await app.start();

  console.log("Server up and running");

  console.log("environment variables:", process.env);
  return app;

}

module.exports = main();

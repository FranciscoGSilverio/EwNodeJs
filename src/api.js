const Hapi = require("@hapi/hapi");
const Context = require("./db/strategies/base/contextStrategy");
const MongoDb = require("./db/strategies/mongodb/mongo");
const HeroSchema = require("./db/strategies/mongodb/schemas/heroesSchema");
const HeroRoute = require("./routes/heroRoute");

const HapiSwagger = require("hapi-swagger");
const Vision = require("@hapi/vision");
const Inert = require("@hapi/inert");

const app = new Hapi.Server({
  port: 5000,
});

const mapRoutes = (instance, methods) => {
  return methods.map((method) => instance[method]());
};

async function main() {
  const connection = MongoDb.connect();
  const context = new Context(new MongoDb(connection, HeroSchema));

  const swaggerOptions = {
    info: {
      title: "Heroes API",
      version: "v1.0",
    },
  };

  await app.register([
    Vision,
    Inert,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  app.route(mapRoutes(new HeroRoute(context), HeroRoute.methods()));

  await app.start();

  console.log("Server up and running");

  return app;
}

module.exports = main();

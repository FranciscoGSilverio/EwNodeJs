const Hapi = require("hapi");
const Context = require("./db/strategies/base/contextStrategy");
const MongoDb = require("./db/strategies/mongodb/mongo");
const HeroSchema = require("./db/strategies/mongodb/schemas/heroesSchema");
const HeroRoute = require("./routes/heroRoute");

const app = new Hapi.Server({
  port: 5000,
});

const mapRoutes = (instance, methods) => {
  return methods.map((method) => instance[method]());
};

async function main() {
  const connection = MongoDb.connect();
  const context = new Context(new MongoDb(connection, HeroSchema));

  app.route([...mapRoutes(new HeroRoute(context), HeroRoute.methods())]);

  await app.start();

  console.log("Server up and running");

  return app;
}

module.exports = main();

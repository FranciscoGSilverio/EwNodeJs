const ContextStrategy = require("./base/contextStrategy");
const MongoDB = require("./mongo");
const Postgres = require("./postgres");

const contextMongo = new ContextStrategy(new MongoDB());
contextMongo.create();

const contextPostgres = new ContextStrategy(new Postgres());
contextPostgres.create();

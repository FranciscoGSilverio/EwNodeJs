const MongoDB = require("../db/strategies/mongodb/mongo");
const HeroSchema = require("../db/strategies/mongodb/schemas/heroesSchema");
const Context = require("../db/strategies/base/contextStrategy");

const MOCK_REGISTERED_HERO = {
  name: "Spider Man",
  power: "Spider sense",
};

const MOCK_UPDATED_HERO = {
  name: "Daffy Duck",
  power: "Stupidity",
};

let MOCK_HERO_ID = "";

let context = {};

describe("Mongo Db CRUD", () => {
  beforeAll(async () => {
    const connection = MongoDB.connect();
    context = new Context(new MongoDB(connection, HeroSchema));

    await context.create(MOCK_REGISTERED_HERO);
    const result = await context.create(MOCK_UPDATED_HERO);

    MOCK_HERO_ID = result._id;
  });

  it("should connect to the database", async () => {
    const expected = "Connected";

    const result = await context.isConnected();

    expect(result).toStrictEqual(expected);
  });

  it("should create one hero on the database", async () => {
    const expected = MOCK_REGISTERED_HERO;

    const { name, power } = await context.create(MOCK_REGISTERED_HERO);

    expect({ name, power }).toStrictEqual(expected);
  });

  it("should read one hero on the database", async () => {
    const expected = MOCK_REGISTERED_HERO;

    const [{ name, power }] = await context.read(MOCK_REGISTERED_HERO);

    result = { name, power };

    expect({ name, power }).toStrictEqual(expected);
  });

  it("should update on hero on the database", async () => {
    const expected = 1;
    const itemModified = {
      ...MOCK_UPDATED_HERO,
      name: "Bugs Bunny",
    };

    const result = await context.update(MOCK_HERO_ID, {
      name: "Bugs Bunny",
    });

    const [{ name, power }] = await context.read({ name: "Bugs Bunny" });

    expect(result.modifiedCount).toStrictEqual(expected);
    expect({ name, power }).toStrictEqual(itemModified);
  });

  it("should delete one hero on the database", async () => {
    const expected = 1;
    const result = await context.delete(MOCK_HERO_ID);

    expect(result.deletedCount).toStrictEqual(expected);
  });
});

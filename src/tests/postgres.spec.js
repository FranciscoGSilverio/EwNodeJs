const Postgres = require("../db/strategies/postgres");
const Context = require("../db/strategies/base/contextStrategy");

const context = new Context(new Postgres());
const MOCK_REGISTER_HERO = {
  name: "Black Adam",
  power: "Super strength",
};

const MOCK_UPDATED_HERO = {
  name: "Black Widowed",
  power: "Inteligence",
};

describe("Postgres database implementation", () => {
  beforeAll(async () => {
    await context.connect();
    await context.delete();
    await context.create(MOCK_UPDATED_HERO);
  });

  it("should connect to the database", async () => {
    const expected = true;

    const result = await context.isConnected();

    expect(result).toStrictEqual(expected);
  });

  it("should create a hero in the database", async () => {
    const expected = MOCK_REGISTER_HERO;

    const { dataValues } = await context.create(MOCK_REGISTER_HERO);

    delete dataValues.id;

    expect(dataValues).toStrictEqual(expected);
  });

  it("should list all the heroes on the database", async () => {
    const expected = MOCK_REGISTER_HERO;

    const [result] = await context.read(MOCK_REGISTER_HERO);

    delete result.id;

    expect(result).toStrictEqual(expected);
  });

  it("should update one hero on the database", async () => {
    const expected = "stealth";
    const [itemToUpdate] = await context.read(MOCK_UPDATED_HERO);

    const newItem = {
      ...MOCK_UPDATED_HERO,
      power: "stealth",
    };

    const [updateStatus] = await context.update(itemToUpdate.id, newItem);

    const [result] = await context.read(newItem);

    expect(updateStatus).toStrictEqual(1);
    expect(result.power).toStrictEqual(expected);
  });

  it("should delete one hero on the database", async () => {
    const expected = 1;

    const [item] = await context.read({});
    const result = await context.delete(item.id);

    expect(result).toStrictEqual(expected);
  });
});

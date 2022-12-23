const Postgres = require("../db/strategies/postgres");
const Context = require("../db/strategies/base/contextStrategy");

const context = new Context(new Postgres());

describe("Postgres database implementation", () => {
  it("should connect to the database", async () => {
    const expected = true;

    const result = await context.isConnected();

    expect(result).toStrictEqual(expected);
  });
});

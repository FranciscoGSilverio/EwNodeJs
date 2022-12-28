const api = require("./../api");

let app = {};

describe("Api http server", function () {
  this.beforeAll(async () => {
    app = await api;
  });

  it("should return the list of heroes from the get endpoint", async () => {
    const expectedStatusCode = 200;

    const result = await app.inject({
      method: "GET",
      url: "/heroes",
    });

    const data = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    console.log(data);

    expect(data).toBeInstanceOf(Array);
    expect(statusCode).toStrictEqual(expectedStatusCode);
  }, 30000);
});

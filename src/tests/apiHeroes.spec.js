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

    expect(data).toBeInstanceOf(Array);
    expect(statusCode).toStrictEqual(expectedStatusCode);
  }, 30000);

  it("should return registers with pagination from the get endpoint", async () => {
    const PAGINATION_VALUES = {
      limit: 2,
      skip: 0,
    };

    const result = await app.inject({
      method: "GET",
      url: `/heroes?skip=${PAGINATION_VALUES.skip}&limit=${PAGINATION_VALUES.limit}`,
    });

    const data = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    expect(data.length).toStrictEqual(2);
    expect(statusCode).toStrictEqual(200);
  });

  it("should return errror for invalid pagination", async () => {
    const INVALID_PAGINATION_VALUES = {
      limit: "aaa",
      skip: "a",
    };

    const result = await app.inject({
      method: "GET",
      url: `/heroes?skip=${INVALID_PAGINATION_VALUES.skip}&limit=${INVALID_PAGINATION_VALUES.limit}`,
    });

    const errorResult = "{\"statusCode\":400,\"error\":\"Bad Request\",\"message\":\"\\\"skip\\\" must be a number\",\"validation\":{\"source\":\"query\",\"keys\":[\"skip\"]}}"
    expect(result.payload).toStrictEqual(errorResult);
    expect(result.statusCode).toStrictEqual(400);
  });
});

const api = require("./../api");

let app = {};

const MOCK_REGISTER_HERO = {
  name: "Mario",
  power: "plumber",
};

const MOCK_DEFAULT_ADDED_HERO = {
  name: "Crash Bandicoot",
  power: "insanity",
};

let MOCK_ID = "";

describe("Api http server", function () {
  this.beforeAll(async () => {
    app = await api;

    const result = await app.inject({
      method: "POST",
      url: "/heroes",
      payload: JSON.stringify(MOCK_DEFAULT_ADDED_HERO),
    });

    const data = JSON.parse(result.payload);

    MOCK_ID = data._id;
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

    const errorResult =
      '{"statusCode":400,"error":"Bad Request","message":"\\"skip\\" must be a number","validation":{"source":"query","keys":["skip"]}}';
    expect(result.payload).toStrictEqual(errorResult);
    expect(result.statusCode).toStrictEqual(400);
  });
  it("should register one hero in the database", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/heroes",
      payload: MOCK_REGISTER_HERO,
    });
    const { _id, message } = JSON.parse(result.payload);
    const statusCode = result.statusCode;

    expect(statusCode).toEqual(200);
    expect(_id).toBeTruthy();
    expect(message).toStrictEqual("Hero registered successfully");
  });
  it("should patch one existing hero in the database", async () => {
    const _id = MOCK_ID;

    const changes = {
      power: "spin",
    };

    const result = await app.inject({
      method: "PATCH",
      url: `/heroes/${_id}`,
      payload: JSON.stringify(changes),
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    expect(statusCode).toEqual(200);
    expect(data.message).toStrictEqual("Hero updated successfully");
  });
  it("should not update hero if given id is incorrect", async () => {
    const _id = "63b37ca61c103d1f020aa8dc01";

    const changes = {
      power: "spin",
    };

    const result = await app.inject({
      method: "PATCH",
      url: `/heroes/${_id}`,
      payload: JSON.stringify(changes),
    });

    const data = JSON.parse(result.payload);

    const expected = {
      statusCode: 500,
      error: "Internal Server Error",
      message: "An internal server error occurred",
    };

    expect(data).toStrictEqual(expected);
  });

  it("should delete one hero in the database", async () => {
    const _id = MOCK_ID;

    const result = await app.inject({
      method: "DELETE",
      url: `/heroes/${_id}`,
    });

    const statusCode = result.statusCode;

    const data = JSON.parse(result.payload);
    expect(statusCode).toEqual(statusCode);
    expect(data.message).toStrictEqual("Hero removed successfully");
  });
  it("should not delete the hero if given id is invalid", async () => {
    const _id = "63b37ca61c103d1f020aa8dc01";

    const result = await app.inject({
      method: "DELETE",
      url: `/heroes/${_id}`,
    });

    const data = JSON.parse(result.payload);
    const expected = {
      statusCode: 500,
      error: "Internal Server Error",
      message: "An internal server error occurred",
    };

    expect(data).toStrictEqual(expected);
  });
});

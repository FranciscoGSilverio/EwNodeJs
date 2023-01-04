const api = require("../api");
const Context = require("../db/strategies/base/contextStrategy");
const Postgres = require("./../db/strategies/postgres/postgres");
const Posgres = require("./../db/strategies/postgres/postgres");
const UserSchema = require("./../db/strategies/postgres/schemas/userSchema");

let app = {};

const MOCK_USER_LOGIN = {
  username: "francisco",
  password: "123",
};

const MOCK_INVALID_USER = {
  username: "francisco",
  password: "999",
};

const MOCK_USER_DB = {
  username: MOCK_USER_LOGIN.username.toLowerCase(),
  password: "$2b$04$DRTTdOQaDIUpjerffjOYsenSBF9Kmm985T7SgpY.3TRT6zOwJDESW",
};

const MOCK_USER_TO_REGISTER = {
  username: "Tiago",
  password: "1010",
};

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZyYW5jaXNjbyIsImlkIjoxLCJpYXQiOjE2NzI3NzI2MzR9.HMoA3Wsg48XY6klcEUrGuUviaaskHeL5CTh6UE8_1xU";

describe("authentication for the heroes api", () => {
  beforeAll(async () => {
    app = await api;

    const postgresConnection = await Postgres.connect();
    const model = await Postgres.defineModel(postgresConnection, UserSchema);
    const postgres = new Context(new Postgres(postgresConnection, model));

    await postgres.update(null, MOCK_USER_DB, true);
  });

  it("should return the access token", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: MOCK_USER_LOGIN,
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    expect(statusCode).toEqual(200);
    expect(data.token.length).toBeGreaterThan(10);
  });

  it("should return unauthorized for invalid user", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: MOCK_INVALID_USER,
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    expect(statusCode).toEqual(401);
    expect(data).toStrictEqual({
      error: "Unauthorized",
      message: "User or password is incorrect",
      statusCode: 401,
    });
  });

  it("should register one user", async () => {
    const result = await app.inject({
      method: "POST",
      url: "/signup",
      payload: MOCK_USER_TO_REGISTER,
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    // expect(statusCode).toEqual(200);
    expect(data).toStrictEqual({ message: "User registered successfully" });
  });
});

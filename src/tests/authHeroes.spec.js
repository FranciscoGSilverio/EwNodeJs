const api = require("../api");

let app = {};

const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZyYW5jaXNjbyIsImlkIjoxLCJpYXQiOjE2NzI3NzI2MzR9.HMoA3Wsg48XY6klcEUrGuUviaaskHeL5CTh6UE8_1xU";

describe("authentication for the heroes api", () => {
  beforeAll(async () => {
    app = await api;
  });

  it("should return the access token", async () => {
    const MOCK_USER_LOGIN = {
      username: "francisco",
      password: "123",
    };

    const result = await app.inject({
      method: "POST",
      url: "/login",
      payload: { ...MOCK_USER_LOGIN },
    });

    const statusCode = result.statusCode;
    const data = JSON.parse(result.payload);

    expect(statusCode).toEqual(200);
    expect(data.token.length).toBeGreaterThan(10);
  });
});

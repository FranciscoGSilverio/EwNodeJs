const PasswordHelper = require("../helpers/passwordHelper");

const PASSWORD = "123";
const HASH = "$2b$04$DRTTdOQaDIUpjerffjOYsenSBF9Kmm985T7SgpY.3TRT6zOwJDESW";

describe("Validate user password with hash", () => {
  it("should generete the hash for the user password", async () => {
    const result = await PasswordHelper.hashPassword(PASSWORD);

    console.log(result);

    expect(result.length).toBeGreaterThan(10);
  });

  it("should validate the hash", async () => {
    const result = await PasswordHelper.comparePassword(PASSWORD, HASH);

    expect(result).toEqual(true);
  });
});

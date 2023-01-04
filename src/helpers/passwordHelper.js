const Bcrypt = require("bcrypt");
const { promisify } = require("util");

const hashAsync = promisify(Bcrypt.hash);
const compareHashAsync = promisify(Bcrypt.compare);
const SALT = 3;

class PasswordHelper {
  static hashPassword(pass) {
    return hashAsync(pass, SALT);
  }

  static comparePassword(pass, hash) {
    return compareHashAsync(pass, hash);
  }
}

module.exports = PasswordHelper;

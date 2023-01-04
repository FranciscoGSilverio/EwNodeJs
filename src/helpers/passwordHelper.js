const Bcrypt = require("bcrypt");
const { promisify } = require("util");

const hashAsync = promisify(Bcrypt.hash);
const compareHashAsync = promisify(Bcrypt.compare);
const SALT = +process.env.SALT;

console.log("the salt variable", process.env.SALT);

class PasswordHelper {
  static hashPassword(pass) {
    return hashAsync(pass, SALT);
  }

  static comparePassword(pass, hash) {
    return compareHashAsync(pass, hash);
  }
}

module.exports = PasswordHelper;

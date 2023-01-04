const BaseRoute = require("./base/baseRoute");
const Joi = require("joi");
const Boom = require("boom");
const Jwt = require("jsonwebtoken");
const PasswordHelper = require("../helpers/passwordHelper");

const failAction = (request, headers, error) => {
  throw error;
};

const MOCK_USER = {
  username: "francisco",
  password: "123",
};

class AuthRoutes extends BaseRoute {
  constructor(secret, db) {
    super();
    this.secret = secret;
    this.db = db;
  }

  login() {
    return {
      path: "/login",
      method: "POST",
      config: {
        auth: false,
        tags: ["api"],
        description: "Get access token",
        notes: "Login with user and password from database",
        validate: {
          failAction,
          payload: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
          }),
        },
      },
      handler: async (request) => {
        const { username, password } = request.payload;

        const [user] = await this.db.read({
          username: username.toLowerCase(),
        });

        if (!user) return Boom.unauthorized("User not found!");

        // if (
        //   username.toLowerCase() !== MOCK_USER.username ||
        //   password.toLowerCase() !== MOCK_USER.password
        // ) {
        //   return Boom.unauthorized();
        // }

        const match = await PasswordHelper.comparePassword(
          password,
          user.password
        );

        if (!match) return Boom.unauthorized("User or password is incorrect");

        const token = Jwt.sign(
          {
            username: username,
            id: user.id,
          },
          this.secret
        );

        return {
          token,
        };
      },
    };
  }
  register() {
    return {
      path: "/signup",
      method: "POST",
      config: {
        auth: false,
        tags: ["api"],
        description: "Register user",
        notes: "Sign up to use the api",
        validate: {
          failAction,
          payload: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
          }),
        },
      },
      handler: async (request) => {
        const { username, password } = request.payload;

        const [user] = await this.db.read({
          username: username.toLowerCase(),
        });

        if (!user) {
          const NEW_USER = {
            username: username.toLowerCase(),
            password: await PasswordHelper.hashPassword(password),
          };

          await this.db.create(NEW_USER);

          return { message: "User registered successfully" };
        }

        return Boom.preconditionFailed("User already signedIn");
      },
    };
  }
}

module.exports = AuthRoutes;

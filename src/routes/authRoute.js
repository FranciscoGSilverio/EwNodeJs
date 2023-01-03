const BaseRoute = require("./base/baseRoute");
const Joi = require("joi");
const Boom = require("boom");
const Jwt = require("jsonwebtoken");

const failAction = (request, headers, error) => {
  throw error;
};

const MOCK_USER = {
  username: "francisco",
  password: "123",
};

class AuthRoutes extends BaseRoute {
  constructor(secret) {
    super();
    this.secret = secret;
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
      handler: (request) => {
        const { username, password } = request.payload;

        if (
          username.toLowerCase() !== MOCK_USER.username ||
          password.toLowerCase() !== MOCK_USER.password
        ) {
          return Boom.unauthorized();
        }

        const token = Jwt.sign(
          {
            username: username,
            id: 1,
          },
          this.secret
        );

        return {
          token,
        };
      },
    };
  }
}

module.exports = AuthRoutes;

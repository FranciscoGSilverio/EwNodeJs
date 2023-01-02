const BaseRoute = require("./base/baseRoute");
const Joi = require("joi");

class HeroRoute extends BaseRoute {
  constructor(db) {
    super();
    this._db = db;
  }

  list() {
    return {
      path: "/heroes",
      method: "GET",
      config: {
        validate: {
          failAction: (request, headers, error) => {
            throw error;
          },
          query: Joi.object({
            skip: Joi.number().integer().default(0),
            limit: Joi.number().integer().default(10),
          }),
        },
      },

      handler: (request, headers) => {
        try {
          const { skip, limit, name } = request.query;

          const query = {
            name: {
              $regex: `.*${name}*.`,
            },
          };

          return this._db.read(name ? query : {}, skip, limit);
        } catch (error) {
          console.log(error);
          return "Internal server error!!!";
        }
      },
    };
  }
}

module.exports = HeroRoute;

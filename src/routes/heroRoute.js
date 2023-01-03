const BaseRoute = require("./base/baseRoute");
const Joi = require("joi");
const Boom = require("boom");
const failAction = (request, headers, error) => {
  throw error;
};

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
        tags: ["api"],
        description: "Should return a list of all the heroes",
        notes: "Can paginate and filter by name",
        validate: {
          failAction,
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
          return Boom.internal();
        }
      },
    };
  }

  create() {
    return {
      path: "/heroes",
      method: "POST",
      config: {
        tags: ["api"],
        description: "Should register one hero",
        notes: "Should register one hero by name and power",
        validate: {
          failAction,
          payload: Joi.object({
            name: Joi.string().required().min(1).max(100),
            power: Joi.string().required().min(1).max(100),
          }),
        },
      },
      handler: async (request) => {
        try {
          const { name, power } = request.payload;

          const result = await this._db.create({ name, power });

          return {
            message: "Hero registered successfully",
            _id: result._id,
          };
        } catch (error) {
          console.log("Error", error);
          return Boom.internal();
        }
      },
    };
  }

  update() {
    return {
      path: "/heroes/{id}",
      method: "PATCH",
      config: {
        tags: ["api"],
        description: "Should update one hero",
        notes: "Should select one hero by id and update it's data",
        validate: {
          failAction,
          params: Joi.object({
            id: Joi.string().required(),
          }),
          payload: Joi.object({
            name: Joi.string().min(1).max(100),
            power: Joi.string().min(1).max(100),
          }),
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          const { payload } = request;

          const stringData = JSON.stringify(payload);
          const data = JSON.parse(stringData);

          const result = await this._db.update(id, data);

          if (result.modifiedCount !== 1)
            return Boom.preconditionFailed("Id not found in the database");

          return {
            message: "Hero updated successfully",
          };
        } catch (error) {
          console.log("Error", error);
          return Boom.internal();
        }
      },
    };
  }

  delete() {
    return {
      path: "/heroes/{id}",
      method: "DELETE",
      config: {
        tags: ["api"],
        description: "Should delete one hero",
        notes: "Should delete one hero id given id is found in the database",
        validate: {
          failAction,
          params: Joi.object({
            id: Joi.string().required(),
          }),
        },
      },
      handler: async (request) => {
        try {
          const { id } = request.params;
          const result = await this._db.delete(id);

          if (result.deletedCount !== 1)
            return Boom.preconditionFailed("Id not found in the database");

          return {
            message: "Hero removed successfully",
          };
        } catch (error) {
          console.log("error", error);
          Boom.internal();
        }
      },
    };
  }
}

module.exports = HeroRoute;

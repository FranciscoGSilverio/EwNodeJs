const BaseRoute = require("./base/baseRoute");

class HeroRoute extends BaseRoute {
  constructor(db) {
    super();
    this._db = db;
  }

  list() {
    return {
      path: "/heroes",
      method: "GET",
      handler: (request, headers) => {
        return this._db.read();
      },
    };
  }
}

module.exports = HeroRoute;

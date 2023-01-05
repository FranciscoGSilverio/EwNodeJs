const BaseRoute = require("./base/baseRoute");
const { join } = require("path");

class UtilsRoute extends BaseRoute {
  coverage() {
    return {
      path: "/coverage/{param*}",
      method: "GET",
      config: {
        auth: false,
      },
      handler: {
        directory: {
          path: join(__dirname, "../../coverage/lcov-report"),
          redirectToSlash: true,
          index: true,
        },
      },
    };
  }
}

module.exports = UtilsRoute;

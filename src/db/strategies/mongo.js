const ICrud = require("./interfaces/interfaceCrud");

class MongoDB extends ICrud {
  constructor() {
    super();
  }

  create(item) {
    console.log("saved to the Mongo db");
  }
}

module.exports = MongoDB;

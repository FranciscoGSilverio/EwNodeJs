const ICrud = require("../interfaces/interfaceCrud");
const Mongoose = require("mongoose");
const STATUS = {
  0: "Disconnected",
  1: "Connected",
  2: "Connecting",
  3: "Disconnecting",
};

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();
    this._schema = schema;
    this._connection = connection;
  }

  async isConnected() {
    const state = STATUS[this._connection.readyState];
    if (state === "Connected") return STATUS[1];

    if (state === "Connecting")
      await new Promise((resolve) => setTimeout(resolve, 1000));

    return STATUS[this._connection.readyState];
  }

  static connect() {
    Mongoose.connect(
      // process.env.MONGO_DB_URL,
      process.env.MONGO_DB_URL,
      { useNewUrlParser: true },
      (error) => {
        if (!error) return;
        console.log("Connection failed", error);
      }
    );

    const connection = Mongoose.connection;

    connection.once("open", () => console.log("database connection on"));

    return connection;
  }

  defineModel() {}

  async create(item) {
    return this._schema.create(item);
  }

  async read(item, skip = 0, limit = 10) {
    return this._schema.find(item).skip(skip).limit(limit);
  }

  update(id, item) {
    return this._schema.updateOne({ _id: id }, { $set: item });
  }

  delete(id) {
    return this._schema.deleteOne({ _id: id });
  }
}

module.exports = MongoDB;

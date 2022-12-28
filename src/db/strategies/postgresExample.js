const Sequelize = require("sequelize");

async function main() {
  const Heroes = driver.define(
    "heroes",
    {
      id: {
        type: Sequelize.INTEGER,
        required: true,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        required: true,
      },
      power: {
        type: Sequelize.STRING,
        required: true,
      },
    },
    {
      tableName: "TB_HEROES",
      freezeTableName: false,
      timestamps: false,
    }
  );

  await Heroes.sync();

  const result = await Heroes.findAll({ raw: true });

  console.log(result)
}

main();
import { Sequelize } from "sequelize";
import getUserModel from "./user";
import getProductModel from "./product";

const sequelize = new Sequelize(
    typeof process.env.DB_URI === "string" ? process.env.DB_URI : "",
    {
        dialect: "postgres",
        dialectOptions: {
            native: true,
            ssl: true,
        },
    }
);

const User = getUserModel(sequelize);
const Product = getProductModel(sequelize);

// associations
User.belongsToMany(Product, {
    through: "user_product_mapping",
    foreignKey: "user_id",
    as: "users",
});
Product.belongsToMany(User, {
    through: "user_product_mapping",
    foreignKey: "product_id",
    as: "products",
});

const models = {
    User,
    Product,
};

export default {
    models,
    sequelize,
};

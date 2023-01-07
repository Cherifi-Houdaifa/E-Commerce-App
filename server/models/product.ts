// user model
import { Sequelize, DataTypes, Model } from "sequelize";

export default function getProductModel(sequelize: Sequelize) {
    const Product = sequelize.define<ProductInterface>("product", {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true,
                notEmpty: true,
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        picture: {
            type: DataTypes.BLOB("long"),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        availability: {
            type: DataTypes.ENUM("Available", "Unavailable"),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        category: {
            type: DataTypes.ENUM("Tech", "Food", "Fashion", "Fitness", "Other"),
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });

    return Product;
}
export interface ProductInterface extends Model {
    name: String;
    price: number;
    description: string;
    picture: Buffer;
    availability: "Available" | "Unavailable";
    category: "Tech" | "Food" | "Fashion" | "Fitness" | "Other";
}

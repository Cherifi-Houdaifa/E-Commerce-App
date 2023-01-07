// user model
import { Sequelize, DataTypes, Model } from "sequelize";
import { ProductInterface } from "./product";

export default function getUserModel(sequelize: Sequelize) {
    const User = sequelize.define<UserInterface>("user", {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        googleid: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
            validate: {
                isNumeric: true,
            },
        },
        password: { type: DataTypes.STRING, allowNull: true },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
    });

    return User;
}
interface UserInterface extends Model {
    email: string;
    username: string;
    password?: string;
    googleid?: string;
    isAdmin: boolean;
    products?: Array<ProductInterface>;
    getProducts: Function;
    setProducts: Function;
    addProduct: Function;
}

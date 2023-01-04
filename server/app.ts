import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;

import db from "./models/index";

import indexRouter from "./routes/index";
import authRouter from "./routes/auth";

const app = express();

// passport configuration
import "./helpers/auth";

// security configurations
// use this to not let people know that the backend is made with express (adds a bit of security)
app.disable("x-powered-by");
// cors is used for allowing which websites can make requests to the api
app.use(
    cors({
        // ALLOWED_ORIGINS env variable have multiple URLs seperated by a '&'
        origin: process.env.ALLOWED_ORIGINS?.split("&"),
        // this is for allowing credentials to be passed with requests like cookies
        credentials: true,
    })
);

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routers
app.use("/", indexRouter);
app.use("/auth", authRouter);

// Error handler
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    // you can also log the err argument for debbuging
    return res.status(500).json({ message: "An error occurred" });
});

// sync database and start server
// if you added a model or made changes add a {force: true} to make database recreate itself
db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});

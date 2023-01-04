import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;

import db from "./models/index";

import indexRouter from "./routes/index";
import authRouter from "./routes/auth";

const app = express();

// passport configuration
import "./helpers/auth";

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routers
app.use("/", indexRouter);
app.use("/auth", authRouter);

// Error handler
app.use(function (err: Error, req: Request, res: Response, next: NextFunction) {
    return res.status(500).json({ message: "An error occurred" });
});

// sync database and start server
db.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});

import express from "express";
const router = express.Router();

router.get("/", function (req, res) {
	res.send("hi")
});

export default router;
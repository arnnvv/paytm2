import express from "express";

const router = express.Router();

router.use("/users");
router.use("/account");

export default router;

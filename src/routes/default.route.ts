import express from "express";
import apiRouter from "./apiRouter";
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../../swagger.json");

router.get("/", async (_req, res) => {
  res.render("index");
});
router.use("/api", apiRouter);
router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));
export default router;

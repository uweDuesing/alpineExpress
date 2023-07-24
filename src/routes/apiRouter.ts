import express from "express";
import { ApiController } from "../controllers/api.controller";
import { body, validationResult } from "express-validator";

const apiRouter = express.Router();

apiRouter.get("/hello/world", async (_req, res) => {
  const controller = new ApiController();
  controller.helloWorld(_req).then(
    (response) => {
      res.setHeader("Content-Type", "application/json");
      res.end(response);
    },
    (error) => {
      res.render("uv/indicator_error");
    },
  );
});
apiRouter.post(
  "/hello/user",
  body("user").isEmail(),

  async (_req, res) => {
    const controller = new ApiController();
    const errors = validationResult(_req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    controller.helloWorld(_req, _req).then(
      (response) => {
        res.setHeader("Content-Type", "application/json");
        res.end(response);
      },
      (error) => {
        res.render("uv/indicator_error");
      },
    );
  },
);
export default apiRouter;

import express from "express";
import dotenv from "dotenv";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";

dotenv.config();
const port = process.env.PORT;

const app = express();

app.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}`);

  connect();

  routes(app);
});

import express from "express";
import dotenv from "dotenv";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import deserializeUser from "./middleware/deserializeUser";

dotenv.config();
const port = process.env.PORT;

const app = express();

// middleware
app.use(deserializeUser);
app.use(express.json());
app.use((req, res, next) => {
  logger.info({ req: req.method + " " + req.path }, "Request");
  next();
});

app.listen(port, () => {
  logger.info(`Listening at http://localhost:${port}`);

  connect();

  routes(app);
});

import pino from "pino";
import { colorizerFactory } from "pino-pretty";

const logger = pino({
  base: {
    pid: false,
  },
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorizerFactory: true,
    },
  },
});

export default logger;

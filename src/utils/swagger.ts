import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../../package.json";
import { Express, Request, Response } from "express";
import logger from "./logger";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    servers: [
      {
        url: "http://localhost:8080/",
      },
    ],
    info: {
      title: "Social REST API Docs",
      version,
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes.ts", "./src/schema/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app: Express, port: number) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  logger.info(`Docs available at http://localhost:${port}/docs`);
}

export default swaggerDocs;

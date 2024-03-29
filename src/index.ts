import express, { Request, Response, NextFunction } from "express";
//@ts-ignore
import Layer from "express/lib/router/layer";
import { PrismaClient } from "@prisma/client";
import endpoints from "./lib/endpoints";
import { db } from "./lib/db";
import APIFeatures from "./lib/ApiFeatures";
import { swagger } from "./lib/swagger";

// Define types for endpoint configuration
interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  route: string;
  model: string;
  operation?: "all" | "one" | "search";
}

interface Options {
  searchableModels?: string[];
  withoutBodyParser?: string[];
}

class Endrun {
  private app: express.Application;
  private router: express.Router;
  private db: PrismaClient;
  private config: Options;

  constructor(
    customRoutes?: (router: express.Router, db: PrismaClient) => void,
    config?: Options
  ) {
    this.app = express();
    this.router = express.Router();
    this.db = db;
    this.config = config || {};
    // Add custom routes
    if (customRoutes) customRoutes(this.router, this.db); //TODO add dynamic e.json();
  }

  private setupEndpoints(endpoints: Endpoint[]) {
    endpoints.forEach((endpoint) => {
      const method = endpoint.method.toLowerCase() as
        | "get"
        | "post"
        | "put"
        | "delete";
      this.router[method](
        endpoint.route,
        express.json(),
        this.handleRequest(endpoint)
      );
    });
  }

  private handleRequest(endpoint: Endpoint) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        let result;
        if (req.method === "GET") {
          switch (endpoint.operation) {
            case "all":
              //@ts-ignore
              result = await db[endpoint.model.toLowerCase()].findMany();
              return res.json(result);
            case "one":
              //@ts-ignore
              result = await db[endpoint.model.toLowerCase()].findMany({
                where: {
                  id: req.params.id,
                },
              });
              return res.json(result);
            case "search":
              if (
                !this.config.searchableModels ||
                //@ts-ignore
                this.config.searchableModels.includes(endpoint.model)
              ) {
                const apiFeatures = await new APIFeatures(
                  //@ts-ignore
                  db[endpoint.model.toLowerCase()],
                  prisma,
                  req.query
                ).filter();

                result = await apiFeatures.query;

                return res.json(result);
              }
          }
        } else if (req.method === "POST") {
          //@ts-ignore
          result = await db[endpoint.model.toLowerCase()].create({
            data: await req.body,
          });
          return res.json(result);
        } else if (req.method === "PUT") {
          //@ts-ignore
          result = await db[endpoint.model.toLowerCase()].upsert({
            create: await req.body,
            update: await req.body,
            where: {
              id: req.params.id,
            },
          });
          return res.json(result);
        } else if (req.method === "DELETE") {
          //@ts-ignore
          result = await db[endpoint.model.toLowerCase()].delete({
            where: {
              id: req.params.id,
            },
          });
          return res.send("Deleted");
        }
        return res.send("Endpoint notfound!");
      } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    };
  }

  public startServer(port: number | string) {
    // Add the bodyParser middleware to all routes.
    this.router.stack.forEach((layer) => {
      if (layer.route) {
        const jsonLayer = new Layer("/", {}, express.json());
        layer.route.stack.unshift(jsonLayer);
      }
    });
    
    //Remove bodyParser from the specified routes provided in the configuration.
    this.config.withoutBodyParser &&
      this.config.withoutBodyParser.forEach((path) => {
        this.router.stack.forEach((layer) => {
          if (layer.route && layer.route.path === path) {
            layer.route.stack = layer.route.stack.filter(
              (item: any) => item.name !== "jsonParser"
            );
          }
        });
      });

    // Setup swagger docs
    this.app.use("/swagger", swagger);

    // Setup routes
    this.setupEndpoints(endpoints);

    console.log(this.router.stack[0].route.stack);

    // Use the router for all API routes
    this.app.use("/api", this.router);

    // Setup notfound route
    this.app.use("*", (req, res) => {
      return res.send("Notfound! 404");
    });

    // Start the server
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

export { Endrun };

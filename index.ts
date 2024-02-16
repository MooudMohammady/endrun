import express, { Request, Response, NextFunction, Router } from "express";
import { PrismaClient } from "@prisma/client";
import endpoints from "./src/lib/endpoints";
import { db } from "./src/lib/db";
import APIFeatures from "./src/lib/ApiFeatures";
import { swagger } from "./src/lib/swagger";

// Define types for endpoint configuration
interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  route: string;
  operation?: "all" | "one" | "search";
}

class Endrun {
  private app: express.Application;
  private router: express.Router;
  private prisma: PrismaClient;

  constructor() {
    this.app = express();
    this.router = express.Router();
    this.prisma = new PrismaClient();
  }

  private setupEndpoints(endpoints: Endpoint[]) {
    endpoints.forEach((endpoint) => {
      const method = endpoint.method.toLowerCase() as
        | "get"
        | "post"
        | "put"
        | "delete";
      this.router[method](endpoint.route, this.handleRequest(endpoint));
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
              const apiFeatures = await new APIFeatures(
                //@ts-ignore
                db[endpoint.model.toLowerCase()],
                prisma,
                req.query
              ).filter();

              result = await apiFeatures.query;

              return res.json(result);
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
        }
        return res.send("Endpoint is working!");
      } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    };
  }

  public startServer(port: number | string) {
    // Middelwares
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json());

    // Setup swagger docs
    this.app.use("/swagger", swagger);

    // Setup routes
    this.setupEndpoints(endpoints);

    // Use the router for all API routes
    this.app.use("/api", this.router);

    // Start the server
    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}

export default Endrun;

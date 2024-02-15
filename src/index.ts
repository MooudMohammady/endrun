import config from "../endrun.config";
import { db } from "./lib/db";
import APIFeatures from "./lib/ApiFeatures";
import express, { Express } from "express";
import { swagger } from "./lib/swagger";
import { DefaultArgs, PrismaClientOptions } from "@prisma/client/runtime/library";
import { PrismaClient, Product } from "@prisma/client";

const app: Express = express();
const router = express.Router();

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use("/swagger",swagger);


config.endpoints.forEach((endpoint) => {  
  const method = endpoint.method.toLowerCase() as
    | "get"
    | "post"
    | "put"
    | "delete";
  router[method](endpoint.route, async (req,res) => {
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
              id: req.param("id"),
            },
          });
          return res.json(result);
        case "search":
          //@ts-ignore
          const apiFeatures = (await new APIFeatures(
            //@ts-ignore
            db[endpoint.model.toLowerCase()],
            prisma,
            req.query
          )
            .filter())

          result = await apiFeatures.query;

          return res.json(result);
      }
    } else if (req.method === "POST") {
      //@ts-ignore
      result = await db[endpoint.model.toLowerCase()].create({
        data: await res.json(),
      });
      return res.json(result);
    } else if (req.method === "PUT") {
      //@ts-ignore
      result = await db[endpoint.model.toLowerCase()].upsert({
        create: await res.json(),
        update: await res.json(),
        where: {
          id: req.param("id"),
        },
      });
      return res.json(result);
    } else if (req.method === "DELETE") {
      //@ts-ignore
      result = await db[endpoint.model.toLowerCase()].delete({
        where: {
          id: req.param("id"),
        },
      });
    }
    return res.send("Endpoint is working!");
  });
});

app.use("/api",router)

app.get("*", (req,res) => {
  return res.send("404 not found!");
});

const port = 3030;
console.log(`Server is running on port ${port}`);

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}`);
});

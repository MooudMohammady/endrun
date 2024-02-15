import { serve } from "@hono/node-server";
import { Context, Hono } from "hono";
import config from "../endrun.config";
import { db } from "./lib/db";
import APIFeatures from "./lib/ApiFeatures";

const app = new Hono().basePath("/api");

config.endpoints.forEach((endpoint) => {
  const method = endpoint.method.toLowerCase() as
    | "get"
    | "post"
    | "put"
    | "delete";
  app[method](endpoint.route, async (c: Context) => {
    let result;

    if (c.req.method === "GET") {
      switch (endpoint.operation) {
        case "all":
          //@ts-ignore
          result = await db[endpoint.model.toLowerCase()].findMany();
          return c.json(result);
        case "one":
          //@ts-ignore
          result = await db[endpoint.model.toLowerCase()].findMany({
            where: {
              id: c.req.param("id"),
            },
          });
          return c.json(result);
        case "search":
          //@ts-ignore
          const apiFeatures = (await new APIFeatures(
            //@ts-ignore
            db[endpoint.model.toLowerCase()],
            //@ts-ignore
            prisma,
            c.req.queries()
          )
            .filter())

          result = await apiFeatures.query;

          return c.json(result);
      }
    } else if (c.req.method === "POST") {
      //@ts-ignore
      result = await db[endpoint.model.toLowerCase()].create({
        data: await c.req.json(),
      });
      return c.json(result);
    } else if (c.req.method === "PUT") {
      //@ts-ignore
      result = await db[endpoint.model.toLowerCase()].upsert({
        create: await c.req.json(),
        update: await c.req.json(),
        where: {
          id: c.req.param("id"),
        },
      });
      return c.json(result);
    } else if (c.req.method === "DELETE") {
      //@ts-ignore
      result = await db[endpoint.model.toLowerCase()].delete({
        where: {
          id: c.req.param("id"),
        },
      });
    }
    return c.text("Endpoint is working!");
  });
});

app.get("*", (c) => {
  return c.text("404 not found!");
});

const port = 3030;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

import { serve } from "@hono/node-server";
import { Context, Hono } from "hono";
import config, { Endpoint } from "../endrun.config";
import { db } from "./lib/db";

const app = new Hono();

config.endpoints.forEach((endpoint: Endpoint) => {
  //@ts-ignore
  app[endpoint.method.toLowerCase()](endpoint.route, async (c: Context) => {
    let result;
    if (c.req.method === "GET") {
      switch (endpoint.operation) {
        case "all":
          //@ts-ignore
          result = await db[endpoint.model.toLowerCase()].findMany();
          return c.json({
            result,
          });
        case "one":
          //@ts-ignore
          result = await db[endpoint.model.toLowerCase()].findMany({
            where: {
              id: c.req.param("id"),
            },
          });
          return c.json({
            result,
          });
      }
    } else if (c.req.method === "POST") {
    } else if (c.req.method === "PUT") {
    } else if (c.req.method === "DELETE") {
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

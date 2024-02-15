import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import config from "../../../endrun.config";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express Library API",
      termsOfService: "http://example.com/terms/",
      contact: {
        name: "API Support",
        url: "http://www.exmaple.com/support",
        email: "support@example.com",
      },
    },

    servers: [
      {
        url: "http://localhost:3030/api",
        description: "My API Documentation",
      },
    ],

    paths: {
      "/products": {
        get: {
          operationId: "getModel",
          summary: "Get Model",
          responses: {
            "200": {
              description: "200 response",
              content: {
                "application/json": {
                  examples: {
                    example_1: {
                      value: [
                        {
                          id: "clsn3at990001r48v66w07uw3",
                          title: "test2 product",
                          description: "test2 description product",
                          price: 150000,
                          createdAt: "2024-02-15T10:40:16.791Z",
                          updatedAt: "2024-02-15T10:40:16.791Z",
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          operationId: "postModel",
          summary: "Post Model",
          parameters: [
            {
              name: "title",
              required: true,
              description: "title",
              schema: {
                type: "string",
                example: "Laptop hp 2Ghz",
              },
            },
            {
              name: "description",
              required: true,
              description: "description",
              schema: {
                type: "string",
                example: "this is description",
              },
            },
            {
              name: "price",
              required: true,
              description: "price",
              schema: {
                type: "number",
                format: "number",
                example: "1600000",
              },
            },
          ],
          responses: {
            "200": {
              description: "200 response",
              content: {
                "application/json": {
                  examples: {
                    example_1: {
                      value: [
                        {
                          id: "clsn3at990001r48v66w07uw3",
                          title: "test2 product",
                          description: "test2 description product",
                          price: 150000,
                          createdAt: "2024-02-15T10:40:16.791Z",
                          updatedAt: "2024-02-15T10:40:16.791Z",
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["../Routes/*.ts"],
};

const router = express.Router();

const specs = swaggerJSDoc(options);

config.endpoints.forEach((endpoint) => {
  const operation = endpoint.operation || "";
  let description = "";
  if (operation === "all") {
    description = "Get all items";
  } else if (operation === "one") {
    description = "Get a single item";
  } else if (operation === "search") {
    description = "Search for items";
  } else {
    description = "No description available";
  }

  // Convert route with params to Swagger path format
  const pathKey = endpoint.route.replace(
    /:[a-zA-Z0-9_-]+/g,
    (match) => `{${match.slice(1)}}`
  );
  //@ts-ignore
  if (!specs.paths[pathKey]) {
    //@ts-ignore
    specs.paths[pathKey] = {};
  }
  //@ts-ignore
  specs.paths[pathKey][endpoint.method.toLowerCase()] = {
    description: description,
    parameters: [],
    responses: {
      200: {
        description: "Successful operation",
        content: {
          "application/json": {
            schema: {
              type: "object",
            },
          },
        },
      },
    },
  };

  // Add parameter for dynamic route params like ":id"
  const dynamicParams = pathKey.match(/{[a-zA-Z0-9_-]+}/g) || [];
  for (const param of dynamicParams) {
    const paramName = param.slice(1, -1); // Remove leading ":"
    //@ts-ignore
    specs.paths[pathKey][endpoint.method.toLowerCase()].parameters.push({
      name: paramName,
      in: "path",
      description: `Value for ${paramName}`,
      required: true,
      schema: {
        type: "string",
      },
    });
  }
});

router.use(serve, setup(specs));

export const swagger = router;

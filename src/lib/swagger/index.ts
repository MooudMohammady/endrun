import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import config from "../../../endrun.config";
import { db } from "../db";
import { Prisma, Product } from "@prisma/client";

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

    paths: {},
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
    requestBody: endpoint.method === "POST" && {
      content: {
        "application/json": {
          schema: {
            $ref: `#/components/schemas/${endpoint.model.toLowerCase()}`, // Reference to Prisma model
          },
        },
      },
    },
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

  // Add components for Prisma models
  //@ts-ignore
  specs.components = {
    schemas: {},
  };

  // Generate schemas for Prisma models
  for (const model of Object.keys(db)) {
    if (!model.startsWith("_") && !model.startsWith("$")) {
      //@ts-ignore
      specs.components.schemas[model] = {
        type: "object",
        properties: {}, // Properties for fields in the model
      };
      //@ts-ignore
      const fields = Prisma.dmmf.datamodel.models.find(
        (model) => model.name === endpoint.model
      ).fields;
      for (const field of fields) {
        if (
          field.name !== "id" &&
          field.name !== "createdAt" &&
          field.name !== "updatedAt"
        ) {
          //@ts-ignore
          specs.components.schemas[model].properties[field.name] = {
            type: field.type, // Set type based on Prisma field type
          };
        }
      }
    }
  }
});

router.use(serve, setup(specs));

export const swagger = router;

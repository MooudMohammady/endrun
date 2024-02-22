//@ts-ignore
import swaggerJSDoc from "swagger-jsdoc";
import express from "express";
import { serve, setup } from "swagger-ui-express";
import { Prisma } from "@prisma/client";
import endpoints from "../endpoints";
import { IswaggerJSDoc } from "../@types/swagger";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "0.0.2",
      description: "Endrun is a simple and powerful web API framework that dynamically generates endpoints and Swagger documentation based on database models using Prisma ORM.",
      termsOfService: "https://github.com/MooudMohammady/endrun.git",
      contact: {
        name: "API Support",
        url: "https://github.com/MooudMohammady/endrun.git",
        email: "mooudmohammadi@gmail.com",
      },
    },

    servers: [
      {
        url: "http://localhost:3030/api",
        description: "Simple demo API Documentation",
      },
    ],

    paths: {},
  },
  apis: ["../Routes/*.ts"],
};

const router = express.Router();

const specs = swaggerJSDoc(options) as IswaggerJSDoc;

// Add components for Prisma models
specs.components = {
  schemas: {},
};

endpoints.forEach((endpoint) => {
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

  if (!specs.paths[pathKey]) {
    specs.paths[pathKey] = {};
  }

  specs.paths[pathKey][endpoint.method.toLowerCase()] = {
    description: description,
    parameters: [],
    requestBody:
      (endpoint.method === "POST" ||
      endpoint.method === "PUT") && {
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

  const model = endpoint.model.toLowerCase();

  // Generate schemas for Prisma models
  if (!model.startsWith("_") && !model.startsWith("$")) {
    specs.components.schemas![model] = {
      type: "object",
      properties: {}, // Properties for fields in the model
    };

    //@ts-ignore
    let fields = Prisma.dmmf.datamodel.models.find(
      //@ts-ignore
      (model) => model.name === endpoint.model
    )!.fields;

    for (const field of fields) {
      if (
        field.name !== "id" &&
        field.name !== "createdAt" &&
        field.name !== "updatedAt"
      ) {
        let modelSchema = specs.components.schemas![model];

        modelSchema.properties[field.name] = { type: field.type.toLowerCase() };
      }
    }
  }
});

router.use(serve, setup(specs));

export const swagger = router;

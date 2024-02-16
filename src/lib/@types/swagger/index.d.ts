/* =================== USAGE ===================

    import * as express from 'express';
    import * as swaggerJSDoc  from 'swagger-jsdoc';

    const app = express();

    const options: swaggerJSDoc.OAS3Options = {
        definition: {
          openapi: '3.0.0',
          info: {
            title: 'Hello World',
            description: 'A sample API',
            version: '1.0.0'
          }
        },
        apis: [
          './example/routes*.js',
          './example/parameters.yaml'
        ]
      }
    };

    const spec = swaggerJSDoc(options);

    app.get('/api-docs.json', function(req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(spec);
    });

 =============================================== */

/**
 * Returns validated Swagger specification in JSON format.
 */
declare function swaggerJSDoc(options?: Options): IswaggerJSDoc;

type Options = {
  apis?: readonly string[] | undefined;
  definition?: SwaggerDefinition | undefined;
  swaggerDefinition?: SwaggerDefinition | undefined;
  [key: string]: any;
};

export declare interface IswaggerJSDoc {
  /**
   * Open API Specification (OAS) version 3.0 options
   */
  oAS3Options: {
    apis?: readonly string[] | undefined;
    definition?: OAS3Definition | undefined;
    swaggerDefinition?: OAS3Definition | undefined;
    [key: string]: any;
  };

  /**
   * For describing Open API Specification (OAS) version 3.0
   */
  oAS3Definition: {
    openapi: string;
    info: Information;
    servers?: readonly Server[] | undefined;
    paths?: Paths | undefined;
    components?: Components | undefined;
    security?: readonly SecurityRequirement[] | undefined;
    tags?: readonly Tag[] | undefined;
    externalDocs?: ExternalDocumentation | undefined;
    [key: string]: any;
  };

  information: {
    title: string;
    description?: string | undefined;
    termsOfService?: string | undefined;
    contact?: Contact | undefined;
    license?: License | undefined;
    version: string;
    [key: string]: any;
  };

  contact: {
    name?: string | undefined;
    url?: string | undefined;
    email?: string | undefined;
    [key: string]: any;
  };

  license: {
    name: string;
    url?: string | undefined;
    [key: string]: any;
  };

  server: {
    url: string;
    description?: string | undefined;
    variables?: { [key: string]: ServerVariable } | undefined;
    [key: string]: any;
  };

  serverVariable: {
    enum?: readonly string[] | undefined;
    default: string;
    description?: string | undefined;
    [key: string]: any;
  };

  paths: {
    [key: string]: PathItem;
  };

  pathItem: {
    $ref?: string | undefined;
    summary?: string | undefined;
    description?: string | undefined;
    get?: Operation | undefined;
    put?: Operation | undefined;
    post?: Operation | undefined;
    delete?: Operation | undefined;
    options?: Operation | undefined;
    head?: Operation | undefined;
    patch?: Operation | undefined;
    trace?: Operation | undefined;
    servers?: readonly Server[] | undefined;
    parameters?: Parameter | Reference | undefined;
    [key: string]: any;
  };

  operation: {
    tags?: string[] | undefined;
    summary?: string | undefined;
    description?: string | undefined;
    externalDocs?: ExternalDocumentation | undefined;
    operationId?: string | undefined;
    parameters?: ReadonlyArray<Parameter | Reference> | undefined;
    requestBody?: RequestBody | Reference | undefined;
    responses?: Responses | undefined;
    callbacks?: { [key: string]: Callback | Reference } | undefined;
    deprecated?: boolean | undefined;
    security?: readonly SecurityRequirement[] | undefined;
    servers?: readonly Server[] | undefined;
    [key: string]: any;
  };

  parameter: {
    name: string;
    in: string;
    description?: string | undefined;
    required?: boolean | undefined;
    deprecated?: boolean | undefined;
    allowEmptyValue?: boolean | undefined;
    style?: string | undefined;
    explode?: boolean | undefined;
    allowReserved?: boolean | undefined;
    schema?: Schema | Reference | undefined;
    example?: any;
    examples?: { [key: string]: Example | Reference } | undefined;
    [key: string]: any;
  };

  schema: {
    type?: string | undefined;
    format?: string | undefined;
    [key: string]: any;
  };

  reference: {
    $ref: string;
  };

  example: {
    summary?: string | undefined;
    description?: string | undefined;
    value?: any;
    externalValue?: string | undefined;
    [key: string]: any;
  };

  requestBody: {
    description?: string | undefined;
    content: { [key: string]: MediaType };
    required?: boolean | undefined;
    [key: string]: any;
  };

  responses: {
    default?: Response | Reference | undefined;
    [key: string]: any;
  };

  response: {
    description: string;
    headers?: { [key: string]: Header | Reference } | undefined;
    content?: { [key: string]: MediaType } | undefined;
    links?: { [key: string]: Link | Reference } | undefined;
    [key: string]: any;
  };

  header: {
    description?: string | undefined;
    required?: boolean | undefined;
    deprecated?: boolean | undefined;
    allowEmptyValue?: boolean | undefined;
    style?: string | undefined;
    explode?: boolean | undefined;
    allowReserved?: boolean | undefined;
    schema?: Schema | Reference | undefined;
    example?: any;
    examples?: { [key: string]: Example | Reference } | undefined;
    [key: string]: any;
  };

  mediaType: {
    schema?: Schema | Reference | undefined;
    example?: any;
    examples?: { [key: string]: Example | Reference } | undefined;
    encoding?: { [key: string]: Encoding } | undefined;
    [key: string]: any;
  };

  encoding: {
    contentType?: string | undefined;
    headers?: { [key: string]: Header | Reference } | undefined;
    style?: string | undefined;
    explode?: boolean | undefined;
    allowReserved?: boolean | undefined;
    [key: string]: any;
  };

  link: {
    operationRef?: string | undefined;
    operationId?: string | undefined;
    parameters?: { [key: string]: any } | undefined;
    requestBody?: { [key: string]: any } | undefined;
    description?: string | undefined;
    server?: Server | undefined;
    [key: string]: any;
  };

  callback: {
    [key: string]: PathItem;
  };

  securityRequirement: {
    [key: string]: readonly string[];
  };

  components: {
    schemas?: { [key: string]: Schema | Reference } | undefined;
    responses?: { [key: string]: Response | Reference } | undefined;
    parameters?: { [key: string]: Parameter | Reference } | undefined;
    examples?: { [key: string]: Example | Reference } | undefined;
    requestBodies?: { [key: string]: RequestBody | Reference } | undefined;
    headers?: { [key: string]: Header | Reference } | undefined;
    securitySchemes?: { [key: string]: SecurityScheme | Reference } | undefined;
    links?: { [key: string]: Link | Reference } | undefined;
    callbacks?: { [key: string]: Callback | Reference } | undefined;
    [key: string]: any;
  };

  securityScheme: {
    type: string;
    description?: string | undefined;
    name?: string | undefined;
    in?: string | undefined;
    scheme?: string | undefined;
    bearerFormat?: string | undefined;
    flows?: OAuthFlows | undefined;
    openIdConnectUrl?: string | undefined;
    [key: string]: any;
  };

  oAuthFlows: {
    implicit?: OAuthFlow | undefined;
    password?: OAuthFlow | undefined;
    clientCredentials?: OAuthFlow | undefined;
    authorizationCode?: OAuthFlow | undefined;
    [key: string]: any;
  };

  oAuthFlow: {
    authorizationUrl?: string | undefined;
    tokenUrl?: string | undefined;
    refreshUrl?: string | undefined;
    scopes: { [key: string]: string };
    [key: string]: any;
  };

  tag: {
    name: string;
    description?: string | undefined;
    externalDocs?: ExternalDocumentation | undefined;
    [key: string]: any;
  };

  externalDocumentation: {
    description?: string | undefined;
    url: string;
    [key: string]: any;
  };

  /**
   * Open API Specification (OAS) version 2.0 options (fka Swagger specification)
   */
  options: {
    apis?: readonly string[] | undefined;
    definition?: SwaggerDefinition | undefined;
    swaggerDefinition?: SwaggerDefinition | undefined;
    [key: string]: any;
  };

  /**
   * For describing Open API Specification (OAS) version 2.0 (fka Swagger specification)
   */
  swaggerDefinition: {
    swagger?: string | undefined;
    info: Information;
    host?: string | undefined;
    basePath?: string | undefined;
    schemes?: readonly string[] | undefined;
    consumes?: readonly string[] | undefined;
    produces?: readonly string[] | undefined;
    tags?: readonly Tag[] | undefined;
    externalDocs?: ExternalDocumentation | undefined;
    [key: string]: any;
  };
}

export = swaggerJSDoc;

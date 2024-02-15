const config: Config = {
  endpoints: [
    {
      method: "GET",
      route: "/user",
      model: "User",
      operation: "all",
    },
    {
      method: "GET",
      route: "/user/:id",
      model: "User",
      operation:"one"
    },
  ],
};

export interface Endpoint {
  method: string;
  route: string;
  model: "User";
  operation: "all" | "one" | "filter";
}

export interface Config {
  endpoints: Endpoint[];
}

export default config;

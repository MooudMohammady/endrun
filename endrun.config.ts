const config: Config = {
  endpoints: [
    {
      method: "GET",
      route: "/products",
      model: "Product",
      operation: "all",
    },
    {
      method: "GET",
      route: "/products/:id",
      model: "Product",
      operation:"one"
    },
    {
      method: "GET",
      route: "/search",
      model: "Product",
      operation:"search"
    },
    {
      method: "POST",
      route: "/products",
      model: "Product",
    },
    {
      method: "PUT",
      route: "/products/:id",
      model: "Product",
    },
    {
      method: "DELETE",
      route: "/products/:id",
      model: "Product",
    },
  ],
};

export interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  route: string;
  model: "Product";
  operation?: "all" | "one" | "search";
}

export interface Config {
  endpoints: Endpoint[];
}

export default config;

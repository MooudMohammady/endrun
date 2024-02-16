import { Prisma } from "@prisma/client";

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  route: string;
  model: "Product" | string;
  operation?: "all" | "one" | "search";
}

const endpoints: Endpoint[] = [];
//@ts-ignore
Prisma.dmmf.datamodel.models.forEach(m=>{
  endpoints.push(
    {
      method:"GET",
      route:`/${m.name.toLowerCase()}s`,
      model:m.name,
      operation:"all"
    },
    {
      method:"GET",
      route:`/${m.name.toLowerCase()}s/:id`,
      model:m.name,
      operation:"one"
    },
    {
      method:"GET",
      route:`/search/${m.name.toLowerCase()}s`,
      model:m.name,
      operation:"search"
    },
    {
      method:"POST",
      route:`/${m.name.toLowerCase()}s`,
      model:m.name
    },
    {
      method:"PUT",
      route:`/${m.name.toLowerCase()}s/:id`,
      model:m.name
    },
    {
      method:"DELETE",
      route:`/${m.name.toLowerCase()}s/:id`,
      model:m.name
    },
  )
})

export default endpoints;
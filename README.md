<div align="center">
  <img src="./images/logo.png" width="500" height="auto" alt="Hono"/>
</div>
<hr />

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/honojs/hono/ci.yml?branch=main)](https://github.com/MooudMohammady/endrun/actions)
[![GitHub](https://img.shields.io/badge/License-GPL3.0-g)](https://github.com/MooudMohammady/endrun/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/hono)](https://www.npmjs.com/package/hono)
[![minifide size - 29 KB](https://img.shields.io/badge/minifide_size-29_KB-blue)](https://)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/hono)](https://bundlephobia.com/result?p=hono)
[![npm type definitions](https://img.shields.io/npm/types/hono)](https://www.npmjs.com/package/hono)
[![GitHub last commit](https://img.shields.io/badge/last_commit-today-g)](https://github.com/MooudMohammady/endrun/commits/main)

# Endrun

Endrun is a simple and powerful web API framework that dynamically generates endpoints and Swagger documentation based on database models using Prisma ORM.

## Features

- **Dynamic Endpoint Generation**: Automatically create endpoints for CRUD operations (GET, POST, PUT, DELETE) for each database model defined in Prisma, without the need for manual code writing.
  
- **Automatic Swagger Documentation**: Generate Swagger documentation automatically for your APIs, specifying the operations available in each endpoint and the parameters required.
  
- **Prisma ORM Compatibility**: Endrun works seamlessly with Prisma ORM for database management, providing a modern and efficient way to interact with your data.

- **Simplicity and Ease of Use**: With its simple and user-friendly design, Endrun allows developers to quickly and confidently create powerful and stable APIs, without the need for repetitive code or unnecessary complexities.
## Usage

To get started with Endrun, follow these simple steps:

1. Install Endrun using npm:

`
npm install endrun
`

vbnet
Copy code

2. Define your database models using Prisma.

3. Import Endrun into your project and configure your endpoints.

4. Start your server and enjoy the power and simplicity of Endrun!

## Example

Here's a simple example of how to use Endrun to create an API endpoint:

```typescript
import Endrun from 'endrun';

const app = new Endrun();

app.get('/products', async (req, res) => {
const products = await Product.find();
res.json(products);
});

app.listen(3000, () => {
console.log('Server is running on port 3000');
});
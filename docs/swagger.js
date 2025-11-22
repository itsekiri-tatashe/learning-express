import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.1.0",
    // swagger: "2.0",
    info: {
      title: "Express API Tutotial",
      version: "1.0.0",
      description: "API documentation for my Express application",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local server",
      },
    ],
  },

  // Paths to files containing OpenAPI annotations
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
5;

export default swaggerSpec;

require("dotenv").config();

const express = require("express");
const app = express();

// 3PL
const morgan = require("morgan");

// Using Middleware
app.use(express.json());
app.use(morgan("tiny"));

// Execute DB
require("./database");

// Import Routes
const genreRouter = require("./routes/genreRoutes");
const customerRouter = require("./routes/customerRoutes");
const movieRouter = require("./routes/movieRoutes");
const rentalRouter = require("./routes/rentalRoutes");

// Use Routes
app.use("/api/genres", genreRouter);
app.use("/api/customers", customerRouter);
app.use("/api/movies", movieRouter);
app.use("/api/rentals", rentalRouter);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

const express = require("express");
const router = express.Router();

// Middleware
const auth = require("../middleware/auth");

//  Import Schema
const Movie = require("../models/Movies");
const { createMovieSchema } = require("../validators/movieSchema");

// Get All Genres
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().populate("genres", "title -_id");
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Single Genre
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const movie = await Movie.findById(id).populate("genres");
    if (!movie) {
      return res
        .status(404)
        .json({ message: "The movie with provided ID does not exist" });
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add New Genre (POST)
router.post("/", auth, async (req, res) => {
  // Validation
  const { error } = createMovieSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const movie = new Movie(req.body);
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Internal server error." });
  }
});

// Update Genre (PUT)
// router.put("/:id",auth, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const genre = await Movie.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!genre) {
//       return res
//         .status(404)
//         .json({ message: "The genre with provided ID does not exist" });
//     }
//     res.status(200).json(genre);
//   } catch (err) {
//     const errorMessages = Object.values(ex.errors).map(
//       (error) => error.message
//     );
//     res.status(400).json({ errors: errorMessages });
//   }
// });

// Delete Genre (DELETE)
// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const genre = await Movie.findById(id);
//     if (!genre) {
//       return res
//         .status(404)
//         .json({ message: "The genre with provided ID does not exist" });
//     }
//     const deletedGenre = await Movie.deleteOne({ _id: id });
//     res.status(204).end();
//   } catch (err) {
//     res.status(500).json(err.message);
//   }
// });

module.exports = router;

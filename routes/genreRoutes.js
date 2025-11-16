const express = require("express");
const router = express.Router();

// Middleware
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

//  Import Genre Schema
const Genre = require("../models/Genres");

// Get All Genres
router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Single Genre
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const genre = await Genre.findById(id);
    if (!genre) {
      return res
        .status(404)
        .json({ message: "The genre with provided ID does not exist" });
    }
    res.status(200).json(genre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add New Genre (POST)
router.post("/", auth, async (req, res) => {
  const { title, description } = req.body;

  const genre = new Genre({
    title: title,
    description: description,
  });

  try {
    const newGenre = await genre.save();
    res.status(201).json(newGenre);
  } catch (ex) {
    const errorMessages = Object.values(ex.errors).map(
      (error) => error.message
    );
    res.status(400).json({ errors: errorMessages });
  }
});

// Update Genre (PUT)
router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const genre = await Genre.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!genre) {
      return res
        .status(404)
        .json({ message: "The genre with provided ID does not exist" });
    }
    res.status(200).json(genre);
  } catch (err) {
    const errorMessages = Object.values(ex.errors).map(
      (error) => error.message
    );
    res.status(400).json({ errors: errorMessages });
  }
});

// Delete Genre (DELETE)
router.delete("/:id", [auth, admin], async (req, res) => {
  const { id } = req.params;

  try {
    const genre = await Genre.findById(id);
    if (!genre) {
      return res
        .status(404)
        .json({ message: "The genre with provided ID does not exist" });
    }
    const deletedGenre = await Genre.deleteOne({ _id: id });
    res.status(204).end();
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;

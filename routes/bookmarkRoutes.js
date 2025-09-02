//import modules
const express = require("express");
const router = express.Router();
const Bookmark = require("../models/Bookmark");
const { authMiddleware } = require("../utils/auth");

//CREATE - Create a new bookmark for authenticated user
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, url } = req.body;

    //validate required fields
    if (!title || !url)
      return res.status(400).json({ error: "title and url required" });

    //create bookmark with user association
    const bookmark = await Bookmark.create({ title, url, user: req.user.id });
    res.status(201).json(bookmark);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//GET ALL - Retrieve all bookmarks for current authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    //find bookmarks belonging to current user, sorted by creation date (newest first)
    const bookmarks = await Bookmark.find({ user: req.user.id })
      .sort({
        createdAt: -1,
      })
      //use lean() for better performance, returns plain JS objects
      .lean();

    res.json(bookmarks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET ONE - Retrieve specific bookmark (user must own it)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    //find bookmark by ID and verify user ownership
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!bookmark) return res.status(404).json({ error: "Not found" });
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE - Update bookmark (user must own it)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, url } = req.body;

    // Check if at least one field is provided for update
    if (!title && !url) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    //find and update bookmark, ensuring user ownership
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        //only update fields that are provided (conditional update)
        $set: { ...(title && { title }), ...(url && { url }) },
      },
      {
        new: true, //return updated document
        runValidators: true, //run model validators on update
      }
    );

    if (!bookmark) return res.status(404).json({ error: "Not found" });

    res.json(bookmark);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE - Delete bookmark (user must own it)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    //find and delete bookmark, ensuring user ownership
    const deleted = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//export router
module.exports = router;

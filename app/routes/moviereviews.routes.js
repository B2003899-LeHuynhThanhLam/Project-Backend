const express = require("express");
const moviereviews = require("../controllers/moviereview.controller");

module.exports = app => {
    const router = express.Router();


    router.post("/", moviereviews.create);
    router.get("/", moviereviews.findAll);
    router.get("/favorite", moviereviews.findAllFavorite);
    router.get("/:id", moviereviews.findOne);
    router.put("/:id", moviereviews.update);
    router.delete("/:id", moviereviews.delete);
    router.delete("/", moviereviews.deleteAll);

    app.use("/api/moviereviews", router);
};
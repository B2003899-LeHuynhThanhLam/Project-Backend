const express = require("express");
const authors = require("../controllers/author.controller");

module.exports = app => {
    const router = express.Router();


    router.post("/", authors.create);
    router.get("/", authors.findAll);
    router.get("/favorite", authors.findAllFavorite);
    router.get("/:id", authors.findOne);
    router.put("/:id", authors.update);
    router.delete("/:id", authors.delete);
    router.delete("/", authors.deleteAll);

    app.use("/api/authors", router);
};
const express = require("express");
const reviewers = require("../controllers/reviewer.controller");

module.exports = app => {
    const router = express.Router();


    router.post("/", reviewers.create);
    router.get("/", reviewers.findAll);
    router.get("/favorite", reviewers.findAllFavorite);
    router.get("/:id", reviewers.findOne);
    router.put("/:id", reviewers.update);
    router.delete("/:id", reviewers.delete);
    router.delete("/", reviewers.deleteAll);

    app.use("/api/reviewers", router);
};
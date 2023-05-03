const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const db = require("../models");
const moviereview = db.moviereview;

// Create and Save a new moviereview
exports.create = async(req, res, next) => {
    // Validate request
    if (!req.body.title) {
        return next(new BadRequestError(400, "Title can not be empty"));
    }
    if (!req.body.moviename) {
        return next(new BadRequestError(400, "movie name can not be empty"));
    }
    if (!req.body.author) {
        return next(new BadRequestError(400, "Author can not be empty"));
    }
    if (!req.body.reviewer) {
        return next(new BadRequestError(400, "Reviewer can not be empty"));
    }
    if (!req.body.intro) {
        return next(new BadRequestError(400, "Intro can not be empty"));
    }
    if (!req.body.content) {
        return next(new BadRequestError(400, "Content can not be empty"));
    }

    // Create a moviereview
    const newMoviereview = new moviereview({
        title: req.body.title,
        moviename: req.body.moviename,
        author: req.body.author,
        reviewer: req.body.reviewer,
        intro: req.body.intro,
        content: req.body.content,
        favorite: String(req.body.favorite).toLowerCase() === "true",
        ownerId: req.userId,
    });

    // Save moviereview in the database
    const [error, document] = await handle(newMoviereview.save());

    if (error) {
        return next(
            new BadRequestError(
                500,
                "An error occurred while creating the movie review"
            )
        );
    }

    return res.send(document);
};

// Retrieve all movie reviews of a user from the database
exports.findAll = async(req, res, next) => {
    const condition = { ownerId: req.userId };
    const title = req.query.title;
    if (title) {
        condition.title = { $regex: new RegExp(title), $options: "i" };
    }

    const [error, documents] = await handle(
        moviereview.find(condition, "-ownerId")
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                "An error occurred while retrieving movie reviews"
            )
        );
    }

    return res.send(documents);
};

// Find a single moviereview with an id
exports.findOne = async(req, res, next) => {
    const condition = {
        _id: req.params.id,
        ownerId: req.userId,
    };

    const [error, document] = await handle(
        moviereview.findOne(condition, "-ownerId")
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                `Error retrieving movie review with id=${req.params.id}`
            )
        );
    }

    if (!document) {
        return next(new BadRequestError(404, "movie review not found"));
    }

    return res.send(document);
};

// Update a moviereview by the id in the request
exports.update = async(req, res, next) => {
    if (!req.body) {
        return next(
            new BadRequestError(400, "Data to update can not be empty")
        );
    }

    const condition = {
        _id: req.params.id,
        ownerId: req.userId,
    };

    const [error, document] = await handle(
        moviereview.findOneAndUpdate(condition, req.body, {
            new: true,
            projection: "-ownerId",
        })
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                `Error updating movie review with id=${req.params.id}`
            )
        );
    }

    if (!document) {
        return next(new BadRequestError(404, "movie review not found"));
    }

    return res.send({ message: "movie review was updated successfully" });
};

// Delete a moviereview with the specified id in the request
exports.delete = async(req, res, next) => {
    const condition = {
        _id: req.params.id,
        ownerId: req.userId,
    };

    const [error, document] = await handle(
        moviereview.findOneAndDelete(condition, {
            projection: "-ownerId",
        })
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                `Could not delete movie review with id=${req.params.id}`
            )
        );
    }

    if (!document) {
        return next(new BadRequestError(404, "movie review not found"));
    }

    return res.send({ message: "movie review was deleted successfully" });
};

// Delete all movie reviews of a user from the database
exports.deleteAll = async(req, res, next) => {
    const [error, data] = await handle(
        moviereview.deleteMany({ ownerId: req.userId })
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                "An error occurred while removing all movie reviews"
            )
        );
    }

    return res.send({
        message: `${data.deletedCount} movie reviews were deleted successfully`,
    });
};

// Find all favorite movie reviews of a user
exports.findAllFavorite = async(req, res, next) => {
    const [error, documents] = await handle(
        moviereview.find({
                favorite: true,
                ownerId: req.userId,
            },
            "-ownerId"
        )
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                "An error occurred while retrieving favorite movie reviews"
            )
        );
    }

    return res.send(documents);
};
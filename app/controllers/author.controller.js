const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const db = require("../models");
const Author = db.Author;

// Create and Save a new Author
exports.create = async(req, res, next) => {
    // Validate request
    if (!req.body.name) {
        return next(new BadRequestError(400, "Name can not be empty"));
    }

    // Create a Author
    const author = new Author({
        name: req.body.name,
        profile: req.body.profile,
        favorite: String(req.body.favorite).toLowerCase() === "true",
        ownerId: req.userId,
    });

    // Save Author in the database
    const [error, document] = await handle(author.save());

    if (error) {
        return next(
            new BadRequestError(
                500,
                "An error occurred while creating the author"
            )
        );
    }

    return res.send(document);
};

// Retrieve all Authors of a user from the database
exports.findAll = async(req, res, next) => {
    const condition = { ownerId: req.userId };
    const name = req.query.name;
    if (name) {
        condition.name = { $regex: new RegExp(name), $options: "i" };
    }

    const [error, documents] = await handle(
        Author.find(condition, "-ownerId")
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                "An error occurred while retrieving authors"
            )
        );
    }

    return res.send(documents);
};

// Find a single Author with an id
exports.findOne = async(req, res, next) => {
    const condition = {
        _id: req.params.id,
        ownerId: req.userId,

    };

    const [error, document] = await handle(
        Author.findOne(condition, "-ownerId")
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                `Error retrieving author with id=${req.params.id}`
            )
        );
    }

    if (!document) {
        return next(new BadRequestError(404, "Author not found"));
    }

    return res.send(document);
};

// Update a Author by the id in the request
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
        Author.findOneAndUpdate(condition, req.body, {
            new: true,
            projection: "-ownerId",
        })
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                `Error updating author with id=${req.params.id}`
            )
        );
    }

    if (!document) {
        return next(new BadRequestError(404, "Author not found"));
    }

    return res.send({ message: "Author was updated successfully" });
};

// Delete a Author with the specified id in the request
exports.delete = async(req, res, next) => {
    const condition = {
        _id: req.params.id,
        ownerId: req.userId,
    };

    const [error, document] = await handle(
        Author.findOneAndDelete(condition, {
            projection: "-ownerId",
        })
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                `Could not delete author with id=${req.params.id}`
            )
        );
    }

    if (!document) {
        return next(new BadRequestError(404, "Author not found"));
    }

    return res.send({ message: "Author was deleted successfully" });
};

// Delete all Authors of a user from the database
exports.deleteAll = async(req, res, next) => {
    const [error, data] = await handle(
        Author.deleteMany({ ownerId: req.userId })
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                "An error occurred while removing all authors"
            )
        );
    }

    return res.send({
        message: `${data.deletedCount} authors were deleted successfully`,
    });
};

// Find all favorite Authors of a user
exports.findAllFavorite = async(req, res, next) => {
    const [error, documents] = await handle(
        Author.find({
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
                "An error occurred while retrieving favorite authors"
            )
        );
    }

    return res.send(documents);
};
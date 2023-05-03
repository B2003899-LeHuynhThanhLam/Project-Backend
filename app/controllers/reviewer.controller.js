const { BadRequestError } = require("../helpers/errors");
const handle = require("../helpers/promise");
const db = require("../models");
const Reviewer = db.Reviewer;

// Create and Save a new Reviewer
exports.create = async(req, res, next) => {
    // Validate request
    if (!req.body.name) {
        return next(new BadRequestError(400, "Name can not be empty"));
    }

    // Create a Reviewer
    const reviewer = new Reviewer({
        name: req.body.name,
        profile: req.body.profile,
        favorite: String(req.body.favorite).toLowerCase() === "true",
        ownerId: req.userId,
    });

    // Save Reviewer in the database
    const [error, document] = await handle(reviewer.save());

    if (error) {
        return next(
            new BadRequestError(
                500,
                "An error occurred while creating the reviewer"
            )
        );
    }

    return res.send(document);
};

// Retrieve all Reviewers of a user from the database
exports.findAll = async(req, res, next) => {
    const condition = { ownerId: req.userId };
    const name = req.query.name;
    if (name) {
        condition.name = { $regex: new RegExp(name), $options: "i" };
    }

    const [error, documents] = await handle(
        Reviewer.find(condition, "-ownerId")
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                "An error occurred while retrieving reviewers"
            )
        );
    }

    return res.send(documents);
};

// Find a single Reviewer with an id
exports.findOne = async(req, res, next) => {
    const condition = {
        _id: req.params.id,
        ownerId: req.userId,

    };

    const [error, document] = await handle(
        Reviewer.findOne(condition, "-ownerId")
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                `Error retrieving reviewer with id=${req.params.id}`
            )
        );
    }

    if (!document) {
        return next(new BadRequestError(404, "Reviewer not found"));
    }

    return res.send(document);
};

// Update a Reviewer by the id in the request
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
        Reviewer.findOneAndUpdate(condition, req.body, {
            new: true,
            projection: "-ownerId",
        })
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                `Error updating reviewer with id=${req.params.id}`
            )
        );
    }

    if (!document) {
        return next(new BadRequestError(404, "Reviewer not found"));
    }

    return res.send({ message: "Reviewer was updated successfully" });
};

// Delete a Reviewer with the specified id in the request
exports.delete = async(req, res, next) => {
    const condition = {
        _id: req.params.id,
        ownerId: req.userId,
    };

    const [error, document] = await handle(
        Reviewer.findOneAndDelete(condition, {
            projection: "-ownerId",
        })
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                `Could not delete reviewer with id=${req.params.id}`
            )
        );
    }

    if (!document) {
        return next(new BadRequestError(404, "Reviewer not found"));
    }

    return res.send({ message: "Reviewer was deleted successfully" });
};

// Delete all Reviewers of a user from the database
exports.deleteAll = async(req, res, next) => {
    const [error, data] = await handle(
        Reviewer.deleteMany({ ownerId: req.userId })
    );

    if (error) {
        return next(
            new BadRequestError(
                500,
                "An error occurred while removing all reviewers"
            )
        );
    }

    return res.send({
        message: `${data.deletedCount} reviewers were deleted successfully`,
    });
};

// Find all favorite Reviewers of a user
exports.findAllFavorite = async(req, res, next) => {
    const [error, documents] = await handle(
        Reviewer.find({
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
                "An error occurred while retrieving favorite reviewers"
            )
        );
    }

    return res.send(documents);
};
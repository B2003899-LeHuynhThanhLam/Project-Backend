const mongoose = require("mongoose");
const createmoviereviewModel = require("./moviereview.model");
const createReviewerModel = require("./reviewer.model");
const createAuthorModel = require("./author.model");
const createUserModel = require("./user.model");

const db = {};
db.mongoose = mongoose;
db.moviereview = createmoviereviewModel(mongoose);
db.Reviewer = createReviewerModel(mongoose);
db.Author = createAuthorModel(mongoose);
db.User = createUserModel(mongoose);

module.exports = db;
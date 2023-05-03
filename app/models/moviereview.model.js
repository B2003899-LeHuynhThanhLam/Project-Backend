module.exports = mongoose => {
    const schema = mongoose.Schema({
        title: {
            type: String,
            required: [true, "Title is required"],
        },
        moviename: {
            type: String,
            required: [true, "movie name is required"],
        },
        author: {
            type: String,
            required: [true, "Author is required"],
        },
        reviewer: {
            type: String,
            required: [true, "Reviewer is required"],
        },
        intro: {
            type: String,
            required: [true, "Intro is required"],
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },
        favorite: Boolean,
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
    }, { timestamps: true });

    // Replace _id with id and remove __V
    schema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    return mongoose.model("moviereview", schema);
};
var mongoose = require("mongoose");
var entrySchema = require("./Entry").entrySchema

var userSchema = mongoose.Schema({
	username: { type: String, required: true, unique: true },
	log: [entrySchema],
});

var User = new mongoose.model("User", userSchema);

module.exports = User;
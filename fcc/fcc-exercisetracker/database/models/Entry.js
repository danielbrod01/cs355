var mongoose = require("mongoose");

var entrySchema = mongoose.Schema({
	description: { type: String, required: true },
	duration: { type: Number, required: true },
	date: { type: Date, default: Date.now },
});

var Entry = new mongoose.model("Entry", entrySchema);

module.exports = {Entry, entrySchema};
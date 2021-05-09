require('dotenv').config()
var express = require('express')
var app = express()
var cors = require('cors')
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var User = require("./database/models/User");
var Entry = require("./database/models/Entry");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//connect to mongo db
mongoose.connect(process.env.DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

/**
 * Make a GET request to /api/users to get an array of all users.
 * Elements in the array is an object containing a user's username and _id.
 * https://stackoverflow.com/questions/25330555/mongoose-find-return-specific-properties
 */
app.get("/api/users", async (req, res) => {
	var userList = await User.find({}, "username _id");

	if (userList) {
    res.json(userList);
  }
	else {
    res.json({ error: "error fetching users" });
  }
});

//make a POST request
app.post("/api/users", async (req, res) => {
	var newUser = await User.create(req.body);

	if (newUser) {
		res.json({ username: newUser.username, _id: newUser._id });
	} else {
		res.json({ error: "error creating new user" });
	}
});

app.get("/api/users/:id/logs", async (req, res) => {
	var { id } = req.params;
	var { from, to, limit } = req.query;
	var user;
	var options;

	if (limit) {
		user = await User.findById(id, options).slice("log", Number(limit)).exec();
	} 
  else user = await User.findById(id);

	if (user) {
		if (from)
			user.log = user.log.filter(
				(entry) => entry.date.getTime() > new Date(from).getTime()
			);

		if (to)
			user.log = user.log.filter(
				(entry) => entry.date.getTime() < new Date(to).getTime()
			);

		var response = {
			_id: user._id,
			username: user.username,
			count: user.log.length,
			log: user.log,
		};

		res.json(response);
	} else res.json({ 
    error: "unable to find user" 
  });
});

app.post("/api/users/:id/exercises", async (req, res) => {
	var { id } = req.params;
	var user = await User.findById(id);

	if (user) {
		var entry = await Entry.Entry.create(req.body);
		user.log.push(entry);
		await user.save();

		var returnObject = {
			_id: user._id,
			username: user.username,
			date: entry.date.toDateString(),
			duration: entry.duration,
			description: entry.description,
		};

		res.json(returnObject);
	} 
  else 
    res.json({ error: "exercise could not be added" });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

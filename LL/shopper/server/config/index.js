const pkg = require("../../package.json");

module.exports = {
  applicationName: pkg.name,
  mongodb: {
    url: "mongodb+srv://user0:mypassword@cluster0.szszg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  },
  redis: {
    port: 7379,
    client: null,
  },
  mysql: {
    options: {
      host: "localhost",
      port: 3406,
      database: "shopper",
      dialect: "mysql",
      username: "root",
      password: "mypassword",
    },
    client: null,
  },
};
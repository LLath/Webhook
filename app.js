require("dotenv").config();
const http = require("http");
const createHandler = require("node-github-webhook");
const { execSync } = require("child_process");

const handlerOptions = [
  { path: "/webhook", secret: process.env.SECRET },
  { path: "/serverwebhook", secret: process.env.SECRET_DWP_SERVER },
];

const handler = createHandler(handlerOptions);

http
  .createServer(function (req, res) {
    handler(req, res, function (err) {
      res.statusCode = 404;
      res.end("no such location");
    });
  })
  .listen(7777);

handler.on("error", function (err) {
  console.error("Error:", err.message);
});

handler.on("push", function (event) {
  console.log(`Received push from ${event.path}`);
  let command;

  switch (event.path) {
    case "webhook":
      command = `git pull | yarn | pm2 restart bot
      `;
      execSync(
        command,
        { cwd: "process.env.HOME/git/DWP/" },
        (err, stdout, stderr) => {
          if (err) console.error(err);
          console.log("Executed script", stdout);
        }
      );
      break;
    case "serverwebhook":
      command = `git pull | npm ci | pm2 restart bot
      `;
      execSync(
        command,
        { cwd: "process.env.HOME/git/dwp_server/" },
        (err, stdout, stderr) => {
          if (err) console.error(err);
          console.log("Executed script", stdout);
        }
      );
      break;

    default:
      break;
  }
});

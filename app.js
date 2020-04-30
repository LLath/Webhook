require("dotenv").config();
var http = require("http");
var createHandler = require("github-webhook-handler");
var handler = createHandler({ path: "/webhook", secret: process.env.SECRET });

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
  console.log(
    "Received a push event for %s to %s",
    event.payload.repository.name,
    event.payload.ref
  );
});

handler.on("issues", function (event) {
  console.log(
    "Received an issue event for %s action=%s: #%d %s",
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title
  );
});

// const
// const crypto = require("crypto");

// console.log(process.env.SECRET);
// http
//   .createServer((req, res) => {
//     req.on("data", (chunk) => {
//       const signature = `sha1=${crypto
//         .createHmac("sha1", process.env.SECRET)
//         .update(chunk)
//         .digest("hex")}`;

//       const isAllowed = req.headers["x-hub-signature"] === signature;

//       const body = JSON.parse(chunk);

//       const isMaster = body.ref === "refs/heads/master";

//       if (isAllowed && isMaster) {
//         console.log("You pushed something important");
//       }
//       console.log("Was mach ich");
//     });
//     res.end();
//   })
//   .listen(7777);

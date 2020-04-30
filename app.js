const http = require("http");
const crypto = require("crypto");

http
  .createServer((req, res) => {
    req.on("data", (chunk) => {
      const signature = `sha1=${crypto
        .createHmac("sha1", process.env.SECRET)
        .update(chunk)
        .digest("hex")}`;

      const isAllowed = req.headers["x-hub-signature"] === signature;

      const body = JSON.parse(chunk);

      const isMaster = body.ref === "refs/heads/master";

      if (isAllowed && isMaster) {
        console.log("You pushed something important");
      }
      console.log("Was mach ich");
    });
    res.end();
  })
  .listen(7777);

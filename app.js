const http = require("http");
const crypto = require("crypto");

const SECRET = "";

http
  .createServer((req, res) => {
    req.on("data", (chunk) => {
      const signature = `sha1=${crypto
        .createHmac("sha1", SECRET)
        .update(chunk)
        .digest("hex")}`;

      const isAllowed = req.headers["x-hub-signature"] === signature;

      const body = JSON.parse(chunk);

      const isMaster = body?.ref === "refs/heads/master";

      if (isAllowed && isMaster) {
        console.log("You pushed something important");
      }
    });
    res.end();
  })
  .listen(8080);

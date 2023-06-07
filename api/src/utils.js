const crypto = require("crypto");

function createHash(board) {
  return crypto.createHash("md5")
      .update(JSON.stringify(board))
      .digest("hex");
}

module.exports = {
  createHash,
};
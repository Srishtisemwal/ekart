const fs = require("fs/promises");
exports.fileDeleteHandler = async (filePath) => {
  try {
    await fs.unlink(filePath);
    return true;
  } catch (err) {
    return false;
  }
};

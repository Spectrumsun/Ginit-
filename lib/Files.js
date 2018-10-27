const fs = require('fs');
const path = require('path');

class File{
  static getCurrentDirectoryBase() {
    return path.basename(process.cwd())
  };

  static directoryExists(filePath) {
    try {
      return fs.statSync(filePath).isDirectory();
    }catch (err) {
      return false;
    }
  }
}

module.exports = File;
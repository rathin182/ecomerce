const multer = require('multer');

const storage = multer.memoryStorage()
const uploade = multer({storage: storage});

module.exports = uploade;

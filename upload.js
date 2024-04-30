var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/profile_pic/')
  },
  filename: function (req, file, cb) {
    var fileparts = file.originalname.split(".");
    var ext = fileparts[fileparts.length - 1];
    cb(null, file.fieldname + "-" + Date.now() + "." + ext);
  }
});

var upload = multer({ storage: storage });

module.exports = upload;

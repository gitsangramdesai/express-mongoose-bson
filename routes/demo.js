var express = require("express");
var router = express.Router();
var { ImageModel } = require("../models/image");
var upload = require("../upload");
var fs = require("fs");
var path = require("path");
var mongoose = require("mongoose");

router.post("/", upload.single("image"), async (req, res, next) => {
  var obj = {
    name: req.body.name,
    desc: req.body.desc,
    filename: req.file.filename,
    img: {
      data: fs.readFileSync(
        path.join("./public/uploads/profile_pic/" + req.file.filename)
      ),
      contentType: "image/png",
    },
  };

  try {
    var item = await ImageModel.create(obj);
    res.json({ item: item });
  } catch (exp) {
    console.log(exp.message.toString());
    res.status(500).send({ msg: "An error occurred", error: exp });
  }
});

//get image --var mongoose = require("mongoose");
router.get("/:fileId", async (req, res) => {
  try {
    var result = await ImageModel.find(
      { _id: new mongoose.Types.ObjectId(req.params.fileId) },
      {}
    );
    var fileName = result[0].filename;
    var mimeType = result[0].img.contentType;
    var buffer = result[0].img.data;

    res.contentType(mimeType);
    res.send(buffer);
    
  } catch (err) {
    res
      .status(500)
      .send({ msg: "An error occurred", error: err.message.toString() });
  }
});

module.exports = router;

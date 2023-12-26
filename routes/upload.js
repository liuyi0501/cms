var express = require('express');
var router = express.Router();
var { websiteData } = require("../config/data.js");
const path = require('path');
const multer = require('multer');
var { imageFormat } = require("../utils/common.js")

// Multer middleware for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // 保存上传图片的目录
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // 使用时间戳作为文件名
  }
});
const upload = multer({ storage: storage });

/* GET users listing. */
router.post('/image', upload.single('file'), (req, res) => {
  // Multer middleware将文件信息添加到req对象中
  if (!req.file) {
    return res.status(400).send('No files were uploaded.');
  }

  // 图片上传成功后返回图片的URL
  const imageUrl = '/images/' + req.file.filename; // 此处假设图片存储在public/images目录下
  imageFormat(imageUrl).then((result)=>{
	  res.json({ imageLinks: result }); // 返回图片的URL
  })
});



module.exports = router;

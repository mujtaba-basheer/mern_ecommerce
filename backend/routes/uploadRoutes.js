const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "uploads/");
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const checkFileType = (file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(
        path.extname(file.originalname).toLocaleLowerCase()
    );
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) return cb(null, true);
    else {
        console.log("err");
        cb("Images Only");
    }
};

const upload = multer({
    storage,
    fileFilter(req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post("/", upload.single("image"), (req, res) => {
    console.log(req.file.path);
    res.send(`/${req.file.path}`);
});

module.exports = router;

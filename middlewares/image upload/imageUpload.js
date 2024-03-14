const fs = require("fs");
const multer = require('multer');
const cloudinary = require("cloudinary").v2;

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
}) ;

const upload = multer({ storage });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const pdfUpload = (req, res, next) => {
    console.log(upload)
    upload.single('pdfFile')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ status: "Failure", message: "No file uploaded" });
        }

        try {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "Ecommerce-pdfs"  // Folder name for PDFs
            });

            req.body.test_result = result.secure_url; // Pass the PDF file URL to req.body.pdfFile

            fs.unlink(req.file.path, (unlinkerr) => {
                if (unlinkerr) {
                    console.log("Error deleting local file", unlinkerr);
                }
            });

            next();
        } catch (error) {
            return res.status(500).json({ message: "Error uploading file to Cloudinary" });
        }
    });
};

module.exports = pdfUpload ;

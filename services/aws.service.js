const AWS = require("aws-sdk");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const uploadToS3 = async (file, folder = "") => {
    if (!file || !file.buffer || !file.originalname || !file.mimetype) {
        throw new Error("Invalid file input.");
    }

    const timestamp = Date.now();
    const key = folder
        ? `avatars/${folder}/${timestamp}-${file.originalname}`
        : `avatars/${timestamp}-${file.originalname}`;

    const uploadParams = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read", // Optional: Set this if you want public access
    };

    try {
        const result = await s3.upload(uploadParams).promise();
        console.log("RESULT",result.Location)
        return result.Location; // Return the file URL
    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw error;
    }
};

module.exports = { uploadToS3 };

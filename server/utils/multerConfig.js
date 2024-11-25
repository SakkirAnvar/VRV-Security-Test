import multer, { diskStorage } from "multer";

// storage
const storage = diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads');
    },
    filename: (req, file, callback) => {
        callback(null, `file-${Date.now()}-${file.originalname}`);
    }
});

// file filtering
const fileFilter = (req, file, callback) => {
    
    const allowedMimeTypes = [
        // Images
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg',
        // Videos
        'video/mp4', 'video/mpeg', 'video/quicktime'
    ];

    const { mediaFormat } = req.body;

    // Check if the MIME type is allowed
    if (allowedMimeTypes.includes(file.mimetype)) {
        // Check the media format against the file type
        if (mediaFormat === "image") {
            const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedImageTypes.includes(file.mimetype)) {
                return callback(new Error('Selected media format is image but file is not an image'), false);
            }
        } else if (mediaFormat === "video") {
            const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime'];
            if (!allowedVideoTypes.includes(file.mimetype)) {
                return callback(new Error('Selected media format is video but file is not a video'), false);
            }
        } else if (mediaFormat === "gif") {
            if (file.mimetype !== 'image/gif') {
                return callback(new Error('Selected media format is gif but file is not a GIF'), false);
            }
        }
        // Allow the file
        callback(null, true);
    } else {
        callback(new Error('Only jpeg, png, gif, webp, mp4, mpeg, and quicktime files are accepted'), false);
    }
};

// define upload
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 100 MB limit
        files: 5 // Allow up to 5 files per request
    }
});

import fs from 'node:fs/promises';
import path from 'node:path';

export const deleteFile = async (filePath) => {
    try {
        const fullPath = path.join(process.cwd(), filePath);
        await fs.unlink(fullPath);
        console.log(`File deleted successfully: ${fullPath}`);
    } catch (error) {
        console.error(`Error deleting file: ${filePath}`, error);
    }
};

// export upload
export default upload;

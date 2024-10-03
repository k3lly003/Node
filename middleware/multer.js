import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });

  export const upload = multer({ storage: storage });
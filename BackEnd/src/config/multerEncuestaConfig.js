import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.resolve(process.cwd(), 'FrontEnd', 'Public', 'uploads', 'encuestas');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadDir)) {
      try {
        fs.mkdirSync(uploadDir, { recursive: true });
      } catch (e) {
        return cb(e);
      }
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}-${safeName}`);
  }
});

function fileFilter(req, file, cb) {
  const allowedExt = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExt.includes(ext)) cb(null, true);
  else cb(new Error('Tipo de archivo no permitido. Solo jpg, png y webp.'), false);
}

const uploadEncuesta = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default uploadEncuesta;

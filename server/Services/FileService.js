const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Путь, куда будут сохраняться файлы
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`); // Уникальное имя файла
    }
  });
  
  const upload = multer({ storage: storage });
class FileService {
    async saveFile(file) {

    }
}

module.exports = new FileService();
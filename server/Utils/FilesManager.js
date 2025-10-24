const { convert } = require('docx2pdf-converter');
const fs = require('fs');

class FileManager {
    async convertDocxToPdf(docxBuffer) {
        try {
            const tempDocxPath = './temp/temp.docx';
            const tempPdfPath = './temp/temp.pdf';

            fs.writeFileSync(tempDocxPath, docxBuffer);

            await convert(tempDocxPath, tempPdfPath); // конвертация

            const pdfBuffer = fs.readFileSync(tempPdfPath);

            // Можно удалить временные файлы
            fs.unlinkSync(tempDocxPath);
            fs.unlinkSync(tempPdfPath);

            return pdfBuffer;
        } catch (error) {
            console.error('Ошибка при конвертации:', error);
        }
    }
}

module.exports = new FileManager();
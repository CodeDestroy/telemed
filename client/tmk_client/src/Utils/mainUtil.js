export default class mainUtil {
    static async isUrl(string) {
        try {
            // Создаем объект URL
            new URL(string);
            return true;
        } catch (e) {
            // Если создание объекта URL выбрасывает исключение, это не URL
            return false;
        }
    }
}
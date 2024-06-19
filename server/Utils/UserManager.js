class UserManager {
    async parseFullName(fullName) {
        // Разбиваем строку на слова
        const parts = fullName.trim().split(/\s+/);
        
        // Инициализируем переменные для фамилии, имени и отчества
        let secondName = '';
        let firstName = '';
        let patronomicName = '';
    
        // Если строка состоит из трех и более частей
        if (parts.length >= 3) {
            secondName = parts[0];
            patronomicName = parts.pop();
            firstName = parts.slice(1).join(' ');
        } 
        // Если строка состоит из двух частей
        else if (parts.length === 2) {
            secondName = parts[0];
            firstName = parts[1];
        }
        // Если строка состоит из одной части (что маловероятно, но на всякий случай)
        else if (parts.length === 1) {
            secondName = parts[0];
        }
    
        return {
            secondName,
            firstName,
            patronomicName
        };
    }
}

module.exports = new UserManager();
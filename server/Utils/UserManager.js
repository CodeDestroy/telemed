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

    async translit(word){
        var answer = '';
        var converter = {
            'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
            'е': 'e',    'ё': 'e',    'ж': 'zh',   'з': 'z',    'и': 'i',
            'й': 'y',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
            'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
            'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': 'ch',
            'ш': 'sh',   'щ': 'sch',  'ь': '',     'ы': 'y',    'ъ': '',
            'э': 'e',    'ю': 'yu',   'я': 'ya',
     
            'А': 'A',    'Б': 'B',    'В': 'V',    'Г': 'G',    'Д': 'D',
            'Е': 'E',    'Ё': 'E',    'Ж': 'Zh',   'З': 'Z',    'И': 'I',
            'Й': 'Y',    'К': 'K',    'Л': 'L',    'М': 'M',    'Н': 'N',
            'О': 'O',    'П': 'P',    'Р': 'R',    'С': 'S',    'Т': 'T',
            'У': 'U',    'Ф': 'F',    'Х': 'H',    'Ц': 'C',    'Ч': 'Ch',
            'Ш': 'Sh',   'Щ': 'Sch',  'Ь': '',     'Ы': 'Y',    'Ъ': '',
            'Э': 'E',    'Ю': 'Yu',   'Я': 'Ya'
        };
     
        for (var i = 0; i < word.length; ++i ) {
            if (converter[word[i]] == undefined){
                answer += word[i];
            } else {
                answer += converter[word[i]];
            }
        }
     
        return answer;
    }
}

module.exports = new UserManager();
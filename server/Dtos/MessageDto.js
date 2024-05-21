module.exports = class MessageDto {
    message;
    files;
    user;
    constructor (message, files, user){
        this.message = message;
        this.files = files;
        this.user = user;
    }
}
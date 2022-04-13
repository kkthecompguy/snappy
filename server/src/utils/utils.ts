// // const crypto = require('crypto');
// const algorithm = 'aes-256-ctr';
// const ENCRYPTION_KEY = 'Put_Your_Password_Here'; // or generate sample key Buffer.from('FoCKvdLslUuB4y3EZlKate7XGottHski1LmyqJHvUhs=', 'base64');
// const IV_LENGTH = 16;

// function encrypt(text: string) {
//     let iv = crypto.randomBytes(IV_LENGTH);
//     let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
//     let encrypted = cipher.update(text);
//     encrypted = Buffer.concat([encrypted, cipher.final()]);
//     return iv.toString('hex') + ':' + encrypted.toString('hex');
// }

// function decrypt(text) {
//     let textParts = text.split(':');
//     let iv = Buffer.from(textParts.shift(), 'hex');
//     let encryptedText = Buffer.from(textParts.join(':'), 'hex');
//     let decipher = crypto.createDecipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
//     let decrypted = decipher.update(encryptedText);
//     decrypted = Buffer.concat([decrypted, decipher.final()]);
//     return decrypted.toString();
// }
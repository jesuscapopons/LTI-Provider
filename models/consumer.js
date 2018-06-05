 
const mongoose = require('mongoose');
const crypto = require('crypto');

/*
 * Genera una llave alfanumerica random
 */
function getRandomKey(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}




/*
 Exportar el modelo para usarlo
 */
module.exports = mongoose.model('Consumer', {
    key: {
        type: String,
        default: getRandomKey.bind(this, 32),
        required: true,
        unique: true
    },
    secret: {
        type: String,
        default: getRandomKey.bind(this, 32),
        required: true
    },
});

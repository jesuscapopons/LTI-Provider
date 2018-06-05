 
 var fs = require('fs');
var https = require('https');
 
const express = require('express');
const app = express();
    

/*
 * Vamos a almacenar la información que recibimos en sesión
 * 
 */
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/lti');  

/*
 *  
 * https://github.com/expressjs/session
 */
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret: 'TOP SECRET',
    resave: true,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 60 * 60 * 24
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));

/*
 * Dentro de lti.js encontramos la lógica de funcionamiento

 */
app.use('/lti/', require('./lti'))

/*
 URL para el consumidor https://ew-box.com:4000/lti/
 El consumidor realiza un POST a nuestra URL y nos da permiso para insertar un iframe dentro de su sistema
 Realizamos redirección a https://ew-box.com:4000/app/
 En este punto la información LTI que se enviaa debe estar disponible en  req.session.
 */
app.post('/app/', (req, res, next) => {
    if(req.session.userId) {
        res.send('Datos que envia el consumidor' + JSON.stringify(req.session));
    } else {
        next('POST. Sesión inválida. Falta validación LTI .');
    }
});

app.get('/app/', (req, res, next) => {
    if(req.session.userId) 
	{
        res.send('Datos que envia el consumidor' + JSON.stringify(req.session));
    } else {
        next('POST. Sesión inválida. Falta validación LTI .');
    }
});

const port = 4000;
/*
Creamos el servidor con protocolo HTTPS. Primero hay que leer la clave privada y la pública.
dichos archivos no estan situados en el path html público para evitar el hackeo de nuestra app
*/
https.createServer({
    key: fs.readFileSync('/var/www/vhosts/ew-box.com/keys/pk.key'),
    cert: fs.readFileSync('/var/www/vhosts/ew-box.com/keys/ew-box_com.crt')
}, app).listen(port, function(){
    console.log("Arrancamos el proveedor en el puerto " + port + "...");
});

app.get('/info', function(req, res){
    console.log("Arrancado el proveedor en el puerto " + port + "...");
});
	

 
 
 
 

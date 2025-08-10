const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();


//Creamos el servidor de express
const app = express();

//Base de datos
dbConnection();

//CORS
app.use(cors());

//Midleware del Directorio publico
app.use( express.static('public'));

//Lectura y parseo del body
app.use( express.json());

 //Rutas
 //Midleware de la Ruta de autenticacion de usuario
 app.use('/api/auth', require('./routes/auth'));
 app.use('/api/events', require('./routes/events'));

//Escuchar peticiones
app.listen(process.env.PORT, () => {
      console.log(`Servidor corriendo en puerto ${ process.env.PORT }`)
});
const mongoose = require("mongoose");
require('dotenv').config();

const dbConnection = async () => {
      console.log(process.env.DB_CNN)
	try {
		await mongoose.connect(process.env.DB_CNN);
            console.log('DB Online');
	} catch (error) {
		console.log(error);
		throw new Error("Error a la hora da inicializar la BD");
	}
};

module.exports = {
      dbConnection
}

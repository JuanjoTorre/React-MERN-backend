const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {

		let usuario = await Usuario.findOne( { email } );

		if( usuario ) {
			return res.status( 400 ).json({
				ok: false,
				msg: "Ya existe un usuario con este email"
			})
		}
		usuario = new Usuario(req.body);

		//Encriptamos la contraseña
		const salt = bcrypt.genSaltSync();
		usuario.password = bcrypt.hashSync(password, salt);

		await usuario.save();

		//Generamos JWT
		const token =  await generarJWT(usuario.id, usuario.name);

		return res.status(201).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			email: usuario.email,
			password: usuario.password,
			token: token
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			msg: "Ocurrio un error",
		});
	}
};

const loginUsuario = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		//Comprobamos que el email exista
		const usuario = await Usuario.findOne( { email } );
		
		if( !usuario ) {
			return res.status( 400 ).json({
				ok: false,
				msg: "El usuario no existe"
			});
		};

		//Si el email es correcto, comprobamos que el password sea correcto tambien
		const validPassword = bcrypt.compareSync( password, usuario.password );
		 if( !validPassword) {
			return res.status(400).json({
				ok: false,
				msg: "Contraseña incorrecta"
			});
		 };

		 //Correcto todo: generamos un token
		 const token =  await generarJWT(usuario.id, usuario.name)

		return res.status(200).json({
			ok: true,
			uid: usuario.id,
			name: usuario.name,
			email: usuario.email,
			password: usuario.password,
			token
		});
		
	} catch (error) {
		return res.status(500).json({
			ok: false,
			msg: "Ocurrio un error",
		});
	}

	return res.status(200).json({
		ok: true,
		msg: "login",
		email,
		password,
	});
};

const revalidarToken = async(req, res = response) => {

	const name = req.name;
	const uid = req.uid;

	//Correcto todo: generamos un token
	const token =  await generarJWT(uid, name)

	return res.json({
		ok: true,
		uid,
		name,
		token

	});
};

module.exports = {
	crearUsuario,
	loginUsuario,
	revalidarToken,
};

const { response } = require("express");
const Evento = require("../models/Evento");

const getEvento = async (req, res = response) => {
	const eventos = await Evento.find().populate("user", "name");

	return res.status(200).json({
		ok: true,
		eventos,
	});
};
const crearEvento = async (req, res = response) => {
	const evento = new Evento(req.body);

	try {
		//Obtengo el id del usuario
		evento.user = req.uid;

		const eventoGuardado = await evento.save();
		return res.status(200).json({
			ok: true,
			msg: "Evento registrado con exito",
			evento: eventoGuardado,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Fallo en el registro del evento",
		});
	}
};

const actualizarEvento = async (req, res = response) => {
	//Obtengo el id que viene por url
	const eventoId = req.params.id;
      //Obtento el uid del usuario
      const uid = req.uid;

	try {
		//Busco el evento con el id que viene por url
		const evento = await Evento.findById(eventoId);

		if (!evento) {
			return res.status(404).json({
				ok: false,
				msg: "id incorrecto",
			});
		}

            //Compruebo que el usuario que quiere hacer el cambio es el mismo que creo el evento
            if(evento.user.toString()  !== uid){
                  return res.status(401).json({
				ok: false,
				msg: "Usuario incorrecto",
			});
            }

            //Creo el nuevo evento añadiendole el user
            const nuevoEvento = {
                  ...req.body,
                  user: uid
            }
            //Actualizo el evento
            const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true});

            return res.status(200).json({
				ok: true,
				msg: "Evento actualizado",
                        evento: eventoActualizado
			});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Hable con el administrador",
                  evento
		});
	}

	

};

const eliminarEvento = async(req, res = response) => {

	//Obtengo el id que viene por url
	const eventoId = req.params.id;
      //Obtento el uid del usuario
      const uid = req.uid;

	try {
		//Busco el evento con el id que viene por url
		const evento = await Evento.findById(eventoId);

		if (!evento) {
			return res.status(404).json({
				ok: false,
				msg: "id incorrecto",
			});
		}

            //Compruebo que el usuario que quiere hacer el cambio es el mismo que creo el evento
            if(evento.user.toString()  !== uid){
                  return res.status(401).json({
				ok: false,
				msg: "Usuario incorrecto",
			});
            }

            //Borro el evento
            const eventoBorrado = await Evento.findByIdAndDelete(eventoId);

            return res.status(200).json({
				ok: true,
				msg: "Evento Borrado",
                        evento: eventoBorrado
			});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			msg: "Hable con el administrador",

		});
	}

};

module.exports = {
	getEvento,
	crearEvento,
	actualizarEvento,
	eliminarEvento,
};

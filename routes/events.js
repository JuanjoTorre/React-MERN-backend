/********************************************RUTAS DE EVENTOS / EVENTS
 *                      host+/api/event
 * ********************************************************************* */

const { Router } = require("express");
const { check } = require('express-validator');

const { getEvento, crearEvento, actualizarEvento, eliminarEvento} = require('../controllers/events')
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { isDate } = require("../helpers/isDate");
const router = Router();


//Defino que todas las rutas por debajo de aqui pasen el middleware de validarJWT
router.use( validarJWT );

//Rutas de eventos
router.get(
      '/', 
      // [ //Middlewares
      //       check('name', 'El nombre es obligatorio' ).not().isEmpty(),
      //       check('email', 'El email es obligatorio' ).isEmail(),
      //       check('password', 'El password debe tener mas de 5 caracteres' ).isLength({min:6}),
      //       validarCampos
      // ],
      getEvento);

router.post(
      '/', 
      [//Middlewares
            check('title', 'El titulo es obligatorio' ).not().isEmpty(),
            check('start', 'La fecha de inicio es obligatoria' ).custom( isDate),
            check('end', 'La fecha de fin es obligatoria' ).custom( isDate),
            validarCampos
      ],
      crearEvento);
router.put(
      '/:id', 
      [//Middlewares
            check('title', 'El titulo es obligatorio' ).not().isEmpty(),
            check('start', 'La fecha de inicio es obligatoria' ).custom( isDate),
            check('end', 'La fecha de fin es obligatoria' ).custom( isDate),
            validarCampos
      ],
      actualizarEvento);
router.delete(
      '/:id', 
      // [//Middlewares
      //       check('title', 'El titulo es obligatorio' ).not().isEmpty(),
      //       check('start', 'La fecha de inicio es obligatoria' ).custom( isDate),
      //       check('end', 'La fecha de fin es obligatoria' ).custom( isDate),
      //       validarCampos
      // ],
      eliminarEvento);

// router.get('/renew',  revalidarToken);

module.exports = router;
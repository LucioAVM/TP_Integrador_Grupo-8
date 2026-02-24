import express from 'express';
import encuestaController from '../Controllers/encuesta.controller.js';
import uploadEncuesta from '../config/multerEncuestaConfig.js';

const router = express.Router();

router.get('/encuesta', encuestaController.getEncuesta);
router.post('/encuesta', uploadEncuesta.single('imagen'), encuestaController.postEncuesta);
router.get('/gracias', (req, res) => res.render('gracias'));

export default router;

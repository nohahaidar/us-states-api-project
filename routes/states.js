const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');
const verifyState = require('../middleware/verifyState');

// GET /states
router.route('/')
    .get(statesController.getAllStates);

// GET /states/:state
router.route('/:state')
    .get(verifyState, statesController.getState);

// GET /states/:state/capital
router.route('/:state/capital')
    .get(verifyState, statesController.getCapital);

// GET /states/:state/nickname
router.route('/:state/nickname')
    .get(verifyState, statesController.getNickname);

// GET /states/:state/population
router.route('/:state/population')
    .get(verifyState, statesController.getPopulation);

// GET /states/:state/admission
router.route('/:state/admission')
    .get(verifyState, statesController.getAdmission);

// GET /states/:state/funfact
router.route('/:state/funfact')
    .get(verifyState, statesController.getRandomFunFact);

module.exports = router;

// POST / PATCH / DELETE /states/:state/funfact
router.route('/:state/funfact')
    .post(verifyState, statesController.createFunFact)
    .patch(verifyState, statesController.updateFunFact)
    .delete(verifyState, statesController.deleteFunFact);


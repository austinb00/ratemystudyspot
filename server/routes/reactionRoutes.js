const express = require('express');
const reactionController = require('../controllers/reactionController');
const verifyJWT = require('../middleware/verifyJWT');
const router = express.Router();

router.get('/', reactionController.getReactions); // get reactions
router.post('/', verifyJWT, reactionController.createReaction) // create a reaction
router.put('/', verifyJWT, reactionController.updateReaction) // update a reaction
router.delete('/', verifyJWT, reactionController.deleteReaction); // delete a reaction

module.exports = router;
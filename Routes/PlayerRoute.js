import express from 'express';
import {
    createPlayerController,
    getAllPlayersController,
    getPlayerByIdController,
    updatePlayerController,
    updatePlayerStatusController,
    deletePlayerController,
    getPlayerByNumberController,
} from '../Controllers/PlayerController.js';
import fileHandler from '../middleware/FileHandler.js';
import { verifyToken, authorizeRoles, ROLES } from '../helper/Auth.js';

const playerRouter = express.Router();

playerRouter.use(verifyToken);
playerRouter.use(authorizeRoles(...ROLES.OPERATIONS));

playerRouter.post('/create', fileHandler(), createPlayerController);
playerRouter.get('/get-all', getAllPlayersController);
playerRouter.get('/get/:id', getPlayerByIdController);
playerRouter.put('/update-status/:id', updatePlayerStatusController);
playerRouter.put('/update/:id', fileHandler(), updatePlayerController);
playerRouter.delete('/delete/:id', deletePlayerController);
playerRouter.get('/by-phone', getPlayerByNumberController);

export default playerRouter;

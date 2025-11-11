import express from 'express';
import {
    createPlayerController,
    getAllPlayersController,
    getPlayerByIdController,
    updatePlayerController,
    deletePlayerController,
    getPlayerByNumberController,
} from '../Controllers/PlayerController.js';
import fileHandler from '../middleware/FileHandler.js';
import { verifyToken } from '../helper/Auth.js';

const playerRouter = express.Router();

playerRouter.use(verifyToken);

playerRouter.post('/create', fileHandler(), createPlayerController);
playerRouter.get('/get-all', getAllPlayersController);
playerRouter.get('/get/:id', getPlayerByIdController);
playerRouter.put('/update/:id', fileHandler(), updatePlayerController);
playerRouter.delete('/delete/:id', deletePlayerController);
playerRouter.get('/by-phone', getPlayerByNumberController);

export default playerRouter;
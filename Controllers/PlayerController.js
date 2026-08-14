import * as playerService from "../Services/PlayerService.js";
import { sendResponse } from "../helper/responseHelper.js";

export const createPlayerController = async (req, res) => {
    const { name,
        email,
        phone,
        gender,
        age
    } = req.body;

    const data = {
        name,
        email,
        phone,
        gender,
        age
    };

    if (req.files && req.files.profileImage && req.files.profileImage[0]) {
        data.profileImage = `/images/${req.files.profileImage[0].filename}`;
    }
    const result = await playerService.createPlayer(data);
    return sendResponse(res, result);
};

export const getAllPlayersController = async (req, res) => {
    const result = await playerService.getAllPlayers();
    return sendResponse(res, result);
}

export const getPlayerByIdController = async (req, res) => {
    const { id } = req.params;
    const result = await playerService.getPlayerById(id);
    return sendResponse(res, result);
}

export const updatePlayerController = async (req, res) => {
    const { id } = req.params;
    const { name,
        email,
        phone,
        gender,
        age
    } = req.body;

    const data = {
        name,
        email,
        phone,
        gender,
        age
    };

    if (req.files && req.files.profileImage && req.files.profileImage[0]) {
        data.profileImage = `/images/${req.files.profileImage[0].filename}`;
    }

    const result = await playerService.updatePlayer(id, data);
    return sendResponse(res, result);
}

export const deletePlayerController = async (req, res) => {
    const { id } = req.params;
    const result = await playerService.deletePlayer(id);
    return sendResponse(res, result);
}

export const getPlayerByNumberController = async (req, res) => {
    const { phone } = req.query;
    const result = await playerService.getPlayerByNumber(phone);
    return sendResponse(res, result);
}


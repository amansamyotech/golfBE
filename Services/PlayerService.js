import PlayerModel from "../Modals/PlayerModal.js";
import {
    AddedFailedMessages,
    AddedsuccessMessages,
    UpdatedsuccessMessages,
    notFound,
    DeletedsuccessMessages,
    requiredMessage,
    errorMessages,
    commonMessage,
} from "../Core/messages.js";
import { statusCodes } from "../Core/constant.js";
import { createResponse } from "../helper/responseHelper.js";

export const createPlayer = async (data) => {
    try {
        const existingPlayer = await PlayerModel.findOne({ phone: data.phone });

        if (existingPlayer) {
            return createResponse(statusCodes.CONFLICT, "Phone Number already exists");
        }

        const newPlayer = new PlayerModel(data);
        const saved = await newPlayer.save();

        return createResponse(
            statusCodes.CREATED,
            AddedsuccessMessages.PLAYER,
            saved
        );
    } catch (err) {
        console.error("Error creating player:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const getAllPlayers = async () => {
    try {
        const players = await PlayerModel.find().sort({ createdAt: -1 });

        return createResponse(
            statusCodes.OK,
            commonMessage.SUCCESS,
            players
        );
    } catch (err) {
        console.error("Error fetching players:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const getPlayerById = async (id) => {
    try {
        const player = await PlayerModel.findById(id);

        if (!player) {
            return createResponse(
                statusCodes.BAD_REQUEST,
                errorMessages.NOT_FOUND_PLAYER
            );
        }

        return createResponse(
            statusCodes.OK,
            commonMessage.SUCCESS,
            player
        );
    } catch (err) {
        console.error("Error fetching player:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const updatePlayer = async (id, data) => {
    try {
        const updated = await PlayerModel.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return createResponse(
                statusCodes.BAD_REQUEST,
                errorMessages.NOT_FOUND_PLAYER
            );
        }

        return createResponse(
            statusCodes.OK,
            UpdatedsuccessMessages.PLAYER,
            updated
        );
    } catch (err) {
        console.error("Error updating player:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const deletePlayer = async (id) => {
    try {
        const deleted = await PlayerModel.findByIdAndDelete(id);

        if (!deleted) {
            return createResponse(
                statusCodes.BAD_REQUEST,
                errorMessages.NOT_FOUND_PLAYER
            );
        }

        return createResponse(
            statusCodes.OK,
            DeletedsuccessMessages.PLAYER,
            deleted
        );
    } catch (err) {
        console.error("Error deleting player:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const getPlayerByNumber = async (phone) => {
    try {
        const player = await PlayerModel.findOne({ phone });

        if (!player) {
            return createResponse(
                statusCodes.BAD_REQUEST,
                notFound.NOT_FOUND_PLAYER
            );
        }

        return createResponse(
            statusCodes.OK,
            commonMessage.SUCCESS,
            player
        );
    } catch (err) {
        console.error("Error fetching player by phone:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};


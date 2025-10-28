import TournamentModel from "../Modals/TournamentModal.js";
import PlayerModel from "../Modals/PlayerModal.js";
import {
    AddedFailedMessages,
    AddedsuccessMessages,
    UpdatedsuccessMessages,
    notFound,
    DeletedsuccessMessages,
    requiredMessage,
    errorMessages,
    commonMessage
} from "../Core/messages.js";
import { statusCodes } from "../Core/constant.js";
import { createResponse } from "../helper/responseHelper.js";

export const createTournament = async (data) => {
    try {
        const newTournament = new TournamentModel(data);
        const saved = await newTournament.save();

        return createResponse(
            statusCodes.CREATED,
            AddedsuccessMessages.TOURNAMENT,
            saved
        );

    } catch (err) {
        console.error("Error creating tournament:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const getAllTournaments = async () => {
    try {
        const tournaments = await TournamentModel.find()
            .populate("course")
            .populate("participants");

        return createResponse(
            statusCodes.OK,
            commonMessage.SUCCESS,
            tournaments
        );
    } catch (err) {
        console.error("Error fetching tournaments:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const getTournamentById = async (id) => {
    try {
        const tournament = await TournamentModel.findById(id)
            .populate("course")
            .populate("participants");

        if (!tournament) {
            return createResponse(
                statusCodes.BAD_REQUEST,
                errorMessages.NOT_FOUND_TOURNAMENT
            );
        }

        return createResponse(
            statusCodes.OK,
            commonMessage.SUCCESS,
            tournament
        );
    } catch (err) {
        console.error("Error fetching tournament:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const updateTournament = async (id, data) => {
    try {
        const updated = await TournamentModel.findByIdAndUpdate(id, data, {
            new: true
        });

        if (!updated) {
            return createResponse(
                statusCodes.BAD_REQUEST,
                errorMessages.NOT_FOUND_TOURNAMENT
            );
        }

        return createResponse(
            statusCodes.OK,
            UpdatedsuccessMessages.TOURNAMENT,
            updated
        );
    } catch (err) {
        console.error("Error updating tournament:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const deleteTournament = async (id) => {
    try {
        const deleted = await TournamentModel.findByIdAndDelete(id);

        if (!deleted) {
            return createResponse(
                statusCodes.BAD_REQUEST,
                errorMessages.NOT_FOUND_TOURNAMENT
            );
        }

        return createResponse(
            statusCodes.OK,
            DeletedsuccessMessages.TOURNAMENT,
            deleted
        );
    } catch (err) {
        console.error("Error deleting tournament:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const assignPlayerToTheTournament = async (id, data) => {
    try {
        const tournament = await TournamentModel.findById(id);

        if (!tournament) {
            return createResponse(
                statusCodes.BAD_REQUEST,
                notFound.TOURNAMENT
            );
        }

        const player = await PlayerModel.findOne({ phone: data.phone });

        if (!player) {
            return createResponse(
                statusCodes.BAD_REQUEST,
                notFound.NOT_FOUND_PLAYER
            );
        }

        const alreadyExists = tournament.participants.includes(player._id);

        if (alreadyExists) {
            return createResponse(
                statusCodes.CONFLICT,
                "Player is already assigned to this tournament"
            );
        }

        tournament.participants.push(player._id);

        if (tournament.participantsRequired > 0) {
            tournament.participantsRequired -= 1;
        }

        if (tournament.status === "planned") {
            player.status = "enrolled";
        } else if (tournament.status === "ongoing") {
            player.status = "active";
        }

        await player.save();
        await tournament.save();

        return createResponse(
            statusCodes.CREATED,
            "Player assigned successfully",
            tournament
        );
    } catch (err) {
        console.error("Error assigning player to tournament:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};

export const changeTournamentStatus = async (id, newStatus) => {
    try {
        const tournament = await TournamentModel.findById(id);

        if (!tournament) {
            return createResponse(
                statusCodes.BAD_REQUEST,
                notFound.TOURNAMENT
            );
        }

        const updatedTournament = await TournamentModel.findByIdAndUpdate(
            id,
            { status: newStatus },
            { new: true }
        );

        return createResponse(
            statusCodes.OK,
            UpdatedsuccessMessages.TOURNAMENT,
            updatedTournament
        );

    } catch (err) {
        console.error("Error updating tournament status:", err);
        return createResponse(
            statusCodes.INTERNAL_SERVER_ERROR,
            errorMessages.INTERNAL_SERVER_ERROR
        );
    }
};











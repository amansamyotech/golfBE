import * as tournamentServices from "../Services/TournamentServices.js";
import { sendResponse } from "../helper/responseHelper.js";

export const createTournamentController = async (req, res) => {
    const result = await tournamentServices.createTournament(req.body);
    return sendResponse(res, result);
}

export const getAllTournamentsController = async (req, res) => {
    const result = await tournamentServices.getAllTournaments();
    return sendResponse(res, result);
}

export const getTournamentByIdController = async (req, res) => {
    const { id } = req.params;
    const result = await tournamentServices.getTournamentById(id);
    return sendResponse(res, result);
}

export const updateTournamentController = async (req, res) => {
    const { id } = req.params;
    const result = await tournamentServices.updateTournament(id, req.body);
    return sendResponse(res, result);
}

export const deleteTournamentController = async (req, res) => {
    const { id } = req.params;
    const result = await tournamentServices.deleteTournament(id);
    return sendResponse(res, result);
}

export const assignPlayerToTheTournament = async (req, res) => {
    const { id } = req.params;
    const result = await tournamentServices.assignPlayerToTheTournament(id, req.body);
    return sendResponse(res, result);
}

export const changeTournamentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const result = await tournamentServices.changeTournamentStatus(id, status);
    return sendResponse(res, result);
}
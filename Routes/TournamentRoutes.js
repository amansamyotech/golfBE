import express from "express";
import {
  createTournamentController,
  getAllTournamentsController,
  getTournamentByIdController,
  updateTournamentController,
  deleteTournamentController,
  assignPlayerToTheTournament,
  changeTournamentStatus,
} from "../Controllers/TournamentController.js";

const tournamentRouter = express.Router();

tournamentRouter.post("/create", createTournamentController);
tournamentRouter.get("/get-all", getAllTournamentsController);
tournamentRouter.get("/get/:id", getTournamentByIdController);
tournamentRouter.put("/update/:id", updateTournamentController);
tournamentRouter.delete("/delete/:id", deleteTournamentController);
tournamentRouter.post("/addPlayerOnTournament/:id", assignPlayerToTheTournament);
tournamentRouter.put("/update-status/:id", changeTournamentStatus);

export default tournamentRouter;


import express from "express";
import protectedRoute from "../middleware/protectedRoute.js";
import { getUsers } from "../controllers/user.controller.js";

const router = express.Router()

router.get("/", protectedRoute, getUsers)

export default router
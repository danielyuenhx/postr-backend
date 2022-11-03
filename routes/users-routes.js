// perform callback functions for different routes
import express from "express";

// callback functions stored in controllers folder
import {
  createUser,
  loginUser,
  deleteUser,
  getUser,
  pinPost,
} from "../controllers/users-controllers.js";
import auth from '../middleware/auth.js'

const router = express.Router();

router.post("/createUser", createUser);
router.post("/loginUser", loginUser);
router.delete('/:id', auth, deleteUser);
router.get("/:username", getUser);
router.post("/pinPost", auth, pinPost);

export default router;

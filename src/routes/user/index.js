import { Router } from "express"

// -----------------------------------------------------------------------------------------

import { createUser, deletedUser, getUserByEmail, getUserById, getUsers, updatedUserById, changeUserRole} from "../../controllers/user/index.js"

// -----------------------------------------------------------------------------------------

const router = Router();

// -----------------------------------------------------------------------------------------

router.post("/", createUser);

router.get("/", getUsers);

router.get("/:email", getUserByEmail);

router.get("/id/:id", getUserById);

router.put("/users/:id", updatedUserById);

router.delete("/:id", deletedUser);

router.get("/premium/:uid", changeUserRole);

// -----------------------------------------------------------------------------------------

export default router;
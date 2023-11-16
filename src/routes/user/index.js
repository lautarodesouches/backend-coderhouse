import { Router } from "express"
import multer from 'multer'

// -----------------------------------------------------------------------------------------

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, `uploads/${file.fieldname}s/`),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})

const upload = multer({
    storage,
    limits: {
        files: 5
    }
})

// -----------------------------------------------------------------------------------------

import { createUser, deletedUser, getUserByEmail, getUserById, getUsers, updateUserById, changeUserRole, addDocuments } from "../../controllers/user/index.js"

// -----------------------------------------------------------------------------------------

const router = Router();

// -----------------------------------------------------------------------------------------

router.post("/", createUser);

router.get("/", getUsers);

router.get("/:email", getUserByEmail);

router.get("/id/:id", getUserById);

router.put("/users/:id", updateUserById);

router.delete("/:id", deletedUser);

router.get("/premium/:uid", changeUserRole);

router.post("/:uid/documents", upload.single('document'), addDocuments)

// -----------------------------------------------------------------------------------------

export default router;
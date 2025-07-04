import express from "express"
import AppController from "../controllers/AppController.js"
import UsersController from "../controllers/UsersController.js"
import AuthController from "../controllers/AuthController.js"
import FilesController from "../controllers/FilesController.js"

const router = express.Router()

// App routes
router.get("/status", AppController.getStatus)
router.get("/stats", AppController.getStats)

// User routes
router.post("/users", UsersController.postNew)
router.get("/users/me", UsersController.getMe)

// Auth routes
router.get("/connect", AuthController.getConnect)
router.get("/disconnect", AuthController.getDisconnect)

// File routes
router.post("/files", FilesController.postUpload)
router.get("/files/:id", FilesController.getShow)
router.get("/files", FilesController.getIndex)
router.put("/files/:id/publish", FilesController.putPublish)
router.put("/files/:id/unpublish", FilesController.putUnpublish)
router.get("/files/:id/data", FilesController.getFile)

export default router

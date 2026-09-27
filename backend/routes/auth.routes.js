
const express = require("express")
const { register, login, getMe, logout } = require("../controller/auth.controller.js")
const { authorize } = require("../middleware/auth.middleware.js")
const authRouter = express.Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/getme", authorize, getMe)
authRouter.get("/logout", logout)

module.exports = authRouter

const router = require("express").Router();

const {
    login,
    register,
    logOut,
    accountRecovery,
    changePassword,
    recoveryPasswordChange
} = require("../controller/auth");

router.post("/login", login);
router.post("/register", register);
router.get("/logout", logOut);
router.post("/recover", accountRecovery)
router.post("/changepassword", changePassword)
router.get("/accountRecovery", recoveryPasswordChange)

module.exports = router;
const {Router} = require ("express");
const ctrl = require("../controllers/userController")

const router = Router();

router.get("/", ctrl.getUsers)

module.exports = router
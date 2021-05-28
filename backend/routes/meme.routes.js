const router = require("express").Router();
const controller = require("../controllers/meme.controller");
const { authJwt } = require("../middlewares");

router.get("/:category", controller.getAll);
router.get("/getById/:meme_id", controller.findOne);
router.post("", [authJwt.verifyToken], controller.create);
router.put("/:meme_id", [authJwt.verifyToken], controller.update);
router.put("/like/:meme_id", [authJwt.verifyToken], controller.like);
router.put("/unlike/:meme_id", [authJwt.verifyToken], controller.dislike);
router.put("/removelike/:meme_id", [authJwt.verifyToken], controller.removeLike);
router.put("/removeunlike/:meme_id", [authJwt.verifyToken], controller.removeUnlike);
router.delete("/:meme_id", [authJwt.verifyToken], controller.delete);

module.exports = router;
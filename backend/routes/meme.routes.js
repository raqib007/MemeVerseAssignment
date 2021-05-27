const router = require("express").Router();
const controller = require("../controllers/meme.controller");

router.get("", controller.getAll);
router.get("/:meme_id", controller.findOne);
router.post("", controller.create);
router.put("/:meme_id",  controller.update);
router.delete("/:meme_id",  controller.delete);

module.exports = router;
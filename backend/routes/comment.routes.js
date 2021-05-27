const router = require("express").Router();
const controller = require("../controllers/comment.controller");

router.get("", controller.getAll);
router.get("/:commentId", controller.findOne);
router.post("", controller.create);
router.put("/:commentId",  controller.update);
router.delete("/:commentId",  controller.delete);

module.exports = router;
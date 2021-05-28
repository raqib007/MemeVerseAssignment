const router = require("express").Router();
const controller = require("../controllers/comment.controller");

router.get("", controller.getAll);
router.get("/:comment_id", controller.findOne);
router.post("", controller.create);
router.put("/:comment_id",  controller.update);
router.delete("/:comment_id",  controller.delete);

module.exports = router;
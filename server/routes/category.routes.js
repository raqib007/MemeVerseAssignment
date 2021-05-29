const router = require("express").Router();
const controller = require("../controllers/category.controller");

router.get("", controller.getAll);
router.get("/:categoryId", controller.findOne);
router.post("", controller.create);
router.put("/:categoryId",  controller.update);
router.delete("/:categoryId",  controller.delete);
router.delete("/", controller.deleteAll);

module.exports = router;
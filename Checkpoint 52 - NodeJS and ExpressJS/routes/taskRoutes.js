const express = require("express");
const taskController = require("../controllers/taskController");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// Protect all task routes with JWT cookie verification
router.use(verifyToken);

router.route("/")
  .post(taskController.createTask)
  .get(taskController.getMyTasks);

router.route("/:id")
  .delete(taskController.deleteTask);

module.exports = router;
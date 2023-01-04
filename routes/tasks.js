const taskRouter = require('express').Router();
const { getTasks, getTaskById, createTask, updateTaskById, deleteTaskById } = require('../controllers/task.controller');

// get all tasks
taskRouter.get("/", getTasks);

// get task by id
taskRouter.get("/:id", getTaskById);

// create task
taskRouter.post("/create", createTask);

// update task by id
taskRouter.put("/:id", updateTaskById);

// delete task by id
taskRouter.delete("/:id", deleteTaskById);

module.exports = taskRouter;
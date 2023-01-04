const TaskModel = require('../models/tasks');

async function getTasks(req, res, next) {
    try {
        // get user id
        const userId = req.user._id;

        // getting related user tasks
        const tasks = await TaskModel.find({ user: userId }).sort({ _id: -1 });
        return res.json(tasks);
    } catch (error) {
        next(error);
    }
}

async function getTaskById(req, res, next) {
    try {
        // get user id
        const userId = req.user._id;

        // get task id
        const taskId = req.params.id;

        // get task by id
        const task = await TaskModel.findOne({ user: userId, _id: taskId });
        if (!task) throw { status: 404, message: "task not found" };
        return res.json(task);
    } catch (error) {
        next(error);
    }
}

async function createTask(req, res, next) {
    try {
        const { title, description, category, user = req.user._id, status = "pending" } = req.body;

        // create task
        const createTask = await TaskModel.create({ title, description, category, user, status });
        if (createTask) {
            return res.json(createTask);
        } else {
            throw { status: 500, message: "there was an error creating the desired task" }
        }
    } catch (error) {
        next(error);
    }
}

async function updateTaskById(req, res, next) {
    try {
        // get user id
        const userId = req.user._id;

        // get task id
        const taskId = req.params.id;

        // get task by id
        const task = TaskModel.findOne({ _id: taskId, user: userId });
        if (!task) throw { status: 404, message: "task not found" };

        // pouring the sent information into the data variable
        const data = { ...req.body };

        // datas validator
        Object.entries(data).forEach(([key, value]) => {
            if (!value || ["", " ", ".", null, undefined].includes(value)) {
                throw { status: 400, message: "please enter valid value" }
            } else if (!["title", "description", "category"].includes(key)) {
                throw { status: 400, message: "please enter valid keys" }
            }
        })

        // update task by id
        const updateTask = await TaskModel.updateOne({ _id: taskId }, { $set: data })
        if (updateTask.modifiedCount > 0) {
            return res.json({ status: 200, message: "task updated successfully" })
        } else {
            throw { status: 500, message: "task to update user" }
        }
    } catch (error) {
        next(error);
    }
}

async function deleteTaskById(req, res, next) {
    try {
        // get user id
        const userId = req.user._id;

        // get task id
        const taskId = req.params.id;

        // get task by task id and user id
        const task = await TaskModel.findOne({ _id: taskId, user: userId });
        if (!task) throw { status: 404, message: "task not found" };

        // remove task
        const removeTask = await TaskModel.deleteOne({ _id: taskId });
        if (removeTask.deletedCount > 0) {
            return res.json({
                status: 200,
                message: "the task was successfully deleted"
            })
        } else {
            throw { status: 500, message: "failed to delete task" }
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTaskById,
    deleteTaskById,
}
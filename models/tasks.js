const { Schema, model, Types } = require("mongoose");

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: undefined },
    user: { type: Types.ObjectId, required: true },
    status: { type: String, default: "pending" },
    category: { type: String, default: "" },
}, { timestamps: true });

const TaskModel = model("tasks", TaskSchema);

module.exports = TaskModel;
const express = require('express');
const { notFound, expressErrorHandler } = require('./module/errorHandler');
const mongoose = require('mongoose');
const path = require('path');
const routes = require('./routes/router');

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/task-manager", (error) => {
    if (!error) console.log("connection established to database");
});

const app = express();

require('dotenv').config();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")))

// all routes
app.use("/", routes)

// express error handling
app.use(expressErrorHandler)

// handling not found error
app.use(notFound)

// listening application on port 3500
app.listen(3500, () => {
    console.log("server listening on port 3500");
})
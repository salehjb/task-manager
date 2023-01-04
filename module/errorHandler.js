function notFound(req, res, next) {
    return res.status(404).json({
        status: 404,
        message: "page not found",
        success: false,
    })
}

function expressErrorHandler(error, req, res, next) {
    const status = error?.status || 500;
    const message = error?.message || "internal server error";

    return res.status(status).json({
        status,
        message,
        success: false,
    })
}

module.exports = {
    notFound,
    expressErrorHandler,
}
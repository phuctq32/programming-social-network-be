const errorHandler = (error, req, res, next) => {
    const { statusCode } = error;
    res.status(statusCode || 500).json({ error });
}

export default errorHandler;
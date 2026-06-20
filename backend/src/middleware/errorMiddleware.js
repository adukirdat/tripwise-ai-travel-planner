export const notFound = (req, _res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (error, _req, res, _next) => {
  let statusCode = error.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  let message = error.message || "Server error.";

  if (error.name === "CastError") {
    statusCode = 404;
    message = "Resource not found.";
  }

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((value) => value.message)
      .join(" ");
  }

  if (error.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(error.keyValue || {})[0] || "field";
    message = `An account with that ${duplicateField} already exists.`;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack
  });
};

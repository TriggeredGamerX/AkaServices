// Import necessary modules
const express = require('express');

// Create the custom error handler middleware
function errorHandler(err, req, res, next) {
    console.error(err.stack); // Log the error stack for debugging purposes
    res.status(500).send('Something went wrong!'); // Send a generic error response
}

module.exports = errorHandler;

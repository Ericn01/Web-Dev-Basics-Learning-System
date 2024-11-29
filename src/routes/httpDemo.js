const express = require('express');
const router = express.Router();

/**
 * GET demonstration endpoint
 * Shows a basic GET request with informational response
 */
router.get('/http-demo', (req, res) => {
  try {
    // Educational response object
    const response = {
      success: true,
      message: "This is a response from a GET request",
      request: {
        method: "GET",
        headers: req.headers,
        url: req.originalUrl,
        timestamp: new Date().toISOString()
      },
      explanation: {
        purpose: "GET requests are used to retrieve data from a server",
        characteristics: [
          "Data is sent through URL parameters",
          "Requests can be cached",
          "Should not modify server data",
          "Idempotent (same request always returns same result)"
        ]
      }
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred processing the GET request",
      error: error.message
    });
  }
});

/**
 * POST demonstration endpoint
 * Shows how POST requests handle data and return responses
 */
router.post('/http-demo', (req, res) => {
  try {
    // Extract data from request body
    const receivedData = req.body.data || '';

    // Educational response object
    const response = {
      success: true,
      message: "This is a response from a POST request",
      request: {
        method: "POST",
        headers: req.headers,
        body: receivedData,
        url: req.originalUrl,
        timestamp: new Date().toISOString()
      },
      receivedData: {
        content: receivedData,
        length: receivedData.length,
        type: typeof receivedData
      },
      explanation: {
        purpose: "POST requests are used to send data to a server",
        characteristics: [
          "Data is sent in the request body",
          "Requests are not cached by default",
          "Can modify server data",
          "Not idempotent (same request might give different results)"
        ]
      }
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred processing the POST request",
      error: error.message
    });
  }
});

module.exports = router;
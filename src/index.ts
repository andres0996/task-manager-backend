/**
 * Entry point of the backend server.
 * 
 * Imports the Express application and starts the HTTP server on the specified port.
 * The port is taken from the environment variable `PORT` if available; otherwise, defaults to 3000.
 */

import app from './app';

/**
 * Port where the server will listen for incoming requests.
 */
const PORT = process.env.PORT || 3000;

/**
 * Starts the Express server and listens on the configured port.
 * Logs a message to the console indicating the server URL.
 */
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
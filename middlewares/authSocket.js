const jwt = require("jsonwebtoken");

const config = process.env;

const verifyTokenSocket = (socket, next) => {
  console.log("Incoming socket connection:", socket.id);

  // Retrieve token from socket handshake auth
  const token = socket.handshake.auth?.token;

  if (!token) {
    const socketError = new Error("NOT_AUTHORIZED: Token missing");
    return next(socketError);
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    
    // Attach user info to socket object
    socket.user = decoded;

    next(); // continue to socket connection
  } catch (err) {
    console.error("Socket auth failed:", err.message);

    const socketError = new Error("NOT_AUTHORIZED: Invalid or expired token");
    return next(socketError);
  }
};

module.exports = verifyTokenSocket;

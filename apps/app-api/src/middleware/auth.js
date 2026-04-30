const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            error: "Invalid token"
        });
    }
};

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      if (
        roles.length &&
        !roles.includes(decoded.role)
      ) {
        return res.status(403).json({
          error: "Forbidden",
        });
      }

      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({
        error: "Invalid token",
      });
    }
  };
};

module.exports = {
    verifyToken,
    auth
};
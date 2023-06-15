import JWT from "jsonwebtoken";
import userModel from "../models/user.model.js";

const tokenDecode = (req) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader) {
      const accessToken = authorizationHeader.split(" ")[1];

      return JWT.verify(accessToken, process.env.TOKEN_ACCESS_SECRET);
    }

    return false;
  } catch (err) {
    return false;
  }
};

const auth = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);

  if (!tokenDecoded)
    return res.status(401).json("Access Denied:Not authorized!");

  const user = await userModel.findById(tokenDecoded.data);
  if (!user)
    return res.status(401).json({ message: "Access Denied:Not authorized!" });

  req.user = user;

  next();
};

const authAdmin = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);

  if (!tokenDecoded)
    return res.status(401).json("Access Denied:Not authorized!");

  const user = await userModel.findById(tokenDecoded.data);
  if (!user) return res.status(401).json("Access Denied:Not authorized!");

  if (user.role != "admin")
    return res.status(401).json("Access Denied:Not authorized!");

  req.user = user;

  next();
};

export default { auth, authAdmin };

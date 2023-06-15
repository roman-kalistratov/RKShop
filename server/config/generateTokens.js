import JWT from "jsonwebtoken";

const generateTokens = (payload) => {
  const accessToken = JWT.sign(payload, process.env.TOKEN_ACCESS_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = JWT.sign(payload, process.env.TOKEN_REFRESH_SECRET, {
    expiresIn: "30d",
  });
  return {
    accessToken,
    refreshToken,
  };
};

const generateResetToken = (payload) => {
  const resetToken = JWT.sign(
    payload,
    process.env.TOKEN_RESET_PASSWORD_SECRET,
    {
      expiresIn: "10m",
    }
  );

  return {
    resetToken,
  };
};

export default { generateTokens, generateResetToken };

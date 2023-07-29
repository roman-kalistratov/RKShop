import nodemailer from "nodemailer";

const sendEmail = async (to, link) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Reset password " + process.env.API_URL,
      text: "",
      html: `<div>
                    <h1>Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now.</h1>
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                    <a href="${process.env.CLIENT_URL}/reset-password/${link}/">${link}</a>
                </div>`,
    });
  } catch (err) {
    throw new Error(err);
  }
};

export default sendEmail;

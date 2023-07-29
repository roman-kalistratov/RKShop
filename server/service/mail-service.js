import sgMail from "@sendgrid/mail";

const sendEmail = async (to, link) => {
  try {
    sgMail.setApiKey(
      "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"
    );

    const msg = {
      to: to,
      from: process.env.SMTP_USER, 
      subject: "Reset Password",
      html: `<div>
      <h2>Please follow this link to reset Your Password. This link is valid till 10 minutes from now.</h2>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <a href="${process.env.CLIENT_URL}/reset-password/${link}/">${link}</a>
            </div>`,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log("Email sent successfully");
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    throw new Error(err);
  }
};

export default sendEmail;

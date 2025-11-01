import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendMail({ to , html , text , subject }) {
  try {
    await transporter.sendMail({
      from: `"Cod-en Team" <${process.env.EMAIL_USER}>`,
      to,
      text,
      html,
      subject,
    });
    return true;
  } catch (err) {
    console.error("Email send failed:", err);
    return false;
  }
}

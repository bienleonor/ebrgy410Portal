import { transporter } from "./config/mail.js";

async function test() {
  await transporter.sendMail({
    from: `"Bebi" <${process.env.SMTP_USER}>`,
    to: "ma.thereseespino20@gmail.com",
    subject: "Lambing",
    text: "I love you more😘💓💞",
  });

  console.log("Email sent successfully");
}

test();

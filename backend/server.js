// server.js

const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const port = process.env.PORT || 5001;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.json());

app.post("/api/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  // Create a Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "balkhandeyash235@gmail.com", // Replace with your email
      pass: "qpna cwut khvc ixgc", // Replace with your email password
    },
  });

  // Setup email data
  const mailOptions = {
    from: "balkhandeyash235@gmail.com", // sender email address
    to: "balkhandeyash235@gmail.com", // recipient email address
    subject: "New Contact Form Submission",
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  try {
    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

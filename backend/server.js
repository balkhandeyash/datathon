// server.js

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const nodemailer = require("nodemailer");
const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI =
  "mongodb+srv://root:root@cluster0.mdcnw2v.mongodb.net/UserData?retryWrites=true&w=majority"; // Replace with your MongoDB Atlas connection string

mongoose.set("strictQuery", false);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB database");
});

const User = mongoose.model("User", {
  name: String,
  username: String,
  password: String,
  email: String,
  otp: String,
  otpTimestamp: Number,
});

const Job = mongoose.model("Job", {
  job_id: String,
  title: String,
  description: String,
  location: String,
  companyName: String,
  link: String,
  // Add other fields as needed based on your API response
});

app.use(cors());
app.use(bodyParser.json());

const secretKey = "Iamyashrajeshbalkhandecsestudent"; // Replace with your secret key

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "balkhandeyash235@gmail.com", // Replace with your email
    pass: "qpna cwut khvc ixgc", // Replace with your email password
  },
});

// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP via email
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: "balkhandeyash235@gmail.com", // Replace with your email
    to: email,
    subject: "OTP Verification",
    text: `Your OTP for registration is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Function to check if OTP is valid within the specified timeframe (5 minutes)
const isOtpValid = (timestamp) => {
  const currentTime = Date.now();
  const expirationTime = timestamp + 5 * 60 * 1000; // 5 minutes in milliseconds

  return currentTime <= expirationTime;
};

app.post("/login-otp", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = generateOTP();

    // Save the OTP and timestamp to the user's document in the database
    const timestamp = Date.now();
    await User.findOneAndUpdate(
      { username },
      { $set: { otp, otpTimestamp: timestamp } }
    );

    // Send OTP to the provided email
    await sendOtpEmail(user.email, otp);

    res
      .status(200)
      .json({ message: "OTP sent successfully", email: user.email });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Error sending OTP" });
  }
});

app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a 6-digit OTP
    const otp = generateOTP();

    // Save the OTP and timestamp to the user's document in the database
    const timestamp = Date.now();
    await User.findOneAndUpdate(
      { email },
      { $set: { otp, otpTimestamp: timestamp } }
    );

    // Send OTP to the provided email
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Error sending OTP" });
  }
});

app.get("/", async (req, res) => {
  const { username, password } = req.body;
  const existingUser = await User.find({ username: "yash" });

  res.send("Hello, World!");
  console.log(existingUser);
});

/*app.get("/login", async (req, res) => {
  //res.send("This is the login page"); // You can send an HTML file or render a login page here

  const existingUser = await Job.find({}, {});
  //console.log(existingUser);
  res.send(existingUser);
});*/


app.post("/register", async (req, res) => {
  try {
    const { name, username, password, captchaResponse, email, otp } = req.body;
    const existingUser = await User.findOne({ username });

    // Verify OTP length
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      return res.status(400).json({ error: "Invalid OTP format" });
    }

    // Verify OTP and timestamp
    const user = await User.findOne({ email, otp });

    if (existingUser) {
      // If username already exists, return an error response
      return res.status(400).json({ error: "Username already exists" });
    }

    const recaptchaSecretKey = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${captchaResponse}`;

    const googleResponse = await axios.post(verificationURL);
    const { success } = googleResponse.data;

    if (!success) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    console.log("Registration request data:", req.body);

    // If username is unique, create a new user and save it in the database
    const hashedPassword = await bcrypt.hashSync(password, 10);
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      email,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registering user" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password, captchaResponse } = req.body;
    const user = await User.findOne({ username: req.body.username });
    console.log("Pass : ", password, " Hash : ", user.password);

    const recaptchaSecretKey = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";
    const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${captchaResponse}`;

    const googleResponse = await axios.post(verificationURL);
    const { success } = googleResponse.data;

    if (!success) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    if (!user || !bcrypt.compareSync(password, user.password)) {
      console.log("Inside Conditon");
      return res.status(401).send("Invalid credentials.");
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      secretKey,
      {
        expiresIn: "5h",
      }
    );

    res.status(200).json({ message: "Success", token });
  } catch (error) {
    res.status(500).send("Error logging in.");
  }
});

app.post("/LandingPage", async (req, res) => {});

function verifyToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

app.get("/api/user", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch user details from the database based on the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return user details in the response
    res.status(200).json({
      username: user.username,
      name: user.name,
      email: user.email,
      // Add other user details as needed
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Error fetching user details" });
  }
});

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

app.put("/api/user", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch the user from the database based on the userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user details with the data from the request body
    user.username = req.body.username || user.username;
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Save the updated user details in the database
    await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      username: user.username,
      name: user.name,
      email: user.email,
      // Add other user details as needed
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Error updating user profile" });
  }
});

app.get("/jobs", async (req, res) => {
  try {
    const options = {
      method: "GET",
      url: "https://jsearch.p.rapidapi.com/search",
      params: {
        query: "Python developer in Texas, USA",
        page: "2",
        num_pages: "2",
      },
      headers: {
        "X-RapidAPI-Key": "d5426ca53amshe5ccee5cb130524p125d11jsn9a55bc5d61af",
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    };

    const response = await axios.request(options);

    console.log("API Response:", response.data);

    if (response.status === 200) {
      const jobsData = response.data.data;

      if (Array.isArray(jobsData)) {
        for (const job of jobsData) {
          // Check if a job with the same job_id already exists in the database
          const existingJob = await Job.findOne({ job_id: job.job_id });

          if (!existingJob) {
            const jobToSave = {
              job_id: job.job_id || "N/A",
              title: job.job_title || "N/A",
              description: job.job_description || "N/A",
              location: `${job.job_city || "N/A"}, ${job.job_state || "N/A"}, ${
                job.job_country || "N/A"
              }`,
              companyName: job.employer_name || "N/A",
              link: job.job_apply_link || "N/A",
              // Add other fields as needed
            };

            // Save the job to MongoDB
            await Job.create(jobToSave);
          }
        }

        res
          .status(200)
          .json({ message: "Jobs data fetched and stored successfully" });
      } else {
        // Check if a single job with the same job_id already exists in the database
        const existingJob = await Job.findOne({ job_id: jobsData.job_id });

        if (!existingJob) {
          const singleJob = {
            job_id: jobsData.job_id || "N/A",
            title: jobsData.job_title || "N/A",
            description: jobsData.job_description || "N/A",
            location: `${jobsData.job_city || "N/A"}, ${
              jobsData.job_state || "N/A"
            }, ${jobsData.job_country || "N/A"}`,
            companyName: jobsData.employer_name || "N/A",
            link: jobsData.job_apply_link || "N/A",
            // Add other fields as needed
          };

          // Save the single job to MongoDB
          await Job.create(singleJob);
        }

        res
          .status(200)
          .json({ message: "Job data fetched and stored successfully" });
      }
    } else {
      console.error("Error fetching job data");
      res.status(500).json({ error: "Error fetching job data" });
    }
  } catch (error) {
    console.error("Error fetching or storing job data:", error);

    if (error.name === "MongoError") {
      console.error("MongoDB Error:", error.message);
    }

    res.status(500).json({ error: "Error fetching or storing job data" });
  }
});

app.get("/applyJobs", async (req, res) => {
  //res.send("This is the login page"); // You can send an HTML file or render a login page here

  const existingUser = await Job.find({}, {});
  //console.log(existingUser);
  res.send(existingUser);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

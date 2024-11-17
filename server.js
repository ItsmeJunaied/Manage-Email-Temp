// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config(); 

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


app.post('/send-email', (req, res) => {
  const { to, name, verificationLink, companyName, membersCount } = req.body;


  ejs.renderFile(path.join(__dirname, 'emailTemplate.ejs'), {
    name,
    verificationLink,
    companyName,
    membersCount,
  }, (err, html) => {
    if (err) {
      console.error('Error rendering template:', err);
      return res.status(500).send('Error rendering template');
    }


    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to, 
      subject: 'Welcome to Manage!', 
      html,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).send('Error sending email');
      }
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

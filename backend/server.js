require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();
const PORT = 5005;

app.use(bodyParser.json());
app.use(cors());

// Mailchimp Configuration
mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_SERVER_PREFIX,
});

const listId = process.env.MAILCHIMP_LIST_ID;

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  try {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: "subscribed",
    });
    res.status(200).json({ message: "Subscription successful!", data: response });
  } catch (error) {
    res.status(500).json({ message: "Subscription failed", error: error.response.text });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

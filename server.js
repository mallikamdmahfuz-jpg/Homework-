const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// ✅ OpenAI API key yahan daalo (apni key)
const OPENAI_API_KEY = "AIzaSyA8ht9e462uMNiRdKLNzvrEpRt6DeUr9QM";

// Home route
app.get("/", (req, res) => {
  res.send("✅ SmartHomeworkAI Server is running fine!");
});

// Main AI route
app.post("/solve", async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question not provided" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a homework solver that explains answers clearly for all subjects." },
          { role: "user", content: question }
        ],
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ answer: data.choices[0].message.content });
    } else {
      res.json({ error: "No response from AI" });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error, try again later." });
  }
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
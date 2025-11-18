import axios from "axios";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"



export const getNews = async (req, res) => {
  try {
    const query = "health care india";
    const apiKey = process.env.NEWS_API;

    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        query
      )}&sortBy=publishedAt&language=en&apiKey=${apiKey}`
    );

    return res.status(200).json({
      message: "News fetched successfully",
      totalResults: response.data.totalResults,
      articles: response.data,
    });
  } catch (error) {
    console.error("Failed to fetch news:", error.message);
    return res.status(500).json({ message: "Failed to fetch news" });
  }
};

export const getHealthTips = async (req, res) => {
  try {
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0.2,
      maxRetries: 2,
    });

    const aiMsg = await llm.invoke([
      {
        role: "system",
        content:
          "You are an assistant that shares 1 short useful health tip of the day.and dont include any of the extra text  ",
      },
      {
        role: "user",
        content: "Give me today's health tip.",
      },
    ]);

    return res.status(200).json({
      message: "Health tip generated successfully",
      tip: aiMsg.content,
    });
  } catch (error) {
    console.error("Error generating health tip:", error);
    return res.status(500).json({
      message: "Failed to generate health tip",
      error: error.message,
    });
  }
};

export const chatbot = async (req, res) => {
  try {
    const { message } = req.body;
    const user  = req.user;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      temperature: 0.3,
      maxRetries: 2,
      apiKey: process.env.GOOGLE_API_KEY,
    });

    
    const systemPrompt = `
    You are a Healthcare AI Assistant.
    You provide safe, helpful, Indian-context health information.
    Avoid diagnosing diseases, and this is the user history User Allergies: ${user.allergies?.join(", ") || "None"}
    User Medications: ${user.medications?.join(", ") || "None"}
    Focus on lifestyle, nutrition, sleep, stress, habits, and preventive care.
    Keep responses concise and easy to follow. if , the issue seems serious then , just tell the user to consult to a user `;

    // Correct Message Format
    const aiResponse = await llm.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ]);

    const output =
      aiResponse?.content?.[0]?.text || aiResponse?.content || "No response.";

    return res.status(200).json({
      success: true,
      reply: output,
    });
  } catch (err) {
    console.error("HealthChatbot Error:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to generate AI response",
    });
  }
};
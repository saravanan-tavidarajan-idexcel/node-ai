const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.TOKEN);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.model = model;
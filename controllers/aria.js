const Groq = require("groq-sdk")
const { asyncHandler, AppError, sendSuccess } = require("../utils/api")

let client = null

function getAriaClient() {
   if (!process.env.GROQ_API_KEY) {
      throw new AppError("GROQ_API_KEY is not configured", 500)
   }

   if (!client) {
      client = new Groq({
         apiKey: process.env.GROQ_API_KEY
      })
   }

   return client
}

const handleAriaChat = asyncHandler(async (req, res) => {
   const { message } = req.body

   const response = await getAriaClient().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
         {
            role: "system",
            content: "You are Aria, a coaching assistant for JEE/NEET students. You help them with weak subjects and keep them on track. Importantly, you should act as a friendly and motivating companion. Always include a short motivational quote or a lighthearted academic joke in your responses to keep the student motivated and destressed. Keep your overall response concise and encouraging."
         },
         { role: "user", content: message }
      ]
   })

   const reply = response.choices && response.choices[0] && response.choices[0].message && response.choices[0].message.content

   if (!reply) {
      throw new AppError("Aria did not return a reply", 502)
   }

   return sendSuccess(res, { reply }, "Aria reply generated")
})

module.exports = { handleAriaChat }

const Groq = require("groq-sdk")

const SYSTEM_PROMPT =
   "You are Aria, a coaching assistant for JEE/NEET students. You help them with weak subjects and keep them on track. Importantly, you should act as a friendly and motivating companion. Always include a short motivational quote or a lighthearted academic joke in your responses to keep the student motivated and destressed. Keep your overall response concise and encouraging."

let client = null

/**
 * Lazy-initialise the Groq SDK client.
 * Throws if GROQ_API_KEY is missing.
 */
function getAriaClient() {
   if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured")
   }

   if (!client) {
      client = new Groq({ apiKey: process.env.GROQ_API_KEY })
   }

   return client
}

/**
 * Send a single user message to Aria and return the reply string.
 * @param {string} message - The user's message
 * @returns {Promise<string>} Aria's reply text
 */
async function generateAriaReply(message) {
   const response = await getAriaClient().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [
         { role: "system", content: SYSTEM_PROMPT },
         { role: "user", content: message }
      ]
   })

   const reply =
      response.choices &&
      response.choices[0] &&
      response.choices[0].message &&
      response.choices[0].message.content

   if (!reply) {
      throw new Error("Aria did not return a reply")
   }

   return reply
}

module.exports = { getAriaClient, generateAriaReply, SYSTEM_PROMPT }

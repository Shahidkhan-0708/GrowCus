const User = require("../models/User")

const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || ""
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN || ""

/**
 * Send a WhatsApp message to a phone number via the configured API.
 * Replace the fetch body/headers with your actual WhatsApp Business API or Twilio format.
 *
 * @param {string} phone - Recipient phone number (with country code)
 * @param {string} message - Message text to send
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
async function sendWhatsAppMessage(phone, message) {
   if (!WHATSAPP_API_URL) {
      console.warn("[WhatsApp] WHATSAPP_API_URL is not configured — message not sent.")
      return { success: false, error: "WhatsApp API URL not configured" }
   }

   try {
      const response = await fetch(WHATSAPP_API_URL, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${WHATSAPP_API_TOKEN}`
         },
         body: JSON.stringify({
            phone,
            message
         })
      })

      if (!response.ok) {
         const errorText = await response.text()
         console.error("[WhatsApp] API error:", response.status, errorText)
         return { success: false, error: `API responded with ${response.status}` }
      }

      return { success: true }
   } catch (error) {
      console.error("[WhatsApp] Failed to send message:", error.message)
      return { success: false, error: error.message }
   }
}

/**
 * Look up a student's parent phone and send them a WhatsApp message.
 *
 * @param {string} studentId - The student's User _id
 * @param {string} message - Message text to send
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
async function notifyParent(studentId, message) {
   const student = await User.findById(studentId).select("parentPhone name").lean()

   if (!student) {
      return { success: false, error: "Student not found" }
   }

   if (!student.parentPhone) {
      return { success: false, error: "No parent phone number on file" }
   }

   const phone = String(student.parentPhone)
   const formattedMessage = `[Growcus] Regarding ${student.name}: ${message}`

   return sendWhatsAppMessage(phone, formattedMessage)
}

module.exports = {
   sendWhatsAppMessage,
   notifyParent
}

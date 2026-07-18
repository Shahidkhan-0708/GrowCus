# Feature: Aria AI Assistant

Aria is the built-in conversational AI assistant designed to help students with academic queries, provide motivation, and summarize their tasks.

## Business Logic

Aria is powered by the **Llama-3** language model, accessed via the **Groq SDK** for ultra-low latency inference.

### Execution Flow
1. The frontend student client sends a message string to `POST /aria/chat`.
2. The `ariaLimiter` ensures the student isn't spamming the expensive AI endpoint.
3. The `aria.js` controller receives the request.
4. **Context Injection**: 
   - The controller could optionally fetch the student's upcoming tasks or recent scores to inject into the LLM's system prompt (allowing Aria to say "I noticed you have a math test tomorrow...").
5. The controller calls `groq.chat.completions.create()`.
6. The resulting string is sent back to the client.

## Code References

- **Routes**: `routes/aria.js`
- **Controller**: `controllers/aria.js` (`ariaChat`)
- **Dependencies**: `groq-sdk`

## Security Considerations

- **Prompt Injection**: Students might attempt to jailbreak Aria. The system prompt must strictly constrain Aria's behavior to academic contexts.
- **Cost Management**: Groq API calls cost money. The environment variable `RL_ARIA_MAX` in `.env` sets the rate limit threshold specifically for this endpoint to prevent abuse.

---

**Related:**
- [[API#AI Assistant]]

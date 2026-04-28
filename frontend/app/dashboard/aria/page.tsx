"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Send, Sparkles, User, RefreshCw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  "How can I improve my Physics preparation for JEE?",
  "I feel demotivated today. Can you help?",
  "Give me a study plan for NEET Biology",
  "Tips for time management during exams",
];

// Simulated AI responses for demo
const aiResponses: Record<string, string> = {
  physics:
    "Great question! Here are some tips to improve your Physics preparation for JEE:\n\n1. **Master the fundamentals** - Start with NCERT and ensure concepts are crystal clear\n2. **Practice numericals daily** - Solve at least 20-30 problems from each chapter\n3. **Focus on high-weightage topics** - Mechanics, Electromagnetism, and Modern Physics\n4. **Use visualization** - Draw diagrams and understand physical phenomena\n5. **Take mock tests** - Regular practice under exam conditions\n\nRemember, consistency is key! You've got this! 💪",
  demotivated:
    "I understand how you feel, and it's completely normal to have tough days. Here's what I want you to remember:\n\n**You are capable of amazing things!** Every successful JEE/NEET qualifier has faced moments of doubt.\n\n**Tips to bounce back:**\n- Take a short break (15-20 mins) - go for a walk or listen to music\n- Review your progress - look how far you've come!\n- Break tasks into smaller chunks - one step at a time\n- Talk to someone who believes in you\n- Remember your 'why' - visualize your goal\n\nTomorrow is a new day. Today might be hard, but you're stronger than you think. I believe in you! 🌟",
  study:
    "Here's a focused study plan for NEET Biology:\n\n**Week 1-2: Cell Biology & Biomolecules**\n- Cell structure, cell cycle, enzymes\n- 2 hours daily + weekend revision\n\n**Week 3-4: Genetics & Evolution**\n- Mendelian genetics, molecular basis\n- Practice genetic problems daily\n\n**Week 5-6: Human Physiology**\n- Digestive, respiratory, circulatory systems\n- Diagram practice essential\n\n**Week 7-8: Plant Physiology & Ecology**\n- Photosynthesis, respiration, ecology\n- NCERT is your best friend here!\n\n**Daily routine:** 3-4 hours Biology, NCERT first, then reference books. Take weekly tests!\n\nYou'll crack it! 📚",
  time: "Excellent question! Time management is crucial for exam success. Here are proven strategies:\n\n**Before the Exam:**\n1. Practice with timed mock tests\n2. Know your strong and weak areas\n3. Set realistic time targets per section\n\n**During the Exam:**\n1. **Quick scan** (2-3 mins) - Overview all questions\n2. **Easy first** - Solve confident questions first\n3. **Don't get stuck** - Skip and come back\n4. **Section timing** - Allocate time proportionally\n5. **Last 15 mins** - Review and attempt remaining\n\n**Pro tip:** Use the '2-minute rule' - if you can't start solving in 2 mins, move on!\n\nPractice makes perfect. You'll develop your own rhythm! ⏱️",
  default:
    "I'm Aria, your AI coaching assistant! I'm here to help you with:\n\n- Subject-specific guidance (Physics, Chemistry, Biology, Math)\n- Study strategies and planning\n- Motivation and mental wellness\n- Exam preparation tips\n- Doubt clearing\n\nFeel free to ask me anything about your JEE/NEET preparation. I'm here to support you on your journey to success! What would you like help with today?",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("physics") || lower.includes("mechanics"))
    return aiResponses.physics;
  if (
    lower.includes("demotivat") ||
    lower.includes("sad") ||
    lower.includes("stressed")
  )
    return aiResponses.demotivated;
  if (
    lower.includes("study plan") ||
    lower.includes("biology") ||
    lower.includes("schedule")
  )
    return aiResponses.study;
  if (lower.includes("time") || lower.includes("management"))
    return aiResponses.time;
  return aiResponses.default;
}

export default function AriaPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm Aria, your AI coaching assistant. I'm here to help you with your JEE/NEET preparation - whether you need subject help, motivation, or study strategies. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getAIResponse(text),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi! I'm Aria, your AI coaching assistant. I'm here to help you with your JEE/NEET preparation - whether you need subject help, motivation, or study strategies. How can I assist you today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Aria AI Coach</h1>
            <p className="text-sm text-muted-foreground">
              Powered by Groq LLM
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={clearChat}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Clear Chat
        </Button>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback
                  className={
                    message.role === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }
                >
                  {message.role === "assistant" ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    message.role === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Sparkles className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <Spinner className="w-4 h-4" />
                  <span className="text-sm text-muted-foreground">
                    Aria is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">
              Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSend(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              placeholder="Ask Aria anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Aria is here to help with JEE/NEET preparation and motivation
          </p>
        </div>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { fetchChatSessions, fetchChatHistory, sendChatMessageMock } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Bot, User, MessageSquare } from "lucide-react";

export default function ChatbotPlaygroundPage() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([
    { id: 'welcome', role: 'bot', content: 'Hello! I am Dexra Assist. How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const loadSessions = async () => {
      const data = await fetchChatSessions();
      setSessions(data);
      if (data.length > 0) setActiveSession(data[0].id);
    };
    loadSessions();
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      if (!activeSession) return;
      const history = await fetchChatHistory(activeSession);
      
      if (history && history.length > 0) {
        setMessages(history.map(msg => ({
          id: msg.id,
          role: msg.role === 'assistant' ? 'bot' : msg.role,
          content: msg.content,
          sources: msg.sources || []
        })));
      } else {
        setMessages([{ id: 'welcome', role: 'bot', content: 'Hello! I am Dexra Assist. How can I help you today?' }]);
      }
    };
    loadHistory();
  }, [activeSession]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now().toString(), role: "user", content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const botMessage = await sendChatMessageMock(userMessage.content, activeSession);
      setMessages(prev => [...prev, botMessage]);
      
      // If we didn't have an active session, this created a new one
      if (!activeSession && botMessage.sessionId) {
        setActiveSession(botMessage.sessionId);
        // Refresh the sessions list in the sidebar
        const updatedSessions = await fetchChatSessions();
        setSessions(updatedSessions);
      }
    } catch (error) {
      const errorMessage = { id: Date.now().toString(), role: "bot", content: "I encountered an error. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6">
      {/* Sidebar */}
      <Card className="w-64 flex-shrink-0 flex flex-col overflow-hidden border-border/50 hidden md:flex">
        <div className="p-4 border-b bg-muted/20">
          <h3 className="font-semibold">Recent Sessions</h3>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {sessions.length === 0 ? (
              <div className="p-4 space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => setActiveSession(session.id)}
                  className={`w-full flex flex-col text-left px-3 py-2 rounded-md transition-colors ${
                    activeSession === session.id 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="text-sm font-medium truncate">{session.title}</span>
                  <span className={`text-xs ${activeSession === session.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {session.time}
                  </span>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Main Chat Area */}
      <Card className="flex-1 flex flex-col overflow-hidden border-border/50">
        <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Dexra Assistant Test</h3>
          </div>
        </div>
        
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50"
          ref={scrollRef}
        >
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-primary text-primary-foreground'
              }`}>
                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
              </div>
              
              <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-white border text-foreground rounded-tl-none whitespace-pre-wrap'
                }`}>
                  {msg.content}
                </div>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-xs font-semibold text-muted-foreground">Sources:</span>
                    {msg.sources.map((source, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-xs bg-white border px-2 py-1 rounded-md text-muted-foreground max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                        <MessageSquare className="h-3 w-3 flex-shrink-0" />
                        <span className="font-medium truncate">{source.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 max-w-[80%]">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div className="bg-white border rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t">
          <div className="relative flex items-center max-w-4xl mx-auto">
            <Input
              placeholder="Type a message to test the chatbot..."
              className="pr-12 py-6 rounded-full bg-muted/10 border-muted"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
            />
            <Button 
              size="icon" 
              className="absolute right-1.5 h-9 w-9 rounded-full"
              onClick={handleSend}
              disabled={isTyping || !inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

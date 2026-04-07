import { create } from 'zustand';
import { PLACES, HOTELS_DATA, RESTAURANTS_DATA } from '../data/places';

const useChatStore = create((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  isStreaming: false,
  sessionToken: null,

  toggleChat: (forceState = null) => 
    set((state) => ({ isOpen: forceState !== null ? forceState : !state.isOpen })),

  addMessage: (message) => 
    set((state) => ({ 
      messages: [...state.messages, { ...message, timestamp: new Date() }] 
    })),

  updateLastMessage: (token) => 
    set((state) => {
      const lastMsgIndex = state.messages.length - 1;
      const updatedMessages = [...state.messages];
      updatedMessages[lastMsgIndex].content += token;
      return { messages: updatedMessages };
    }),

  setLoading: (loading) => set({ isLoading: loading }),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  
  clearChat: () => set({ messages: [] }),
  
  setSessionToken: (token) => set({ sessionToken: token }),

  sendMessage: async (content) => {
    const { messages, addMessage, isStreaming } = useChatStore.getState();
    if (isStreaming || !content.trim()) return;

    // 1. Add user message
    addMessage({ role: 'user', content });
    set({ isStreaming: true });

    try {
      // Build a compressed list of what exists on the website to constrain the AI
      const availableDestinations = PLACES.map(p => p.name).join(", ");
      const availableHotels = HOTELS_DATA.map(h => h.name).join(", ");
      const availableRestaurants = RESTAURANTS_DATA.map(r => r.name).join(", ");

      const systemPrompt = `You are TOURISM PK AI, a highly friendly and efficient concierge for the "Tourism PK" platform. 
CRITICAL RULE: You MUST ONLY discuss, recommend, or provide details about the exact locations, hotels, and restaurants listed in your database context below. DO NOT invent information or talk about places outside of this list.
If a user asks about something NOT on this list, politely apologize in a friendly way and state that it is not currently covered on the platform, then guide them back to what is available. Do not engage in arguments.

AVAILABLE DATABASE ON TOURISM PK:
Destinations: ${availableDestinations}
Hotels: ${availableHotels}
Restaurants: ${availableRestaurants}

Keep answers concise, extremely friendly, and highly relevant.`;

      // Format history
      const currentHistory = useChatStore.getState().messages;
      const apiMessages = currentHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add System Prompt
      apiMessages.unshift({ role: 'system', content: systemPrompt });

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: apiMessages,
          temperature: 0.7,
          max_tokens: 500,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from Groq API');
      }

      const data = await response.json();
      const aiReply = data.choices[0].message.content;

      // 3. Add AI message
      addMessage({ role: 'assistant', content: aiReply });

    } catch (error) {
      console.error("Chat Error:", error);
      addMessage({ role: 'assistant', content: 'Oops! I am having trouble connecting to the network right now. Please try again in a moment.' });
    } finally {
      set({ isStreaming: false });
    }
  }
}));

export default useChatStore;

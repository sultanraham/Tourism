import { create } from 'zustand';
import { supabase } from '../lib/supabase';

const useChatStore = create((set) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  isStreaming: false,

  toggleChat: (forceState = null) =>
    set((state) => ({ isOpen: forceState !== null ? forceState : !state.isOpen })),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, timestamp: new Date() }]
    })),

  setStreaming: (streaming) => set({ isStreaming: streaming }),
  clearChat: () => set({ messages: [] }),

  sendMessage: async (content) => {
    const { addMessage, isStreaming } = useChatStore.getState();
    if (isStreaming || !content.trim()) return;

    addMessage({ role: 'user', content });
    set({ isStreaming: true });

    try {
      // 1. Fetch Real-time Context from Supabase
      const [destRes, hotelRes, restRes] = await Promise.all([
        supabase.from('destinations').select('name').limit(50),
        supabase.from('hotels').select('name').limit(50),
        supabase.from('restaurants').select('name').limit(50)
      ]);

      const availableDestinations = (destRes.data || []).map(d => d.name).join(", ");
      const availableHotels = (hotelRes.data || []).map(h => h.name).join(", ");
      const availableRestaurants = (restRes.data || []).map(r => r.name).join(", ");

      const systemPrompt = `You are TOURISM GUIDER, a high-fidelity travel concierge. 
      STRICT RULES:
      1. TRIGGER COMMAND: When a user confirms (e.g., "ok", "sure", "finalize"), you MUST end your response with: [PLAN_TRIP:City|Days]. Example: "Great! Sending you to our Neural Planner now... [PLAN_TRIP:Lahore|3]"
      2. GEOGRAPHY: Faisal Mosque is in ISLAMABAD. Badshahi Mosque is in LAHORE. Do not mix them up.
      3. CHAT FORMAT: For any trip preview in chat, you MUST use "📅 DAY X: [Theme]" so the UI renders cards.
      4. DATA GAPS: If you lack hotels, use: "🏨 STAY: Managed by user" and "🍴 DINE: Local exploration".
      5. NO MARKDOWN BOLDING: Never use "**".
      6. BE CONCISE: Lustria style.

      AVAILABLE DATA:
      - CITIES: ${availableDestinations || 'Many across Pakistan'}
      - HOTELS: ${availableHotels || 'None currently listed'}
      - RESTAURANTS: ${availableRestaurants || 'None currently listed'}`;

      const currentHistory = useChatStore.getState().messages;
      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...currentHistory.map(msg => ({ role: msg.role, content: msg.content }))
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: apiMessages,
          temperature: 0.6,
          max_tokens: 500,
        })
      });

      if (!response.ok) throw new Error('Neural Link Failure');

      const data = await response.json();
      const aiReply = data.choices[0].message.content;

      addMessage({ role: 'assistant', content: aiReply });
      return aiReply;

    } catch (error) {
      console.error("Neural Error:", error);
      addMessage({ role: 'assistant', content: 'Neural link interrupted. Re-synchronizing... Please try again.' });
    } finally {
      set({ isStreaming: false });
    }
  }
}));

export default useChatStore;

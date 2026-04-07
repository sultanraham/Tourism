export const generateSmartMaterial = async (type, name, location, apiKey) => {
    if (!apiKey) throw new Error("No Groq API Key provided.");

    const prompt = `You are an elite content strategist for Tourism PK. Generate a highly professional, cinematic, and accurate JSON object for a ${type} located in ${location} named "${name}".
    
    The response MUST be valid JSON only. NO conversational text.
    
    ${type === 'destination' ? `
    REQUIRED FIELDS for Destination:
    {
        "name": "${name}",
        "slug": "kebab-case-slug",
        "province": "The province in Pakistan (e.g. Gilgit-Baltistan, KPK, Punjab, etc.)",
        "category": "One of (Valleys, Mountains, Lakes, Historical, Beaches, National Park, Cities, Deserts, Waterfalls, Religious)",
        "rating_avg": 4.8,
        "review_count": 1250,
        "difficulty": "One of (Easy, Moderate, Hard, Very Hard)",
        "ideal_duration": "E.g. 2-3 Days",
        "lat": 35.0,
        "lng": 75.0,
        "best_season": "One of (Spring, Summer, Autumn, Winter, Monsoon, Year_Round)",
        "average_cost_pkr": 15000,
        "description": "An epic, world-class 3-4 sentence storytelling narrative for the discovery modal about this place. Be poetic and cinematic.",
        "highlights": "Exactly 4 world-class highlights (comma separated), e.g. Crystal clear lakes, 15th-century architecture, etc.",
        "tags": ["tag1", "tag2", "tag3"]
    }` : ''}
    
    ${type === 'hotel' ? `
    REQUIRED FIELDS for Hotel:
    {
        "name": "${name}",
        "slug": "kebab-case-hotel-slug",
        "destination_slug": "kebab-case-destination-slug",
        "stars": 3,
        "description": "Luxury 1-sentence sales pitch.",
        "amenities": ["WiFi", "Restaurant", "Hot Water", "Parking"],
        "location": "${location}",
        "contact": "+92-XXX-XXXXXXX"
    }` : ''}
    
    ${type === 'restaurant' ? `
    REQUIRED FIELDS for Restaurant:
    {
        "name": "${name}",
        "slug": "kebab-case-restaurant-slug",
        "destination_slug": "kebab-case-destination-slug",
        "cuisine": "E.g. Mughal/Traditional",
        "must_try": "The signature dish",
        "rating": "4.5",
        "address": "Detailed address",
        "location": "${location}",
        "timing": "E.g. 12:00 PM - 11:00 PM"
    }` : ''}
    
    Only return valid JSON object.`;

    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'You are an elite Pakistan Tourism data expert.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.5,
                response_format: { type: 'json_object' }
            })
        });

        const data = await res.json();
        return JSON.parse(data.choices[0].message.content);
    } catch (err) {
        console.error("Groq AI Error:", err);
        throw err;
    }
}

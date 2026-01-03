import Anthropic from '@anthropic-ai/sdk';
import { PairingRequest, PairingResponse, RefinementRequest, Recommendation, PriceIndicator } from '@/types';

// Abstract AI provider interface for swappability
export interface AIProvider {
  generatePairings(request: PairingRequest): Promise<PairingResponse>;
  refinePairings(request: RefinementRequest): Promise<PairingResponse>;
}

// Claude implementation
export class ClaudeProvider implements AIProvider {
  private client: Anthropic;

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('Missing ANTHROPIC_API_KEY environment variable');
    }
    this.client = new Anthropic({ apiKey });
  }

  async generatePairings(request: PairingRequest): Promise<PairingResponse> {
    const systemPrompt = this.buildSystemPrompt(request.preferences);
    
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: request.menuImageUrl,
              },
            },
            {
              type: 'image',
              source: {
                type: 'url',
                url: request.wineListImageUrl,
              },
            },
            {
              type: 'text',
              text: this.buildUserPrompt(request.occasion),
            },
          ],
        },
      ],
    });

    return this.parseResponse(response);
  }

  async refinePairings(request: RefinementRequest): Promise<PairingResponse> {
    const systemPrompt = `You are a sommelier and food pairing expert. The user has received recommendations and wants to refine them.

USER PREFERENCES:
- Cuisine styles they enjoy: ${request.preferences.cuisine_styles.join(', ') || 'No specific preference'}
- Price sensitivity: ${request.preferences.price_sensitivity}
- Allergies (MUST AVOID): ${request.preferences.allergies.join(', ') || 'None'}
- Dislikes: ${request.preferences.dislikes.join(', ') || 'None'}
      
Previous recommendations were:
${request.previousRecommendations.map((r, i) => `${i + 1}. ${r.food_name} with ${r.wine_name}`).join('\n')}

Based on the user's refinement request, provide 3 NEW and DIFFERENT recommendations from the menu and wine list shown in the images. Respond in JSON format only.`;

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'url',
                url: request.menuImageUrl,
              },
            },
            {
              type: 'image',
              source: {
                type: 'url',
                url: request.wineListImageUrl,
              },
            },
            {
              type: 'text',
              text: `Please refine the recommendations based on this request: "${request.refinement}"

Look at the menu and wine list images again and provide 3 NEW pairings that better match what the user wants.
          
Respond with exactly this JSON structure:
{
  "recommendations": [
    {
      "food_name": "Exact dish name from the menu",
      "wine_name": "Exact wine name from the list",
      "reasoning": "2-3 sentences explaining why this pairing works for taste and value",
      "price_indicator": "£ or ££ or £££",
      "rank": 1
    },
    // ... 2 more recommendations with rank 2 and 3
  ]
}`,
            },
          ],
        },
      ],
    });

    return this.parseResponse(response, request.sessionId);
  }

  private buildSystemPrompt(preferences: PairingRequest['preferences']): string {
    return `You are an expert sommelier and food pairing specialist. Your job is to analyze a food menu and wine list, then recommend the best food and wine pairings.

USER PREFERENCES:
- Cuisine styles they enjoy: ${preferences.cuisine_styles.join(', ') || 'No specific preference'}
- Price sensitivity: ${preferences.price_sensitivity}
- Allergies (MUST AVOID): ${preferences.allergies.join(', ') || 'None'}
- Dislikes: ${preferences.dislikes.join(', ') || 'None'}

IMPORTANT RULES:
1. NEVER recommend anything containing the user's allergens
2. Avoid items the user dislikes
3. Match price sensitivity: budget = cheapest good options, moderate = mid-range, premium = best regardless of price
4. Consider both taste pairing AND value for money
5. Provide exactly 3 recommendations ranked by how well they match the user's preferences

Respond ONLY with valid JSON, no other text.`;
  }

  private buildUserPrompt(occasion?: string): string {
    const occasionText = occasion ? `\n\nOccasion/mood: ${occasion}` : '';
    
    return `Please analyze these images of a food menu and wine list. Recommend the 3 best food and wine pairings.${occasionText}

Respond with exactly this JSON structure:
{
  "recommendations": [
    {
      "food_name": "Exact dish name from the menu",
      "wine_name": "Exact wine name from the list",
      "reasoning": "2-3 sentences explaining why this pairing works brilliantly for taste and represents good value",
      "price_indicator": "£ or ££ or £££",
      "rank": 1
    },
    {
      "food_name": "...",
      "wine_name": "...",
      "reasoning": "...",
      "price_indicator": "...",
      "rank": 2
    },
    {
      "food_name": "...",
      "wine_name": "...",
      "reasoning": "...",
      "price_indicator": "...",
      "rank": 3
    }
  ]
}`;
  }

  private parseResponse(response: Anthropic.Message, existingSessionId?: string): PairingResponse {
    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    try {
      // Extract JSON from the response (handle potential markdown code blocks)
      let jsonText = content.text;
      const jsonMatch = jsonText.match(/```json\s*([\s\S]*?)\s*```/) || 
                        jsonText.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1];
      }

      const parsed = JSON.parse(jsonText.trim());
      
      // Validate and transform the response
      const recommendations: Omit<Recommendation, 'id' | 'session_id' | 'created_at'>[] = 
        parsed.recommendations.map((rec: {
          food_name: string;
          wine_name: string;
          reasoning: string;
          price_indicator: string;
          rank: number;
        }) => ({
          food_name: rec.food_name,
          wine_name: rec.wine_name,
          reasoning: rec.reasoning,
          price_indicator: this.validatePriceIndicator(rec.price_indicator),
          rank: this.validateRank(rec.rank),
        }));

      return {
        recommendations,
        sessionId: existingSessionId || crypto.randomUUID(),
      };
    } catch {
      console.error('Failed to parse Claude response:', content.text);
      throw new Error('Failed to parse AI response');
    }
  }

  private validatePriceIndicator(value: string): PriceIndicator {
    if (value === '£' || value === '££' || value === '£££') {
      return value;
    }
    return '££'; // Default to moderate
  }

  private validateRank(value: number): 1 | 2 | 3 {
    if (value === 1 || value === 2 || value === 3) {
      return value;
    }
    return 1;
  }
}

// Factory function to get the AI provider
export function getAIProvider(): AIProvider {
  return new ClaudeProvider();
}

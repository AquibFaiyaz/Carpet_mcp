import { z } from 'zod';
import { MARKET_TRENDS } from '../data/trends.js';

export const GetMarketTrendsSchema = z.object({
  style: z.enum(['japandi', 'vintage_revival', 'modern_abstract', 'textured_moroccan', 'cultural_minimalism']).optional()
    .describe('Specific carpet design style to query. If omitted, returns all trending styles.'),
  region: z.enum(['US', 'EU', 'UK', 'GCC', 'Australia']).optional()
    .describe('Target export market region.')
});

export type GetMarketTrendsInput = z.infer<typeof GetMarketTrendsSchema>;

export function handleGetMarketTrends(input: GetMarketTrendsInput) {
  let styles = Object.values(MARKET_TRENDS);

  if (input.style) {
    styles = styles.filter(s => s.id === input.style);
  }

  if (input.region) {
    styles = styles.filter(s => s.targetRegions.includes(input.region!));
  }

  return {
    summary: `Found ${styles.length} market trend profile(s)${input.region ? ` for ${input.region}` : ''}.`,
    styles: styles.map(s => ({
      id: s.id,
      name: s.name,
      description: s.description,
      targetRegions: s.targetRegions,
      popularMaterials: s.popularMaterials,
      recommendedWeave: s.recommendedWeave,
      colorPalettes: s.colorPalettes,
      trendingMotifs: s.trendingMotifs,
      etsyTags: s.etsyTags,
      buyerInsights: s.buyerInsights
    }))
  };
}

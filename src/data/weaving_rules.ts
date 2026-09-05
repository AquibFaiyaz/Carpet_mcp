export interface WeavingSpecRule {
  type: string;
  name: string;
  weavingHubs: string[];
  knotDensityOrQuality: string;
  recommendedColors: { min: number; max: number; optimal: number };
  pileHeightRangeMm: { min: number; max: number };
  supportsCarving: boolean;
  supportsHighLow: boolean;
  leadTimeWeeks: string;
  costTier: 'Budget' | 'Mid-Range' | 'Premium' | 'Luxury Heirlooms';
  bestFor: string;
  constraints: string[];
}

export const WEAVING_RULES: Record<string, WeavingSpecRule> = {
  'hand-tufted': {
    type: 'hand-tufted',
    name: 'Hand-Tufted Cut & Loop Pile',
    weavingHubs: ['Bhadohi (UP)', 'Mirzapur (UP)', 'Panipat (Haryana)'],
    knotDensityOrQuality: '4.5 to 5.5 kg/sqm yarn density',
    recommendedColors: { min: 2, max: 12, optimal: 6 },
    pileHeightRangeMm: { min: 8, max: 20 },
    supportsCarving: true,
    supportsHighLow: true,
    leadTimeWeeks: '3 to 5 weeks',
    costTier: 'Mid-Range',
    bestFor: 'Modern abstract, Japandi carved textures, plush contemporary area rugs for Etsy/B2C.',
    constraints: [
      'Requires latex backing and canvas cover, not washable in home washing machines.',
      'Complex color gradients must be reduced to 6-10 distinct dyed yarn shades.'
    ]
  },
  'hand-knotted': {
    type: 'hand-knotted',
    name: 'Hand-Knotted Heirloom Weave',
    weavingHubs: ['Jaipur (Rajasthan)', 'Bhadohi (UP)', 'Srinagar (Kashmir)'],
    knotDensityOrQuality: '60 Knots, 80 Knots, 100 Knots, or 120 Knots per sq inch',
    recommendedColors: { min: 3, max: 25, optimal: 12 },
    pileHeightRangeMm: { min: 4, max: 10 },
    supportsCarving: true,
    supportsHighLow: false,
    leadTimeWeeks: '8 to 16 weeks (depending on size and knot count)',
    costTier: 'Luxury Heirlooms',
    bestFor: 'High-end vintage revival, traditional Persian/Oushak medallions, heirloom luxury interior designer projects.',
    constraints: [
      'Extremely labor-intensive; 100-knot 8x10ft rug takes 3-4 months to weave.',
      'High price point; requires buyer appreciation for true artisanal craftsmanship.'
    ]
  },
  'flatweave-kilim': {
    type: 'flatweave-kilim',
    name: 'Flatweave / Kilim (Dhurrie)',
    weavingHubs: ['Panipat (Haryana)', 'Jaipur (Rajasthan)', 'Agra (UP)'],
    knotDensityOrQuality: 'Reversible flat woven yarn warp & weft',
    recommendedColors: { min: 2, max: 8, optimal: 4 },
    pileHeightRangeMm: { min: 2, max: 5 },
    supportsCarving: false,
    supportsHighLow: false,
    leadTimeWeeks: '2 to 4 weeks',
    costTier: 'Budget',
    bestFor: 'Geometrics, Scandinavian Dhurries, lightweight washable rugs, high-traffic entryways.',
    constraints: [
      'Zero pile height; no 3D carved textures possible.',
      'Reversible, lighter weight; usually requires a non-slip rug pad underneath.'
    ]
  },
  'hand-loom': {
    type: 'hand-loom',
    name: 'Hand-Loom Loop & Shag Pile',
    weavingHubs: ['Panipat (Haryana)', 'Bhadohi (UP)'],
    knotDensityOrQuality: 'Pitched handloom wire weave',
    recommendedColors: { min: 1, max: 4, optimal: 2 },
    pileHeightRangeMm: { min: 12, max: 40 },
    supportsCarving: false,
    supportsHighLow: true,
    leadTimeWeeks: '2 to 4 weeks',
    costTier: 'Mid-Range',
    bestFor: 'Moroccan shag rugs, solid textured wool loops, minimalist neutral bedroom carpets.',
    constraints: [
      'Best for solid or simple geometric striping; cannot do complex intricate floral medallions.'
    ]
  }
};

export interface StyleProfile {
  id: string;
  name: string;
  description: string;
  targetRegions: string[];
  popularMaterials: string[];
  recommendedWeave: string[];
  colorPalettes: {
    name: string;
    description: string;
    colors: string[];
  }[];
  trendingMotifs: string[];
  etsyTags: string[];
  buyerInsights: string;
}

export const MARKET_TRENDS: Record<string, StyleProfile> = {
  japandi: {
    id: 'japandi',
    name: 'Japandi & Organic Minimalist',
    description: 'Blends Scandinavian hygge with Japanese wabi-sabi. Prioritizes natural fibers, high-low carved textures, and subtle organic line work.',
    targetRegions: ['US', 'EU', 'UK', 'Australia'],
    popularMaterials: ['New Zealand Wool', 'Un-dyed Natural Jute', 'Cotton Warp'],
    recommendedWeave: ['Hand-tufted Cut & Loop', 'High-Low Carved Pile', 'Chunky Flatweave'],
    colorPalettes: [
      {
        name: 'Mineral Neutral',
        description: 'Soothing beige, cream, and soft taupe with charcoal accents',
        colors: ['#F5F2EB (Oatmeal Cream)', '#D9D2C5 (Almond Taupe)', '#8C857B (Mineral Grey)', '#2E2D2B (Soft Charcoal)']
      },
      {
        name: 'Earthy Clay',
        description: 'Warm terracotta highlights over a muted off-white base',
        colors: ['#F9F6F0 (Warm White)', '#C87D55 (Terracotta Clay)', '#A39B8B (Sage Tint)', '#5C5449 (Espresso Brown)']
      }
    ],
    trendingMotifs: ['Asymmetrical carved wave lines', 'Soft pebble outlines', 'Micro-line geometric grid', 'Subtle borderless arch'],
    etsyTags: ['Japandi Rug', 'High Low Carved Rug', 'Minimalist Area Rug', 'Neutral Wool Carpet', 'Wabi Sabi Decor', 'Custom Size Rug'],
    buyerInsights: 'Buyers look for tactile warmth underfoot ("surface life") rather than flat prints. High-low pile carving is a key selling feature.'
  },
  vintage_revival: {
    id: 'vintage_revival',
    name: 'Vintage Revival & Distressed Antique',
    description: 'Recreates the aged, washed patina of heirloom Persian and Turkish rugs with muted tones and worn medallions.',
    targetRegions: ['US', 'UK', 'EU', 'GCC'],
    popularMaterials: ['Hand-knotted Wool', 'Bamboo Silk & Wool Blend', 'Oxidized Distressed Wash Wool'],
    recommendedWeave: ['Hand-knotted 80-Knot', 'Hand-knotted 100-Knot', 'Printed Flatweave'],
    colorPalettes: [
      {
        name: 'Washed Terracotta & Indigo',
        description: 'Faded rust, aged denim blue, and warm ivory patina',
        colors: ['#B85B43 (Washed Terracotta)', '#3E5C76 (Aged Indigo)', '#E8E1D5 (Warm Ivory)', '#8D7B68 (Muted Olive)']
      },
      {
        name: 'Dusty Rose & Mineral Slate',
        description: 'Vintage rose quartz with slate blue and antique brass',
        colors: ['#C48B8B (Dusty Rose)', '#4A5D6E (Mineral Slate)', '#D4C3A3 (Antique Beige)', '#6B5E4C (Bronze Brown)']
      }
    ],
    trendingMotifs: ['Herati floral border', 'Faded central medallion', 'Oushak floral spray', 'Antique Abrash color variations'],
    etsyTags: ['Vintage Persian Rug', 'Distressed Area Rug', 'Traditional Medallion Rug', 'Hand Knotted Rug', 'Turkish Oushak Style', 'Faded Heirloom Rug'],
    buyerInsights: 'Customers want the visual history and charm of a century-old antique rug without the fragile antique price tag.'
  },
  modern_abstract: {
    id: 'modern_abstract',
    name: 'Modern Abstract & Painterly',
    description: 'Art-like statement rugs featuring fluid color transitions, asymmetrical shapes, and contemporary brushstroke motifs.',
    targetRegions: ['US', 'EU', 'GCC'],
    popularMaterials: ['New Zealand Wool', 'Bamboo Silk (Viscose)', 'Pure Silk Accents'],
    recommendedWeave: ['Hand-tufted Cut Pile', 'Sculpted Tufted Wool & Silk'],
    colorPalettes: [
      {
        name: 'Gallery Expression',
        description: 'Vibrant moss, ochre, terracotta, and soft ivory contrast',
        colors: ['#556B2F (Moss Green)', '#DAA520 (Ochre Gold)', '#C05A46 (Clay Red)', '#FAF8F5 (Ivory White)']
      },
      {
        name: 'Nordic Horizon',
        description: 'Calming blues, seafoam green, and mist grey watercolor transition',
        colors: ['#5C788A (Slate Blue)', '#A2B9B5 (Seafoam Mist)', '#E6E4DF (Off White)', '#3A4856 (Deep Navy)']
      }
    ],
    trendingMotifs: ['Fluid watercolor shapes', 'Asymmetrical color blocking', 'Overlapping translucent rings', 'Sculpted brushstroke relief'],
    etsyTags: ['Abstract Area Rug', 'Modern Art Carpet', 'Hand Tufted Wool Rug', 'Contemporary Rug', 'Statement Living Room Rug', 'Custom Color Carpet'],
    buyerInsights: 'High-end buyers and interior designers purchase these as focal artwork for minimalist rooms.'
  },
  textured_moroccan: {
    id: 'textured_moroccan',
    name: 'Textured Moroccan & Tribal Shag',
    description: 'Inspired by Beni Ourain and Atlas mountain weaves. Plush, thick shag pile with charcoal diamond lines and braided fringe.',
    targetRegions: ['US', 'EU', 'UK', 'Australia'],
    popularMaterials: ['Coarse Natural Wool', 'Unbleached Sheep Wool', 'Cotton Foundation'],
    recommendedWeave: ['High Pile Hand-tufted Shag', 'Hand-knotted Berber Weave'],
    colorPalettes: [
      {
        name: 'Beni Classic',
        description: 'Natural ivory sheep wool base with soft charcoal diamond lines',
        colors: ['#F7F4EC (Natural Unbleached Wool)', '#2B2A29 (Dark Charcoal)', '#D6CEBE (Soft Taupe)']
      }
    ],
    trendingMotifs: ['Irregular diamond grid', 'Tribal chevron', 'Braided fringe ends', 'Abstract Berber symbols'],
    etsyTags: ['Moroccan Rug', 'Beni Ourain Rug', 'Plush Shag Rug', 'Cozy Wool Carpet', 'Boho Living Room Decor', 'Tribal Area Rug'],
    buyerInsights: 'Extremely popular for bedrooms and nurseries due to ultra-soft plush feeling underfoot.'
  },
  cultural_minimalism: {
    id: 'cultural_minimalism',
    name: 'Cultural Minimalism (Indian Heritage Redefined)',
    description: 'Reinterprets traditional Indian Jaipuri, Kashmiri, and Mughal motifs (Lotus, Kalka/Paisley, Chinar) into clean, 2-3 tone modern palettes.',
    targetRegions: ['US', 'EU', 'GCC', 'Australia'],
    popularMaterials: ['Fine Wool', 'Bamboo Silk', 'Mulberry Silk'],
    recommendedWeave: ['Hand-knotted 100+ Knot', 'Fine Hand-tufted Carved'],
    colorPalettes: [
      {
        name: 'Monochrome Jaipur',
        description: 'Tone-on-tone ivory and champagne gold with fine carving',
        colors: ['#FDFBF7 (Ivory Base)', '#D4AF37 (Champagne Gold Silk)', '#88847B (Soft Shadow Grey)']
      }
    ],
    trendingMotifs: ['Deconstructed Lotus medallion', 'Tone-on-tone Paisley / Kalka', 'Jali geometric lattice', 'Mughal garden silhouette'],
    etsyTags: ['Indian Hand Knotted Rug', 'Jaipur Wool Carpet', 'Luxury Silk Rug', 'Mughal Pattern Rug', 'Heritage Decor', 'Custom Luxury Rug'],
    buyerInsights: 'Appeals to luxury buyers seeking high craftsmanship without loud traditional colors.'
  }
};

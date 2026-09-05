import { z } from 'zod';
import { MARKET_TRENDS } from '../data/trends.js';

export const EtsyListingSchema = z.object({
  designName: z.string().describe('Name of the carpet design.'),
  style: z.string().describe('Design aesthetic (e.g. japandi, vintage_revival, modern_abstract, textured_moroccan).'),
  materials: z.array(z.string()).describe('Materials used (e.g. ["New Zealand Wool", "Bamboo Silk"]).'),
  weavingType: z.enum(['hand-tufted', 'hand-knotted', 'flatweave-kilim', 'hand-loom'])
    .describe('Construction weaving technique.'),
  roomType: z.string().optional().default('Living Room & Bedroom')
    .describe('Ideal room setting.')
});

export type EtsyListingInput = z.infer<typeof EtsyListingSchema>;

export function handleGenerateEtsyListing(input: EtsyListingInput) {
  const styleData = MARKET_TRENDS[input.style.toLowerCase()] || MARKET_TRENDS.japandi;
  const materialList = input.materials.join(' & ');
  const weaveTitle = input.weavingType.replace('-', ' ').toUpperCase();

  // Generate SEO Title (< 140 chars)
  const seoTitle = `${input.designName} ${styleData.name} Rug | Handcrafted ${materialList} Area Rug for ${input.roomType} | Custom Size Carpet`;

  // Generate 13 Etsy Tags (each < 20 chars)
  const baseTags = [
    `${styleData.name.split(' ')[0]} Rug`,
    'Hand Tufted Rug',
    'Wool Area Rug',
    'Neutral Area Rug',
    'Custom Size Rug',
    'Living Room Decor',
    'Minimalist Rug',
    'Boho Carpet',
    'High Low Rug',
    'Handmade Area Rug',
    'Luxury Wool Carpet',
    'Modern Home Decor',
    'Aesthetic Area Rug'
  ].slice(0, 13);

  // Storytelling Description
  const description = `✨ **${input.designName.toUpperCase()} - ${styleData.name.toUpperCase()}** ✨

Elevate your living space with our handcrafted **${input.designName}** area rug. Masterfully woven by skilled artisans in India using premium **${materialList}**, this piece seamlessly combines modern architectural design with rich tactile comfort underfoot.

🌿 **KEY FEATURES:**
• **Construction:** ${weaveTitle} (Handcrafted by master artisans in Bhadohi/Jaipur, India)
• **Material Blend:** ${materialList} for exceptional softness, durability, and natural sheen.
• **Texture:** High-density plush pile with tactile surface depth.
• **Style Aesthetic:** Perfect for ${styleData.name}, Scandinavian Modern, and Contemporary Organic interiors.
• **Customization:** Available in standard sizes (5x8, 8x10, 9x12 ft) as well as fully custom sizes and color palettes upon request!

🏠 **IDEAL ROOM PLACEMENT:**
Designed to ground modern ${input.roomType} settings, adding emotional warmth and refined sophistication.

🧼 **CARE INSTRUCTIONS:**
• Vacuum regularly using a low-suction setting without a beater bar.
• Spot clean stains immediately with a mild detergent and dry cloth.
• Professional rug cleaning recommended for deep maintenance.

📦 **SHIPPING & HANDLING:**
Each rug is custom woven and carefully inspected before being rolled, wrapped in protective export packaging, and shipped directly from our artisan workshop in India via express courier (DHL/FedEx).
`;

  return {
    listingTitle: seoTitle,
    etsyTags13: baseTags,
    productDescription: description,
    suggestedCategory: 'Home & Living > Rugs > Area Rugs',
    etsyAttributes: {
      craftType: 'Weaving & Tufting',
      primaryMaterial: input.materials[0] || 'Wool',
      secondaryMaterial: input.materials[1] || 'Cotton',
      room: input.roomType,
      isCustomizable: true
    }
  };
}

import { z } from 'zod';
import { WEAVING_RULES } from '../data/weaving_rules.js';

export const TechSheetSchema = z.object({
  designName: z.string().describe('Name of the carpet design collection.'),
  style: z.string().describe('Design style (e.g. Japandi, Vintage Distressed, Abstract).'),
  weavingType: z.enum(['hand-tufted', 'hand-knotted', 'flatweave-kilim', 'hand-loom'])
    .describe('Construction weaving technique.'),
  warpMaterial: z.string().optional().default('100% Heavy Duty Cotton')
    .describe('Foundation warp material.'),
  weftPileMaterial: z.string().default('80% New Zealand Wool / 20% Bamboo Silk')
    .describe('Pile yarn material blend.'),
  colors: z.array(z.string()).max(12)
    .describe('List of indexed yarn dye color names (up to 12 colors).'),
  dimensionsFeet: z.string().default('8x10 ft')
    .describe('Standard rug dimensions (e.g. 5x8 ft, 8x10 ft, 9x12 ft).'),
  pileHeightMm: z.number().optional().default(12)
    .describe('Target finished pile height in millimeters.'),
  specialFinishing: z.string().optional().default('Hand beveling/carving around motifs, serged sides, 3-inch cotton fringe ends')
    .describe('Special finishing instructions for weavers.')
});

export type TechSheetInput = z.infer<typeof TechSheetSchema>;

export function handleGenerateTechSheet(input: TechSheetInput) {
  const rule = WEAVING_RULES[input.weavingType];

  return {
    documentTitle: `NAKSHA TECHNICAL WEAVING SPECIFICATION SHEET`,
    generatedDate: new Date().toISOString().split('T')[0],
    generalInfo: {
      designName: input.designName,
      styleCategory: input.style,
      targetDimensions: input.dimensionsFeet,
      weavingConstruction: rule.name,
      recommendedProductionHub: rule.weavingHubs[0], // Primary center e.g. Bhadohi
    },
    rawMaterials: {
      warpFoundation: input.warpMaterial,
      pileYarnComposition: input.weftPileMaterial,
      yarnDyeColorIndex: input.colors.map((c, i) => `Yarn Swatch #${i + 1}: ${c}`),
      totalYarnColorCount: input.colors.length
    },
    weavingParameters: {
      qualityDensity: rule.knotDensityOrQuality,
      targetPileHeight: `${input.pileHeightMm} mm`,
      carvingCarvedRelief: rule.supportsCarving ? 'Required (Follow CAD outline)' : 'None',
      leadTimeEstimate: rule.leadTimeWeeks
    },
    finishingAndPacking: {
      finishingNotes: input.specialFinishing,
      backing: input.weavingType === 'hand-tufted' ? 'Heavy cotton canvas backing with latex bonding' : 'Natural woven wool/cotton back (no latex)',
      packagingSpec: 'Heavy duty moisture-proof poly wrap roll with edge protectors for export shipping'
    },
    masterWeaverChecklist: [
      '1. Verify yarn dye batch color matching against Pantone/Master Wool Swatches before warping.',
      '2. Ensure orthographic CAD graph (naksha) is scaled accurately to standard dimensions.',
      '3. Conduct first 12-inch weave inspection for pile height and knot density compliance.'
    ]
  };
}

import { z } from 'zod';
import { WEAVING_RULES } from '../data/weaving_rules.js';

export const ValidateSpecsSchema = z.object({
  weavingType: z.enum(['hand-tufted', 'hand-knotted', 'flatweave-kilim', 'hand-loom'])
    .describe('Proposed weaving construction technique.'),
  colorCount: z.number().min(1).max(50)
    .describe('Total number of distinct yarn colors in the proposed design.'),
  pileHeightMm: z.number().optional()
    .describe('Proposed pile height in millimeters.'),
  hasCarving: z.boolean().optional().default(false)
    .describe('Whether the design requires 3D hand carving / beveling.'),
  hasHighLow: z.boolean().optional().default(false)
    .describe('Whether the design requires high-low cut & loop texture variations.')
});

export type ValidateSpecsInput = z.infer<typeof ValidateSpecsSchema>;

export function handleValidateSpecs(input: ValidateSpecsInput) {
  const rule = WEAVING_RULES[input.weavingType];
  if (!rule) {
    throw new Error(`Unknown weaving type: ${input.weavingType}`);
  }

  const warnings: string[] = [];
  const recommendations: string[] = [];
  let isFeasible = true;

  // 1. Color Count Validation
  if (input.colorCount > rule.recommendedColors.max) {
    isFeasible = false;
    warnings.push(`Color count of ${input.colorCount} exceeds maximum limit of ${rule.recommendedColors.max} colors for ${rule.name}. Highly recommended to color-index to ${rule.recommendedColors.optimal} yarn shades.`);
  } else if (input.colorCount > rule.recommendedColors.optimal) {
    warnings.push(`Color count of ${input.colorCount} is higher than optimal (${rule.recommendedColors.optimal} colors). May increase yarn dyeing costs and production time.`);
  }

  // 2. Carving & High-Low Validation
  if (input.hasCarving && !rule.supportsCarving) {
    isFeasible = false;
    warnings.push(`${rule.name} does NOT support 3D hand carving. Choose hand-tufted or hand-knotted instead.`);
  }

  if (input.hasHighLow && !rule.supportsHighLow) {
    warnings.push(`${rule.name} has limited/no support for high-low texture variations.`);
  }

  // 3. Pile Height Validation
  if (input.pileHeightMm !== undefined) {
    if (input.pileHeightMm < rule.pileHeightRangeMm.min || input.pileHeightMm > rule.pileHeightRangeMm.max) {
      warnings.push(`Pile height ${input.pileHeightMm}mm is outside standard range (${rule.pileHeightRangeMm.min}-${rule.pileHeightRangeMm.max}mm) for ${rule.name}.`);
    }
  }

  // Recommendations
  recommendations.push(`Primary Indian Weaving Hubs: ${rule.weavingHubs.join(', ')}.`);
  recommendations.push(`Estimated Production Lead Time: ${rule.leadTimeWeeks}.`);
  recommendations.push(`Cost Tier: ${rule.costTier}.`);
  recommendations.push(...rule.constraints);

  return {
    weavingType: rule.name,
    isFeasible,
    colorCountCheck: {
      requested: input.colorCount,
      optimal: rule.recommendedColors.optimal,
      maxAllowed: rule.recommendedColors.max,
      status: input.colorCount <= rule.recommendedColors.max ? 'PASS' : 'EXCEEDED'
    },
    manufacturingSpecs: {
      weavingHubs: rule.weavingHubs,
      qualityDensity: rule.knotDensityOrQuality,
      recommendedPileHeight: `${rule.pileHeightRangeMm.min}-${rule.pileHeightRangeMm.max} mm`,
      leadTime: rule.leadTimeWeeks,
      costTier: rule.costTier
    },
    warnings,
    recommendations
  };
}

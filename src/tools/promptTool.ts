import { z } from 'zod';
import { CARPET_DESIGN_STYLES } from '../data/design_styles.js';

export const GenerateCarpetDesignPromptSchema = z.object({
  style: z.enum([
    'japandi',
    'vintage_persian',
    'turkish_oushak',
    'modern_abstract',
    'moroccan_berber',
    'scandinavian_kilim',
    'mughal_heritage'
  ]).describe('Carpet design aesthetic / historical style category.'),

  motifs: z.string().optional()
    .describe('Specific pattern motifs (e.g. "Herati floral scrolls", "carved organic waves", "lotus medallion").'),

  borderStyle: z.string().optional()
    .describe('Border design style (e.g. "3-tier floral main border with guard stripes", "borderless flush edge", "braided fringe ends").'),

  medallionType: z.string().optional()
    .describe('Central medallion type (e.g. "star-shaped central medallion", "teardrop pendant medallion", "open field no medallion").'),

  weavingTexture: z.enum([
    'hand-tufted cut-and-loop',
    'hand-knotted 80-knot wool',
    'hand-knotted 100-knot silk-blend',
    'flatweave-kilim',
    'plush-moroccan-shag'
  ]).optional().default('hand-tufted cut-and-loop')
    .describe('Weaving technique & pile texture.'),

  fiberBlend: z.string().optional()
    .describe('Yarn fiber composition (e.g. "New Zealand Wool with Bamboo Silk highlights", "Un-dyed Natural Jute").'),

  colorPalette: z.array(z.string()).optional()
    .describe('List of specific yarn colors or palette description (e.g. ["Washed Terracotta", "Aged Indigo", "Ivory Base"]).'),

  finishEffects: z.string().optional()
    .describe('Special surface finishing effects (e.g. "faded distressed abrash patina", "high-low 3D carved relief lines", "luminous silky sheen").'),

  targetAi: z.enum(['midjourney', 'flux', 'gemini', 'dalle3']).optional().default('midjourney')
    .describe('Target AI image generator model.'),

  seamlessTile: z.boolean().optional().default(true)
    .describe('Whether to generate a seamless tileable repeat design (--tile flag for Midjourney).'),

  aspectRatio: z.string().optional().default('1:1')
    .describe('Aspect ratio of the generated design map (e.g. "1:1", "4:5", "3:4").')
});

export type GenerateCarpetDesignPromptInput = {
  style: 'japandi' | 'vintage_persian' | 'turkish_oushak' | 'modern_abstract' | 'moroccan_berber' | 'scandinavian_kilim' | 'mughal_heritage';
  motifs?: string;
  borderStyle?: string;
  medallionType?: string;
  weavingTexture?: 'hand-tufted cut-and-loop' | 'hand-knotted 80-knot wool' | 'hand-knotted 100-knot silk-blend' | 'flatweave-kilim' | 'plush-moroccan-shag';
  fiberBlend?: string;
  colorPalette?: string[];
  finishEffects?: string;
  targetAi?: 'midjourney' | 'flux' | 'gemini' | 'dalle3';
  seamlessTile?: boolean;
  aspectRatio?: string;
};

export function handleGenerateCarpetDesignPrompt(input: GenerateCarpetDesignPromptInput) {
  const styleData = CARPET_DESIGN_STYLES[input.style] || CARPET_DESIGN_STYLES.japandi;
  const targetAi = input.targetAi || 'midjourney';
  const seamlessTile = input.seamlessTile !== undefined ? input.seamlessTile : true;
  const aspectRatio = input.aspectRatio || '1:1';
  const weavingTexture = input.weavingTexture || 'hand-tufted cut-and-loop';

  // 1. Camera / Perspective Layer (Strict Orthographic Map)
  const perspectiveLayer = 'Top-down flat lay view, 90-degree orthographic 2D carpet design map, direct overhead view';

  // 2. Motif & Medallion Layer
  const selectedMotifs = input.motifs || styleData.signatureMotifs[0];
  const selectedMedallion = input.medallionType || styleData.medallionTypes[0];
  const motifLayer = `featuring ${selectedMotifs} with a ${selectedMedallion}`;

  // 3. Border Layer
  const selectedBorder = input.borderStyle || styleData.borderStyles[0];
  const borderLayer = `framed by a ${selectedBorder}`;

  // 4. Weaving & Fiber Layer
  const fiberInfo = input.fiberBlend || styleData.recommendedFibers.join(' & ');
  const weaveTextureMap: Record<string, string> = {
    'hand-tufted cut-and-loop': 'rendered as a hand-tufted cut and loop pile wool carpet texture with 3D carved relief details',
    'hand-knotted 80-knot wool': 'rendered as an authentic 80-knot fine hand-knotted wool rug weave with visible yarn stitches',
    'hand-knotted 100-knot silk-blend': 'rendered as a high-density 100-knot fine silk and wool hand-knotted heirloom carpet map',
    'flatweave-kilim': 'rendered as a flatweave wool kilim dhurrie texture with matte woven warp and weft yarn grid',
    'plush-moroccan-shag': 'rendered as an ultra-plush thick sheep wool shag carpet texture with heavy tactile yarn loops'
  };
  const weaveLayer = `${weaveTextureMap[weavingTexture]}, crafted from ${fiberInfo}`;

  // 5. Palette Layer
  const selectedColors = input.colorPalette && input.colorPalette.length > 0
    ? input.colorPalette.join(', ')
    : styleData.curatedPalettes[0].colors.join(', ');
  const colorLayer = `in a curated color palette of ${selectedColors}`;

  // 6. Finishing Effects & Lighting Layer
  const finishEffects = input.finishEffects || styleData.surfaceTextures[0];
  const finishLayer = `with a ${finishEffects}, soft natural overhead window lighting, photorealistic high resolution interior design quality`;

  // Combine Base Prompt
  const basePromptParts = [
    perspectiveLayer,
    motifLayer,
    borderLayer,
    weaveLayer,
    colorLayer,
    finishLayer
  ];

  let fullPrompt = basePromptParts.join(', ');

  // Add Target AI Spec Modifiers
  const proTips: string[] = [
    styleData.aiDesignAdvice,
    'Ensure the AI output is color-indexed to 6-12 solid yarn shades before handing off to master weavers in Bhadohi or Jaipur.'
  ];

  if (targetAi === 'midjourney') {
    if (seamlessTile) {
      fullPrompt += ' --tile';
      proTips.push('Included `--tile` parameter at the end for seamless pattern repetition in Midjourney.');
    }
    if (aspectRatio && aspectRatio !== '1:1') {
      fullPrompt += ` --ar ${aspectRatio}`;
    }
    fullPrompt += ' --v 6.1';
  } else if (targetAi === 'flux') {
    fullPrompt = `[Flat Lay Carpet Design Spec] ${fullPrompt}, 8k resolution, crisp texture render, no perspective distortion`;
    proTips.push('For FLUX, set guidance scale to 4.0 for sharp, crisp yarn texture definition.');
  } else if (targetAi === 'dalle3' || targetAi === 'gemini') {
    fullPrompt = `A high-resolution, perfectly flat 2D top-down photograph of a carpet design. ${fullPrompt}. The angle must be strictly 90 degrees overhead with zero tilt or room perspective.`;
    proTips.push('Explicitly specified 90-degree overhead flat lay view to prevent DALL-E/Gemini from rendering a tilted room background.');
  }

  return {
    styleCategory: styleData.name,
    targetAiModel: targetAi,
    generatedDesignPrompt: fullPrompt,
    promptComponents: {
      perspectiveLock: perspectiveLayer,
      motifsAndMedallion: motifLayer,
      borderStyle: borderLayer,
      weavingAndFibers: weaveLayer,
      colorPalette: colorLayer,
      finishingEffects: finishLayer
    },
    carpetDesignTips: proTips
  };
}

export interface PromptGenerationRequest {
  style: string; // e.g., 'japandi', 'vintage_revival', 'modern_abstract', 'textured_moroccan', 'cultural_minimalism'
  weavingType: 'hand-tufted' | 'hand-knotted' | 'flatweave-kilim' | 'hand-loom';
  materials?: string[]; // e.g., ['New Zealand Wool', 'Bamboo Silk']
  colorPalette?: string[]; // e.g., ['Warm Cream', 'Terracotta Clay', 'Sage']
  customMotifs?: string; // e.g., 'asymmetrical carved wave lines'
  targetAi?: 'midjourney' | 'flux' | 'gemini' | 'dalle3';
  seamlessTile?: boolean;
  aspectRatio?: string; // e.g., '1:1', '4:5', '3:4'
}

export function buildStructuredPrompt(request: PromptGenerationRequest): {
  prompt: string;
  breakdown: Record<string, string>;
  proTips: string[];
} {
  const targetAi = request.targetAi || 'midjourney';
  const seamless = request.seamlessTile !== undefined ? request.seamlessTile : true;

  // Layer 1: Perspective (CRITICAL)
  const perspectiveLayer = 'Top-down flat lay view, 90-degree orthographic 2D carpet design map, direct overhead view';

  // Layer 2: Weave & Texture
  let weaveLayer = '';
  switch (request.weavingType) {
    case 'hand-tufted':
      weaveLayer = 'luxurious hand-tufted wool cut and loop pile texture, 3D hand-carved relief lines, tactile surface detail';
      break;
    case 'hand-knotted':
      weaveLayer = 'fine hand-knotted wool carpet construction, 80-knot density, intricate yarn stitches, authentic handcrafted texture';
      break;
    case 'flatweave-kilim':
      weaveLayer = 'chunky flatweave wool kilim dhurrie texture, visible woven warp and weft yarn grid, matte natural fiber finish';
      break;
    case 'hand-loom':
      weaveLayer = 'plush thick hand-loom loop pile shag texture, heavy tactile wool yarn loops';
      break;
  }

  // Layer 3: Materials
  const defaultMaterials = request.materials && request.materials.length > 0
    ? request.materials.join(' and ')
    : 'New Zealand wool and subtle bamboo silk sheen accents';
  const materialLayer = `crafted from high quality ${defaultMaterials}`;

  // Layer 4: Pattern & Motifs
  const motifLayer = request.customMotifs
    ? `featuring ${request.customMotifs}`
    : `featuring signature ${request.style.replace('_', ' ')} aesthetic motifs`;

  // Layer 5: Color Palette
  const colorLayer = request.colorPalette && request.colorPalette.length > 0
    ? `palette of ${request.colorPalette.join(', ')}`
    : `harmonious muted palette tailored for high-end interior design`;

  // Layer 6: Edge Finishing & Lighting
  const finishLayer = 'finished with subtle serged border edges and soft natural overhead window lighting, photorealistic interior design quality';

  // Assembly
  const basePromptParts = [
    perspectiveLayer,
    motifLayer,
    `render as a ${weaveLayer}`,
    materialLayer,
    colorLayer,
    finishLayer
  ];

  let fullPrompt = basePromptParts.join(', ');

  // Add AI Model Specific Modifiers
  const proTips: string[] = [
    'Always verify the generated tile seamlessly repeats before sending to weavers.',
    'Color reduce the resulting design to 6-10 solid yarn dye swatches in Photoshop or Illustrator.'
  ];

  if (targetAi === 'midjourney') {
    if (seamless) {
      fullPrompt += ' --tile';
      proTips.push('Included `--tile` parameter at the end for seamless pattern repetition in Midjourney.');
    }
    if (request.aspectRatio && request.aspectRatio !== '1:1') {
      fullPrompt += ` --ar ${request.aspectRatio}`;
    }
    fullPrompt += ' --v 6.1';
  } else if (targetAi === 'flux') {
    fullPrompt = `[Flat Lay Design Spec] ${fullPrompt}, 8k resolution, crisp texture render, no perspective distortion`;
    proTips.push('For FLUX, use high guidance scale (3.5 - 5) for clean line separation.');
  } else if (targetAi === 'dalle3' || targetAi === 'gemini') {
    fullPrompt = `A high-resolution, perfectly flat top-down 2D photograph of a rug design. ${fullPrompt}. The view must be strictly 90 degrees overhead with zero angle skew.`;
    proTips.push('Explicitly specified 90-degree overhead angle to prevent DALL-E/Gemini from rendering tilted rooms.');
  }

  return {
    prompt: fullPrompt,
    breakdown: {
      perspective: perspectiveLayer,
      weaveTexture: weaveLayer,
      materials: materialLayer,
      pattern: motifLayer,
      colors: colorLayer,
      finishing: finishLayer
    },
    proTips
  };
}

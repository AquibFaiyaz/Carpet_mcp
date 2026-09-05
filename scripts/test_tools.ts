import { CARPET_DESIGN_STYLES } from '../src/data/design_styles.js';
import { handleGenerateCarpetDesignPrompt } from '../src/tools/promptTool.js';

console.log('--- 1. Testing get_carpet_design_styles ---');
console.log(`Loaded ${Object.keys(CARPET_DESIGN_STYLES).length} design styles:`, Object.keys(CARPET_DESIGN_STYLES));

console.log('\n--- 2. Testing generate_carpet_design_prompt (Vintage Persian) ---');
const vintagePrompt = handleGenerateCarpetDesignPrompt({
  style: 'vintage_persian',
  motifs: 'Herati floral lattice scrolls and Shah Abbas palmettes',
  borderStyle: 'Classic 3-tier Persian floral border with guard stripes',
  medallionType: 'star-shaped central medallion with teardrop pendants',
  weavingTexture: 'hand-knotted 100-knot silk-blend',
  fiberBlend: '80% Fine Wool / 20% Mulberry Silk',
  colorPalette: ['Washed Terracotta', 'Aged Denim Indigo', 'Warm Ivory Base', 'Muted Olive'],
  finishEffects: 'faded distressed abrash patina with velvety silk sheen',
  targetAi: 'midjourney',
  seamlessTile: true,
  aspectRatio: '4:5'
});
console.log(JSON.stringify(vintagePrompt, null, 2));

console.log('\n--- 3. Testing generate_carpet_design_prompt (Japandi Carved Relief) ---');
const japandiPrompt = handleGenerateCarpetDesignPrompt({
  style: 'japandi',
  motifs: 'asymmetrical carved organic waves',
  borderStyle: 'borderless flush edge',
  medallionType: 'off-center fluid pebble form',
  weavingTexture: 'hand-tufted cut-and-loop',
  fiberBlend: 'New Zealand Wool and Bamboo Silk',
  colorPalette: ['Oatmeal Cream', 'Almond Taupe', 'Mineral Grey'],
  finishEffects: 'high-low 3D carved relief lines with plush loop pile',
  targetAi: 'midjourney',
  seamlessTile: true
});
console.log(JSON.stringify(japandiPrompt, null, 2));

console.log('\n✅ ALL DESIGN TOOLS TESTED SUCCESSFULLY!');

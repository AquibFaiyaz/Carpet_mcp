export interface DesignStyle {
  id: string;
  name: string;
  category: string;
  description: string;
  signatureMotifs: string[];
  borderStyles: string[];
  medallionTypes: string[];
  recommendedFibers: string[];
  surfaceTextures: string[];
  curatedPalettes: {
    name: string;
    colors: string[];
    description: string;
  }[];
  aiDesignAdvice: string;
}

export const CARPET_DESIGN_STYLES: Record<string, DesignStyle> = {
  japandi: {
    id: 'japandi',
    name: 'Japandi & Organic Minimalist',
    category: 'Contemporary Minimalist',
    description: 'Harmonizes Scandinavian hygge with Japanese wabi-sabi. Emphasizes organic lines, carved reliefs, high-low pile textures, and soft neutral mineral tones.',
    signatureMotifs: ['Asymmetrical carved organic wave lines', 'Soft pebble forms', 'Minimalist micro-line grid', 'Borderless soft arches'],
    borderStyles: ['Borderless flush edges', 'Single narrow self-color serged edge', 'Subtle carved inset line'],
    medallionTypes: ['No medallion (open organic field)', 'Off-center fluid pebble form'],
    recommendedFibers: ['New Zealand Wool', 'Un-dyed Natural Jute', 'Matte Organic Cotton'],
    surfaceTextures: ['High-low carved cut & loop pile', 'Plush cut pile with carved relief', 'Chunky wool loop pile'],
    curatedPalettes: [
      {
        name: 'Mineral Neutral',
        colors: ['Oatmeal Cream (#F5F2EB)', 'Almond Taupe (#D9D2C5)', 'Mineral Grey (#8C857B)', 'Soft Charcoal (#2E2D2B)'],
        description: 'Soothing beige, cream, and soft taupe with subtle charcoal line accents.'
      },
      {
        name: 'Earthy Clay',
        colors: ['Warm White (#F9F6F0)', 'Terracotta Clay (#C87D55)', 'Sage Tint (#A39B8B)', 'Espresso Brown (#5C5449)'],
        description: 'Warm terracotta highlights over a muted off-white base.'
      }
    ],
    aiDesignAdvice: 'Focus on surface texture keywords like "high-low 3D carved relief", "plush loop pile", and "soft natural overhead window lighting".'
  },
  vintage_persian: {
    id: 'vintage_persian',
    name: 'Vintage Persian & Heirloom Medallion',
    category: 'Traditional & Classic',
    description: 'Recreates the aged elegance of historic Tabriz, Kashan, and Isfahan rugs with distressed patina, faded abrash washes, and intricate botanical detail.',
    signatureMotifs: ['Herati floral lattice', 'Shah Abbas palmettes', 'Kalka/Paisley scrolls', 'Corner spandrels with arabesques'],
    borderStyles: ['Classic 3-tier Persian border (main floral border with inner and outer guard stripes)', 'Faded distressed border'],
    medallionTypes: ['Intricate star-shaped central medallion', 'Symmetrical oval floral medallion', 'Pendant medallion with teardrops'],
    recommendedFibers: ['Fine Wool', 'Bamboo Silk & Wool Blend', 'Mulberry Silk'],
    surfaceTextures: ['Low-cut fine pile with abrash fading', 'Distressed oxidized wash finish', 'Velvety smooth silk sheen'],
    curatedPalettes: [
      {
        name: 'Washed Terracotta & Indigo',
        colors: ['Washed Terracotta (#B85B43)', 'Aged Indigo (#3E5C76)', 'Warm Ivory (#E8E1D5)', 'Muted Olive (#8D7B68)'],
        description: 'Faded rust, aged denim blue, and warm ivory patina.'
      },
      {
        name: 'Antique Crimson & Gold',
        colors: ['Distressed Crimson (#8B2626)', 'Antique Brass Gold (#C5A059)', 'Midnight Blue (#1C2833)', 'Cream (#FDFEFE)'],
        description: 'Classic rich heritage colors rendered in a soft washed vintage finish.'
      }
    ],
    aiDesignAdvice: 'Include keywords like "distressed worn patina", "faded abrash color variations", "intricate fine 100-knot weave", and "vintage antique Persian carpet map".'
  },
  turkish_oushak: {
    id: 'turkish_oushak',
    name: 'Turkish Oushak & Antique Pastel',
    category: 'Transitional & Pastel Heritage',
    description: 'Famous for soft pastel tones, open spacious fields, large floral sprays, and luminous silky wool finishes.',
    signatureMotifs: ['Spacious geometric floral sprays', 'Angular star motifs', 'Large-scale vines', 'Soft abstract palmettes'],
    borderStyles: ['Wide open floral border', 'Simple soft-tone guard border'],
    medallionTypes: ['Large relaxed geometric medallion', 'Open field without central medallion'],
    recommendedFibers: ['Hand-spun Wool', 'Angora Wool', 'Soft Cotton Warp'],
    surfaceTextures: ['Soft medium cut pile', 'Silky luster wool finish'],
    curatedPalettes: [
      {
        name: 'Oushak Pastel Bloom',
        colors: ['Muted Sage (#9CAF88)', 'Soft Apricot (#F4C493)', 'Warm Beige (#EBE3D5)', 'Dusty Terracotta (#D9826C)'],
        description: 'Gentle pastel greens, soft apricot, and warm beige.'
      }
    ],
    aiDesignAdvice: 'Emphasize "open spacious field design", "soft pastel tones", "large geometric palmettes", and "luminous hand-spun wool sheen".'
  },
  modern_abstract: {
    id: 'modern_abstract',
    name: 'Modern Abstract & Painterly',
    category: 'Contemporary Art',
    description: 'Transforms floor space into a fine art canvas with fluid watercolor gradients, bold asymmetrical color blocks, and sculpted relief lines.',
    signatureMotifs: ['Fluid watercolor shapes', 'Overlapping translucent rings', 'Asymmetrical painterly brushstrokes', 'Sculpted relief waves'],
    borderStyles: ['Borderless open canvas', 'Asymmetrical frame edge'],
    medallionTypes: ['No medallion (freestyle abstract composition)'],
    recommendedFibers: ['New Zealand Wool', 'Bamboo Viscose Silk', 'Pure Silk Accents'],
    surfaceTextures: ['Sculpted cut pile with silk relief', 'Variable pile height cut & loop'],
    curatedPalettes: [
      {
        name: 'Gallery Expression',
        colors: ['Moss Green (#556B2F)', 'Ochre Gold (#DAA520)', 'Clay Red (#C05A46)', 'Ivory White (#FAF8F5)'],
        description: 'Vibrant artistic contrast of earthy clay, ochre gold, and deep moss.'
      },
      {
        name: 'Nordic Horizon',
        colors: ['Slate Blue (#5C788A)', 'Seafoam Mist (#A2B9B5)', 'Off White (#E6E4DF)', 'Deep Navy (#3A4856)'],
        description: 'Calming watercolor transition of blue, mist grey, and navy.'
      }
    ],
    aiDesignAdvice: 'Use keywords like "abstract painterly watercolor gradient", "asymmetrical composition", "silk highlights on matte wool base", and "modern gallery floor art".'
  },
  moroccan_berber: {
    id: 'moroccan_berber',
    name: 'Moroccan Berber & Tribal Shag',
    category: 'Boho & Tribal',
    description: 'Inspired by Beni Ourain tribal weaves of the Atlas Mountains. Features plush, thick sheep wool shag pile with iconic charcoal diamond line work.',
    signatureMotifs: ['Irregular hand-drawn diamond grid', 'Tribal chevron lines', 'Abstract Berber geometric symbols'],
    borderStyles: ['Traditional braided fringe top and bottom', 'Unfinished tribal edge'],
    medallionTypes: ['No central medallion (repeating or irregular diamond grid)'],
    recommendedFibers: ['Unbleached Sheep Wool', 'Natural Coarse Wool'],
    surfaceTextures: ['Ultra-plush thick shag pile', 'High-density chunky wool loop'],
    curatedPalettes: [
      {
        name: 'Beni Classic',
        colors: ['Natural Unbleached Wool (#F7F4EC)', 'Dark Charcoal (#2B2A29)', 'Soft Taupe (#D6CEBE)'],
        description: 'Classic creamy off-white wool with dark charcoal geometric diamond lines.'
      }
    ],
    aiDesignAdvice: 'Use keywords like "plush thick shag pile", "irregular hand-drawn charcoal diamond grid", "braided fringe at bottom edge", and "cozy boho sheep wool carpet".'
  },
  scandinavian_kilim: {
    id: 'scandinavian_kilim',
    name: 'Scandinavian Geometric Flatweave & Kilim',
    category: 'Flatweave & Geometric',
    description: 'Clean, reversible flatweave rugs featuring sharp geometric patterns, stripes, and modern color blocking.',
    signatureMotifs: ['Geometric triangles and diamonds', 'Horizontal color block bands', 'Clean chevron stripes'],
    borderStyles: ['Clean flat woven edge', 'Short fringe tassels'],
    medallionTypes: ['Repeating geometric diamond grid'],
    recommendedFibers: ['Flat-woven Wool', 'Organic Cotton Dhurrie Yarn', 'Jute'],
    surfaceTextures: ['Flat woven kilim texture', 'Reversible Dhurrie weave', 'Zero pile matte yarn'],
    curatedPalettes: [
      {
        name: 'Nordic Geometric',
        colors: ['Sand Beige (#E4DCCF)', 'Slate Grey (#7D8897)', 'Mustard Yellow (#E5A93C)', 'Muted Off-White (#FAF7F2)'],
        description: 'Crisp scandi palette of slate grey, mustard yellow, and sand beige.'
      }
    ],
    aiDesignAdvice: 'Use keywords like "flatweave kilim dhurrie texture", "zero pile flat woven yarn grid", "sharp geometric stripes", and "matte natural wool finish".'
  },
  mughal_heritage: {
    id: 'mughal_heritage',
    name: 'Mughal Heritage & Royal Indian Lotus',
    category: 'Heritage & Royal Indian',
    description: 'Celebrates rich Indian carpet weaving art from Jaipur, Kashmir, and Agra. Features intricate Lotus blossoms, Mughal garden lattices, and tone-on-tone silk carving.',
    signatureMotifs: ['Jaipur Lotus medallion', 'Mughal garden lattice (Jali)', 'Kashmiri Chinar leaves', 'Floral meander borders'],
    borderStyles: ['Intricate multi-tier floral border with gold silk guard lines'],
    medallionTypes: ['Deconstructed Lotus flower medallion', 'Royal Mughal octagonal medallion'],
    recommendedFibers: ['Fine Wool', 'Mulberry Silk', 'Bamboo Silk'],
    surfaceTextures: ['Fine 100-knot hand-knotted pile', 'Tone-on-tone cut silk relief'],
    curatedPalettes: [
      {
        name: 'Monochrome Jaipur Gold',
        colors: ['Ivory Base (#FDFBF7)', 'Champagne Gold Silk (#D4AF37)', 'Soft Shadow Grey (#88847B)'],
        description: 'Tone-on-tone ivory base with champagne gold silk highlights.'
      },
      {
        name: 'Royal Kashmiri Sapphire',
        colors: ['Royal Sapphire Blue (#1F3A60)', 'Antique Gold (#D4AF37)', 'Ivory (#F5F5F0)', 'Ruby Red Accents (#900C3F)'],
        description: 'Deep royal blue field with gold and ivory Lotus motifs.'
      }
    ],
    aiDesignAdvice: 'Use keywords like "intricate Mughal garden Lotus medallion", "tone-on-tone silk relief on wool base", "fine 100-knot Kashmiri rug map", and "royal Indian carpet art".'
  }
};

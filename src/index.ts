#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { CARPET_DESIGN_STYLES } from './data/design_styles.js';
import {
  GenerateCarpetDesignPromptSchema,
  handleGenerateCarpetDesignPrompt
} from './tools/promptTool.js';

const server = new Server(
  {
    name: 'carpet-design-mcp',
    version: '2.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Define Schemas for Additional Design Tools
const GetCarpetDesignStylesSchema = z.object({
  category: z.enum([
    'japandi',
    'vintage_persian',
    'turkish_oushak',
    'modern_abstract',
    'moroccan_berber',
    'scandinavian_kilim',
    'mughal_heritage'
  ]).optional().describe('Filter by specific carpet style category. If omitted, returns all styles.')
});

const RefineDesignConceptSchema = z.object({
  conceptDescription: z.string().describe('Rough carpet design idea or text prompt (e.g. "a navy blue and gold rug with flowers").'),
  desiredStyle: z.enum([
    'japandi',
    'vintage_persian',
    'turkish_oushak',
    'modern_abstract',
    'moroccan_berber',
    'scandinavian_kilim',
    'mughal_heritage'
  ]).optional().default('vintage_persian').describe('Target carpet aesthetic to apply.'),
  targetAi: z.enum(['midjourney', 'flux', 'gemini', 'dalle3']).optional().default('midjourney')
});

const GetColorPalettesSchema = z.object({
  styleFilter: z.string().optional().describe('Filter color palettes by carpet style.')
});

// Register Tool Definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_carpet_design_styles',
        description: 'Explore traditional & modern carpet design styles (Japandi, Vintage Persian, Turkish Oushak, Modern Abstract, Moroccan Berber, Scandinavian Kilim, Mughal Heritage). Returns signature motifs, border styles, medallion types, fibers, and curated yarn swatches.',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              enum: ['japandi', 'vintage_persian', 'turkish_oushak', 'modern_abstract', 'moroccan_berber', 'scandinavian_kilim', 'mughal_heritage'],
              description: 'Filter by specific carpet style category.'
            }
          }
        }
      },
      {
        name: 'generate_carpet_design_prompt',
        description: 'Generate hyper-focused 6-layer 2D top-down flat lay AI prompts for carpet and area rug design (Midjourney --tile, FLUX, Gemini Imagen, DALL-E 3).',
        inputSchema: {
          type: 'object',
          properties: {
            style: {
              type: 'string',
              enum: ['japandi', 'vintage_persian', 'turkish_oushak', 'modern_abstract', 'moroccan_berber', 'scandinavian_kilim', 'mughal_heritage'],
              description: 'Carpet style category.'
            },
            motifs: { type: 'string', description: 'Pattern motifs (e.g. "Herati floral scrolls", "carved organic waves").' },
            borderStyle: { type: 'string', description: 'Border design style (e.g. "3-tier floral main border with guard stripes").' },
            medallionType: { type: 'string', description: 'Central medallion type (e.g. "star-shaped central medallion").' },
            weavingTexture: {
              type: 'string',
              enum: ['hand-tufted cut-and-loop', 'hand-knotted 80-knot wool', 'hand-knotted 100-knot silk-blend', 'flatweave-kilim', 'plush-moroccan-shag'],
              description: 'Weaving technique & pile texture.'
            },
            fiberBlend: { type: 'string', description: 'Yarn fiber composition (e.g. "New Zealand Wool with Bamboo Silk").' },
            colorPalette: { type: 'array', items: { type: 'string' }, description: 'Yarn colors or palette.' },
            finishEffects: { type: 'string', description: 'Surface finishing effects (e.g. "faded distressed abrash patina", "high-low 3D carved relief").' },
            targetAi: {
              type: 'string',
              enum: ['midjourney', 'flux', 'gemini', 'dalle3'],
              description: 'Target AI generator model.'
            },
            seamlessTile: { type: 'boolean', description: 'Whether to add seamless tiling flags (--tile).' },
            aspectRatio: { type: 'string', description: 'Aspect ratio (e.g. 1:1, 4:5, 3:4).' }
          },
          required: ['style']
        }
      },
      {
        name: 'refine_carpet_design_concept',
        description: 'Take a rough carpet design concept and refine it into a professional AI design prompt with authentic carpet craftsmanship terminology (Herati borders, abrash fading, lotus medallion, carved relief).',
        inputSchema: {
          type: 'object',
          properties: {
            conceptDescription: { type: 'string', description: 'Rough design idea or description.' },
            desiredStyle: {
              type: 'string',
              enum: ['japandi', 'vintage_persian', 'turkish_oushak', 'modern_abstract', 'moroccan_berber', 'scandinavian_kilim', 'mughal_heritage'],
              description: 'Target aesthetic.'
            },
            targetAi: {
              type: 'string',
              enum: ['midjourney', 'flux', 'gemini', 'dalle3']
            }
          },
          required: ['conceptDescription']
        }
      },
      {
        name: 'get_carpet_color_palettes',
        description: 'Get curated carpet color palettes (Earthy Terracotta, Mineral Japandi, Washed Indigo, Oushak Pastel, Gold Silk) specifically tailored for yarn dyeing and carpet aesthetics.',
        inputSchema: {
          type: 'object',
          properties: {
            styleFilter: { type: 'string', description: 'Optional style name filter.' }
          }
        }
      }
    ]
  };
});

// Handle Tool Executions
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'get_carpet_design_styles') {
      const parsed = GetCarpetDesignStylesSchema.parse(args || {});
      if (parsed.category) {
        return { content: [{ type: 'text', text: JSON.stringify(CARPET_DESIGN_STYLES[parsed.category], null, 2) }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(Object.values(CARPET_DESIGN_STYLES), null, 2) }] };
    }

    if (name === 'generate_carpet_design_prompt') {
      const parsed = GenerateCarpetDesignPromptSchema.parse(args || {});
      const result = handleGenerateCarpetDesignPrompt(parsed);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    }

    if (name === 'refine_carpet_design_concept') {
      const parsed = RefineDesignConceptSchema.parse(args || {});
      const styleData = CARPET_DESIGN_STYLES[parsed.desiredStyle] || CARPET_DESIGN_STYLES.vintage_persian;

      const refinedResult = handleGenerateCarpetDesignPrompt({
        style: parsed.desiredStyle,
        motifs: `${parsed.conceptDescription}, combined with ${styleData.signatureMotifs[0]}`,
        borderStyle: styleData.borderStyles[0],
        medallionType: styleData.medallionTypes[0],
        targetAi: parsed.targetAi,
        seamlessTile: true
      });

      return { content: [{ type: 'text', text: JSON.stringify({
        originalConcept: parsed.conceptDescription,
        appliedStyle: styleData.name,
        refinedAiPrompt: refinedResult.generatedDesignPrompt,
        designBreakdown: refinedResult.promptComponents,
        expertAdvice: refinedResult.carpetDesignTips
      }, null, 2) }] };
    }

    if (name === 'get_carpet_color_palettes') {
      const parsed = GetColorPalettesSchema.parse(args || {});
      let styles = Object.values(CARPET_DESIGN_STYLES);
      if (parsed.styleFilter) {
        styles = styles.filter(s => s.id.includes(parsed.styleFilter!.toLowerCase()) || s.name.toLowerCase().includes(parsed.styleFilter!.toLowerCase()));
      }
      const palettes = styles.flatMap(s => s.curatedPalettes.map(p => ({ style: s.name, ...p })));
      return { content: [{ type: 'text', text: JSON.stringify(palettes, null, 2) }] };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error: any) {
    return {
      isError: true,
      content: [{ type: 'text', text: `Error executing ${name}: ${error?.message || String(error)}` }]
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Carpet Design Intelligence MCP Server (Design Focus) running on stdio');
}

main().catch((error) => {
  console.error('Fatal error starting Carpet Design MCP Server:', error);
  process.exit(1);
});

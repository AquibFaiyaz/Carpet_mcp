#!/usr/bin/env node
import express, { Request, Response } from 'express';
import cors from 'cors';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
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

const PORT = process.env.PORT || 3005;
const MODE = process.env.TRANSPORT_MODE || 'http'; // 'http' or 'stdio'

// Instantiate Core MCP Server
const mcpServer = new Server(
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

// Define Zod Schemas
const GetCarpetDesignStylesSchema = z.object({
  category: z.enum([
    'japandi',
    'vintage_persian',
    'turkish_oushak',
    'modern_abstract',
    'moroccan_berber',
    'scandinavian_kilim',
    'mughal_heritage'
  ]).optional().describe('Filter by specific carpet style category.')
});

const RefineDesignConceptSchema = z.object({
  conceptDescription: z.string().describe('Rough carpet design idea or text prompt.'),
  desiredStyle: z.enum([
    'japandi',
    'vintage_persian',
    'turkish_oushak',
    'modern_abstract',
    'moroccan_berber',
    'scandinavian_kilim',
    'mughal_heritage'
  ]).optional().default('vintage_persian').describe('Target carpet aesthetic.'),
  targetAi: z.enum(['midjourney', 'flux', 'gemini', 'dalle3']).optional().default('midjourney')
});

const GetColorPalettesSchema = z.object({
  styleFilter: z.string().optional().describe('Filter color palettes by carpet style.')
});

// Register Tool Definitions
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
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
        description: 'Get curated carpet color palettes (Earthy Terracotta, Mineral Japandi, Washed Indigo, Oushak Pastel, Gold Silk) specifically tailored for yarn dyeing and rug aesthetics.',
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

// Tool Handler Execution Logic
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
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

// Setup Express HTTP Server & ChatGPT Action Endpoints
async function startHttpServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  let sseTransport: SSEServerTransport | null = null;

  // Root & Health check
  app.get('/', (req: Request, res: Response) => {
    res.json({
      name: 'Carpet Design Intelligence MCP & ChatGPT API',
      status: 'active',
      endpoints: {
        mcpSse: 'https://aquib.online/mcp/sse',
        chatGptOpenApiSchema: 'https://aquib.online/mcp/openapi.json',
        tools: [
          'https://aquib.online/mcp/api/get_carpet_design_styles',
          'https://aquib.online/mcp/api/generate_carpet_design_prompt',
          'https://aquib.online/mcp/api/refine_carpet_design_concept',
          'https://aquib.online/mcp/api/get_carpet_color_palettes'
        ]
      }
    });
  });

  // MCP SSE Transport for Remote MCP Clients
  app.get(['/sse', '/mcp/sse'], async (req: Request, res: Response) => {
    console.log('New MCP SSE connection established');
    sseTransport = new SSEServerTransport('/mcp/messages', res);
    await mcpServer.connect(sseTransport);
  });

  app.post(['/messages', '/mcp/messages'], async (req: Request, res: Response) => {
    if (sseTransport) {
      await sseTransport.handlePostMessage(req, res);
    } else {
      res.status(400).json({ error: 'No active SSE connection' });
    }
  });

  // ChatGPT Actions OpenAPI 3.0 Schema Endpoint
  app.get(['/openapi.json', '/mcp/openapi.json'], (req: Request, res: Response) => {
    res.json({
      openapi: '3.1.0',
      info: {
        title: 'Carpet Design Intelligence API for ChatGPT',
        version: '2.0.0',
        description: 'AI Prompt Engineering and Craftsman Knowledge API for Indian Carpet & Area Rug Exporters.'
      },
      servers: [
        { url: 'https://aquib.online/mcp' }
      ],
      paths: {
        '/api/generate_carpet_design_prompt': {
          post: {
            summary: 'Generate AI carpet design prompt',
            operationId: 'generate_carpet_design_prompt',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['style'],
                    properties: {
                      style: { type: 'string', enum: ['japandi', 'vintage_persian', 'turkish_oushak', 'modern_abstract', 'moroccan_berber', 'scandinavian_kilim', 'mughal_heritage'] },
                      motifs: { type: 'string', description: 'Pattern motifs' },
                      borderStyle: { type: 'string', description: 'Border style' },
                      medallionType: { type: 'string', description: 'Medallion type' },
                      weavingTexture: { type: 'string', enum: ['hand-tufted cut-and-loop', 'hand-knotted 80-knot wool', 'hand-knotted 100-knot silk-blend', 'flatweave-kilim', 'plush-moroccan-shag'] },
                      fiberBlend: { type: 'string', description: 'Fibers (e.g. New Zealand Wool)' },
                      colorPalette: { type: 'array', items: { type: 'string' } },
                      targetAi: { type: 'string', enum: ['midjourney', 'flux', 'gemini', 'dalle3'] }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Generated prompt and design components' }
            }
          }
        },
        '/api/refine_carpet_design_concept': {
          post: {
            summary: 'Refine a rough carpet design concept into a professional AI prompt',
            operationId: 'refine_carpet_design_concept',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['conceptDescription'],
                    properties: {
                      conceptDescription: { type: 'string', description: 'Rough rug idea' },
                      desiredStyle: { type: 'string', enum: ['japandi', 'vintage_persian', 'turkish_oushak', 'modern_abstract', 'moroccan_berber', 'scandinavian_kilim', 'mughal_heritage'] }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Refined prompt result' }
            }
          }
        },
        '/api/get_carpet_design_styles': {
          post: {
            summary: 'Get detailed specs for carpet design styles',
            operationId: 'get_carpet_design_styles',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      category: { type: 'string', enum: ['japandi', 'vintage_persian', 'turkish_oushak', 'modern_abstract', 'moroccan_berber', 'scandinavian_kilim', 'mughal_heritage'] }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Carpet style specifications' }
            }
          }
        },
        '/api/get_carpet_color_palettes': {
          post: {
            summary: 'Get curated yarn color palettes',
            operationId: 'get_carpet_color_palettes',
            requestBody: {
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      styleFilter: { type: 'string' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Yarn color palettes' }
            }
          }
        }
      }
    });
  });

  // REST API Endpoints for ChatGPT Actions
  app.post(['/api/generate_carpet_design_prompt', '/mcp/api/generate_carpet_design_prompt'], (req: Request, res: Response) => {
    try {
      const parsed = GenerateCarpetDesignPromptSchema.parse(req.body || {});
      const result = handleGenerateCarpetDesignPrompt(parsed);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || String(err) });
    }
  });

  app.post(['/api/refine_carpet_design_concept', '/mcp/api/refine_carpet_design_concept'], (req: Request, res: Response) => {
    try {
      const parsed = RefineDesignConceptSchema.parse(req.body || {});
      const styleData = CARPET_DESIGN_STYLES[parsed.desiredStyle] || CARPET_DESIGN_STYLES.vintage_persian;
      const refinedResult = handleGenerateCarpetDesignPrompt({
        style: parsed.desiredStyle,
        motifs: `${parsed.conceptDescription}, combined with ${styleData.signatureMotifs[0]}`,
        borderStyle: styleData.borderStyles[0],
        medallionType: styleData.medallionTypes[0],
        targetAi: parsed.targetAi,
        seamlessTile: true
      });
      res.json({
        originalConcept: parsed.conceptDescription,
        appliedStyle: styleData.name,
        refinedAiPrompt: refinedResult.generatedDesignPrompt,
        designBreakdown: refinedResult.promptComponents,
        expertAdvice: refinedResult.carpetDesignTips
      });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || String(err) });
    }
  });

  app.post(['/api/get_carpet_design_styles', '/mcp/api/get_carpet_design_styles'], (req: Request, res: Response) => {
    try {
      const parsed = GetCarpetDesignStylesSchema.parse(req.body || {});
      if (parsed.category) {
        res.json(CARPET_DESIGN_STYLES[parsed.category]);
      } else {
        res.json(Object.values(CARPET_DESIGN_STYLES));
      }
    } catch (err: any) {
      res.status(400).json({ error: err?.message || String(err) });
    }
  });

  app.post(['/api/get_carpet_color_palettes', '/mcp/api/get_carpet_color_palettes'], (req: Request, res: Response) => {
    try {
      const parsed = GetColorPalettesSchema.parse(req.body || {});
      let styles = Object.values(CARPET_DESIGN_STYLES);
      if (parsed.styleFilter) {
        styles = styles.filter(s => s.id.includes(parsed.styleFilter!.toLowerCase()) || s.name.toLowerCase().includes(parsed.styleFilter!.toLowerCase()));
      }
      const palettes = styles.flatMap(s => s.curatedPalettes.map(p => ({ style: s.name, ...p })));
      res.json(palettes);
    } catch (err: any) {
      res.status(400).json({ error: err?.message || String(err) });
    }
  });

  app.listen(PORT, () => {
    console.log(`Carpet Design MCP & ChatGPT Server running on http://localhost:${PORT}`);
  });
}

// Mode Dispatcher
if (MODE === 'stdio') {
  const transport = new StdioServerTransport();
  mcpServer.connect(transport).then(() => {
    console.error('Carpet Design MCP Server running on stdio');
  });
} else {
  startHttpServer();
}

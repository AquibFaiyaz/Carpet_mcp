#!/usr/bin/env node
import express, { Request, Response } from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
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

// Tool Definitions for MCP
const TOOL_DEFINITIONS = [
  {
    name: 'get_carpet_design_styles',
    description: 'Explore traditional & modern carpet design styles (Japandi, Vintage Persian, Turkish Oushak, Modern Abstract, Moroccan Berber, Scandinavian Kilim, Mughal Heritage). Returns signature motifs, border styles, medallion types, fibers, and curated yarn swatches.',
    inputSchema: {
      type: 'object' as const,
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
      type: 'object' as const,
      properties: {
        style: {
          type: 'string',
          enum: ['japandi', 'vintage_persian', 'turkish_oushak', 'modern_abstract', 'moroccan_berber', 'scandinavian_kilim', 'mughal_heritage'],
          description: 'Carpet style category.'
        },
        motifs: { type: 'string', description: 'Pattern motifs (e.g. "Herati floral scrolls", "carved organic waves").' },
        borderStyle: { type: 'string', description: 'Border design style.' },
        medallionType: { type: 'string', description: 'Central medallion type.' },
        weavingTexture: {
          type: 'string',
          enum: ['hand-tufted cut-and-loop', 'hand-knotted 80-knot wool', 'hand-knotted 100-knot silk-blend', 'flatweave-kilim', 'plush-moroccan-shag'],
          description: 'Weaving technique & pile texture.'
        },
        fiberBlend: { type: 'string', description: 'Yarn fiber composition.' },
        colorPalette: { type: 'array', items: { type: 'string' }, description: 'Yarn colors or palette.' },
        finishEffects: { type: 'string', description: 'Surface finishing effects.' },
        targetAi: { type: 'string', enum: ['midjourney', 'flux', 'gemini', 'dalle3'], description: 'Target AI generator model.' },
        seamlessTile: { type: 'boolean', description: 'Whether to add seamless tiling flags (--tile).' },
        aspectRatio: { type: 'string', description: 'Aspect ratio (e.g. 1:1, 4:5, 3:4).' }
      },
      required: ['style']
    }
  },
  {
    name: 'refine_carpet_design_concept',
    description: 'Take a rough carpet design concept and refine it into a professional AI design prompt with authentic carpet craftsmanship terminology.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        conceptDescription: { type: 'string', description: 'Rough design idea or description.' },
        desiredStyle: {
          type: 'string',
          enum: ['japandi', 'vintage_persian', 'turkish_oushak', 'modern_abstract', 'moroccan_berber', 'scandinavian_kilim', 'mughal_heritage'],
          description: 'Target aesthetic.'
        },
        targetAi: { type: 'string', enum: ['midjourney', 'flux', 'gemini', 'dalle3'] }
      },
      required: ['conceptDescription']
    }
  },
  {
    name: 'get_carpet_color_palettes',
    description: 'Get curated carpet color palettes specifically tailored for yarn dyeing and rug aesthetics.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        styleFilter: { type: 'string', description: 'Optional style name filter.' }
      }
    }
  }
];

// Tool execution handler
function handleToolCall(name: string, args: any) {
  if (name === 'get_carpet_design_styles') {
    const parsed = GetCarpetDesignStylesSchema.parse(args || {});
    if (parsed.category) {
      return CARPET_DESIGN_STYLES[parsed.category];
    }
    return Object.values(CARPET_DESIGN_STYLES);
  }

  if (name === 'generate_carpet_design_prompt') {
    const parsed = GenerateCarpetDesignPromptSchema.parse(args || {});
    return handleGenerateCarpetDesignPrompt(parsed);
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
    return {
      originalConcept: parsed.conceptDescription,
      appliedStyle: styleData.name,
      refinedAiPrompt: refinedResult.generatedDesignPrompt,
      designBreakdown: refinedResult.promptComponents,
      expertAdvice: refinedResult.carpetDesignTips
    };
  }

  if (name === 'get_carpet_color_palettes') {
    const parsed = GetColorPalettesSchema.parse(args || {});
    let styles = Object.values(CARPET_DESIGN_STYLES);
    if (parsed.styleFilter) {
      styles = styles.filter(s => s.id.includes(parsed.styleFilter!.toLowerCase()) || s.name.toLowerCase().includes(parsed.styleFilter!.toLowerCase()));
    }
    return styles.flatMap(s => s.curatedPalettes.map(p => ({ style: s.name, ...p })));
  }

  throw new Error(`Unknown tool: ${name}`);
}

// Configure MCP Server handlers
function configureMcpServer(server: Server) {
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOL_DEFINITIONS };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      const result = handleToolCall(name, args);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (error: any) {
      return {
        isError: true,
        content: [{ type: 'text', text: `Error executing ${name}: ${error?.message || String(error)}` }]
      };
    }
  });
}

function createConfiguredServer(): Server {
  const server = new Server(
    { name: 'carpet-design-mcp', version: '2.0.0' },
    { capabilities: { tools: {} } }
  );
  configureMcpServer(server);
  return server;
}

// ========== HTTP Server (Dual Transport + ChatGPT Actions) ==========
async function startHttpServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // Active transports by session ID
  const sseTransports = new Map<string, SSEServerTransport>();
  const streamableTransports = new Map<string, StreamableHTTPServerTransport>();

  // Diagnostic logger
  app.use((req, _res, next) => {
    const sessId = req.headers['mcp-session-id'] || req.query.sessionId || '-';
    console.log(`[HTTP] ${req.method} ${req.url} | Session: ${sessId} | UA: ${req.headers['user-agent'] || '-'}`);
    next();
  });

  const serverInfo = {
    name: 'Carpet Design Intelligence MCP Server',
    version: '2.0.0',
    status: 'active',
    mcpEndpoint: 'https://aquib.online/mcp',
    mcpSseEndpoint: 'https://aquib.online/mcp/sse',
    openApiSchema: 'https://aquib.online/mcp/openapi.json',
    tools: TOOL_DEFINITIONS.map(t => t.name)
  };

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json(serverInfo);
  });

  // OpenAPI 3.1.0 schema for ChatGPT Custom GPT Actions
  app.get(['/openapi.json', '/mcp/openapi.json'], (_req: Request, res: Response) => {
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
                      style: {
                        type: 'string',
                        enum: ['japandi', 'vintage_persian', 'turkish_oushak', 'modern_abstract', 'moroccan_berber', 'scandinavian_kilim', 'mughal_heritage']
                      },
                      motifs: { type: 'string' },
                      borderStyle: { type: 'string' },
                      medallionType: { type: 'string' },
                      weavingTexture: { type: 'string' },
                      fiberBlend: { type: 'string' },
                      colorPalette: { type: 'array', items: { type: 'string' } },
                      finishEffects: { type: 'string' },
                      targetAi: { type: 'string', enum: ['midjourney', 'flux', 'gemini', 'dalle3'] },
                      seamlessTile: { type: 'boolean' },
                      aspectRatio: { type: 'string' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Generated AI prompt with design breakdown' }
            }
          }
        },
        '/api/refine_carpet_design_concept': {
          post: {
            summary: 'Refine a raw design idea into a production AI prompt',
            operationId: 'refine_carpet_design_concept',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['conceptDescription'],
                    properties: {
                      conceptDescription: { type: 'string' },
                      desiredStyle: {
                        type: 'string',
                        enum: ['japandi', 'vintage_persian', 'turkish_oushak', 'modern_abstract', 'moroccan_berber', 'scandinavian_kilim', 'mughal_heritage']
                      },
                      targetAi: { type: 'string', enum: ['midjourney', 'flux', 'gemini', 'dalle3'] }
                    }
                  }
                }
              }
            },
            responses: {
              '200': { description: 'Refined prompt with craftsmanship terminology' }
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
                      category: {
                        type: 'string',
                        enum: ['japandi', 'vintage_persian', 'turkish_oushak', 'modern_abstract', 'moroccan_berber', 'scandinavian_kilim', 'mughal_heritage']
                      }
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

  // Helper: Start Legacy SSEServerTransport
  const handleSseConnection = async (req: Request, res: Response) => {
    console.log(`[MCP SSE] Creating legacy SSE connection from ${req.ip}`);
    const transport = new SSEServerTransport('/mcp/messages', res);
    const server = createConfiguredServer();

    transport.onclose = () => {
      console.log(`[MCP SSE] Closed session: ${transport.sessionId}`);
      sseTransports.delete(transport.sessionId);
    };

    sseTransports.set(transport.sessionId, transport);
    await server.connect(transport);
    console.log(`[MCP SSE] Connected session: ${transport.sessionId}`);
  };

  // Dedicated SSE endpoints (for clients specifying /sse or /mcp/sse)
  app.get(['/sse', '/mcp/sse'], handleSseConnection);

  // Dedicated POST message endpoints for legacy SSE clients
  app.post(['/mcp/messages', '/messages', '/mcp/message', '/message'], async (req: Request, res: Response) => {
    const sessionId = (req.query.sessionId as string) || (req.headers['mcp-session-id'] as string);
    if (!sessionId) {
      res.status(400).json({ error: 'Missing sessionId query parameter or mcp-session-id header' });
      return;
    }
    const transport = sseTransports.get(sessionId);
    if (!transport) {
      res.status(404).json({ error: `Session not found: ${sessionId}` });
      return;
    }
    try {
      await transport.handlePostMessage(req, res, req.body);
    } catch (err: any) {
      console.error('[MCP SSE] Error in handlePostMessage:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: err?.message || String(err) });
      }
    }
  });

  // ========== Primary MCP Endpoint (Streamable HTTP + Probe Handler) ==========
  // ChatGPT MCP, Claude, and modern MCP clients communicate with /mcp (or /)
  app.all(['/', '/mcp', '/mcp/'], async (req: Request, res: Response) => {
    const sessionIdHeader = req.headers['mcp-session-id'] as string | undefined;
    const sessionIdQuery = req.query.sessionId as string | undefined;
    const sessionId = sessionIdHeader || sessionIdQuery;

    // 1. Existing Streamable HTTP Session
    if (sessionId && streamableTransports.has(sessionId)) {
      const transport = streamableTransports.get(sessionId)!;
      await transport.handleRequest(req, res, req.body);
      return;
    }

    // 2. Existing SSE Session (POST message to /mcp?sessionId=...)
    if (sessionId && sseTransports.has(sessionId)) {
      if (req.method === 'POST') {
        const transport = sseTransports.get(sessionId)!;
        await transport.handlePostMessage(req, res, req.body);
        return;
      }
    }

    // 3. Unknown Session ID provided
    if (sessionId) {
      console.warn(`[MCP Router] Session ID not found: ${sessionId}`);
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    // 4. No Session ID provided:
    // 4A. GET Request
    if (req.method === 'GET') {
      // Legacy SSE probe without session ID (Accept: text/event-stream)
      if (req.headers['accept']?.includes('text/event-stream')) {
        return handleSseConnection(req, res);
      }
      // Browser GET -> Display status JSON
      res.json(serverInfo);
      return;
    }

    // 4B. POST Request -> New Streamable HTTP Session Initialization
    if (req.method === 'POST') {
      console.log(`[Streamable HTTP] Initializing new session...`);
      let transport: StreamableHTTPServerTransport;

      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (newId: string) => {
          console.log(`[Streamable HTTP] onsessioninitialized: ${newId}`);
          streamableTransports.set(newId, transport);
        },
        onsessionclosed: (closedId: string) => {
          console.log(`[Streamable HTTP] onsessionclosed: ${closedId}`);
          streamableTransports.delete(closedId);
        }
      });

      const server = createConfiguredServer();

      transport.onclose = () => {
        if (transport.sessionId) {
          console.log(`[Streamable HTTP] onclose: ${transport.sessionId}`);
          streamableTransports.delete(transport.sessionId);
        }
      };

      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);

      // Verify session is stored
      if (transport.sessionId && !streamableTransports.has(transport.sessionId)) {
        console.log(`[Streamable HTTP] Registering session: ${transport.sessionId}`);
        streamableTransports.set(transport.sessionId, transport);
      }
      return;
    }

    // 4C. DELETE Request without session ID
    if (req.method === 'DELETE') {
      res.status(400).json({ error: 'Missing mcp-session-id header' });
      return;
    }

    res.status(405).json({ error: 'Method Not Allowed' });
  });

  // ========== REST API Endpoints (for direct HTTP calls & ChatGPT Actions) ==========
  app.post(['/api/generate_carpet_design_prompt', '/mcp/api/generate_carpet_design_prompt'], (req: Request, res: Response) => {
    try { res.json(handleToolCall('generate_carpet_design_prompt', req.body)); }
    catch (err: any) { res.status(400).json({ error: err?.message || String(err) }); }
  });

  app.post(['/api/refine_carpet_design_concept', '/mcp/api/refine_carpet_design_concept'], (req: Request, res: Response) => {
    try { res.json(handleToolCall('refine_carpet_design_concept', req.body)); }
    catch (err: any) { res.status(400).json({ error: err?.message || String(err) }); }
  });

  app.post(['/api/get_carpet_design_styles', '/mcp/api/get_carpet_design_styles'], (req: Request, res: Response) => {
    try { res.json(handleToolCall('get_carpet_design_styles', req.body)); }
    catch (err: any) { res.status(400).json({ error: err?.message || String(err) }); }
  });

  app.post(['/api/get_carpet_color_palettes', '/mcp/api/get_carpet_color_palettes'], (req: Request, res: Response) => {
    try { res.json(handleToolCall('get_carpet_color_palettes', req.body)); }
    catch (err: any) { res.status(400).json({ error: err?.message || String(err) }); }
  });

  app.listen(PORT, () => {
    console.log(`Carpet Design MCP Server running on http://localhost:${PORT}`);
    console.log(`- MCP Endpoint: https://aquib.online/mcp`);
    console.log(`- MCP SSE Direct: https://aquib.online/mcp/sse`);
    console.log(`- OpenAPI 3.1.0: https://aquib.online/mcp/openapi.json`);
  });
}

// ========== STDIO Mode ==========
if (MODE === 'stdio') {
  const server = createConfiguredServer();
  const transport = new StdioServerTransport();
  server.connect(transport).then(() => {
    console.error('Carpet Design MCP Server running on stdio');
  });
} else {
  startHttpServer();
}

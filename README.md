# Carpet Design Intelligence MCP Server (`carpet-design-mcp`)

![CI/CD Pipeline](https://github.com/AquibFaiyaz/Carpet_mcp/actions/workflows/deploy.yml/badge.svg)

A specialized **Model Context Protocol (MCP)** server built for Indian carpet exporters, manufacturers, and interior designers to design, validate, and sell rugs overseas.

This server bridges **overseas market intelligence (Etsy/US/EU trends)**, **AI prompt engineering (Midjourney, FLUX, Gemini, DALL-E 3)**, **Indian weaving specifications (Bhadohi, Jaipur, Panipat)**, and **Etsy SEO listing generation**.

---

## Features & Available Tools

### 1. `get_carpet_design_styles`
* **Purpose**: Explores 7 core carpet design categories: Japandi, Vintage Persian, Turkish Oushak, Modern Abstract, Moroccan Berber, Scandinavian Kilim, and Mughal Heritage.
* **Returns**: Signature motifs, border styles, medallion types, fibers, and curated yarn swatches.

### 2. `generate_carpet_design_prompt`
* **Purpose**: Generates hyper-focused 6-layer 2D top-down flat lay AI prompts for carpet and area rug design.
* **Returns**: Optimized AI prompt string with perspective lock (`top-down flat lay view`), weave texture specs, color palette, and seamless tile parameters (`--tile` for Midjourney).

### 3. `refine_carpet_design_concept`
* **Purpose**: Takes a rough carpet design concept and enriches it into a professional AI design prompt with authentic carpet craftsmanship terminology (Herati borders, abrash fading, lotus medallion, carved relief).

### 4. `get_carpet_color_palettes`
* **Purpose**: Gets curated carpet color palettes (Earthy Terracotta, Mineral Japandi, Washed Indigo, Oushak Pastel, Gold Silk) specifically tailored for yarn dyeing and rug aesthetics.

---

## Installation & Setup

### Prerequisites
* Node.js v18 or higher installed on your system.

### Build from Source
```bash
git clone https://github.com/AquibFaiyaz/Carpet_mcp.git
cd Carpet_mcp
npm install
npm run build
```

---

## Configuration for MCP Hosts

### 1. Claude Desktop
Add the following snippet to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "carpet-design-mcp": {
      "command": "node",
      "args": [
        "/Users/aquibfaiyaz/Desktop/Learning Resources/Carpet_mcp/dist/index.js"
      ]
    }
  }
}
```

### 2. Antigravity IDE / Cursor
Add to your workspace `.vscode/settings.json` or `.agents/mcp_config.json`:

```json
{
  "mcpServers": {
    "carpet-design-mcp": {
      "command": "npx",
      "args": [
        "-y",
        "tsx",
        "/Users/aquibfaiyaz/Desktop/Learning Resources/Carpet_mcp/src/index.ts"
      ]
    }
  }
}
```

---

## Automated CI/CD & VPS Deployment

This repository includes a GitHub Actions CI/CD pipeline ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).
Every commit pushed to the `main` branch automatically:
1. Runs TypeScript typechecking (`npm run typecheck`).
2. Compiles production JS bundle (`npm run build`).
3. Executes automated integration tests (`npx tsx scripts/test_tools.ts`).
4. SSHs into your VPS server (`166.0.244.81`) and reloads PM2 (`pm2 restart carpet-mcp`).

---

## License
MIT License

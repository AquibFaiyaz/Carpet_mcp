# Carpet Design Intelligence MCP Server (`carpet-design-mcp`)

A specialized **Model Context Protocol (MCP)** server built for Indian carpet exporters, manufacturers, and interior designers to design, validate, and sell rugs overseas.

This server bridges **overseas market intelligence (Etsy/US/EU trends)**, **AI prompt engineering (Midjourney, FLUX, Gemini, DALL-E 3)**, **Indian weaving specifications (Bhadohi, Jaipur, Panipat)**, and **Etsy SEO listing generation**.

---

## Features & Available Tools

### 1. `get_carpet_market_trends`
* **Purpose**: Queries market intelligence profiles for major overseas target regions (US, EU, UK, GCC).
* **Returns**: Recommended styles (Japandi, Vintage Revival, Modern Abstract, Moroccan Shag), color palettes (Hex/Pantone), trending motifs, Etsy search tags, and buyer insights.

### 2. `generate_carpet_ai_prompt`
* **Purpose**: Generates structured, 6-layer top-down orthographic AI prompts for carpet and area rug design.
* **Returns**: Optimized AI prompt string with perspective lock (`top-down flat lay view`), weave texture specs, color palette, and seamless tile parameters (`--tile` for Midjourney).

### 3. `validate_manufacturing_specs`
* **Purpose**: Validates whether a proposed design is technically and financially manufacturable in Indian weaving centers (Bhadohi, Jaipur, Panipat).
* **Returns**: Color count feasibility check, knot density recommendations, pile height limits, production lead times, and cost tier warnings.

### 4. `generate_weaver_tech_sheet`
* **Purpose**: Formats a design idea into a complete Technical Naksha Specification Sheet for master weavers in India.
* **Returns**: Warp/weft yarn specs, indexed yarn dye swatch list (max 12 colors), carving relief instructions, and master weaver quality checklists.

### 5. `generate_etsy_listing_metadata`
* **Purpose**: Generates high-converting Etsy SEO listing metadata.
* **Returns**: Etsy SEO title (< 140 chars), 13 targeted search tags, storytelling product description, care instructions, and shipping specs.

---

## Installation & Setup

### Prerequisites
* Node.js v18 or higher installed on your system.

### Build from Source
```bash
git clone <repository-url>
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

## Example Usage Prompts

Here are examples of how you can talk to an AI assistant once this MCP server is active:

1. *"What rug styles and color palettes are trending on Etsy in the US for Japandi decor?"*
2. *"Generate a Midjourney prompt for a Japandi hand-tufted wool carpet with high-low carved organic lines in muted terracotta and almond cream."*
3. *"Check if a hand-tufted rug design with 15 colors and 3D carving is easy to weave in Bhadohi."*
4. *"Create a technical Naksha spec sheet for an 8x10 ft Japandi rug named 'Komorebi Wave'."*
5. *"Generate an Etsy listing title, 13 tags, and description for our new hand-tufted New Zealand wool rug."*

---

## License
MIT License

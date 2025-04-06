#!/usr/bin/env node

/**
 * StylePilot MCP Server
 * 基于Model Context Protocol (MCP)的风格模板服务
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import * as fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径（ES模块中的__dirname替代方案）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 风格模板类型定义
type Style = {
  id: string;
  name: string;
  description: string;
  template: any;
};

// 风格类别
const CATEGORIES = ['text', 'card', 'structure'];

// 使用相对于脚本文件的路径
const DATA_DIR = path.resolve(__dirname, '../data');

// 风格模板文件映射
const STYLE_FILES: Record<string, string> = {
  'text': path.join(DATA_DIR, 'text_styles.json'),
  'card': path.join(DATA_DIR, 'card_styles.json'),
  'structure': path.join(DATA_DIR, 'structure_styles.json')
};

// 服务器实例创建
const server = new Server(
  {
    name: "stylepilot",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

// 确保数据目录存在
async function ensureDataDirExists() {
  try {
    console.error(`正在检查数据目录: ${DATA_DIR}`);
    await fs.access(DATA_DIR);
    console.error(`数据目录已存在`);
  } catch (error) {
    console.error(`数据目录不存在，正在创建...`);
    try {
      await fs.mkdir(DATA_DIR, { recursive: true });
      console.error(`数据目录创建成功`);
    } catch (mkdirError) {
      console.error(`创建数据目录失败: ${mkdirError}`);
      throw mkdirError;
    }
  }

  // 确保每个风格文件存在
  for (const category of CATEGORIES) {
    const filePath = STYLE_FILES[category];
    try {
      console.error(`检查风格文件: ${filePath}`);
      await fs.access(filePath);
      console.error(`风格文件 ${category} 已存在`);
    } catch (error) {
      console.error(`风格文件 ${category} 不存在，正在创建...`);
      try {
        // 如果文件不存在，创建一个空的风格列表
        await fs.writeFile(filePath, JSON.stringify({ styles: [] }, null, 2));
        console.error(`风格文件 ${category} 创建成功`);
      } catch (writeError) {
        console.error(`创建风格文件 ${category} 失败: ${writeError}`);
        throw writeError;
      }
    }
  }
}

// 读取指定类别的风格
async function readStyles(category: string): Promise<Style[]> {
  const filePath = STYLE_FILES[category];
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.styles || [];
  } catch (error) {
    console.error(`Error reading styles for category ${category}:`, error);
    return [];
  }
}

// 写入指定类别的风格
async function writeStyles(category: string, styles: Style[]): Promise<void> {
  const filePath = STYLE_FILES[category];
  try {
    await fs.writeFile(filePath, JSON.stringify({ styles }, null, 2));
  } catch (error) {
    console.error(`Error writing styles for category ${category}:`, error);
    throw error;
  }
}

// 获取所有风格
async function getAllStyles(): Promise<Record<string, Style[]>> {
  const result: Record<string, Style[]> = {};
  
  for (const category of CATEGORIES) {
    result[category] = await readStyles(category);
  }
  
  return result;
}

// 实现ListResourcesRequestSchema处理程序
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const allStylesByCategory = await getAllStyles();
  const resources = [];

  for (const [category, styles] of Object.entries(allStylesByCategory)) {
    for (const style of styles) {
      resources.push({
        uri: `style:///${category}/${style.id}`,
        mimeType: "application/json",
        name: style.name,
        description: style.description || `A ${category} style template`
      });
    }
  }

  return { resources };
});

// 实现ReadResourceRequestSchema处理程序
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const url = new URL(request.params.uri);
  const parts = url.pathname.replace(/^\//, '').split('/');
  
  if (parts.length !== 2) {
    throw new Error("Invalid style URI format. Expected: style:///{category}/{style_id}");
  }

  const [category, styleId] = parts;
  
  if (!CATEGORIES.includes(category)) {
    throw new Error(`Invalid style category: ${category}`);
  }

  const styles = await readStyles(category);
  const style = styles.find(s => s.id === styleId);

  if (!style) {
    throw new Error(`Style not found: ${styleId} in category ${category}`);
  }

  return {
    contents: [{
      uri: request.params.uri,
      mimeType: "application/json",
      text: JSON.stringify(style.template, null, 2)
    }]
  };
});

// 实现ListToolsRequestSchema处理程序
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_style",
        description: "Get a specific style template by category and ID",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Category of the style (text, card, structure)"
            },
            style_id: {
              type: "string",
              description: "ID of the style to retrieve"
            }
          },
          required: ["category", "style_id"]
        }
      },
      {
        name: "search_style",
        description: "Search for styles by keywords or description",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Keywords to search for in style names and descriptions"
            },
            category: {
              type: "string",
              description: "Optional category to restrict search (text, card, structure)"
            }
          },
          required: ["query"]
        }
      },
      {
        name: "create_style",
        description: "Create a new style template",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Category of the style (text, card, structure)"
            },
            id: {
              type: "string",
              description: "Unique ID for the new style"
            },
            name: {
              type: "string",
              description: "Name of the style"
            },
            description: {
              type: "string",
              description: "Description of the style"
            },
            template: {
              type: "object",
              description: "The style template definition"
            }
          },
          required: ["category", "id", "name", "description", "template"]
        }
      },
      {
        name: "update_style",
        description: "Update an existing style template",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Category of the style (text, card, structure)"
            },
            style_id: {
              type: "string",
              description: "ID of the style to update"
            },
            name: {
              type: "string",
              description: "Updated name of the style"
            },
            description: {
              type: "string",
              description: "Updated description of the style"
            },
            template: {
              type: "object",
              description: "Updated style template definition"
            }
          },
          required: ["category", "style_id"]
        }
      },
      {
        name: "delete_style",
        description: "Delete a style template",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Category of the style (text, card, structure)"
            },
            style_id: {
              type: "string",
              description: "ID of the style to delete"
            }
          },
          required: ["category", "style_id"]
        }
      },
      {
        name: "list_styles",
        description: "List available styles in a category or all categories",
        inputSchema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Category of styles to list (text, card, structure), or 'all' for all categories"
            }
          }
        }
      }
    ]
  };
});

// 实现CallToolRequestSchema处理程序
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "get_style": {
      const category = String(request.params.arguments?.category);
      const styleId = String(request.params.arguments?.style_id);
      
      if (!category || !styleId) {
        throw new Error("Category and style_id are required");
      }
      
      if (!CATEGORIES.includes(category)) {
        throw new Error(`Invalid category: ${category}`);
      }
      
      const styles = await readStyles(category);
      const style = styles.find(s => s.id === styleId);
      
      if (!style) {
        throw new Error(`Style not found: ${styleId} in category ${category}`);
      }
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(style, null, 2)
        }]
      };
    }
    
    case "search_style": {
      const query = String(request.params.arguments?.query).toLowerCase();
      const category = request.params.arguments?.category ? 
        String(request.params.arguments.category) : undefined;
      
      if (!query) {
        throw new Error("Search query is required");
      }
      
      if (category && !CATEGORIES.includes(category)) {
        throw new Error(`Invalid category: ${category}`);
      }
      
      const results: Array<Style & { category: string }> = [];
      
      if (category) {
        // 搜索特定类别
        const styles = await readStyles(category);
        styles.forEach(style => {
          if (style.id.toLowerCase().includes(query) || 
              style.name.toLowerCase().includes(query) || 
              style.description.toLowerCase().includes(query)) {
            results.push({ ...style, category });
          }
        });
      } else {
        // 搜索所有类别
        for (const cat of CATEGORIES) {
          const styles = await readStyles(cat);
          styles.forEach(style => {
            if (style.id.toLowerCase().includes(query) || 
                style.name.toLowerCase().includes(query) || 
                style.description.toLowerCase().includes(query)) {
              results.push({ ...style, category: cat });
            }
          });
        }
      }
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(
            { 
              query, 
              category: category || 'all', 
              total: results.length,
              results 
            }, 
            null, 
            2
          )
        }]
      };
    }
    
    case "create_style": {
      const category = String(request.params.arguments?.category);
      const id = String(request.params.arguments?.id);
      const name = String(request.params.arguments?.name);
      const description = String(request.params.arguments?.description);
      const template = request.params.arguments?.template;
      
      if (!category || !id || !name || !description || !template) {
        throw new Error("All fields (category, id, name, description, template) are required");
      }
      
      if (!CATEGORIES.includes(category)) {
        throw new Error(`Invalid category: ${category}`);
      }
      
      const styles = await readStyles(category);
      
      if (styles.some(s => s.id === id)) {
        throw new Error(`Style with ID ${id} already exists in category ${category}`);
      }
      
      const newStyle: Style = {
        id,
        name,
        description,
        template
      };
      
      styles.push(newStyle);
      await writeStyles(category, styles);
      
      return {
        content: [{
          type: "text",
          text: `Created style ${id} in category ${category}`
        }]
      };
    }
    
    case "update_style": {
      const category = String(request.params.arguments?.category);
      const styleId = String(request.params.arguments?.style_id);
      
      if (!category || !styleId) {
        throw new Error("Category and style_id are required");
      }
      
      if (!CATEGORIES.includes(category)) {
        throw new Error(`Invalid category: ${category}`);
      }
      
      const styles = await readStyles(category);
      const styleIndex = styles.findIndex(s => s.id === styleId);
      
      if (styleIndex === -1) {
        throw new Error(`Style not found: ${styleId} in category ${category}`);
      }
      
      // 更新风格属性
      const updatedStyle = { ...styles[styleIndex] };
      
      if (request.params.arguments?.name) {
        updatedStyle.name = String(request.params.arguments.name);
      }
      
      if (request.params.arguments?.description) {
        updatedStyle.description = String(request.params.arguments.description);
      }
      
      if (request.params.arguments?.template) {
        updatedStyle.template = request.params.arguments.template;
      }
      
      styles[styleIndex] = updatedStyle;
      await writeStyles(category, styles);
      
      return {
        content: [{
          type: "text",
          text: `Updated style ${styleId} in category ${category}`
        }]
      };
    }
    
    case "delete_style": {
      const category = String(request.params.arguments?.category);
      const styleId = String(request.params.arguments?.style_id);
      
      if (!category || !styleId) {
        throw new Error("Category and style_id are required");
      }
      
      if (!CATEGORIES.includes(category)) {
        throw new Error(`Invalid category: ${category}`);
      }
      
      const styles = await readStyles(category);
      const filteredStyles = styles.filter(s => s.id !== styleId);
      
      if (filteredStyles.length === styles.length) {
        throw new Error(`Style not found: ${styleId} in category ${category}`);
      }
      
      await writeStyles(category, filteredStyles);
      
      return {
        content: [{
          type: "text",
          text: `Deleted style ${styleId} from category ${category}`
        }]
      };
    }
    
    case "list_styles": {
      const category = request.params.arguments?.category ? String(request.params.arguments.category) : 'all';
      
      if (category !== 'all' && !CATEGORIES.includes(category)) {
        throw new Error(`Invalid category: ${category}`);
      }
      
      let result: Record<string, any> = {};
      
      if (category === 'all') {
        result = await getAllStyles();
      } else {
        const styles = await readStyles(category);
        result[category] = styles;
      }
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(result, null, 2)
        }]
      };
    }
    
    default:
      throw new Error(`Unknown tool: ${request.params.name}`);
  }
});

// 实现ListPromptsRequestSchema处理程序
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "apply_style",
        description: "Apply a style template to generate content"
      }
    ]
  };
});

// 实现GetPromptRequestSchema处理程序
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name !== "apply_style") {
    throw new Error(`Unknown prompt: ${request.params.name}`);
  }
  
  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "首先使用get_style工具获取一个风格模板，然后根据这个模板生成相应风格的内容。"
        }
      },
      {
        role: "user",
        content: {
          type: "text",
          text: "你可以通过以下步骤操作：\n1. 调用get_style工具获取风格定义\n2. 分析风格模板的各个维度\n3. 根据用户需求，按照风格模板定义的特性生成内容"
        }
      },
      {
        role: "user",
        content: {
          type: "text",
          text: "确保你生成的内容符合风格模板中定义的所有维度和特征。"
        }
      }
    ]
  };
});

// 启动服务器
async function main() {
  // 添加调试输出
  console.error(`当前文件路径: ${__filename}`);
  console.error(`当前目录路径: ${__dirname}`);
  console.error(`当前工作目录: ${process.cwd()}`);
  console.error(`数据目录路径: ${DATA_DIR}`);
  
  await ensureDataDirExists();
  
  // 输出每个风格文件的路径和是否存在
  for (const category of CATEGORIES) {
    const filePath = STYLE_FILES[category];
    const exists = await fs.access(filePath).then(() => true).catch(() => false);
    console.error(`风格文件 ${category}: ${filePath}, 存在: ${exists}`);
  }
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});

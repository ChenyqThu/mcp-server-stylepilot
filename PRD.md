# StylePilot PRD - Model Context Protocol (MCP) 服务

## 1. 产品概述

### 1.1 产品定义
StylePilot是一个基于Model Context Protocol (MCP)的风格模板服务，用于存储和提供各类内容风格模板，供大语言模型(LLM)通过MCP协议调用，以实现风格化输出。

### 1.2 产品目标
为用户提供一个简单、高效的工具，通过预定义的风格模板控制LLM的输出风格，包括文本风格、卡片UI风格和内容结构风格。服务通过MCP协议与LLM集成，实现更加结构化和可控的交互。

### 1.3 目标用户
个人用户，主要是开发者或AI内容创作者，需要控制LLM输出风格的人。

## 2. 功能需求

### 2.1 核心功能

#### 2.1.1 风格模板管理
- 支持三种主要风格类别：文本风格、卡片风格、结构风格
- 每种风格以JSON格式定义，包含多维度的风格特征描述
- 风格模板存储在本地文件中，作为项目的一部分

#### 2.1.2 MCP协议支持
根据Model Context Protocol规范，提供以下能力：
- **Resources**: 以URI形式(`style:///{category}/{style_id}`)提供风格模板资源
- **Tools**: 提供管理风格模板的工具（获取、创建、更新、删除、列出）
- **Prompts**: 提供应用风格模板的提示

### 2.2 风格类别说明

#### 2.2.1 文本风格
描述语言、叙述、情感表达等特征，如"海子诗歌风格"，包含以下维度：
- 语言特点 (句式、词汇选择、修辞手法)
- 段落结构 (长度、过渡方式、层次模式)
- 叙述方式 (视角、时序、叙述者态度)
- 情感表达 (强度、表达方式、基调)
- 思维模式 (逻辑模式、深度、节奏)
- 独特性 (标志性短语、意象系统)
- 文化参考 (典故、知识领域)
- 节奏韵律 (音节模式、停顿模式、节奏)

示例：
{
    "style_summary": "深度思考型散文，将个人经历与思想洞察相结合，以温和自省的口吻探讨成长与人生哲理",
    "language": {
        "sentence_pattern": ["中短句为主，穿插长句形成节奏变化", "设问句与自答式结构"],
        "word_choice": {
            "formality_level": "3",
            "preferred_words": ["热爱", "痛苦", "经历", "内心", "思考", "承受"],
            "avoided_words": ["专业术语", "复杂概念词"]
        },
        "rhetoric": ["比喻", "对比", "自问自答", "引用与典故"]
    },
    "structure": {
        "paragraph_length": "短至中等，多在50-150字之间",
        "transition_style": "以小标题或数字分段，通过个人故事或思考转换话题",
        "hierarchy_pattern": "从具体经历到抽象思考，形成递进式结构"
    },
    "narrative": {
        "perspective": "第一人称，亲身经历分享",
        "time_sequence": "现在与过去穿插，回忆与现实交织",
        "narrator_attitude": "反思型，温和谦逊但有坚定立场"
    },
    "emotion": {
        "intensity": "3",
        "expression_style": "克制而真诚，避免情绪化爆发",
        "tone": "平静中带有思考的温度，偶有幽默自嘲"
    },
    "thinking": {
        "logic_pattern": "归纳式思维，从个体经验提炼普遍道理",
        "depth": "4",
        "rhythm": "缓慢深入，给读者留下思考空间"
    },
    "uniqueness": {
        "signature_phrases": ["愿意主动承受痛苦，才是热爱的证明", "回头看", "内心"],
        "imagery_system": ["旅程与道路", "痛苦与成长", "内心与外界"]
    },
    "cultural": {
        "allusions": ["现代文化引用", "中等频率"],
        "knowledge_domains": ["职场", "创业", "艺术", "心理学"]
    },
    "rhythm": {
        "syllable_pattern": "中文短句为主，节奏舒缓",
        "pause_pattern": "自然停顿，段落之间留白明显",
        "tempo": "中等节奏，有快慢变化"
    }
}

#### 2.2.2 卡片风格
描述视觉UI布局、色彩使用、排版等特征，如"六宫格总结卡片"，包含以下维度：
- 视觉特征 (布局模式、色彩使用、装饰元素)
- 结构 (层次模式、卡片排列、信息密度)
- 排版 (层级水平、强调技巧、可读性焦点)
- 内容格式 (格式类型、长度约束、突出方式)
- 图标使用 (用途、风格、放置位置)
- 美学风格 (风格方向、情绪氛围、平衡原则)

{
  "style_id": "horizontal_six_grid",
  "name": "通用-横版六宫格卡片",
  "style_summary": "简约优雅的信息卡片，采用六宫格布局，以几何装饰和色彩分类展示结构化内容",
  "visual": {
    "layout_pattern": ["网格式布局，3x2六宫格排列", "主卡片包含子卡片结构"],
    "color_usage": {
      "background_style": "渐变色主背景，纯色子卡片",
      "accent_method": "每个子卡片使用不同的强调色",
      "contrast_level": "4",
      "preferred_palettes": ["蓝紫渐变主题", "彩色类别标识", "白色内容区域"]
    },
    "decoration": ["半透明几何图案", "色块下划线", "图标与文字组合"]
  },
  "structure": {
    "hierarchy_pattern": "大标题+副标题框架，内容分为多个同等重要的类别块",
    "card_arrangement": "均匀分布，视觉平衡",
    "information_density": "3",
    "whitespace_usage": "适度留白，清晰分隔各内容区域"
  },
  "typography": {
    "hierarchy_levels": "4个层级（主标题、副标题、卡片标题、正文）",
    "emphasis_techniques": ["粗细对比", "大小变化", "色彩强调", "下划线标记"],
    "readability_focus": "高，采用清晰字体和足够对比度"
  },
  "content": {
    "format_types": ["列表式", "短段落", "要点突出", "可视化图表"],
    "length_constraints": "每卡片内容简洁，控制在100字以内",
    "highlight_method": "关键词加粗或彩色标注",
    "categorization": "内容按主题或功能分类，每类使用独特视觉标识"
  },
  "icon_usage": {
    "purpose": "类别标识和内容分类",
    "style": "线性图标，简洁现代",
    "placement": "标题前方，与文字组合"
  },
  "aesthetic": {
    "style_direction": "现代简约，几何感",
    "mood": "专业而不失活力",
    "balance_principle": "结构与装饰平衡，内容为主，视觉为辅",
    "guiding_concept": "简约而不失优雅，几何形状传达和谐感"
  }
}

#### 2.2.3 结构风格
描述内容组织方式、层级关系等特征，如"卡片笔记"，包含以下维度：
- 组织模式 (层级、分类、关联方式)
- 信息流 (线性、网状、自上而下)
- 分块策略 (分段方式、分组逻辑)
- 重点突出 (关键信息的位置与处理)
- 连接方式 (内部引用、过渡元素)

## 3. 技术规格

### 3.1 系统架构
- 基于MCP协议的服务架构
- 本地文件系统存储风格模板
- 通过标准输入/输出流(stdio)与客户端通信

### 3.2 存储结构
```
/data
  text_styles.json    # 存储所有文本风格
  card_styles.json    # 存储所有卡片风格
  structure_styles.json    # 存储所有结构风格
```

### 3.3 MCP能力规格

#### 3.3.1 Resources (资源)

风格模板资源以URI形式提供：
```
style:///{category}/{style_id}
```

例如：
- `style:///text/haiku_poetry` - 表示文本类别中的"haiku_poetry"风格
- `style:///card/summary_card` - 表示卡片类别中的"summary_card"风格

每个资源的MIME类型为`application/json`，提供完整的风格模板定义。

#### 3.3.2 Tools (工具)

提供以下工具来管理风格模板：

**get_style**: 获取特定风格
```json
{
  "name": "get_style",
  "description": "Get a specific style template by category and ID",
  "inputSchema": {
    "type": "object",
    "properties": {
      "category": {
        "type": "string",
        "description": "Category of the style (text, card, structure)"
      },
      "style_id": {
        "type": "string",
        "description": "ID of the style to retrieve"
      }
    },
    "required": ["category", "style_id"]
  }
}
```

**create_style**: 创建新风格
```json
{
  "name": "create_style",
  "description": "Create a new style template",
  "inputSchema": {
    "type": "object",
    "properties": {
      "category": {
        "type": "string",
        "description": "Category of the style (text, card, structure)"
      },
      "id": {
        "type": "string",
        "description": "Unique ID for the new style"
      },
      "name": {
        "type": "string",
        "description": "Name of the style"
      },
      "description": {
        "type": "string",
        "description": "Description of the style"
      },
      "template": {
        "type": "object",
        "description": "The style template definition"
      }
    },
    "required": ["category", "id", "name", "description", "template"]
  }
}
```

**update_style**: 更新现有风格
```json
{
  "name": "update_style",
  "description": "Update an existing style template",
  "inputSchema": {
    "type": "object",
    "properties": {
      "category": {
        "type": "string",
        "description": "Category of the style (text, card, structure)"
      },
      "style_id": {
        "type": "string",
        "description": "ID of the style to update"
      },
      "name": {
        "type": "string",
        "description": "Updated name of the style"
      },
      "description": {
        "type": "string",
        "description": "Updated description of the style"
      },
      "template": {
        "type": "object",
        "description": "Updated style template definition"
      }
    },
    "required": ["category", "style_id"]
  }
}
```

**delete_style**: 删除风格
```json
{
  "name": "delete_style",
  "description": "Delete a style template",
  "inputSchema": {
    "type": "object",
    "properties": {
      "category": {
        "type": "string",
        "description": "Category of the style (text, card, structure)"
      },
      "style_id": {
        "type": "string",
        "description": "ID of the style to delete"
      }
    },
    "required": ["category", "style_id"]
  }
}
```

**list_styles**: 列出风格
```json
{
  "name": "list_styles",
  "description": "List available styles in a category or all categories",
  "inputSchema": {
    "type": "object",
    "properties": {
      "category": {
        "type": "string",
        "description": "Category of styles to list (text, card, structure), or 'all' for all categories"
      }
    }
  }
}
```

#### 3.3.3 Prompts (提示)

提供以下提示来应用风格模板：

**apply_style**: 应用风格生成内容
```json
{
  "name": "apply_style",
  "description": "Apply a style template to generate content"
}
```

此提示将引导LLM使用`get_style`工具获取风格模板，然后根据用户需求生成符合该风格的内容。

## 4. 技术实现

### 4.1 开发技术
- 语言: TypeScript/JavaScript
- MCP SDK: `@modelcontextprotocol/sdk`
- 运行环境: Node.js
- 存储: 本地JSON文件

### 4.2 代码结构

```typescript
#!/usr/bin/env node

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

// 风格模板类型定义
type Style = {
  id: string;
  name: string;
  description: string;
  category: string;
  template: any;
};

// 设置数据目录
const DATA_DIR = path.join(process.cwd(), 'data');

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

// 实现ListResourcesRequestSchema处理程序

// 实现ReadResourceRequestSchema处理程序

// 实现ListToolsRequestSchema处理程序

// 实现CallToolRequestSchema处理程序

// 实现ListPromptsRequestSchema处理程序

// 实现GetPromptRequestSchema处理程序

// 启动服务器
async function main() {
  await ensureDataDirExists();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
```

完整代码在前面部分已提供。

## 5. 使用流程

### 5.1 服务部署
1. 安装依赖:
   ```
   npm install @modelcontextprotocol/sdk
   ```
2. 编译TypeScript代码:
   ```
   tsc
   ```
3. 启动服务:
   ```
   node dist/index.js
   ```

### 5.2 与MCP客户端集成

使用支持MCP协议的LLM客户端与StylePilot服务器集成:

1. 客户端连接到StylePilot服务器
2. 客户端发现可用的工具、资源和提示
3. 客户端使用工具获取或管理风格模板
4. 客户端使用apply_style提示应用风格模板生成内容

### 5.3 典型使用场景

#### 场景1: 获取并应用风格模板
1. 客户端调用`list_styles`工具列出所有可用风格
2. 客户端选择合适的风格，调用`get_style`工具获取详细模板
3. 客户端使用风格模板指导LLM生成内容

#### 场景2: 创建新风格模板
1. 用户定义新的风格模板
2. 客户端调用`create_style`工具创建新风格
3. 后续可以使用该风格生成内容

#### 场景3: 更新风格模板
1. 客户端调用`get_style`获取当前风格
2. 用户修改风格定义
3. 客户端调用`update_style`更新风格

## 6. 未来扩展可能性

### 6.1 短期扩展
- 添加更多预定义风格模板
- 支持风格模板验证功能
- 添加风格组合功能（混合多种风格特征）

### 6.2 中期扩展
- 改进资源组织，支持风格分类和标签
- 添加风格模板版本控制
- 增强风格应用提示，支持更复杂的场景

### 6.3 长期扩展
- 支持基于网络的MCP传输，而非仅限于stdio
- 开发与常见LLM平台的集成示例
- 添加风格预览和测试功能

## 7. 开发计划

### 7.1 阶段一: 基础功能实现
- 实现MCP服务器基础框架
- 创建风格模板数据结构
- 实现风格模板管理工具

### 7.2 阶段二: 测试与优化
- 与支持MCP的LLM客户端集成测试
- 优化风格模板结构
- 完善错误处理

### 7.3 阶段三: 文档与示例
- 编写使用文档
- 创建示例风格模板
- 开发集成示例
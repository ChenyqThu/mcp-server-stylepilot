# StylePilot MCP Server

基于Model Context Protocol (MCP)的风格模板服务，用于存储和提供各类内容风格模板，供大语言模型(LLM)通过MCP协议调用，以实现风格化输出。

## 功能特点

### 资源 (Resources)
- 提供三种风格类别模板：文本风格、卡片风格、结构风格
- 通过`style:///{category}/{style_id}`URI访问风格模板
- 每个风格模板包含详细的多维度特征描述
- 以JSON格式提供风格定义

### 工具 (Tools)
- `get_style` - 获取特定风格模板
- `search_style` - 通过关键词搜索风格模板
- `create_style` - 创建新风格模板
- `update_style` - 更新现有风格模板
- `delete_style` - 删除风格模板
- `list_styles` - 列出可用风格模板

### 提示 (Prompts)
- `apply_style` - 应用风格模板生成内容
  - 指导LLM获取并应用风格模板生成内容
  - 支持多维度风格特征的应用

## 开发指南

安装依赖:
```bash
npm install
```

构建服务器:
```bash
npm run build
```

开发模式(自动重新构建):
```bash
npm run watch
```

## 安装与集成

要在支持MCP的LLM客户端（如Claude Desktop）中使用，添加服务器配置:

在Windows上: `%APPDATA%/Claude/claude_desktop_config.json`
在MacOS上: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "stylepilot": {
      "command": "/path/to/mcp-server-stylepilot/build/index.js"
    }
  }
}
```

### 调试

由于MCP服务器通过标准输入/输出流(stdio)通信，可以使用[MCP Inspector](https://github.com/modelcontextprotocol/inspector)进行调试:

```bash
npm run inspector
```

Inspector将提供一个URL，可在浏览器中访问调试工具。

## 使用流程

### 获取并应用风格模板
1. 使用`list_styles`工具列出所有可用风格
2. 或者使用`search_style`工具通过关键词搜索特定风格（例如搜索"卡片"或"散文"）
3. 使用`get_style`工具获取详细的风格模板定义
4. 根据风格模板生成内容

### 创建新风格模板
1. 定义风格模板各个维度的特征
2. 使用`create_style`工具创建新风格
3. 应用新创建的风格模板

### 数据存储
风格模板存储在本地JSON文件中:
- `data/text_styles.json` - 文本风格
- `data/card_styles.json` - 卡片风格
- `data/structure_styles.json` - 结构风格

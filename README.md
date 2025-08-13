# 智能代码审查助手 MCP

一个功能强大的 Model Context Protocol (MCP) 服务器，提供全面的代码质量分析、安全检测、重构建议和文档生成功能。

## ✨ 主要特性

### 🔍 代码质量分析
- **多维度质量评估**：代码行数、复杂度、可维护性指数等
- **问题检测**：样式问题、性能问题、可维护性问题
- **多语言支持**：JavaScript/TypeScript、Python、Java等
- **智能建议**：提供具体的改进建议和最佳实践

### 🛡️ 安全漏洞检测
- **常见安全问题**：硬编码密码、代码注入、SQL注入等
- **语言特定检测**：XSS、原型污染、不安全反序列化等
- **风险评估**：提供详细的风险评分和修复建议
- **CWE映射**：与通用弱点枚举标准对应

### 🔧 智能重构建议
- **性能优化**：循环优化、字符串拼接改进等
- **可读性提升**：复杂条件简化、变量命名改进等
- **可维护性增强**：重复代码提取、函数拆分等
- **现代化建议**：使用最新语言特性和最佳实践

### 📊 复杂度分析
- **圈复杂度**：McCabe复杂度计算
- **认知复杂度**：代码理解难度评估
- **Halstead复杂度**：程序复杂度的数学度量
- **可维护性指数**：综合可维护性评分

### 📚 文档生成
- **多种格式**：Markdown、JSDoc、内联注释
- **智能分析**：自动提取函数、类、方法信息
- **使用示例**：生成代码使用示例
- **API文档**：完整的API文档生成

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 构建项目

```bash
npm run build
```

### 启动服务器

```bash
npm start
```

### 开发模式

```bash
npm run dev
```

## 🛠️ 工具说明

### 1. analyze_code_quality

分析代码质量，检测潜在问题和改进建议。

**参数：**
- `code` (string): 要分析的代码内容
- `language` (string): 编程语言
- `filename` (string, 可选): 文件名

**示例：**
```json
{
  "code": "function example() { var x = 1; if (x == 1) console.log('test'); }",
  "language": "javascript",
  "filename": "example.js"
}
```

### 2. generate_documentation

为代码生成详细的文档和注释。

**参数：**
- `code` (string): 要生成文档的代码
- `language` (string): 编程语言
- `docType` (string): 文档类型 (inline/markdown/jsdoc)

**示例：**
```json
{
  "code": "function calculateSum(a, b) { return a + b; }",
  "language": "javascript",
  "docType": "markdown"
}
```

### 3. detect_security_issues

检测代码中的安全漏洞和风险。

**参数：**
- `code` (string): 要检测的代码
- `language` (string): 编程语言

**示例：**
```json
{
  "code": "const password = 'hardcoded123'; eval(userInput);",
  "language": "javascript"
}
```

### 4. suggest_refactoring

提供代码重构建议，改善代码结构和可读性。

**参数：**
- `code` (string): 要重构的代码
- `language` (string): 编程语言
- `focus` (string): 重构重点 (performance/readability/maintainability/all)

**示例：**
```json
{
  "code": "for(var i=0;i<arr.length;i++){if(arr[i]==target){return i;}}",
  "language": "javascript",
  "focus": "performance"
}
```

### 5. calculate_complexity

计算代码复杂度指标。

**参数：**
- `code` (string): 要分析的代码
- `language` (string): 编程语言

**示例：**
```json
{
  "code": "function complexFunction(x) { if (x > 0) { for (let i = 0; i < x; i++) { if (i % 2 === 0) { console.log(i); } } } }",
  "language": "javascript"
}
```

## 📋 支持的编程语言

- **JavaScript/TypeScript**: 全功能支持
- **Python**: 全功能支持
- **Java**: 全功能支持
- **SQL**: 安全检测支持
- **其他语言**: 基础分析支持

## 🎯 使用场景

### 代码审查
在代码审查过程中，使用本工具快速识别代码质量问题、安全漏洞和改进机会。

### 重构指导
在重构代码时，获得具体的重构建议和优先级指导。

### 安全审计
在安全审计中，自动检测常见的安全漏洞和风险点。

### 文档生成
自动生成代码文档，提高项目的可维护性。

### 教学辅助
帮助开发者学习最佳实践和代码质量标准。

## 📊 分析报告示例

### 代码质量分析报告
```json
{
  "filename": "example.js",
  "language": "javascript",
  "metrics": {
    "linesOfCode": 45,
    "complexity": 8,
    "maintainabilityIndex": 72.5
  },
  "issues": [
    {
      "type": "style",
      "severity": "warning",
      "message": "建议使用let或const替代var",
      "line": 3,
      "rule": "no-var"
    }
  ],
  "overallScore": 85,
  "recommendations": [
    "使用现代JavaScript语法",
    "添加错误处理机制"
  ]
}
```

### 安全扫描报告
```json
{
  "language": "javascript",
  "totalIssues": 2,
  "criticalIssues": 1,
  "riskScore": 15,
  "issues": [
    {
      "type": "hardcoded-credentials",
      "severity": "critical",
      "message": "检测到硬编码的敏感信息",
      "cwe": "CWE-798",
      "recommendation": "使用环境变量存储敏感信息"
    }
  ]
}
```

## 🔧 配置选项

### 环境变量
- `MCP_LOG_LEVEL`: 日志级别 (debug/info/warn/error)
- `MCP_MAX_CODE_SIZE`: 最大代码大小限制
- `MCP_TIMEOUT`: 分析超时时间

### 自定义规则
可以通过配置文件自定义分析规则和阈值。

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- Model Context Protocol 团队
- 开源社区的贡献者们
- 代码质量分析领域的研究者们

## 📞 联系我们

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 参与讨论

---

**让代码审查变得更智能、更高效！** 🚀
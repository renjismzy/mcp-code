#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { analyzeCodeQuality } from './tools/codeAnalyzer.js';
import { generateDocumentation } from './tools/docGenerator.js';
import { detectSecurityIssues } from './tools/securityScanner.js';
import { suggestRefactoring } from './tools/refactoringSuggester.js';
import { calculateComplexity } from './tools/complexityCalculator.js';

/**
 * 智能代码审查助手 MCP 服务器
 * 提供代码质量分析、文档生成、安全检测等功能
 */
class SmartCodeReviewerServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'smart-code-reviewer-mcp',
        version: '1.0.0',
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'analyze_code_quality',
            description: '分析代码质量，检测潜在问题和改进建议',
            inputSchema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: '要分析的代码内容'
                },
                language: {
                  type: 'string',
                  description: '编程语言 (javascript, typescript, python, java, etc.)'
                },
                filename: {
                  type: 'string',
                  description: '文件名（可选）'
                }
              },
              required: ['code', 'language']
            }
          },
          {
            name: 'generate_documentation',
            description: '为代码生成详细的文档和注释',
            inputSchema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: '要生成文档的代码'
                },
                language: {
                  type: 'string',
                  description: '编程语言'
                },
                docType: {
                  type: 'string',
                  enum: ['inline', 'markdown', 'jsdoc'],
                  description: '文档类型'
                }
              },
              required: ['code', 'language', 'docType']
            }
          },
          {
            name: 'detect_security_issues',
            description: '检测代码中的安全漏洞和风险',
            inputSchema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: '要检测的代码'
                },
                language: {
                  type: 'string',
                  description: '编程语言'
                }
              },
              required: ['code', 'language']
            }
          },
          {
            name: 'suggest_refactoring',
            description: '提供代码重构建议，改善代码结构和可读性',
            inputSchema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: '要重构的代码'
                },
                language: {
                  type: 'string',
                  description: '编程语言'
                },
                focus: {
                  type: 'string',
                  enum: ['performance', 'readability', 'maintainability', 'all'],
                  description: '重构重点'
                }
              },
              required: ['code', 'language']
            }
          },
          {
            name: 'calculate_complexity',
            description: '计算代码复杂度指标（圈复杂度、认知复杂度等）',
            inputSchema: {
              type: 'object',
              properties: {
                code: {
                  type: 'string',
                  description: '要分析的代码'
                },
                language: {
                  type: 'string',
                  description: '编程语言'
                }
              },
              required: ['code', 'language']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'analyze_code_quality':
            return await this.handleAnalyzeCodeQuality(args);
          case 'generate_documentation':
            return await this.handleGenerateDocumentation(args);
          case 'detect_security_issues':
            return await this.handleDetectSecurityIssues(args);
          case 'suggest_refactoring':
            return await this.handleSuggestRefactoring(args);
          case 'calculate_complexity':
            return await this.handleCalculateComplexity(args);
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `未知工具: ${name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `工具执行错误: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    });
  }

  private async handleAnalyzeCodeQuality(args: any) {
    const schema = z.object({
      code: z.string(),
      language: z.string(),
      filename: z.string().optional()
    });

    const { code, language, filename } = schema.parse(args);
    const result = await analyzeCodeQuality(code, language, filename);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  private async handleGenerateDocumentation(args: any) {
    const schema = z.object({
      code: z.string(),
      language: z.string(),
      docType: z.enum(['inline', 'markdown', 'jsdoc']).default('markdown')
    });

    const { code, language, docType } = schema.parse(args);
    const result = await generateDocumentation(code, language, docType);

    return {
      content: [
        {
          type: 'text',
          text: result
        }
      ]
    };
  }

  private async handleDetectSecurityIssues(args: any) {
    const schema = z.object({
      code: z.string(),
      language: z.string()
    });

    const { code, language } = schema.parse(args);
    const result = await detectSecurityIssues(code, language);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  private async handleSuggestRefactoring(args: any) {
    const schema = z.object({
      code: z.string(),
      language: z.string(),
      focus: z.enum(['performance', 'readability', 'maintainability', 'all']).default('all')
    });

    const { code, language, focus } = schema.parse(args);
    const result = await suggestRefactoring(code, language, focus);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  private async handleCalculateComplexity(args: any) {
    const schema = z.object({
      code: z.string(),
      language: z.string()
    });

    const { code, language } = schema.parse(args);
    const result = await calculateComplexity(code, language);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2)
        }
      ]
    };
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('智能代码审查助手 MCP 服务器已启动');
  }
}

// 启动服务器
const server = new SmartCodeReviewerServer();
server.run().catch((error) => {
  console.error('服务器启动失败:', error);
  process.exit(1);
});
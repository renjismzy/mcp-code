import { SecurityIssue, SecurityScanResult } from '../types/index.js';

/**
 * 检测代码中的安全漏洞和风险
 */
export async function detectSecurityIssues(
  code: string,
  language: string
): Promise<SecurityScanResult> {
  const issues: SecurityIssue[] = [];
  
  // 通用安全检测
  await detectCommonSecurityIssues(code, language, issues);
  
  // 语言特定安全检测
  switch (language.toLowerCase()) {
    case 'javascript':
    case 'typescript':
      await detectJavaScriptSecurityIssues(code, issues);
      break;
    case 'python':
      await detectPythonSecurityIssues(code, issues);
      break;
    case 'java':
      await detectJavaSecurityIssues(code, issues);
      break;
    case 'sql':
      await detectSQLSecurityIssues(code, issues);
      break;
  }
  
  return {
    language,
    totalIssues: issues.length,
    criticalIssues: issues.filter(i => i.severity === 'critical').length,
    highIssues: issues.filter(i => i.severity === 'high').length,
    mediumIssues: issues.filter(i => i.severity === 'medium').length,
    lowIssues: issues.filter(i => i.severity === 'low').length,
    issues,
    recommendations: generateSecurityRecommendations(issues),
    riskScore: calculateRiskScore(issues)
  };
}

/**
 * 检测通用安全问题
 */
async function detectCommonSecurityIssues(
  code: string,
  language: string,
  issues: SecurityIssue[]
): Promise<void> {
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const trimmedLine = line.trim().toLowerCase();
    
    // 检测硬编码密码
    const passwordPatterns = [
      /password\s*[=:]\s*["'][^"']+["']/i,
      /pwd\s*[=:]\s*["'][^"']+["']/i,
      /secret\s*[=:]\s*["'][^"']+["']/i,
      /api[_-]?key\s*[=:]\s*["'][^"']+["']/i,
      /token\s*[=:]\s*["'][^"']+["']/i
    ];
    
    passwordPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        issues.push({
          type: 'hardcoded-credentials',
          severity: 'critical',
          message: '检测到硬编码的敏感信息（密码、密钥等）',
          description: '硬编码的敏感信息可能被恶意用户获取，应使用环境变量或配置文件',
          line: lineNumber,
          column: line.search(pattern) + 1,
          cwe: 'CWE-798',
          recommendation: '使用环境变量或安全的配置管理系统存储敏感信息'
        });
      }
    });
    
    // 检测潜在的代码注入
    const injectionPatterns = [
      /eval\s*\(/i,
      /exec\s*\(/i,
      /system\s*\(/i,
      /shell_exec\s*\(/i,
      /passthru\s*\(/i
    ];
    
    injectionPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        issues.push({
          type: 'code-injection',
          severity: 'critical',
          message: '检测到潜在的代码注入风险',
          description: '使用动态代码执行函数可能导致代码注入攻击',
          line: lineNumber,
          column: line.search(pattern) + 1,
          cwe: 'CWE-94',
          recommendation: '避免使用动态代码执行，使用更安全的替代方案'
        });
      }
    });
    
    // 检测不安全的随机数生成
    const weakRandomPatterns = [
      /math\.random\s*\(/i,
      /random\.random\s*\(/i,
      /rand\s*\(/i
    ];
    
    weakRandomPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        issues.push({
          type: 'weak-randomness',
          severity: 'medium',
          message: '使用了不安全的随机数生成器',
          description: '弱随机数生成器可能被预测，不适用于安全相关场景',
          line: lineNumber,
          column: line.search(pattern) + 1,
          cwe: 'CWE-338',
          recommendation: '使用密码学安全的随机数生成器'
        });
      }
    });
    
    // 检测调试信息泄露
    const debugPatterns = [
      /console\.log\s*\(.*(password|token|key|secret)/i,
      /print\s*\(.*(password|token|key|secret)/i,
      /system\.out\.println\s*\(.*(password|token|key|secret)/i
    ];
    
    debugPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        issues.push({
          type: 'information-disclosure',
          severity: 'high',
          message: '检测到敏感信息可能通过调试输出泄露',
          description: '在日志或控制台输出中包含敏感信息可能导致信息泄露',
          line: lineNumber,
          column: line.search(pattern) + 1,
          cwe: 'CWE-532',
          recommendation: '移除或过滤敏感信息的调试输出'
        });
      }
    });
  });
}

/**
 * JavaScript/TypeScript 特定安全检测
 */
async function detectJavaScriptSecurityIssues(
  code: string,
  issues: SecurityIssue[]
): Promise<void> {
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // 检测XSS风险
    const xssPatterns = [
      /innerHTML\s*=\s*.*\+/,
      /outerHTML\s*=\s*.*\+/,
      /document\.write\s*\(/,
      /\.html\s*\(.*\+/
    ];
    
    xssPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        issues.push({
          type: 'xss',
          severity: 'high',
          message: '检测到潜在的XSS（跨站脚本）风险',
          description: '直接设置HTML内容可能导致XSS攻击',
          line: lineNumber,
          column: line.search(pattern) + 1,
          cwe: 'CWE-79',
          recommendation: '使用安全的DOM操作方法，对用户输入进行转义'
        });
      }
    });
    
    // 检测不安全的正则表达式
    const regexPatterns = [
      /new\s+RegExp\s*\(.*\+/,
      /\/.*\(.*\*.*\+.*\).*\//
    ];
    
    regexPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        issues.push({
          type: 'regex-dos',
          severity: 'medium',
          message: '检测到可能导致ReDoS的正则表达式',
          description: '复杂的正则表达式可能导致拒绝服务攻击',
          line: lineNumber,
          column: line.search(pattern) + 1,
          cwe: 'CWE-1333',
          recommendation: '简化正则表达式，避免嵌套量词'
        });
      }
    });
    
    // 检测不安全的JSON解析
    if (line.includes('JSON.parse') && !line.includes('try')) {
      issues.push({
        type: 'unsafe-deserialization',
        severity: 'medium',
        message: '不安全的JSON解析',
        description: 'JSON.parse可能抛出异常，应该使用try-catch包装',
        line: lineNumber,
        column: line.indexOf('JSON.parse') + 1,
        cwe: 'CWE-502',
        recommendation: '使用try-catch包装JSON.parse，或使用安全的JSON解析库'
      });
    }
    
    // 检测原型污染风险
    const prototypePatterns = [
      /__proto__/,
      /constructor\.prototype/,
      /Object\.prototype/
    ];
    
    prototypePatterns.forEach(pattern => {
      if (pattern.test(line)) {
        issues.push({
          type: 'prototype-pollution',
          severity: 'high',
          message: '检测到潜在的原型污染风险',
          description: '修改对象原型可能导致原型污染攻击',
          line: lineNumber,
          column: line.search(pattern) + 1,
          cwe: 'CWE-1321',
          recommendation: '避免直接修改对象原型，使用Object.create(null)创建安全对象'
        });
      }
    });
  });
}

/**
 * Python 特定安全检测
 */
async function detectPythonSecurityIssues(
  code: string,
  issues: SecurityIssue[]
): Promise<void> {
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // 检测SQL注入风险
    const sqlInjectionPatterns = [
      /execute\s*\(.*%.*\)/,
      /query\s*\(.*\+.*\)/,
      /cursor\.execute\s*\(.*%/
    ];
    
    sqlInjectionPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        issues.push({
          type: 'sql-injection',
          severity: 'critical',
          message: '检测到潜在的SQL注入风险',
          description: '使用字符串拼接构建SQL查询可能导致SQL注入',
          line: lineNumber,
          column: line.search(pattern) + 1,
          cwe: 'CWE-89',
          recommendation: '使用参数化查询或ORM框架'
        });
      }
    });
    
    // 检测不安全的pickle使用
    if (line.includes('pickle.loads') || line.includes('pickle.load')) {
      issues.push({
        type: 'unsafe-deserialization',
        severity: 'critical',
        message: '不安全的pickle反序列化',
        description: 'pickle.loads可以执行任意代码，不应用于不可信数据',
        line: lineNumber,
        column: line.indexOf('pickle.load') + 1,
        cwe: 'CWE-502',
        recommendation: '使用JSON或其他安全的序列化格式'
      });
    }
    
    // 检测不安全的临时文件
    const tempFilePatterns = [
      /tempfile\.mktemp/,
      /\/tmp\//
    ];
    
    tempFilePatterns.forEach(pattern => {
      if (pattern.test(line)) {
        issues.push({
          type: 'insecure-temp-file',
          severity: 'medium',
          message: '不安全的临时文件使用',
          description: '不安全的临时文件创建可能导致竞态条件攻击',
          line: lineNumber,
          column: line.search(pattern) + 1,
          cwe: 'CWE-377',
          recommendation: '使用tempfile.NamedTemporaryFile()或tempfile.mkstemp()'
        });
      }
    });
  });
}

/**
 * Java 特定安全检测
 */
async function detectJavaSecurityIssues(
  code: string,
  issues: SecurityIssue[]
): Promise<void> {
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // 检测不安全的反序列化
    if (line.includes('ObjectInputStream') || line.includes('readObject')) {
      issues.push({
        type: 'unsafe-deserialization',
        severity: 'critical',
        message: '不安全的Java对象反序列化',
        description: 'Java反序列化可能导致远程代码执行',
        line: lineNumber,
        column: 1,
        cwe: 'CWE-502',
        recommendation: '验证反序列化数据来源，使用白名单过滤'
      });
    }
    
    // 检测不安全的XML解析
    const xmlPatterns = [
      /DocumentBuilderFactory/,
      /SAXParserFactory/,
      /XMLInputFactory/
    ];
    
    xmlPatterns.forEach(pattern => {
      if (pattern.test(line)) {
        issues.push({
          type: 'xxe',
          severity: 'high',
          message: '潜在的XXE（XML外部实体）风险',
          description: '不安全的XML解析器配置可能导致XXE攻击',
          line: lineNumber,
          column: line.search(pattern) + 1,
          cwe: 'CWE-611',
          recommendation: '禁用XML解析器的外部实体处理功能'
        });
      }
    });
    
    // 检测不安全的随机数
    if (line.includes('new Random()')) {
      issues.push({
        type: 'weak-randomness',
        severity: 'medium',
        message: '使用了不安全的随机数生成器',
        description: 'java.util.Random不适用于安全相关场景',
        line: lineNumber,
        column: line.indexOf('new Random()') + 1,
        cwe: 'CWE-338',
        recommendation: '使用SecureRandom类生成安全随机数'
      });
    }
  });
}

/**
 * SQL 特定安全检测
 */
async function detectSQLSecurityIssues(
  code: string,
  issues: SecurityIssue[]
): Promise<void> {
  const lines = code.split('\n');
  
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const upperLine = line.toUpperCase();
    
    // 检测动态SQL构建
    if (upperLine.includes('SELECT') && (line.includes('+') || line.includes('||'))) {
      issues.push({
        type: 'sql-injection',
        severity: 'critical',
        message: '检测到动态SQL构建，存在注入风险',
        description: '使用字符串拼接构建SQL语句可能导致SQL注入',
        line: lineNumber,
        column: 1,
        cwe: 'CWE-89',
        recommendation: '使用参数化查询或存储过程'
      });
    }
    
    // 检测权限过大的操作
    const dangerousOperations = [
      'DROP TABLE',
      'DELETE FROM',
      'TRUNCATE',
      'ALTER TABLE',
      'GRANT ALL'
    ];
    
    dangerousOperations.forEach(op => {
      if (upperLine.includes(op)) {
        issues.push({
          type: 'dangerous-operation',
          severity: 'high',
          message: `检测到危险的SQL操作: ${op}`,
          description: '危险的SQL操作可能导致数据丢失或权限泄露',
          line: lineNumber,
          column: upperLine.indexOf(op) + 1,
          cwe: 'CWE-250',
          recommendation: '确保操作权限最小化，添加适当的条件限制'
        });
      }
    });
  });
}

/**
 * 计算风险评分
 */
function calculateRiskScore(issues: SecurityIssue[]): number {
  let score = 0;
  
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'critical':
        score += 10;
        break;
      case 'high':
        score += 7;
        break;
      case 'medium':
        score += 4;
        break;
      case 'low':
        score += 1;
        break;
    }
  });
  
  return Math.min(100, score);
}

/**
 * 生成安全建议
 */
function generateSecurityRecommendations(issues: SecurityIssue[]): string[] {
  const recommendations: string[] = [];
  const issueTypes = new Set(issues.map(i => i.type));
  
  if (issueTypes.has('hardcoded-credentials')) {
    recommendations.push('使用环境变量或密钥管理系统存储敏感信息');
  }
  
  if (issueTypes.has('sql-injection')) {
    recommendations.push('实施参数化查询和输入验证');
  }
  
  if (issueTypes.has('xss')) {
    recommendations.push('对所有用户输入进行适当的转义和验证');
  }
  
  if (issueTypes.has('code-injection')) {
    recommendations.push('避免使用动态代码执行，实施输入白名单');
  }
  
  if (issueTypes.has('unsafe-deserialization')) {
    recommendations.push('验证反序列化数据来源，使用安全的数据格式');
  }
  
  if (issueTypes.has('weak-randomness')) {
    recommendations.push('使用密码学安全的随机数生成器');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('未发现明显的安全问题，继续保持良好的安全实践');
  }
  
  // 添加通用安全建议
  recommendations.push('定期进行安全代码审查');
  recommendations.push('实施适当的错误处理和日志记录');
  recommendations.push('保持依赖库的及时更新');
  
  return recommendations;
}
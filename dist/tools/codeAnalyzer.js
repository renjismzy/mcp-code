/**
 * 分析代码质量
 */
export async function analyzeCodeQuality(code, language, filename) {
    const issues = [];
    const metrics = {
        linesOfCode: 0,
        complexity: 0,
        maintainabilityIndex: 0,
        duplicateLines: 0,
        testCoverage: 0
    };
    // 基础指标计算
    const lines = code.split('\n');
    metrics.linesOfCode = lines.filter(line => line.trim().length > 0).length;
    // 通用代码问题检测
    await detectCommonIssues(code, language, issues);
    // 语言特定分析
    switch (language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
            await analyzeJavaScript(code, issues, metrics);
            break;
        case 'python':
            await analyzePython(code, issues, metrics);
            break;
        case 'java':
            await analyzeJava(code, issues, metrics);
            break;
        default:
            await analyzeGeneric(code, issues, metrics);
    }
    // 计算可维护性指数
    metrics.maintainabilityIndex = calculateMaintainabilityIndex(metrics, issues.length);
    return {
        filename: filename || 'unknown',
        language,
        metrics,
        issues,
        overallScore: calculateOverallScore(metrics, issues),
        recommendations: generateRecommendations(issues, metrics)
    };
}
/**
 * 检测通用代码问题
 */
async function detectCommonIssues(code, language, issues) {
    const lines = code.split('\n');
    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();
        // 检测过长的行
        if (line.length > 120) {
            issues.push({
                type: 'style',
                severity: 'warning',
                message: '代码行过长，建议控制在120字符以内',
                line: lineNumber,
                column: 121,
                rule: 'max-line-length'
            });
        }
        // 检测TODO/FIXME注释
        if (trimmedLine.includes('TODO') || trimmedLine.includes('FIXME')) {
            issues.push({
                type: 'maintainability',
                severity: 'info',
                message: '发现待办事项或需要修复的代码',
                line: lineNumber,
                column: 1,
                rule: 'todo-fixme'
            });
        }
        // 检测硬编码字符串
        const hardcodedStringRegex = /["'][^"']{20,}["']/g;
        if (hardcodedStringRegex.test(trimmedLine) && !trimmedLine.includes('console.log')) {
            issues.push({
                type: 'maintainability',
                severity: 'warning',
                message: '发现可能的硬编码字符串，建议使用常量',
                line: lineNumber,
                column: 1,
                rule: 'no-hardcoded-strings'
            });
        }
        // 检测空的catch块
        if (trimmedLine.includes('catch') && lines[index + 1]?.trim() === '}') {
            issues.push({
                type: 'error-handling',
                severity: 'error',
                message: '空的catch块可能隐藏错误',
                line: lineNumber,
                column: 1,
                rule: 'no-empty-catch'
            });
        }
    });
    // 检测重复代码
    detectDuplicateCode(lines, issues);
}
/**
 * JavaScript/TypeScript 特定分析
 */
async function analyzeJavaScript(code, issues, metrics) {
    const lines = code.split('\n');
    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();
        // 检测var使用
        if (trimmedLine.includes('var ')) {
            issues.push({
                type: 'style',
                severity: 'warning',
                message: '建议使用let或const替代var',
                line: lineNumber,
                column: trimmedLine.indexOf('var') + 1,
                rule: 'no-var'
            });
        }
        // 检测==使用
        if (trimmedLine.includes('==') && !trimmedLine.includes('===')) {
            issues.push({
                type: 'style',
                severity: 'warning',
                message: '建议使用===进行严格比较',
                line: lineNumber,
                column: trimmedLine.indexOf('==') + 1,
                rule: 'strict-equality'
            });
        }
        // 检测console.log
        if (trimmedLine.includes('console.log')) {
            issues.push({
                type: 'style',
                severity: 'info',
                message: '生产代码中应移除console.log',
                line: lineNumber,
                column: trimmedLine.indexOf('console.log') + 1,
                rule: 'no-console'
            });
        }
        // 检测未使用的变量（简单检测）
        const varDeclaration = trimmedLine.match(/(?:let|const|var)\s+(\w+)/);
        if (varDeclaration) {
            const varName = varDeclaration[1];
            const restOfCode = lines.slice(index + 1).join('\n');
            if (!restOfCode.includes(varName)) {
                issues.push({
                    type: 'maintainability',
                    severity: 'warning',
                    message: `变量'${varName}'可能未被使用`,
                    line: lineNumber,
                    column: 1,
                    rule: 'no-unused-vars'
                });
            }
        }
    });
    // 计算圈复杂度
    metrics.complexity = calculateCyclomaticComplexity(code);
}
/**
 * Python 特定分析
 */
async function analyzePython(code, issues, metrics) {
    const lines = code.split('\n');
    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();
        // 检测缩进问题
        if (line.length > 0 && !line.startsWith(' ') && !line.startsWith('\t') && line.startsWith(' ')) {
            const spaces = line.match(/^\s*/)[0].length;
            if (spaces % 4 !== 0) {
                issues.push({
                    type: 'style',
                    severity: 'warning',
                    message: 'Python建议使用4个空格缩进',
                    line: lineNumber,
                    column: 1,
                    rule: 'indentation'
                });
            }
        }
        // 检测import语句位置
        if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('from ')) {
            // 检查是否在文件顶部
            const previousNonEmptyLines = lines.slice(0, index).filter(l => l.trim().length > 0);
            const hasNonImportCode = previousNonEmptyLines.some(l => !l.trim().startsWith('#') &&
                !l.trim().startsWith('import ') &&
                !l.trim().startsWith('from ') &&
                !l.trim().startsWith('"""') &&
                !l.trim().startsWith("'''"));
            if (hasNonImportCode) {
                issues.push({
                    type: 'style',
                    severity: 'warning',
                    message: 'import语句应该放在文件顶部',
                    line: lineNumber,
                    column: 1,
                    rule: 'import-order'
                });
            }
        }
        // 检测过长的函数
        if (trimmedLine.startsWith('def ')) {
            const functionEnd = findFunctionEnd(lines, index);
            const functionLength = functionEnd - index;
            if (functionLength > 50) {
                issues.push({
                    type: 'maintainability',
                    severity: 'warning',
                    message: '函数过长，建议拆分为更小的函数',
                    line: lineNumber,
                    column: 1,
                    rule: 'max-function-length'
                });
            }
        }
    });
    metrics.complexity = calculateCyclomaticComplexity(code);
}
/**
 * Java 特定分析
 */
async function analyzeJava(code, issues, metrics) {
    const lines = code.split('\n');
    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();
        // 检测类名命名规范
        const classDeclaration = trimmedLine.match(/class\s+(\w+)/);
        if (classDeclaration) {
            const className = classDeclaration[1];
            if (!/^[A-Z][a-zA-Z0-9]*$/.test(className)) {
                issues.push({
                    type: 'style',
                    severity: 'warning',
                    message: 'Java类名应使用PascalCase命名',
                    line: lineNumber,
                    column: 1,
                    rule: 'class-naming'
                });
            }
        }
        // 检测方法命名规范
        const methodDeclaration = trimmedLine.match(/(?:public|private|protected)?\s*\w+\s+(\w+)\s*\(/);
        if (methodDeclaration) {
            const methodName = methodDeclaration[1];
            if (!/^[a-z][a-zA-Z0-9]*$/.test(methodName) && methodName !== 'main') {
                issues.push({
                    type: 'style',
                    severity: 'warning',
                    message: 'Java方法名应使用camelCase命名',
                    line: lineNumber,
                    column: 1,
                    rule: 'method-naming'
                });
            }
        }
        // 检测System.out.println
        if (trimmedLine.includes('System.out.println')) {
            issues.push({
                type: 'style',
                severity: 'info',
                message: '生产代码中建议使用日志框架替代System.out.println',
                line: lineNumber,
                column: 1,
                rule: 'no-system-out'
            });
        }
    });
    metrics.complexity = calculateCyclomaticComplexity(code);
}
/**
 * 通用分析
 */
async function analyzeGeneric(code, issues, metrics) {
    metrics.complexity = calculateCyclomaticComplexity(code);
}
/**
 * 计算圈复杂度
 */
function calculateCyclomaticComplexity(code) {
    let complexity = 1; // 基础复杂度
    // 计算决策点
    const decisionKeywords = [
        'if', 'else if', 'elif', 'while', 'for', 'foreach',
        'switch', 'case', 'catch', 'and', 'or', '&&', '||',
        '?', 'try'
    ];
    decisionKeywords.forEach(keyword => {
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedKeyword}\\b`, 'gi');
        const matches = code.match(regex);
        if (matches) {
            complexity += matches.length;
        }
    });
    return complexity;
}
/**
 * 检测重复代码
 */
function detectDuplicateCode(lines, issues) {
    const lineMap = new Map();
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.length > 10) { // 只检查有意义的行
            if (!lineMap.has(trimmedLine)) {
                lineMap.set(trimmedLine, []);
            }
            lineMap.get(trimmedLine).push(index + 1);
        }
    });
    lineMap.forEach((lineNumbers, line) => {
        if (lineNumbers.length > 1) {
            lineNumbers.forEach(lineNumber => {
                issues.push({
                    type: 'maintainability',
                    severity: 'info',
                    message: `发现重复代码行，考虑提取为函数或常量`,
                    line: lineNumber,
                    column: 1,
                    rule: 'duplicate-code'
                });
            });
        }
    });
}
/**
 * 查找函数结束位置
 */
function findFunctionEnd(lines, startIndex) {
    let indentLevel = 0;
    let baseIndent = -1;
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().length === 0)
            continue;
        const currentIndent = line.length - line.trimStart().length;
        if (baseIndent === -1) {
            baseIndent = currentIndent;
        }
        if (i > startIndex && currentIndent <= baseIndent && line.trim().length > 0) {
            return i;
        }
    }
    return lines.length;
}
/**
 * 计算可维护性指数
 */
function calculateMaintainabilityIndex(metrics, issueCount) {
    const baseScore = 100;
    const complexityPenalty = metrics.complexity * 2;
    const issuePenalty = issueCount * 3;
    const locPenalty = Math.max(0, (metrics.linesOfCode - 100) * 0.1);
    return Math.max(0, baseScore - complexityPenalty - issuePenalty - locPenalty);
}
/**
 * 计算总体评分
 */
function calculateOverallScore(metrics, issues) {
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;
    let score = 100;
    score -= errorCount * 10;
    score -= warningCount * 5;
    score -= infoCount * 1;
    score -= Math.max(0, (metrics.complexity - 10) * 2);
    return Math.max(0, Math.min(100, score));
}
/**
 * 生成改进建议
 */
function generateRecommendations(issues, metrics) {
    const recommendations = [];
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    if (errorCount > 0) {
        recommendations.push(`修复 ${errorCount} 个严重错误以提高代码稳定性`);
    }
    if (warningCount > 5) {
        recommendations.push(`解决 ${warningCount} 个警告以提高代码质量`);
    }
    if (metrics.complexity > 15) {
        recommendations.push('代码复杂度较高，建议拆分复杂函数');
    }
    if (metrics.linesOfCode > 500) {
        recommendations.push('文件较大，考虑拆分为多个模块');
    }
    if (metrics.maintainabilityIndex < 60) {
        recommendations.push('可维护性指数较低，建议重构代码结构');
    }
    if (recommendations.length === 0) {
        recommendations.push('代码质量良好，继续保持！');
    }
    return recommendations;
}
//# sourceMappingURL=codeAnalyzer.js.map
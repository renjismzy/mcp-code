/**
 * 计算代码复杂度指标
 */
export async function calculateComplexity(code, language) {
    const metrics = {
        cyclomaticComplexity: 0,
        cognitiveComplexity: 0,
        halsteadComplexity: {
            vocabulary: 0,
            length: 0,
            difficulty: 0,
            effort: 0,
            volume: 0,
            bugs: 0,
            time: 0
        },
        maintainabilityIndex: 0,
        linesOfCode: 0,
        logicalLinesOfCode: 0,
        commentLines: 0,
        blankLines: 0
    };
    // 基础指标计算
    calculateBasicMetrics(code, metrics);
    // 圈复杂度计算
    metrics.cyclomaticComplexity = calculateCyclomaticComplexity(code, language);
    // 认知复杂度计算
    metrics.cognitiveComplexity = calculateCognitiveComplexity(code, language);
    // Halstead复杂度计算
    metrics.halsteadComplexity = calculateHalsteadComplexity(code, language);
    // 可维护性指数计算
    metrics.maintainabilityIndex = calculateMaintainabilityIndex(metrics);
    return {
        language,
        metrics,
        analysis: analyzeComplexity(metrics),
        recommendations: generateComplexityRecommendations(metrics),
        riskLevel: assessRiskLevel(metrics)
    };
}
/**
 * 计算基础指标
 */
function calculateBasicMetrics(code, metrics) {
    const lines = code.split('\n');
    metrics.linesOfCode = lines.length;
    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine === '') {
            metrics.blankLines++;
        }
        else if (isCommentLine(trimmedLine)) {
            metrics.commentLines++;
        }
        else {
            metrics.logicalLinesOfCode++;
        }
    });
}
/**
 * 计算圈复杂度（McCabe复杂度）
 */
function calculateCyclomaticComplexity(code, language) {
    let complexity = 1; // 基础复杂度
    // 根据语言定义决策点关键字
    const decisionKeywords = getDecisionKeywords(language);
    decisionKeywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = code.match(regex);
        if (matches) {
            complexity += matches.length;
        }
    });
    // 特殊处理case语句
    const caseMatches = code.match(/\bcase\b/gi);
    if (caseMatches) {
        complexity += caseMatches.length;
    }
    // 处理逻辑操作符
    const logicalOperators = code.match(/&&|\|\|/g);
    if (logicalOperators) {
        complexity += logicalOperators.length;
    }
    return complexity;
}
/**
 * 计算认知复杂度
 */
function calculateCognitiveComplexity(code, language) {
    let complexity = 0;
    let nestingLevel = 0;
    const lines = code.split('\n');
    lines.forEach(line => {
        const trimmedLine = line.trim();
        // 更新嵌套级别
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        // 检测控制结构
        const controlStructures = getControlStructures(language);
        controlStructures.forEach(structure => {
            if (new RegExp(`\\b${structure}\\b`).test(trimmedLine)) {
                complexity += 1 + nestingLevel;
            }
        });
        // 检测逻辑操作符（在条件中）
        if (isInCondition(trimmedLine)) {
            const logicalOps = (trimmedLine.match(/&&|\|\|/g) || []).length;
            complexity += logicalOps;
        }
        // 检测递归调用
        if (hasRecursiveCall(trimmedLine, code)) {
            complexity += 1;
        }
        // 检测跳转语句
        const jumpStatements = ['break', 'continue', 'goto', 'return'];
        jumpStatements.forEach(jump => {
            if (new RegExp(`\\b${jump}\\b`).test(trimmedLine)) {
                complexity += 1;
            }
        });
        nestingLevel += openBraces - closeBraces;
        nestingLevel = Math.max(0, nestingLevel);
    });
    return complexity;
}
/**
 * 计算Halstead复杂度
 */
function calculateHalsteadComplexity(code, language) {
    const operators = getOperators(language);
    const operands = getOperands(code, language);
    const operatorCounts = countTokens(code, operators);
    const operandCounts = countTokens(code, operands);
    const n1 = Object.keys(operatorCounts).length; // 不同操作符数量
    const n2 = Object.keys(operandCounts).length; // 不同操作数数量
    const N1 = Object.values(operatorCounts).reduce((sum, count) => sum + count, 0); // 操作符总数
    const N2 = Object.values(operandCounts).reduce((sum, count) => sum + count, 0); // 操作数总数
    const vocabulary = n1 + n2;
    const length = N1 + N2;
    const difficulty = (n1 / 2) * (N2 / n2);
    const volume = length * Math.log2(vocabulary);
    const effort = difficulty * volume;
    const bugs = volume / 3000; // 经验公式
    const time = effort / 18; // 秒
    return {
        vocabulary,
        length,
        difficulty: Math.round(difficulty * 100) / 100,
        volume: Math.round(volume * 100) / 100,
        effort: Math.round(effort * 100) / 100,
        bugs: Math.round(bugs * 1000) / 1000,
        time: Math.round(time * 100) / 100
    };
}
/**
 * 计算可维护性指数
 */
function calculateMaintainabilityIndex(metrics) {
    const halstead = metrics.halsteadComplexity;
    const cyclomatic = metrics.cyclomaticComplexity;
    const loc = metrics.logicalLinesOfCode;
    const commentRatio = metrics.commentLines / (metrics.linesOfCode || 1);
    // Microsoft的可维护性指数公式（简化版）
    let mi = 171 - 5.2 * Math.log(halstead.volume) - 0.23 * cyclomatic - 16.2 * Math.log(loc);
    // 注释比例调整
    mi += 50 * Math.sin(Math.sqrt(2.4 * commentRatio));
    // 确保在0-100范围内
    mi = Math.max(0, Math.min(100, mi));
    return Math.round(mi * 100) / 100;
}
/**
 * 分析复杂度
 */
function analyzeComplexity(metrics) {
    const analysis = [];
    // 圈复杂度分析
    if (metrics.cyclomaticComplexity <= 10) {
        analysis.push('圈复杂度较低，代码结构简单清晰');
    }
    else if (metrics.cyclomaticComplexity <= 20) {
        analysis.push('圈复杂度中等，建议关注代码结构');
    }
    else {
        analysis.push('圈复杂度较高，建议重构以降低复杂度');
    }
    // 认知复杂度分析
    if (metrics.cognitiveComplexity <= 15) {
        analysis.push('认知复杂度较低，代码易于理解');
    }
    else if (metrics.cognitiveComplexity <= 25) {
        analysis.push('认知复杂度中等，需要一定时间理解');
    }
    else {
        analysis.push('认知复杂度较高，理解和维护困难');
    }
    // 可维护性指数分析
    if (metrics.maintainabilityIndex >= 80) {
        analysis.push('可维护性指数优秀，代码质量很高');
    }
    else if (metrics.maintainabilityIndex >= 60) {
        analysis.push('可维护性指数良好，代码质量较好');
    }
    else if (metrics.maintainabilityIndex >= 40) {
        analysis.push('可维护性指数一般，需要改进');
    }
    else {
        analysis.push('可维护性指数较低，急需重构');
    }
    // Halstead复杂度分析
    if (metrics.halsteadComplexity.difficulty > 30) {
        analysis.push('Halstead难度较高，代码理解困难');
    }
    if (metrics.halsteadComplexity.bugs > 0.1) {
        analysis.push(`预估可能存在 ${metrics.halsteadComplexity.bugs.toFixed(3)} 个缺陷`);
    }
    return analysis.join('；');
}
/**
 * 生成复杂度改进建议
 */
function generateComplexityRecommendations(metrics) {
    const recommendations = [];
    if (metrics.cyclomaticComplexity > 15) {
        recommendations.push('将复杂函数拆分为多个小函数');
        recommendations.push('减少条件分支，使用多态或策略模式');
        recommendations.push('提取重复的条件判断为独立函数');
    }
    if (metrics.cognitiveComplexity > 20) {
        recommendations.push('减少嵌套层级，使用早期返回');
        recommendations.push('将复杂逻辑提取为有意义的函数');
        recommendations.push('简化条件表达式，使用布尔变量');
    }
    if (metrics.maintainabilityIndex < 60) {
        recommendations.push('增加代码注释，提高可读性');
        recommendations.push('重构长函数和复杂逻辑');
        recommendations.push('改善变量和函数命名');
    }
    if (metrics.halsteadComplexity.difficulty > 25) {
        recommendations.push('简化表达式，减少操作符使用');
        recommendations.push('提取常量，减少魔法数字');
        recommendations.push('使用更清晰的变量名');
    }
    const commentRatio = metrics.commentLines / (metrics.linesOfCode || 1);
    if (commentRatio < 0.1) {
        recommendations.push('增加必要的代码注释');
    }
    if (recommendations.length === 0) {
        recommendations.push('代码复杂度控制良好，继续保持');
    }
    return recommendations;
}
/**
 * 评估风险等级
 */
function assessRiskLevel(metrics) {
    let riskScore = 0;
    // 圈复杂度风险
    if (metrics.cyclomaticComplexity > 20)
        riskScore += 3;
    else if (metrics.cyclomaticComplexity > 10)
        riskScore += 1;
    // 认知复杂度风险
    if (metrics.cognitiveComplexity > 25)
        riskScore += 3;
    else if (metrics.cognitiveComplexity > 15)
        riskScore += 1;
    // 可维护性指数风险
    if (metrics.maintainabilityIndex < 40)
        riskScore += 3;
    else if (metrics.maintainabilityIndex < 60)
        riskScore += 1;
    // Halstead复杂度风险
    if (metrics.halsteadComplexity.difficulty > 30)
        riskScore += 2;
    if (metrics.halsteadComplexity.bugs > 0.2)
        riskScore += 2;
    if (riskScore >= 8)
        return 'critical';
    if (riskScore >= 5)
        return 'high';
    if (riskScore >= 2)
        return 'medium';
    return 'low';
}
// 辅助函数
function isCommentLine(line) {
    return line.startsWith('//') || line.startsWith('#') ||
        line.startsWith('/*') || line.startsWith('*') ||
        line.startsWith('"""') || line.startsWith("'''");
}
function getDecisionKeywords(language) {
    const common = ['if', 'while', 'for', 'catch', 'case'];
    switch (language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
            return [...common, 'switch', 'try'];
        case 'python':
            return [...common, 'elif', 'except', 'finally', 'with'];
        case 'java':
            return [...common, 'switch', 'try', 'finally'];
        case 'c':
        case 'cpp':
            return [...common, 'switch', 'do'];
        default:
            return common;
    }
}
function getControlStructures(language) {
    return ['if', 'else', 'while', 'for', 'switch', 'try', 'catch', 'finally'];
}
function isInCondition(line) {
    return /\b(if|while|for)\s*\(/.test(line) || /\?.*:/.test(line);
}
function hasRecursiveCall(line, code) {
    // 简化的递归检测
    const functionName = extractFunctionName(code);
    return Boolean(functionName && line.includes(functionName));
}
function extractFunctionName(code) {
    const match = code.match(/function\s+(\w+)|def\s+(\w+)|\b(\w+)\s*\(/m);
    return match ? (match[1] || match[2] || match[3]) : null;
}
function getOperators(language) {
    const common = ['+', '-', '*', '/', '%', '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||', '!'];
    switch (language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
            return [...common, '===', '!==', '++', '--', '+=', '-=', '*=', '/='];
        case 'python':
            return [...common, '//', '**', 'and', 'or', 'not', 'in', 'is'];
        case 'java':
            return [...common, '++', '--', '+=', '-=', '*=', '/=', 'instanceof'];
        default:
            return common;
    }
}
function getOperands(code, language) {
    // 简化的操作数提取
    const operands = [];
    // 提取变量名
    const variablePattern = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
    const variables = code.match(variablePattern) || [];
    operands.push(...variables);
    // 提取数字
    const numberPattern = /\b\d+(\.\d+)?\b/g;
    const numbers = code.match(numberPattern) || [];
    operands.push(...numbers);
    // 提取字符串
    const stringPattern = /["'][^"']*["']/g;
    const strings = code.match(stringPattern) || [];
    operands.push(...strings);
    return [...new Set(operands)]; // 去重
}
function countTokens(code, tokens) {
    const counts = {};
    tokens.forEach(token => {
        const regex = new RegExp(`\\b${escapeRegExp(token)}\\b`, 'g');
        const matches = code.match(regex);
        if (matches) {
            counts[token] = matches.length;
        }
    });
    return counts;
}
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=complexityCalculator.js.map
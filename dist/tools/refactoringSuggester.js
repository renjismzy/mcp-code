/**
 * 提供代码重构建议
 */
export async function suggestRefactoring(code, language, focus = 'all') {
    const suggestions = [];
    // 根据重构重点进行分析
    if (focus === 'all' || focus === 'performance') {
        await analyzePerformanceIssues(code, language, suggestions);
    }
    if (focus === 'all' || focus === 'readability') {
        await analyzeReadabilityIssues(code, language, suggestions);
    }
    if (focus === 'all' || focus === 'maintainability') {
        await analyzeMaintainabilityIssues(code, language, suggestions);
    }
    // 语言特定重构建议
    switch (language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
            await analyzeJavaScriptRefactoring(code, suggestions);
            break;
        case 'python':
            await analyzePythonRefactoring(code, suggestions);
            break;
        case 'java':
            await analyzeJavaRefactoring(code, suggestions);
            break;
    }
    // 按优先级排序
    suggestions.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
    return {
        language,
        focus,
        totalSuggestions: suggestions.length,
        highPriority: suggestions.filter(s => s.priority === 'high').length,
        mediumPriority: suggestions.filter(s => s.priority === 'medium').length,
        lowPriority: suggestions.filter(s => s.priority === 'low').length,
        suggestions,
        summary: generateRefactoringSummary(suggestions, focus)
    };
}
/**
 * 分析性能问题
 */
async function analyzePerformanceIssues(code, language, suggestions) {
    const lines = code.split('\n');
    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();
        // 检测循环中的重复计算
        if (isInLoop(lines, index) && hasExpensiveOperation(trimmedLine)) {
            suggestions.push({
                type: 'performance',
                priority: 'high',
                title: '循环中的重复计算',
                description: '在循环中发现可能的重复计算，建议提取到循环外部',
                line: lineNumber,
                originalCode: line,
                suggestedCode: optimizeLoopCalculation(line, language),
                impact: '可显著提升性能，特别是在大数据集处理时',
                effort: 'low'
            });
        }
        // 检测字符串拼接性能问题
        if (hasInefficiientStringConcatenation(trimmedLine, language)) {
            suggestions.push({
                type: 'performance',
                priority: 'medium',
                title: '低效的字符串拼接',
                description: '使用更高效的字符串拼接方法',
                line: lineNumber,
                originalCode: line,
                suggestedCode: optimizeStringConcatenation(line, language),
                impact: '在大量字符串操作时可提升性能',
                effort: 'low'
            });
        }
        // 检测不必要的对象创建
        if (hasUnnecessaryObjectCreation(trimmedLine, language)) {
            suggestions.push({
                type: 'performance',
                priority: 'medium',
                title: '不必要的对象创建',
                description: '减少不必要的对象创建以降低内存压力',
                line: lineNumber,
                originalCode: line,
                suggestedCode: optimizeObjectCreation(line, language),
                impact: '减少内存使用和垃圾回收压力',
                effort: 'medium'
            });
        }
        // 检测低效的数组操作
        if (hasInefficientArrayOperation(trimmedLine, language)) {
            suggestions.push({
                type: 'performance',
                priority: 'medium',
                title: '低效的数组操作',
                description: '使用更高效的数组操作方法',
                line: lineNumber,
                originalCode: line,
                suggestedCode: optimizeArrayOperation(line, language),
                impact: '在处理大数组时可显著提升性能',
                effort: 'low'
            });
        }
    });
}
/**
 * 分析可读性问题
 */
async function analyzeReadabilityIssues(code, language, suggestions) {
    const lines = code.split('\n');
    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();
        // 检测过长的行
        if (line.length > 120) {
            suggestions.push({
                type: 'readability',
                priority: 'medium',
                title: '代码行过长',
                description: '将长行拆分为多行以提高可读性',
                line: lineNumber,
                originalCode: line,
                suggestedCode: breakLongLine(line, language),
                impact: '提高代码可读性和维护性',
                effort: 'low'
            });
        }
        // 检测复杂的条件表达式
        if (hasComplexCondition(trimmedLine)) {
            suggestions.push({
                type: 'readability',
                priority: 'high',
                title: '复杂的条件表达式',
                description: '将复杂条件拆分为多个简单条件或提取为函数',
                line: lineNumber,
                originalCode: line,
                suggestedCode: simplifyCondition(line, language),
                impact: '大幅提高代码可读性和理解性',
                effort: 'medium'
            });
        }
        // 检测魔法数字
        if (hasMagicNumbers(trimmedLine)) {
            suggestions.push({
                type: 'readability',
                priority: 'medium',
                title: '魔法数字',
                description: '将魔法数字提取为有意义的常量',
                line: lineNumber,
                originalCode: line,
                suggestedCode: extractMagicNumbers(line, language),
                impact: '提高代码可读性和维护性',
                effort: 'low'
            });
        }
        // 检测不清晰的变量名
        if (hasPoorVariableNames(trimmedLine)) {
            suggestions.push({
                type: 'readability',
                priority: 'medium',
                title: '不清晰的变量名',
                description: '使用更具描述性的变量名',
                line: lineNumber,
                originalCode: line,
                suggestedCode: improveVariableNames(line, language),
                impact: '提高代码可读性和自文档化',
                effort: 'low'
            });
        }
    });
    // 检测缺少注释的复杂函数
    const functions = extractFunctions(code, language);
    functions.forEach(func => {
        if (func.complexity > 10 && !func.hasComments) {
            suggestions.push({
                type: 'readability',
                priority: 'high',
                title: '复杂函数缺少注释',
                description: '为复杂函数添加详细注释说明其功能和逻辑',
                line: func.startLine,
                originalCode: func.code,
                suggestedCode: addFunctionComments(func, language),
                impact: '大幅提高代码可理解性',
                effort: 'medium'
            });
        }
    });
}
/**
 * 分析可维护性问题
 */
async function analyzeMaintainabilityIssues(code, language, suggestions) {
    const lines = code.split('\n');
    // 检测重复代码
    const duplicates = findDuplicateCode(lines);
    duplicates.forEach(duplicate => {
        suggestions.push({
            type: 'maintainability',
            priority: 'high',
            title: '重复代码',
            description: '提取重复代码为公共函数或方法',
            line: duplicate.lines[0],
            originalCode: duplicate.code,
            suggestedCode: extractDuplicateCode(duplicate, language),
            impact: '减少代码重复，提高维护性',
            effort: 'medium'
        });
    });
    // 检测过长的函数
    const functions = extractFunctions(code, language);
    functions.forEach(func => {
        if (func.lineCount > 50) {
            suggestions.push({
                type: 'maintainability',
                priority: 'high',
                title: '函数过长',
                description: '将长函数拆分为多个小函数',
                line: func.startLine,
                originalCode: func.code,
                suggestedCode: splitLongFunction(func, language),
                impact: '提高代码模块化和可测试性',
                effort: 'high'
            });
        }
    });
    // 检测过多的参数
    functions.forEach(func => {
        if (func.parameterCount > 5) {
            suggestions.push({
                type: 'maintainability',
                priority: 'medium',
                title: '函数参数过多',
                description: '考虑使用对象参数或拆分函数',
                line: func.startLine,
                originalCode: func.signature,
                suggestedCode: refactorParameters(func, language),
                impact: '提高函数可读性和易用性',
                effort: 'medium'
            });
        }
    });
    // 检测深层嵌套
    lines.forEach((line, index) => {
        const nestingLevel = calculateNestingLevel(lines, index);
        if (nestingLevel > 4) {
            suggestions.push({
                type: 'maintainability',
                priority: 'medium',
                title: '嵌套层级过深',
                description: '减少嵌套层级，使用早期返回或提取函数',
                line: index + 1,
                originalCode: line,
                suggestedCode: reduceNesting(lines, index, language),
                impact: '提高代码可读性和理解性',
                effort: 'medium'
            });
        }
    });
}
/**
 * JavaScript/TypeScript 特定重构分析
 */
async function analyzeJavaScriptRefactoring(code, suggestions) {
    const lines = code.split('\n');
    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();
        // 建议使用现代JavaScript特性
        if (trimmedLine.includes('var ')) {
            suggestions.push({
                type: 'modernization',
                priority: 'medium',
                title: '使用现代变量声明',
                description: '使用let或const替代var',
                line: lineNumber,
                originalCode: line,
                suggestedCode: line.replace(/\bvar\b/g, 'const'),
                impact: '提高代码安全性和可读性',
                effort: 'low'
            });
        }
        // 建议使用箭头函数
        if (/function\s*\([^)]*\)\s*\{/.test(trimmedLine) && !trimmedLine.includes('function ')) {
            suggestions.push({
                type: 'modernization',
                priority: 'low',
                title: '使用箭头函数',
                description: '考虑使用箭头函数简化语法',
                line: lineNumber,
                originalCode: line,
                suggestedCode: convertToArrowFunction(line),
                impact: '简化语法，提高可读性',
                effort: 'low'
            });
        }
        // 建议使用模板字符串
        if (hasStringConcatenation(trimmedLine)) {
            suggestions.push({
                type: 'modernization',
                priority: 'low',
                title: '使用模板字符串',
                description: '使用模板字符串替代字符串拼接',
                line: lineNumber,
                originalCode: line,
                suggestedCode: convertToTemplateString(line),
                impact: '提高可读性和维护性',
                effort: 'low'
            });
        }
        // 建议使用解构赋值
        if (hasObjectPropertyAccess(trimmedLine)) {
            suggestions.push({
                type: 'modernization',
                priority: 'low',
                title: '使用解构赋值',
                description: '使用解构赋值简化对象属性访问',
                line: lineNumber,
                originalCode: line,
                suggestedCode: convertToDestructuring(line),
                impact: '简化代码，提高可读性',
                effort: 'low'
            });
        }
    });
}
/**
 * Python 特定重构分析
 */
async function analyzePythonRefactoring(code, suggestions) {
    const lines = code.split('\n');
    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();
        // 建议使用列表推导式
        if (isSimpleLoop(trimmedLine) && canUseListComprehension(lines, index)) {
            suggestions.push({
                type: 'pythonic',
                priority: 'medium',
                title: '使用列表推导式',
                description: '使用列表推导式替代简单循环',
                line: lineNumber,
                originalCode: extractLoopCode(lines, index),
                suggestedCode: convertToListComprehension(lines, index),
                impact: '提高性能和可读性',
                effort: 'low'
            });
        }
        // 建议使用with语句
        if (trimmedLine.includes('open(') && !isInWithStatement(lines, index)) {
            suggestions.push({
                type: 'pythonic',
                priority: 'high',
                title: '使用with语句',
                description: '使用with语句确保文件正确关闭',
                line: lineNumber,
                originalCode: line,
                suggestedCode: convertToWithStatement(line),
                impact: '提高资源管理安全性',
                effort: 'low'
            });
        }
        // 建议使用f-string
        if (hasStringFormatting(trimmedLine)) {
            suggestions.push({
                type: 'pythonic',
                priority: 'low',
                title: '使用f-string',
                description: '使用f-string替代字符串格式化',
                line: lineNumber,
                originalCode: line,
                suggestedCode: convertToFString(line),
                impact: '提高性能和可读性',
                effort: 'low'
            });
        }
    });
}
/**
 * Java 特定重构分析
 */
async function analyzeJavaRefactoring(code, suggestions) {
    const lines = code.split('\n');
    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();
        // 建议使用Stream API
        if (isTraditionalLoop(trimmedLine) && canUseStream(lines, index)) {
            suggestions.push({
                type: 'modernization',
                priority: 'medium',
                title: '使用Stream API',
                description: '使用Stream API替代传统循环',
                line: lineNumber,
                originalCode: extractLoopCode(lines, index),
                suggestedCode: convertToStream(lines, index),
                impact: '提高代码表达力和可读性',
                effort: 'medium'
            });
        }
        // 建议使用Optional
        if (hasNullCheck(trimmedLine)) {
            suggestions.push({
                type: 'modernization',
                priority: 'medium',
                title: '使用Optional',
                description: '使用Optional替代null检查',
                line: lineNumber,
                originalCode: line,
                suggestedCode: convertToOptional(line),
                impact: '提高空值处理安全性',
                effort: 'medium'
            });
        }
        // 建议使用try-with-resources
        if (hasResourceManagement(trimmedLine)) {
            suggestions.push({
                type: 'modernization',
                priority: 'high',
                title: '使用try-with-resources',
                description: '使用try-with-resources确保资源正确释放',
                line: lineNumber,
                originalCode: line,
                suggestedCode: convertToTryWithResources(line),
                impact: '提高资源管理安全性',
                effort: 'medium'
            });
        }
    });
}
// 辅助函数实现（简化版）
function isInLoop(lines, index) {
    for (let i = index - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.includes('for') || line.includes('while'))
            return true;
        if (line.includes('}'))
            break;
    }
    return false;
}
function hasExpensiveOperation(line) {
    return line.includes('Math.') || line.includes('parseInt') || line.includes('parseFloat');
}
function hasInefficiientStringConcatenation(line, language) {
    switch (language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
            return line.includes('+=') && line.includes('"');
        case 'java':
            return line.includes('+=') && line.includes('String');
        default:
            return false;
    }
}
function hasUnnecessaryObjectCreation(line, language) {
    return line.includes('new ') && (line.includes('for') || line.includes('while'));
}
function hasInefficientArrayOperation(line, language) {
    return line.includes('.push(') && isInLoop([line], 0);
}
function hasComplexCondition(line) {
    const operators = (line.match(/&&|\|\||==|!=|>=|<=/g) || []).length;
    return operators > 2;
}
function hasMagicNumbers(line) {
    const numbers = line.match(/\b\d{2,}\b/g);
    return numbers !== null && numbers.length > 0;
}
function hasPoorVariableNames(line) {
    const poorNames = ['a', 'b', 'c', 'x', 'y', 'z', 'temp', 'data', 'item'];
    return poorNames.some(name => new RegExp(`\\b${name}\\b`).test(line));
}
function hasStringConcatenation(line) {
    return line.includes('+') && line.includes('"');
}
function hasObjectPropertyAccess(line) {
    return /\w+\.\w+/.test(line);
}
function isSimpleLoop(line) {
    return line.includes('for ') && line.includes(' in ');
}
function canUseListComprehension(lines, index) {
    return lines[index + 1]?.trim().includes('append(');
}
function isInWithStatement(lines, index) {
    for (let i = index - 1; i >= 0; i--) {
        if (lines[i].trim().startsWith('with '))
            return true;
        if (lines[i].trim() === '')
            continue;
        break;
    }
    return false;
}
function hasStringFormatting(line) {
    return line.includes('.format(') || line.includes('%');
}
function isTraditionalLoop(line) {
    return line.includes('for(') || line.includes('for (');
}
function canUseStream(lines, index) {
    return lines[index + 1]?.includes('add(') || lines[index + 1]?.includes('put(');
}
function hasNullCheck(line) {
    return line.includes('!= null') || line.includes('== null');
}
function hasResourceManagement(line) {
    return line.includes('FileInputStream') || line.includes('BufferedReader');
}
// 代码转换函数（简化实现）
function optimizeLoopCalculation(line, language) {
    return `// 将计算提取到循环外部\n${line}`;
}
function optimizeStringConcatenation(line, language) {
    switch (language.toLowerCase()) {
        case 'javascript':
            return line.replace(/\+/g, '使用模板字符串');
        case 'java':
            return line.replace('String', 'StringBuilder');
        default:
            return line;
    }
}
function optimizeObjectCreation(line, language) {
    return `// 考虑对象池或重用\n${line}`;
}
function optimizeArrayOperation(line, language) {
    return line.replace('.push(', '.concat([') + '])';
}
function breakLongLine(line, language) {
    const indent = line.match(/^\s*/)?.[0] || '';
    const parts = line.trim().split(' ');
    const mid = Math.floor(parts.length / 2);
    return `${indent}${parts.slice(0, mid).join(' ')}\n${indent}    ${parts.slice(mid).join(' ')}`;
}
function simplifyCondition(line, language) {
    return `// 将复杂条件提取为函数\n${line}`;
}
function extractMagicNumbers(line, language) {
    return `// 定义常量\nconst MAGIC_NUMBER = 42;\n${line.replace(/\d+/, 'MAGIC_NUMBER')}`;
}
function improveVariableNames(line, language) {
    return line.replace(/\ba\b/g, 'meaningfulName');
}
function addFunctionComments(func, language) {
    return `/**\n * 函数功能描述\n */\n${func.code}`;
}
function extractDuplicateCode(duplicate, language) {
    return `// 提取为公共函数\nfunction extractedFunction() {\n    ${duplicate.code}\n}`;
}
function splitLongFunction(func, language) {
    return `// 将长函数拆分为多个小函数\n${func.code}`;
}
function refactorParameters(func, language) {
    return `// 使用对象参数\nfunction ${func.name}(options) { ... }`;
}
function reduceNesting(lines, index, language) {
    return `// 使用早期返回减少嵌套\n${lines[index]}`;
}
function convertToArrowFunction(line) {
    return line.replace(/function\s*\(([^)]*)\)\s*\{/, '($1) => {');
}
function convertToTemplateString(line) {
    return line.replace(/"([^"]*)"/g, '`$1`');
}
function convertToDestructuring(line) {
    return `// 使用解构赋值\n${line}`;
}
function convertToListComprehension(lines, index) {
    return `// 使用列表推导式\nresult = [item for item in collection]`;
}
function convertToWithStatement(line) {
    return line.replace(/open\(/, 'with open(') + ':';
}
function convertToFString(line) {
    return line.replace(/\.format\(/, 'f"...{') + '}"';
}
function convertToStream(lines, index) {
    return `// 使用Stream API\ncollection.stream().map(...).collect(...)`;
}
function convertToOptional(line) {
    return line.replace('!= null', 'Optional.ofNullable(...).isPresent()');
}
function convertToTryWithResources(line) {
    return `try (${line}) {\n    // 资源会自动关闭\n}`;
}
function extractLoopCode(lines, index) {
    return lines.slice(index, index + 3).join('\n');
}
function calculateNestingLevel(lines, index) {
    let level = 0;
    for (let i = 0; i <= index; i++) {
        const line = lines[i];
        level += (line.match(/\{/g) || []).length;
        level -= (line.match(/\}/g) || []).length;
    }
    return level;
}
function extractFunctions(code, language) {
    // 简化的函数提取逻辑
    return [];
}
function findDuplicateCode(lines) {
    // 简化的重复代码检测
    return [];
}
function generateRefactoringSummary(suggestions, focus) {
    const total = suggestions.length;
    if (total === 0) {
        return '代码质量良好，未发现需要重构的问题';
    }
    const byType = suggestions.reduce((acc, s) => {
        acc[s.type] = (acc[s.type] || 0) + 1;
        return acc;
    }, {});
    let summary = `发现 ${total} 个重构建议，重点关注 ${focus}。`;
    Object.entries(byType).forEach(([type, count]) => {
        summary += ` ${type}: ${count}个；`;
    });
    return summary;
}
//# sourceMappingURL=refactoringSuggester.js.map
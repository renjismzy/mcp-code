/**
 * 文档生成工具
 * 为代码生成各种格式的文档
 */
export async function generateDocumentation(code, language, docType = 'markdown') {
    switch (docType) {
        case 'inline':
            return generateInlineComments(code, language);
        case 'jsdoc':
            return generateJSDoc(code, language);
        case 'markdown':
        default:
            return generateMarkdownDoc(code, language);
    }
}
/**
 * 生成内联注释
 */
function generateInlineComments(code, language) {
    const lines = code.split('\n');
    const commentedLines = [];
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        // 为函数添加注释
        if (isFunctionDeclaration(trimmedLine, language)) {
            const functionInfo = extractFunctionInfo(trimmedLine, language);
            const comment = generateFunctionComment(functionInfo, language);
            commentedLines.push(comment);
        }
        // 为复杂逻辑添加注释
        if (isComplexLogic(trimmedLine, language)) {
            const explanation = explainComplexLogic(trimmedLine, language);
            commentedLines.push(formatComment(explanation, language));
        }
        commentedLines.push(line);
        // 为变量声明添加注释
        if (isVariableDeclaration(trimmedLine, language)) {
            const varInfo = extractVariableInfo(trimmedLine, language);
            if (varInfo.isComplex) {
                const explanation = explainVariable(varInfo, language);
                commentedLines.push(formatComment(explanation, language));
            }
        }
    });
    return commentedLines.join('\n');
}
/**
 * 生成JSDoc格式文档
 */
function generateJSDoc(code, language) {
    const lines = code.split('\n');
    const documentedLines = [];
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        if (isFunctionDeclaration(trimmedLine, language)) {
            const functionInfo = extractFunctionInfo(trimmedLine, language);
            const jsdoc = generateJSDocComment(functionInfo);
            documentedLines.push(jsdoc);
        }
        if (isClassDeclaration(trimmedLine, language)) {
            const classInfo = extractClassInfo(trimmedLine, language);
            const jsdoc = generateClassJSDoc(classInfo);
            documentedLines.push(jsdoc);
        }
        documentedLines.push(line);
    });
    return documentedLines.join('\n');
}
/**
 * 生成Markdown文档
 */
function generateMarkdownDoc(code, language) {
    const analysis = analyzeCodeStructure(code, language);
    let markdown = `# 代码文档\n\n`;
    if (analysis.overview) {
        markdown += `## 概述\n\n${analysis.overview}\n\n`;
    }
    if (analysis.classes.length > 0) {
        markdown += `## 类\n\n`;
        analysis.classes.forEach(cls => {
            markdown += `### ${cls.name}\n\n`;
            markdown += `${cls.description}\n\n`;
            if (cls.properties.length > 0) {
                markdown += `#### 属性\n\n`;
                cls.properties.forEach((prop) => {
                    markdown += `- **${prop.name}** (${prop.type}): ${prop.description}\n`;
                });
                markdown += '\n';
            }
            if (cls.methods.length > 0) {
                markdown += `#### 方法\n\n`;
                cls.methods.forEach((method) => {
                    markdown += `##### ${method.name}\n\n`;
                    markdown += `${method.description}\n\n`;
                    if (method.parameters.length > 0) {
                        markdown += `**参数:**\n\n`;
                        method.parameters.forEach((param) => {
                            markdown += `- \`${param.name}\` (${param.type}): ${param.description}\n`;
                        });
                        markdown += '\n';
                    }
                    if (method.returns) {
                        markdown += `**返回值:** ${method.returns.type} - ${method.returns.description}\n\n`;
                    }
                    markdown += `\`\`\`${language}\n${method.code}\n\`\`\`\n\n`;
                });
            }
        });
    }
    if (analysis.functions.length > 0) {
        markdown += `## 函数\n\n`;
        analysis.functions.forEach(func => {
            markdown += `### ${func.name}\n\n`;
            markdown += `${func.description}\n\n`;
            if (func.parameters.length > 0) {
                markdown += `**参数:**\n\n`;
                func.parameters.forEach((param) => {
                    markdown += `- \`${param.name}\` (${param.type}): ${param.description}\n`;
                });
                markdown += '\n';
            }
            if (func.returns) {
                markdown += `**返回值:** ${func.returns.type} - ${func.returns.description}\n\n`;
            }
            markdown += `\`\`\`${language}\n${func.code}\n\`\`\`\n\n`;
        });
    }
    if (analysis.constants.length > 0) {
        markdown += `## 常量\n\n`;
        analysis.constants.forEach(constant => {
            markdown += `- **${constant.name}**: ${constant.description}\n`;
        });
        markdown += '\n';
    }
    if (analysis.usage) {
        markdown += `## 使用示例\n\n`;
        markdown += `\`\`\`${language}\n${analysis.usage}\n\`\`\`\n\n`;
    }
    return markdown;
}
/**
 * 分析代码结构
 */
function analyzeCodeStructure(code, language) {
    const lines = code.split('\n');
    const structure = {
        overview: generateOverview(code, language),
        classes: [],
        functions: [],
        constants: [],
        usage: generateUsageExample(code, language)
    };
    let currentClass = null;
    lines.forEach((line, index) => {
        const trimmedLine = line.trim();
        // 检测类
        if (isClassDeclaration(trimmedLine, language)) {
            currentClass = extractClassInfo(trimmedLine, language);
            currentClass.methods = [];
            currentClass.properties = [];
            structure.classes.push(currentClass);
        }
        // 检测函数/方法
        if (isFunctionDeclaration(trimmedLine, language)) {
            const functionInfo = extractFunctionInfo(trimmedLine, language);
            const functionCode = extractFunctionCode(lines, index, language);
            const funcDoc = {
                name: functionInfo.name,
                description: generateFunctionDescription(functionInfo, language),
                parameters: functionInfo.parameters.map((p) => ({
                    name: p.name,
                    type: p.type || 'any',
                    description: generateParameterDescription(p.name, functionInfo.name)
                })),
                returns: functionInfo.returnType ? {
                    type: functionInfo.returnType,
                    description: generateReturnDescription(functionInfo.name, functionInfo.returnType)
                } : null,
                code: functionCode
            };
            if (currentClass && isMethodDeclaration(trimmedLine, language)) {
                currentClass.methods.push(funcDoc);
            }
            else {
                structure.functions.push(funcDoc);
            }
        }
        // 检测常量
        if (isConstantDeclaration(trimmedLine, language)) {
            const constantInfo = extractConstantInfo(trimmedLine, language);
            structure.constants.push({
                name: constantInfo.name,
                description: generateConstantDescription(constantInfo.name, constantInfo.value)
            });
        }
    });
    return structure;
}
/**
 * 生成概述
 */
function generateOverview(code, language) {
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(line => line.trim().length > 0);
    let overview = `这是一个${language}代码文件，包含${nonEmptyLines.length}行代码。`;
    const functionCount = lines.filter(line => isFunctionDeclaration(line.trim(), language)).length;
    const classCount = lines.filter(line => isClassDeclaration(line.trim(), language)).length;
    if (classCount > 0) {
        overview += ` 定义了${classCount}个类`;
    }
    if (functionCount > 0) {
        overview += ` 和${functionCount}个函数`;
    }
    overview += '。';
    // 尝试从注释中提取更多信息
    const comments = extractComments(code, language);
    if (comments.length > 0) {
        const firstComment = comments[0];
        if (firstComment.length > 20) {
            overview += ` ${firstComment}`;
        }
    }
    return overview;
}
/**
 * 生成使用示例
 */
function generateUsageExample(code, language) {
    const structure = extractBasicStructure(code, language);
    let example = '';
    switch (language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
            if (structure.classes.length > 0) {
                const firstClass = structure.classes[0];
                example += `// 创建${firstClass}实例\n`;
                example += `const instance = new ${firstClass}();\n\n`;
            }
            if (structure.functions.length > 0) {
                const firstFunction = structure.functions[0];
                example += `// 调用${firstFunction}函数\n`;
                example += `const result = ${firstFunction}();\n`;
            }
            break;
        case 'python':
            if (structure.classes.length > 0) {
                const firstClass = structure.classes[0];
                example += `# 创建${firstClass}实例\n`;
                example += `instance = ${firstClass}()\n\n`;
            }
            if (structure.functions.length > 0) {
                const firstFunction = structure.functions[0];
                example += `# 调用${firstFunction}函数\n`;
                example += `result = ${firstFunction}()\n`;
            }
            break;
        case 'java':
            if (structure.classes.length > 0) {
                const firstClass = structure.classes[0];
                example += `// 创建${firstClass}实例\n`;
                example += `${firstClass} instance = new ${firstClass}();\n\n`;
            }
            break;
    }
    return example;
}
// 辅助函数
function isFunctionDeclaration(line, language) {
    switch (language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
            return /^(export\s+)?(async\s+)?function\s+\w+|^\w+\s*[:=]\s*(async\s+)?\(|^(async\s+)?\w+\s*\(/.test(line);
        case 'python':
            return /^def\s+\w+/.test(line);
        case 'java':
            return /^(public|private|protected)?\s*(static\s+)?\w+\s+\w+\s*\(/.test(line);
        default:
            return /function|def|fn\s+/.test(line);
    }
}
function isClassDeclaration(line, language) {
    switch (language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
            return /^(export\s+)?(abstract\s+)?class\s+\w+/.test(line);
        case 'python':
            return /^class\s+\w+/.test(line);
        case 'java':
            return /^(public\s+)?(abstract\s+)?class\s+\w+/.test(line);
        default:
            return /class\s+\w+/.test(line);
    }
}
function isMethodDeclaration(line, language) {
    // 简化的方法检测逻辑
    return isFunctionDeclaration(line, language);
}
function isVariableDeclaration(line, language) {
    switch (language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
            return /^(let|const|var)\s+\w+/.test(line);
        case 'python':
            return /^\w+\s*=/.test(line);
        case 'java':
            return /^(public|private|protected)?\s*(static\s+)?(final\s+)?\w+\s+\w+\s*=/.test(line);
        default:
            return /\w+\s*=/.test(line);
    }
}
function isConstantDeclaration(line, language) {
    switch (language.toLowerCase()) {
        case 'javascript':
        case 'typescript':
            return /^const\s+[A-Z_]+/.test(line);
        case 'python':
            return /^[A-Z_]+\s*=/.test(line);
        case 'java':
            return /^(public\s+)?(static\s+)?(final\s+)[A-Z_]+/.test(line);
        default:
            return /^[A-Z_]+\s*=/.test(line);
    }
}
function isComplexLogic(line, language) {
    const complexPatterns = [
        /if\s*\(.+&&.+\|\|.+\)/, // 复杂条件
        /for\s*\(.+;.+;.+\)/, // 复杂循环
        /\w+\s*=\s*.+\?.+:/, // 三元操作符
        /\w+\s*=\s*.+\+.+\*.+/, // 复杂计算
    ];
    return complexPatterns.some(pattern => pattern.test(line));
}
function extractFunctionInfo(line, language) {
    // 简化的函数信息提取
    const nameMatch = line.match(/(?:function\s+|def\s+|^\s*)(\w+)/);
    const name = nameMatch ? nameMatch[1] : 'unknown';
    return {
        name,
        parameters: [],
        returnType: null
    };
}
function extractClassInfo(line, language) {
    const nameMatch = line.match(/class\s+(\w+)/);
    const name = nameMatch ? nameMatch[1] : 'unknown';
    return {
        name,
        description: `${name}类的描述`
    };
}
function extractVariableInfo(line, language) {
    return {
        name: 'variable',
        isComplex: line.length > 50
    };
}
function extractConstantInfo(line, language) {
    const match = line.match(/(\w+)\s*=\s*(.+)/);
    return {
        name: match ? match[1] : 'CONSTANT',
        value: match ? match[2] : 'value'
    };
}
function extractFunctionCode(lines, startIndex, language) {
    // 简化的函数代码提取
    let endIndex = startIndex + 1;
    let braceCount = 0;
    let started = false;
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('{')) {
            braceCount += (line.match(/\{/g) || []).length;
            started = true;
        }
        if (line.includes('}')) {
            braceCount -= (line.match(/\}/g) || []).length;
        }
        if (started && braceCount === 0) {
            endIndex = i + 1;
            break;
        }
    }
    return lines.slice(startIndex, endIndex).join('\n');
}
function extractComments(code, language) {
    const comments = [];
    const lines = code.split('\n');
    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
            comments.push(trimmed.substring(2).trim());
        }
    });
    return comments;
}
function extractBasicStructure(code, language) {
    const lines = code.split('\n');
    const structure = {
        classes: [],
        functions: []
    };
    lines.forEach(line => {
        const trimmed = line.trim();
        if (isClassDeclaration(trimmed, language)) {
            const match = trimmed.match(/class\s+(\w+)/);
            if (match)
                structure.classes.push(match[1]);
        }
        if (isFunctionDeclaration(trimmed, language)) {
            const match = trimmed.match(/(?:function\s+|def\s+)(\w+)/);
            if (match)
                structure.functions.push(match[1]);
        }
    });
    return structure;
}
// 生成描述的辅助函数
function generateFunctionComment(functionInfo, language) {
    return formatComment(`${functionInfo.name}函数的功能描述`, language);
}
function generateFunctionDescription(functionInfo, language) {
    return `${functionInfo.name}函数用于执行特定的业务逻辑`;
}
function generateParameterDescription(paramName, functionName) {
    return `${functionName}函数的${paramName}参数`;
}
function generateReturnDescription(functionName, returnType) {
    return `${functionName}函数的返回值`;
}
function generateConstantDescription(name, value) {
    return `${name}常量，值为${value}`;
}
function generateJSDocComment(functionInfo) {
    let jsdoc = '/**\n';
    jsdoc += ` * ${functionInfo.name}函数的描述\n`;
    functionInfo.parameters.forEach((param) => {
        jsdoc += ` * @param {${param.type || 'any'}} ${param.name} - ${param.name}参数\n`;
    });
    if (functionInfo.returnType) {
        jsdoc += ` * @returns {${functionInfo.returnType}} 返回值描述\n`;
    }
    jsdoc += ' */';
    return jsdoc;
}
function generateClassJSDoc(classInfo) {
    let jsdoc = '/**\n';
    jsdoc += ` * ${classInfo.name}类的描述\n`;
    jsdoc += ` * @class\n`;
    jsdoc += ' */';
    return jsdoc;
}
function explainComplexLogic(line, language) {
    return '复杂逻辑的解释说明';
}
function explainVariable(varInfo, language) {
    return `${varInfo.name}变量的用途说明`;
}
function formatComment(text, language) {
    switch (language.toLowerCase()) {
        case 'python':
            return `# ${text}`;
        case 'java':
        case 'javascript':
        case 'typescript':
        default:
            return `// ${text}`;
    }
}
//# sourceMappingURL=docGenerator.js.map
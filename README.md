# 智能代码审查助手 MCP 使用指南

## 📋 目录

1. [安装配置](#安装配置)
2. [Claude Desktop 配置](#claude-desktop-配置)
3. [功能使用说明](#功能使用说明)
4. [实际使用示例](#实际使用示例)
5. [常见问题](#常见问题)
6. [最佳实践](#最佳实践)

## 🚀 安装配置

### 1. 环境要求

- Node.js 18+ 
- npm 或 yarn
- Claude Desktop 应用

### 2. 项目构建

下载uv包

### 2. 添加 MCP 服务器配置

在配置文件中添加以下内容：

```json
{
  "mcpServers": {
    "smart-code-reviewer": {
      "command": "npx",
      "args": [
        "-y",
        "https://github.com/renjismzy/mcp-code.git"
      ],
      "env": {
        "MCP_LOG_LEVEL": "info",
        "MCP_MAX_CODE_SIZE": "50000",
        "MCP_TIMEOUT": "30000"
      }
    }
  }
}
```

### 3. 重启 Claude Desktop

配置完成后，重启 Claude Desktop 应用以加载新的 MCP 服务器。

### 4. 验证连接

在 Claude Desktop 中发送消息：

```
你好！请告诉我你现在可以使用哪些工具？
```

如果配置成功，Claude 应该会显示可以使用智能代码审查相关的工具。

## 🛠️ 功能使用说明

### 1. 代码质量分析

**用途：** 全面分析代码质量，检测潜在问题

**使用方法：**
```
请分析以下JavaScript代码的质量：

```javascript
var x = 1;
if (x == 1) {
    console.log('test');
}
```
```

**分析内容：**
- 代码行数统计
- 复杂度评估
- 可维护性指数
- 样式问题检测
- 改进建议

### 2. 安全漏洞检测

**用途：** 检测代码中的安全风险和漏洞

**使用方法：**
```
请检测以下代码的安全问题：

```python
password = "hardcoded123"
result = eval(user_input)
```
```

**检测内容：**
- 硬编码敏感信息
- 代码注入风险
- 不安全函数使用
- SQL注入风险
- XSS漏洞

### 3. 重构建议

**用途：** 提供代码重构和优化建议

**使用方法：**
```
请为以下代码提供重构建议，重点关注性能优化：

```javascript
for(var i=0; i<arr.length; i++) {
    if(arr[i] == target) {
        return i;
    }
}
```
```

**建议类型：**
- 性能优化
- 可读性提升
- 可维护性增强
- 现代化改进

### 4. 复杂度计算

**用途：** 计算代码的各种复杂度指标

**使用方法：**
```
请计算以下函数的复杂度：

```java
public int complexMethod(int x) {
    if (x > 0) {
        for (int i = 0; i < x; i++) {
            if (i % 2 == 0) {
                System.out.println(i);
            }
        }
    }
    return x;
}
```
```

**复杂度指标：**
- 圈复杂度（McCabe）
- 认知复杂度
- Halstead复杂度
- 可维护性指数

### 5. 文档生成

**用途：** 自动生成代码文档和注释

**使用方法：**
```
请为以下函数生成Markdown格式的文档：

```python
def calculate_sum(a, b):
    return a + b
```
```

**文档格式：**
- Markdown文档
- JSDoc注释
- 内联注释

## 💡 实际使用示例

### 示例1：完整的代码审查流程

```
我有一个JavaScript函数需要进行完整的代码审查，请帮我：
1. 分析代码质量
2. 检测安全问题
3. 提供重构建议
4. 计算复杂度
5. 生成文档

代码如下：
```javascript
function processUserData(userData) {
    var result = '';
    for (var i = 0; i < userData.length; i++) {
        if (userData[i].active == true) {
            result = result + userData[i].name + ', ';
        }
    }
    return eval('(' + result + ')');
}
```
```

### 示例2：Python安全审计

```
请对这个Python函数进行安全审计：

```python
def execute_command(user_input):
    import subprocess
    command = f"ls {user_input}"
    return subprocess.call(command, shell=True)
```
```

### 示例3：Java代码重构

```
这个Java方法太复杂了，请提供重构建议：

```java
public String processData(String data, int type, boolean flag) {
    if (type == 1) {
        if (flag) {
            return data.toUpperCase();
        } else {
            return data.toLowerCase();
        }
    } else if (type == 2) {
        if (flag) {
            return data.trim().toUpperCase();
        } else {
            return data.trim().toLowerCase();
        }
    } else {
        return data;
    }
}
```
```

## ❓ 常见问题

### Q1: MCP服务器无法启动

**解决方案：**
1. 检查Node.js版本是否为18+
2. 确认项目已正确构建（`npm run build`）
3. 检查配置文件中的路径是否正确
4. 查看Claude Desktop的错误日志

### Q2: 工具无法使用

**解决方案：**
1. 重启Claude Desktop
2. 检查MCP服务器配置
3. 确认服务器进程正在运行
4. 检查环境变量设置

### Q3: 分析结果不准确

**解决方案：**
1. 确保代码语言标识正确
2. 检查代码格式是否规范
3. 尝试分析较小的代码片段
4. 查看详细的错误信息

### Q4: 性能问题

**解决方案：**
1. 减少单次分析的代码量
2. 调整超时设置
3. 检查系统资源使用情况
4. 优化代码分析参数

## 🎯 最佳实践

### 1. 代码准备

- **格式化代码**：确保代码格式规范，便于分析
- **完整代码**：提供完整的函数或类，避免代码片段不完整
- **语言标识**：明确指定编程语言
- **上下文信息**：提供必要的背景信息

### 2. 分析策略

- **分步分析**：对于复杂代码，分步进行不同类型的分析
- **重点关注**：根据需求重点关注特定方面（性能、安全、可读性）
- **批量处理**：对于多个文件，逐个进行分析
- **结果验证**：结合人工审查验证分析结果

### 3. 结果应用

- **优先级排序**：根据问题严重程度确定修复优先级
- **渐进改进**：逐步应用改进建议，避免大规模重构
- **测试验证**：修改后进行充分测试
- **文档更新**：及时更新相关文档

### 4. 团队协作

- **标准制定**：建立团队代码质量标准
- **定期审查**：定期进行代码质量审查
- **知识分享**：分享分析结果和改进经验
- **工具集成**：考虑集成到CI/CD流程中

## 📞 技术支持

如果在使用过程中遇到问题：

1. **查看日志**：检查Claude Desktop和MCP服务器的日志
2. **检查配置**：验证所有配置文件的正确性
3. **重启服务**：尝试重启Claude Desktop和MCP服务器
4. **版本兼容**：确认所有组件版本兼容

---

**祝您使用愉快！让代码审查变得更智能、更高效！** 🚀

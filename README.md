《smart-code-reviewer 使用教程》
一、工具简介
smart-code-reviewer 是基于 mcp-code 项目开发的代码审查工具，可通过简单配置快速部署并实现代码自动化审查功能，支持自定义日志级别、最大代码处理规模及超时时间等参数。
二、前提条件
已安装 Python 环境（建议 Python 3.8+）
已安装 uv 工具（Python 包管理工具，若未安装可通过 pip install uv 命令安装）
网络环境可访问 GitHub（用于拉取项目代码）
三、部署与启动步骤
1. 配置参数说明
在启动工具前，需了解核心配置参数的含义（对应提供的 JSON 配置）：
command: 启动命令，此处为 uv（使用 uv 工具执行）
args: 命令参数，-y 表示自动确认所有提示，https://github.com/renjismzy/mcp-code.git 是项目代码仓库地址
env: 环境变量
MCP_LOG_LEVEL: 日志级别，info 表示输出信息级别的日志（包含正常运行信息）
MCP_MAX_CODE_SIZE: 最大代码处理规模，50000 表示最多处理 50000 字符的代码
MCP_TIMEOUT: 超时时间，30000 表示 30000 毫秒（30 秒）后未完成操作则超时
2. 启动工具
方式一：直接执行命令
在终端中输入以下命令，即可基于配置启动工具：
bash
MCP_LOG_LEVEL=info MCP_MAX_CODE_SIZE=50000 MCP_TIMEOUT=30000 uv -y https://github.com/renjismzy/mcp-code.git
方式二：通过脚本启动（推荐）
创建一个脚本文件（如 start-reviewer.sh）
写入以下内容：
bash
#!/bin/bash
# 设置环境变量
export MCP_LOG_LEVEL=info
export MCP_MAX_CODE_SIZE=50000
export MCP_TIMEOUT=30000
# 启动工具
uv -y https://github.com/renjismzy/mcp-code.git
赋予脚本执行权限：chmod +x start-reviewer.sh
运行脚本：./start-reviewer.sh
四、使用流程
启动工具：按照上述步骤启动 smart-code-reviewer，工具会自动拉取 mcp-code 仓库代码
代码审查：工具会根据配置的参数（最大代码规模、超时时间等）对拉取的代码进行自动审查
查看结果：审查过程中，工具会通过 info 级别的日志输出审查进度和结果（如代码中的潜在问题、规范不符项等）
结束运行：审查完成或达到超时时间后，工具会自动停止运行
五、参数自定义
若需调整工具行为，可修改环境变量参数：
若需要更详细的日志（如调试信息），可将 MCP_LOG_LEVEL 改为 debug
若需处理更大规模的代码，可增大 MCP_MAX_CODE_SIZE 的值（如 100000 表示处理 100000 字符）
若需延长超时时间，可增大 MCP_TIMEOUT 的值（如 60000 表示 60 秒超时）
修改后重启工具即可生效。
六、常见问题
拉取代码失败：检查网络是否通畅，或仓库地址是否正确（确认 https://github.com/renjismzy/mcp-code.git 可访问）
超时频繁：若代码规模较大，可适当增大 MCP_TIMEOUT 的值
日志无输出：检查 MCP_LOG_LEVEL 是否设置正确，避免设置为 error 或 warn 时遗漏信息级日志
通过以上步骤，即可快速部署并使用 smart-code-reviewer 进行代码审查，如需进一步定制功能，可参考 mcp-code 项目的源码进行二次开发。

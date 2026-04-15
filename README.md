# AI Web Helper 浏览器插件
基于 Ollama 本地大模型的 AI 网页助手，支持翻译、解释、智能问答，全程本地运行，保护隐私。

## 核心功能
- 浏览器右键一键调用，无需切换页面
- 100% 本地运行，不上传任何用户数据
- 支持流式输出，响应更流畅
- 兼容 Ollama 全系列大模型
- 覆盖翻译、解释、自由问答等场景
- 轻量无侵入，不影响浏览器正常使用

## 技术栈
- 前端：HTML / CSS / JavaScript
- AI 引擎：Ollama 本地大模型 API
- 平台：Chrome / Edge 浏览器扩展

## 快速开始

### 1. 安装 Ollama
https://ollama.com/
安装后自动后台运行。

### 2. 拉取模型
ollama pull qwen:1.8b（速度最快）

### 3. 加载插件
1. 打开浏览器扩展页面
   - Chrome: chrome://extensions/
   - Edge: edge://extensions/
2. 开启开发者模式
3. 点击「加载已解压的扩展程序」
4. 选择项目文件夹 ai-web-helper

### 4. 使用方法
 选中网页文字 → 右键 → AI网页阅读助手 → 翻译选中内容/解释选中内容

## 项目结构
ai-web-helper/
├── manifest.json
├── background.js
├── popup/
├── icons/
└── README.md

## 自定义配置
在 background.js 中可修改：
- 模型名称
- 提示词
- 生成参数
- API 地址与端口

## 速度优化建议
- 使用轻量模型 qwen:1.8b，CPU 也能快速响应
- 保持 Ollama 后台常驻，避免冷启动
- 开启流式输出，提升使用体验
- 关闭多余浏览器扩展，释放内存

## 开源协议
MIT License

## 作者
GitHub: https://github.com/ycw0103

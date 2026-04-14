// 插件安装/更新时，初始化右键菜单
chrome.runtime.onInstalled.addListener(() => {
  // 先清除旧菜单，避免重复创建导致崩溃
  chrome.contextMenus.removeAll(() => {
    // 创建「翻译选中内容」菜单
    chrome.contextMenus.create({
      id: "translateSelection",
      title: "翻译选中内容",
      contexts: ["selection"]
    });
    // 创建「解释选中内容」菜单
    chrome.contextMenus.create({
      id: "explainSelection",
      title: "解释选中内容",
      contexts: ["selection"]
    });
  });
});

// 监听右键菜单点击事件
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // 1. 校验选中的文本
  const selectedText = info.selectionText?.trim();
  if (!selectedText) {
    // 没选中文本，弹窗提示
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => alert("❌ 请先选中一段文字再操作！")
    }).catch(err => console.error("弹窗失败:", err));
    return;
  }

  // 2. 读取用户配置（和 options/popup 完全统一，带默认值）
  const config = await chrome.storage.sync.get({
    ollamaUrl: "http://localhost:11434/api/generate",
    modelName: "llama3"
  });

  // 3. 构造提示词
  let prompt = "";
  if (info.menuItemId === "translateSelection") {
    prompt = `请将以下内容翻译成标准中文，只输出翻译结果，不要任何额外解释：\n${selectedText}`;
  } else if (info.menuItemId === "explainSelection") {
    prompt = `请用通俗易懂的中文详细解释以下内容：\n${selectedText}`;
  } else {
    return; // 未知菜单ID，直接返回
  }

  try {
    // 4. 调用 Ollama API（完整错误处理，避免后台崩溃）
    const response = await fetch(config.ollamaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: config.modelName,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3, // 降低随机性，保证输出稳定
          num_ctx: 2048
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败，状态码：${response.status}`);
    }

    const result = await response.json();
    const aiReply = result.response || "模型未返回有效内容";

    // 5. 弹窗展示结果
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text, reply) => {
        alert(`📝 原文：\n${text}\n\n🤖 AI 结果：\n${reply}`);
      },
      args: [selectedText, aiReply]
    });

  } catch (error) {
    // 6. 捕获所有错误，弹窗提示，避免后台崩溃
    console.error("调用Ollama失败:", error);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (errMsg) => {
        alert(`❌ 调用失败：${errMsg}\n\n请检查：\n1. Ollama是否启动（CMD窗口是否打开）\n2. 模型是否下载完成\n3. 接口地址是否正确`);
      },
      args: [error.message]
    });
  }
});

// 监听插件启动事件，保证后台服务常驻
chrome.runtime.onStartup.addListener(() => {
  console.log("AI网页阅读助手后台服务已启动");
});
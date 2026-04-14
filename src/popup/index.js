const result = document.getElementById('result');
const callAI = async (prompt) => {
  const { ollamaUrl, modelName } = await chrome.storage.sync.get({ ollamaUrl: "http://localhost:11434/api/generate", modelName: "llama3" });
  try {
    const res = await fetch(ollamaUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: modelName, prompt, stream: false }) });
    return (await res.json()).response || "无结果";
  } catch (e) { return "❌ 调用失败，请检查Ollama是否启动。"; }
};

document.getElementById('sumBtn').onclick = async () => {
  result.textContent = "总结中...";
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const text = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: () => document.body.innerText.slice(0, 3000) });
  result.textContent = await callAI(`总结这段话：${text[0].result}`);
};

document.getElementById('transBtn').onclick = async () => {
  result.textContent = "翻译中...";
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const text = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: () => window.getSelection().toString().trim() });
  result.textContent = text[0].result ? await callAI(`翻译：${text[0].result}`) : "请先选中一段文字。";
};

document.getElementById('setBtn').onclick = () => chrome.runtime.openOptionsPage();
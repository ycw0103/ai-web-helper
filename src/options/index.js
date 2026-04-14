const load = async () => {
  const cfg = await chrome.storage.sync.get({ ollamaUrl: "http://localhost:11434/api/generate", modelName: "llama3" });
  document.getElementById('ollamaUrl').value = cfg.ollamaUrl;
  document.getElementById('modelName').value = cfg.modelName;
};

document.getElementById('save').onclick = async () => {
  await chrome.storage.sync.set({
    ollamaUrl: document.getElementById('ollamaUrl').value,
    modelName: document.getElementById('modelName').value
  });
  alert("保存成功！");
};

load();
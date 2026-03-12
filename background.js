// Create the context menu item when installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "countWords",
    title: "Count Words",
    contexts: ["all"]
  });
});

// Handle the click event
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "countWords") {

    let selection = info.selectionText || "";

    if (selection.trim().length > 0) {
      // Normal pages: selection worked fine
      showCount(tab.id, selection);
    } else {
      // Try reading selection from ALL frames (handles iframes)
      chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: () => window.getSelection().toString()
      }).then(results => {
        // Find the first frame that has a non-empty selection
        const match = results.find(r => r.result && r.result.trim().length > 0);

        if (match) {
          showCount(tab.id, match.result);
        } else {
          // Google Docs fallback: read from clipboard
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: async () => {
              try {
                const text = await navigator.clipboard.readText();
                if (!text || text.trim().length === 0) {
                  alert("No text found.\n\nIn Google Docs:\n1. Select your text\n2. Press Ctrl+C (or Cmd+C) to copy it\n3. Then right-click and choose \"Count Words\"");
                } else {
                  const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
                  alert(`Word Count: ${words} words`);
                }
              } catch (e) {
                alert("Clipboard access was denied.\n\nIn Google Docs:\n1. Select your text\n2. Press Ctrl+C (or Cmd+C) to copy it\n3. Right-click → \"Count Words\"\n4. If prompted, allow clipboard access.");
              }
            }
          }).catch(err => console.error("Script injection failed:", err));
        }
      }).catch(err => console.error("Frame script injection failed:", err));
    }
  }
});

function showCount(tabId, selection) {
  chrome.scripting.executeScript({
    target: { tabId },
    func: (text) => {
      const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
      alert(`Word Count: ${words} words`);
    },
    args: [selection]
  }).catch(err => console.error("Error:", err));
}

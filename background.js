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
      // Try reading selection from ALL frames (handles iframes + Google Docs)
      chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        func: () => {
          const selection = window.getSelection().toString();
          // Google Docs stores content in a special aria element when nothing
          // is returned by getSelection() — try that as a fallback
          if (!selection || selection.trim().length === 0) {
            const docsSelection = document.querySelector(".kix-selection-overlay");
            if (docsSelection) {
              // Get all selected text spans inside Google Docs' editor
              const selectedSpans = document.querySelectorAll(".kix-lineview-text-block");
              const text = Array.from(selectedSpans)
                .map(el => el.textContent)
                .join(" ");
              return text.trim();
            }
          }
          return selection;
        }
      }).then(results => {
        const match = results.find(r => r.result && r.result.trim().length > 0);

              if (match) {
                showCount(tab.id, match.result);
              } else {
                // Inject alert into the page context
                chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  func: () => alert("No text found. Please select some text and try again.")
                });
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
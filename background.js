// Create the context menu item when installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "countWords",
      title: "Count Words: '%s'",
      contexts: ["all"]
    });
  });
  
  // Handle the click event
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "countWords") {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        func: (infoText) => {
          const selectedText = infoText || window.getSelection().toString();
          
          if (!selectedText || selectedText.trim().length === 0) {
            alert("No text selected! Please highlight some text first.");
            return;
          }
          
          const wordCount = selectedText.trim().split(/\s+/).filter(w => w.length > 0).length;
          alert(`Word Count: ${wordCount} words`);
        },
        args: [info.selectionText || ""]
      });
    }
  });
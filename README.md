# Quick Word Counter Chrome Extension

A lightweight Chrome Extension that allows you to count words in any highlighted text directly from the right-click context menu. No copy-pasting required!

## Features

- **Instant Word Count**: Highlight text on any webpage and right-click to see the word count.
- **Cross-Site Compatibility**: Works on standard websites and complex web apps like Google Docs.
- **Multi-Frame Support**: Robustly detects text even inside iframes.
- **Lightweight**: Minimal footprint, built with Manifest V3.

## Installation

To install this extension manually (Developer Mode):

1. **Download or Create the Files**:
   Create a new folder on your computer and save the following two files inside it:
   - `manifest.json`
   - `background.js`

2. **Load the Extension in Chrome**:
   - Open Chrome and navigate to `chrome://extensions`.
   - Enable **Developer Mode** using the toggle in the top right corner.
   - Click the **Load unpacked** button.
   - Select the folder you created in Step 1.

## Usage

1. Navigate to any website.
2. Highlight a paragraph or a block of text.
3. Right-click the highlighted text.
4. Select **Count Words** from the menu.
5. An alert will appear showing the total word count.

### Google Docs & Complex Sites
Some sites (like Google Docs) override the default right-click menu. To use the extension on these sites:
- Highlight your text.
- **Hold the `Shift` key** while you right-click. This forces the browser's native context menu to appear.


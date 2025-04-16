function applyMoodToTab() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"]
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const moodButtons = document.querySelectorAll(".mood");
  const customBg = document.getElementById("custom-bg");
  const customText = document.getElementById("custom-text");
  const customPopupBg = document.getElementById("custom-popup-bg");
  const saveBtn = document.getElementById("save-custom");

  chrome.storage.sync.get(["mood", "customMood"], ({ mood, customMood }) => {
    if (mood === "custom" && customMood) {
      document.body.style.backgroundColor = customMood.popupBg || customMood.bg;
      document.body.style.color = customMood.text;
    } else if (mood) {
      document.body.setAttribute("data-mood", mood);
    }
  });

  moodButtons.forEach(button => {
    button.addEventListener("click", () => {
      const selectedMood = button.dataset.mood;
      document.body.removeAttribute("style");
      document.body.setAttribute("data-mood", selectedMood);
      chrome.storage.sync.set({ mood: selectedMood }, applyMoodToTab);
    });
  });

  saveBtn.addEventListener("click", () => {
    const bg = customBg.value;
    const text = customText.value;
    const popupBg = customPopupBg.value;

    document.body.removeAttribute("data-mood");
    document.body.style.backgroundColor = popupBg;
    document.body.style.color = text;

    chrome.storage.sync.set({
      mood: "custom",
      customMood: {
        bg,
        text,
        popupBg
      }
    }, applyMoodToTab);
  });
});
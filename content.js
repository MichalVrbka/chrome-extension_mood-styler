console.log("Mood Styler content script injected.");

chrome.storage.sync.get(["mood", "customMood"], ({ mood, customMood }) => {
  const styles = {
    happy: `
      body { background-color: #fffbe6 !important; filter: saturate(120%); }
      * { border-radius: 8px; font-family: 'Comic Sans MS', cursive !important; }
    `,
    chill: `
      body { background-color: #e6f7ff !important; filter: brightness(95%); }
    `,
    focused: `
      body { background-color: #e8f0fe !important; font-family: sans-serif !important; }
    `,
    energetic: `
      body { background-color: #fff0f0 !important; filter: contrast(110%); }
    `,
    dark: `
      body { background-color: #121212 !important; color: #e0e0e0 !important; }
      a { color: #90caf9 !important; }
    `
  };

  // Odebereme případný předchozí styl
  const previousStyle = document.getElementById("mood-styler-style");
  if (previousStyle) previousStyle.remove();

  const style = document.createElement("style");
  style.id = "mood-styler-style";
  style.textContent = (mood === "custom" && customMood)
    ? `body { background-color: ${customMood.bg} !important; color: ${customMood.text} !important; }`
    : styles[mood] || "";
  
  // Vložíme styl do <head> nebo alternativně do <html>, pokud head není k dispozici
  const target = document.head || document.documentElement;
  target.appendChild(style);
});

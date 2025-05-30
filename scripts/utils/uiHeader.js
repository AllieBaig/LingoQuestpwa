
// scripts/ui/uiHeader.js
// 🧠 MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
// 📅 Timestamp: 2025-05-30 23:40 | File: scripts/ui/uiHeader.js

export function renderUIHeader() {
  const header = document.createElement('header');
  header.id = 'uiControls';
  header.className = 'ascii-ui-header';

  header.innerHTML = `
    <span id="userNickname">👤 Player</span>

    <select id="uiModeToggle" title="UI Mode">
      <option value="normal">Normal UI</option>
      <option value="ascii">ASCII UI</option>
    </select>

    <select id="quizLangModeToggle" title="Quiz Language Mode">
      <option value="specific">🈯 Specific Language</option>
      <option value="random">🌍 Random Mix</option>
    </select>
    
    <select id="langChoiceToggle" title="Choose Language">
      <option value="en">🇬🇧 English</option>
      <option value="fr">🇫🇷 French</option>
      <option value="de">🇩🇪 German</option>
    </select>
  `;

  document.body.prepend(header); // Insert at top of <body>
}

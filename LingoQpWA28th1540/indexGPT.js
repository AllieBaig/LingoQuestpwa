<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="theme-color" content="#ffffff" />
  <link rel="manifest" href="manifest.json" />
  <link rel="apple-touch-icon" href="icons/icon-192.png" />
  <link rel="icon" href="icons/favicon.svg" type="image/svg+xml" />

  <!-- Critical CSS loaded first -->
  <link rel="stylesheet" href="styles/variables.css" />
  <link rel="stylesheet" href="styles/minimal-ui.css" />
  <link rel="stylesheet" href="styles/main.css" media="all" onload="this.media='all'" />
  <link rel="stylesheet" href="styles/lingoquest.css" media="all" onload="this.media='all'" />
  <link rel="stylesheet" href="styles/ascii-ui.css">


  <title>LingoQuestPWA</title>

  <!-- Preload fonts/icons if used -->
  <link rel="preload" as="image" href="icons/icon-192.png" />
</head>
<body class="minimal-ui">

  <!-- Top Bar -->
  <header id="topBar">
    <div id="userInfo">
      <span id="userNickname">👤 Guest</span>
    </div>
    <div id="uiControls">
      <select id="uiModeToggle" title="UI Mode">
        <option value="normal">Normal UI</option>
        <option value="ascii">ASCII UI</option>
      </select>
      <button id="darkModeToggle" title="Toggle Dark Mode">🌓</button>
    
    <select id="buttonSizeToggle" title="Button Size">
  <option value="md">🔲 Classic</option>
  <option value="lg">🟦 Large</option>
  <option value="xl">🟥 Extra Large</option>
  <option value="xxl">🧱 Extra Very Large</option>
</select>
    
    </div>
  </header>


<!-- Mode Selector Panel (shown only if no mode is passed via URL) -->
<section id="modeSelectorPanel" class="text-center hidden">
  <h2>🎮 Choose a Game Mode</h2>
  <div class="modeButtons">
    <button data-mode="solo" data-lang="fr">🇫🇷 Solo Mode</button>
    <button data-mode="mixlingo" data-lang="fr">🌍 MixLingo</button>
    <button data-mode="wordrelic" data-lang="fr">🗝️ Word Relic</button>
    <button data-mode="wordsafari" data-lang="fr">🦁 Word Safari</button>
  </div>
</section>

  <!-- Game Area -->
  <main id="gameContainer">
    <section id="sentenceClue" class="clueArea">Loading...</section>
    <section id="sentenceBuilderArea" class="builderArea"></section>
    <section id="resultSummary" class="resultArea"></section>
  </main>

  <!-- XP & Footer -->
  <footer id="footerPanel">
    <div id="xpTracker">
      <span id="xpLabel">XP: </span>
      <progress id="xpBar" value="0" max="100"></progress>
      <span id="levelBadge">Lv 1</span>
    </div>
    <div id="versionInfo"></div>
  </footer>

  <!-- Async JS Load -->
  <script type="module" src="scripts/main.js"></script>
  
  <!-- Error Log Panel (hidden by default) -->
<section id="errorLogPanel" class="hidden">
  <h3>⚠️ Error Log</h3>
  <pre id="errorLogOutput">No errors yet.</pre>
</section>
  
</body>
</html>


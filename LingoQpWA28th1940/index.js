
<!--
LingoQuest: Gamified Vocabulary Adventure
MIT License — https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
Generated: 2025-05-27 23:40 | File: index.html
-->

<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#4a90e2" />
  <title>LingoQuest</title>
  <link rel="manifest" href="manifest.json" />
  <link rel="stylesheet" href="styles/variables.css" />
  <link rel="stylesheet" href="styles/main.css" />
  <link rel="stylesheet" href="styles/lingoquest.css" />
  <!-- Minimal UI loaded dynamically in JS if selected -->
</head>

<body>
  <header id="header">
    <h1 id="gameTitle">LingoQuest</h1>

    <!-- Language toggle -->
    <button id="languageToggle" aria-label="Change Language">🌐</button>

    <!-- Dark mode toggle -->
    <button id="darkModeToggle" aria-label="Toggle Dark Mode">🌓</button>

    <!-- UI mode selector -->
    <label for="uiModeSelector" class="sr-only">Select UI Mode</label>
    <select id="uiModeSelector" name="uiModeSelector" aria-label="UI Mode">
      <option value="normal" selected>Normal UI</option>
      <option value="ascii">ASCII UI</option>
    </select>
  </header>

  <main id="mainScreen">

    <!-- Game Mode Selector -->
    <section id="modeSelector">
      <h2>Choose a Mode</h2>
      <div class="mode-buttons">
        <button id="startSolo">Start Solo Mode</button>
        <button id="startMixLingo">Start MixLingo</button>
      </div>
    </section>

    <!-- Game Panel -->
    <section id="questPanel">
      <div id="categorySelector" hidden></div>

      <div id="sentenceClueContainer">
        <p id="sentenceClue"></p>
      </div>

      <div id="sentenceBuilderArea" class="builder-area"></div>
      <button id="submitSentence">Submit</button>
    </section>

    <section id="hintPanel" hidden></section>
    <section id="resultSummary" hidden></section>

    <!-- ASCII fallback area -->
    <pre id="asciiOutput" hidden></pre>
  </main>

  <footer id="footer">
    <div id="xpTracker"></div>
    <div id="streakBadge"></div>
    <div id="versionLabel"></div>
  </footer>

  <script type="module" src="scripts/main.js"></script>
</body>
</html>

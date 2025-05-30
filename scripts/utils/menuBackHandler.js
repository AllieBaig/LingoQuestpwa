
/**
 * Back to Menu Button Handler
 * Adds listener to any #backToMenu button to reset UI and load main menu
 * Depends on: utils/menuRenderer.js (renderGameMenu)
 * MIT License: https://github.com/AllieBaig/LingoQuest/blob/main/LICENSE
 * Timestamp: 2025-05-29 20:55 | File: scripts/utils/menuBackHandler.js
 */

import { renderGameMenu } from './menuRenderer.js';

export function attachBackToMenuListener() {
	const backBtn = document.getElementById('backToMenu');
	if (!backBtn) return;

	backBtn.addEventListener('click', () => {
		clearGameUI();
		renderGameMenu();
	});
}

function clearGameUI() {
	const clue = document.getElementById('sentenceClue');
	const builder = document.getElementById('sentenceBuilderArea');
	const result = document.getElementById('resultSummary');
	const hint = document.getElementById('hintPanel');
	const ascii = document.getElementById('asciiOutput');

	if (clue) clue.textContent = '';
	if (builder) builder.innerHTML = '';
	if (result) result.hidden = true;
	if (hint) hint.hidden = true;
	if (ascii) ascii.hidden = true;
}

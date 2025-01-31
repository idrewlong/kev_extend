let isActive = false;
const toggleButton = document.getElementById('toggleButton');

toggleButton.addEventListener('click', () => {
	isActive = !isActive;

	// Update button appearance
	toggleButton.textContent = isActive
		? 'Turn Kev Mode Off'
		: 'Turn Kev Mode On';
	toggleButton.className = `toggle-button ${isActive ? 'active' : 'inactive'}`;

	// Send message to content script
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, {
			type: isActive ? 'REPLACE_IMAGES' : 'RESET_IMAGES',
		});
	});
});

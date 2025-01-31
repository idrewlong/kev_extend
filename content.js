const images = [
	'kev_confuse.JPG',
	'kev_old.JPG',
	'kev_plumber.JPG',
	'kev_wife.JPG',
	'kev.JPG',
];

// Store original image sources
const originalSources = new Map();

// Get random image URL from local collection
function getRandomImageUrl() {
	const randomImage = images[Math.floor(Math.random() * images.length)];
	return chrome.runtime.getURL(`images/${randomImage}`);
}

// Replace all images on the page
function replaceImages() {
	const imgElements = document.getElementsByTagName('img');

	for (let img of imgElements) {
		// Skip if image is very small (likely an icon)
		if (img.width < 30 || img.height < 30) continue;

		// Store original source if not already stored
		if (!originalSources.has(img)) {
			originalSources.set(img, {
				src: img.src,
				width: img.width,
				height: img.height,
			});
		}

		// Replace with random image
		const randomImageUrl = getRandomImageUrl();
		img.src = randomImageUrl;

		// Preserve original dimensions
		const original = originalSources.get(img);
		img.width = original.width;
		img.height = original.height;
	}
}

// Reset images to their original sources
function resetImages() {
	originalSources.forEach((original, img) => {
		if (img.isConnected) {
			// Check if element still exists in DOM
			img.src = original.src;
			img.width = original.width;
			img.height = original.height;
		}
	});
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === 'REPLACE_IMAGES') {
		replaceImages();
	} else if (message.type === 'RESET_IMAGES') {
		resetImages();
	}
});

// Watch for dynamically added images
const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.addedNodes) {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeName === 'IMG') {
					setTimeout(() => {
						replaceImages();
					}, 100);
				}
			});
		}
	});
});

observer.observe(document.body, {
	childList: true,
	subtree: true,
});

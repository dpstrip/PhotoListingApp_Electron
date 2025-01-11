document.getElementById('select-dir-btn').addEventListener('click', async () => {
    const directoryPath = await window.electron.selectDirectory();
    if (directoryPath) {
        const images = await window.electron.getImages(directoryPath);
        displayThumbnails(images);
    }
});

document.getElementById('help-btn').addEventListener('click', async () => {
    const helpText = await window.electron.readHelpText();
    openHelpWindow(helpText);
});

function displayThumbnails(images) {
    const container = document.getElementById('thumbnail-container');
    container.innerHTML = ''; // Clear existing thumbnails
    images.forEach(imagePath => {
        const img = document.createElement('img');
        img.src = `file://${imagePath}`;
        img.classList.add('thumbnail');
        img.addEventListener('dblclick', () => openImageInNewWindow(imagePath));
        container.appendChild(img);
    });
}

function openImageInNewWindow(imagePath) {
    const imageWindow = window.open('', '_blank', 'width=800,height=600');
    imageWindow.document.write(`
        <html>
            <body style="margin: 0; display: flex; justify-content: center; align-items: center;">
                <img src="file://${imagePath}" style="max-width: 100%; max-height: 100%;">
            </body>
        </html>
    `);
}

function openHelpWindow(helpText) {
    const helpWindow = window.open('', '_blank', 'width=600,height=400');
    helpWindow.document.write(`
        <html>
            <body style="margin: 20px; font-family: Arial, sans-serif;">
                <pre>${helpText}</pre>
            </body>
        </html>
    `);
}

// popup-injector.js
(function () {
    let popupContainer = null;

    function createPopup() {
        if (popupContainer) return;
        popupContainer = document.createElement('div');
        popupContainer.id = 'extension-popup-67';
        popupContainer.className = 'ext-popup-container';

        fetch(chrome.runtime.getURL('popup.html'))
            .then(res => res.text())
            .then(html => {
                popupContainer.innerHTML = html;
                document.body.appendChild(popupContainer);
                // Show with animation
                requestAnimationFrame(() => {
                    popupContainer.classList.add('ext-popup-show');
                });
            })
            .catch(console.error);
    }

    // Show immediately on load (or call createPopup() when needed)
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', createPopup);
    } else {
        createPopup();
    }
})();

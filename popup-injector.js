// popup-injector.js
(function () {
    let popupContainer = null;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

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
                
                // Add drag functionality
                addDragFunctionality();
                
                // Show with animation
                requestAnimationFrame(() => {
                    popupContainer.classList.add('ext-popup-show');
                });
            })
            .catch(console.error);
    }

    function addDragFunctionality() {
        popupContainer.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
    }

    function startDrag(e) {
        isDragging = true;
        popupContainer.classList.add('dragging');
        
        const rect = popupContainer.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging) return;
        
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        
        // Keep popup within viewport bounds
        const maxX = window.innerWidth - popupContainer.offsetWidth;
        const maxY = window.innerHeight - popupContainer.offsetHeight;
        
        const constrainedX = Math.max(0, Math.min(x, maxX));
        const constrainedY = Math.max(0, Math.min(y, maxY));
        
        popupContainer.style.left = constrainedX + 'px';
        popupContainer.style.top = constrainedY + 'px';
        popupContainer.style.right = 'auto';
        popupContainer.style.bottom = 'auto';
    }

    function endDrag() {
        isDragging = false;
        popupContainer.classList.remove('dragging');
    }

    // Show immediately on load (or call createPopup() when needed)
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', createPopup);
    } else {
        createPopup();
    }
})();

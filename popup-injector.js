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
                
                // Fix video source path
                const video = popupContainer.querySelector('.subway-video');
                if (video) {
                    video.src = chrome.runtime.getURL('subwaysurfers.mp4');
                }
                
                // Add drag functionality
                addDragFunctionality();
                
                // Add close button functionality
                addCloseFunctionality();
                
                // Hide the "Goon Corner" button when popup is shown
                hideGoonCornerButton();
                
                // Show with animation
                requestAnimationFrame(() => {
                    popupContainer.classList.add('ext-popup-show');
                    // Resume video playback after animation starts
                    setTimeout(() => {
                        resumeVideo();
                    }, 150); // Half of the transition duration for smoother effect
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
        if (!popupContainer) return;
        isDragging = true;
        popupContainer.classList.add('dragging');
        
        const rect = popupContainer.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        
        e.preventDefault();
    }

    function drag(e) {
        if (!isDragging || !popupContainer) return;
        
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
        if (popupContainer) {
            popupContainer.classList.remove('dragging');
        }
    }

    function addCloseFunctionality() {
        const closeBtn = popupContainer.querySelector('.popup-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', hidePopup);
        }
    }

    function hidePopup() {
        // Pause the video before hiding
        pauseVideo();
        popupContainer.classList.remove('ext-popup-show');
        // Show the "Goon Corner" button when popup is hidden
        showGoonCornerButton();
        // Remove popup after animation completes
        setTimeout(() => {
            if (popupContainer && popupContainer.parentNode) {
                popupContainer.parentNode.removeChild(popupContainer);
                popupContainer = null;
            }
        }, 300); // Match CSS transition duration
    }

    function showGoonCornerButton() {
        const button = document.getElementById('show-popup-button');
        if (button) {
            button.classList.add('show');
        }
    }

    function hideGoonCornerButton() {
        const button = document.getElementById('show-popup-button');
        if (button) {
            button.classList.remove('show');
        }
    }

    function pauseVideo() {
        const video = popupContainer?.querySelector('.subway-video');
        if (video) {
            video.pause();
        }
    }

    function resumeVideo() {
        const video = popupContainer?.querySelector('.subway-video');
        if (video) {
            video.play();
        }
    }

    // Listen for show popup events
    window.addEventListener('showPopup', createPopup);

    // Show immediately on load (or call createPopup() when needed)
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', createPopup);
    } else {
        createPopup();
    }
})();

// content.js

(function () {
    // Counter element
    let counterElement = null;
    let arrowElement = null;
    let showPopupButton = null;
    let totalCount = 0;
    let isCounterHidden = false;

    // Entry point
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runHighlighter);
    } else {
        runHighlighter();
    }

    function runHighlighter() {
        try {
            createCounter();
            highlightExisting();
            observeDynamic();
        } catch (err) {
            console.error('67 Highlighter error:', err);
        }
    }

    function createCounter() {
        // Create counter element
        counterElement = document.createElement('div');
        counterElement.id = 'sixty-seven-counter';
        counterElement.textContent = '67 Count \u{1F940}: 0'; // wilted flower emoji so goated
        counterElement.title = 'Click to hide counter';
        
        // Add click event listener
        counterElement.addEventListener('click', toggleCounter);
        
        // Create arrow element
        arrowElement = document.createElement('div');
        arrowElement.id = 'sixty-seven-arrow';
        arrowElement.textContent = '\u{1F940}';
        arrowElement.title = 'Click to show counter';
        
        // Add click event listener to arrow
        arrowElement.addEventListener('click', toggleCounter);
        
        // Create show popup button
        showPopupButton = document.createElement('div');
        showPopupButton.id = 'show-popup-button';
        showPopupButton.textContent = 'Subway Surfers';
        showPopupButton.title = 'Subway Surfers';
        
        // Add click event listener to show popup button
        showPopupButton.addEventListener('click', showPopup);
        
        document.body.appendChild(counterElement);
        document.body.appendChild(arrowElement);
        document.body.appendChild(showPopupButton);
        
        // Match button width to counter width
        matchButtonWidth();
    }

    function toggleCounter() {
        isCounterHidden = !isCounterHidden;
        if (isCounterHidden) {
            counterElement.classList.add('hidden');
            arrowElement.classList.add('show');
        } else {
            counterElement.classList.remove('hidden');
            arrowElement.classList.remove('show');
        }
    }

    function updateCounter() {
        if (counterElement) {
            counterElement.textContent = `67 Count \u{1F940}: ${totalCount}`;
            // Update button width when counter changes
            matchButtonWidth();
        }
    }

    function matchButtonWidth() {
        if (counterElement && showPopupButton) {
            const counterWidth = counterElement.offsetWidth;
            showPopupButton.style.width = counterWidth + 'px';
        }
    }

    function showPopup() {
        // Dispatch a custom event to trigger popup creation
        window.dispatchEvent(new CustomEvent('showPopup'));
    }

    function shouldSkip(node) {
        const p = node.parentNode;
        if (!p || p.nodeType !== Node.ELEMENT_NODE) return false;
        // Skip inside existing highlights
        if (p.closest && p.closest('mark.highlight-67')) return true;
        // Skip inside the counter element itself
        if (p.id === 'sixty-seven-counter' || p.closest('#sixty-seven-counter')) return true;
        const t = p.tagName;
        if (['SCRIPT','STYLE','INPUT','TEXTAREA','SELECT'].includes(t)) return true;
        if (p.isContentEditable) return true;
        const s = window.getComputedStyle(p);
        return s.display === 'none' || s.visibility === 'hidden';
    }

    function getTextNodes(root) {
        const nodes = [];
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            { acceptNode: n => shouldSkip(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT }
        );
        let cur;
        while (cur = walker.nextNode()) nodes.push(cur);
        return nodes;
    }

    function highlightInNode(textNode) {
        const txt = textNode.textContent;
        const regex = /67/g;
        const matches = txt.match(regex);
        if (!matches) return;
        
        // Check if the text node is still attached to the DOM
        const p = textNode.parentNode;
        if (!p) return; // Node was removed, skip processing
        
        // Count the matches and add to total
        totalCount += matches.length;
        
        const span = document.createElement('span');
        span.innerHTML = txt.replace(regex, '<mark class="highlight-67">$&</mark>');
        p.insertBefore(span, textNode);
        p.removeChild(textNode);
        
        // Update the counter display
        updateCounter();
    }

    function highlightExisting() {
        getTextNodes(document.body).forEach(highlightInNode);
    }

    // Dynamic content handling with throttle
    const pending = new Set();
    let scheduled = false;
    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (!shouldSkip(node)) highlightInNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            getTextNodes(node).forEach(highlightInNode);
        }
    }

    function observeDynamic() {
        const obs = new MutationObserver(muts => {
            muts.forEach(m => m.addedNodes.forEach(n => pending.add(n)));
            if (!scheduled) {
                scheduled = true;
                requestIdleCallback(() => {
                    pending.forEach(processNode);
                    pending.clear();
                    scheduled = false;
                }, { timeout: 500 });
            }
        });
        obs.observe(document.body, { childList: true, subtree: true });
    }
})();

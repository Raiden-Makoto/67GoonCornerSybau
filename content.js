if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', Highlight67);
}
else {
    Highlight67();
}

function Highlight67() {
    // recursively collect all text nodes under a root node
    function getTextNodes(root) {
        const nodes = [];
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    const parentTag = node.parentNode && node.parentNode.tagName;
                    if (parentTag === 'SCRIPT' || parentTag === 'STYLE') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        ); // idk what this does but idrc
        let current;
        while (current = walker.nextNode()) {
            nodes.push(current); // freaky ahh stack
        }
        return nodes;
    }
    // this function highlights 67
    function highlightInNode(textNode) {
        const text = textNode.textContent;
        const regex = /67/g; // accept all numbers, so 167 and 9267 are valid
        if (!regex.test(text)) return;
        const span = document.createElement('span');
        span.innerHTML = text.replace(regex, '<mark class="highlight-67">$&</mark>');
        const parent = textNode.parentNode;
        parent.insertBefore(span, textNode);
        parent.removeChild(textNode);
    }
    // now let's actually highlight everything
    const allText = getTextNodes(document.body);
    allText.forEach(highlightInNode);
    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType === Node.TEXT_NODE) {
                    highlightInNode(node);
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    getTextNodes(node).forEach(highlightInNode);
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
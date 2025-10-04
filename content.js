if (document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', Highlight67);
}
else{
    Highlight67();
}

function Highlight67(){
    // recursively collect all text nodes under a root node
    function getTextNodes(root){
        const nodes = [];
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node){
                    const parentTag = node.parentNode && node.parentNode.tagName;
                    if (parentTag === 'SCRIPT' || parentTag === 'STYLE'){
                        return NodeFilter.FILTER_REJECT;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        ); // idk what this does but idrc
        let current; 
        while (current = walker.nextNode()){
            nodes.push(current); // freaky ahh stack
        }
        return nodes;
    }
    // this function highlights 67
}
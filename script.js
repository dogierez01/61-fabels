// --- NEW ZOOM AND PAN LOGIC ---
let scale = 1, lastScale = 1, startDist = 0;
let translateX = 0, translateY = 0, lastTranslateX = 0, lastTranslateY = 0;
let startX = 0, startY = 0;

zoomContainer.addEventListener('touchstart', (e) => { 
    if (e.touches.length === 1) {
        // 1 Finger: Get ready to Pan (Drag)
        startX = e.touches[0].pageX - lastTranslateX;
        startY = e.touches[0].pageY - lastTranslateY;
    } else if (e.touches.length === 2) {
        // 2 Fingers: Get ready to Zoom
        startDist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY); 
    }
}, { passive: false });

zoomContainer.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevents the whole browser page from scrolling/bouncing

    if (e.touches.length === 1) {
        // 1 Finger: Calculate new X and Y position
        translateX = e.touches[0].pageX - startX;
        translateY = e.touches[0].pageY - startY;
    } else if (e.touches.length === 2) {
        // 2 Fingers: Calculate new Scale
        let dist = Math.hypot(e.touches[0].pageX - e.touches[1].pageX, e.touches[0].pageY - e.touches[1].pageY);
        scale = Math.min(Math.max(1, lastScale * (dist / startDist)), 4); // Min 1x, Max 4x zoom
    }
    
    // Apply BOTH Pan and Zoom at the same time
    comicImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
}, { passive: false });

zoomContainer.addEventListener('touchend', () => { 
    // Save the final states so the next touch starts from the right spot
    lastScale = scale; 
    lastTranslateX = translateX;
    lastTranslateY = translateY;
});

function resetZoom() { 
    // Snap everything back to dead-center and 1x size when closing/opening
    scale = 1; lastScale = 1; 
    translateX = 0; translateY = 0; lastTranslateX = 0; lastTranslateY = 0;
    comicImg.style.transform = `translate(0px, 0px) scale(1)`; 
}
// --- END NEW ZOOM AND PAN LOGIC ---

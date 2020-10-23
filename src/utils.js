export function fixBody(isFix = true) {
  if (window) {
    const docEl = document.documentElement || document.body;
    if (isFix) {
      docEl.style.top = `-${window.scrollY}px`;
      docEl.style.position = 'fixed';
      docEl.style.width = '100%';
    } else {
      const scrollY = -parseInt(docEl.style.top);
      docEl.style.position = null;
      docEl.style.width = null;
      docEl.style.top = null;
      if (scrollY) {
        window.scrollTo(0, scrollY);
      }
    }
  }
}

export function getOffset(e) {
  if (e.offsetX) {
    return { x: e.offsetX, y: e.offsetY };
  }
  const touch = e.touches?.[0] || {};
  const bcr = e.target.getBoundingClientRect();
  return {
    x: touch.clientX - bcr.x,
    y: touch.clientY - bcr.y
  };
}
export const isEditorMode = () => {
  // Verifica sessionStorage per chiavi che iniziano con "aue"
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith('aue')) {
      return true;
    }
  }
  return false;
};


export function classNames(classes) {
  return Object.entries(classes)
    .filter(([_, value]) => Boolean(value))
    .map(([key]) => key)
    .join(' ');
}

export function handleScrollClasses(node, threshold, cssClasses, removeOnScroll = true) {
  const classes = Array.isArray(cssClasses) ? cssClasses : [cssClasses];

  window.addEventListener('scroll', () => {
    if (window.scrollY > threshold) {
      node.classList.add(...classes);
    } else if (removeOnScroll) {
      node.classList.remove(...classes);
    }
  });
}



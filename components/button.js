export function createWhiteBorderButton(label = 'Donate Now', href = '#', themeColor = false, scrollThreshold) {

  const animatedLinesColor = themeColor ? 'button-line-absolute-theme' : 'button-line-absolute-white';

  const link = document.createElement('a');
  link.href = href;
  link.className = 'group relative inline-block w-fit border border-white p-2 lg:border-0';

  const topLine = document.createElement('span');
  topLine.className = `-top-1 -right-1 h-0.5 w-3/5 group-hover:w-9/12 ${animatedLinesColor}`;

  const topRightLine = document.createElement('span');
  topRightLine.className = `-top-1 -right-1 h-full w-0.5 group-hover:h-9/12 ${animatedLinesColor}`;

  const bottomLine = document.createElement('span');
  bottomLine.className = `-bottom-1 -left-1 h-0.5 w-3/5 group-hover:w-9/12 ${animatedLinesColor}`;

  const bottomLeftLine = document.createElement('span');
  bottomLeftLine.className = `-bottom-1 -left-1 h-full w-0.5 group-hover:h-9/12 ${animatedLinesColor}`;

  const text = document.createElement('span');
  text.className = `px-6 py-2 ${themeColor ? 'text-primary' : 'text-white'}`;
  text.textContent = label;

  // Appendi gli elementi
  link.appendChild(topLine);
  link.appendChild(topRightLine);
  link.appendChild(bottomLine);
  link.appendChild(bottomLeftLine);
  link.appendChild(text);

  if (scrollThreshold) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        topLine.classList.remove('button-line-absolute-white');
        topRightLine.classList.remove('button-line-absolute-white');
        bottomLine.classList.remove('button-line-absolute-white');
        bottomLeftLine.classList.remove('button-line-absolute-white');
        text.classList.remove('text-white');
        topLine.classList.add('button-line-absolute-theme');
        topRightLine.classList.add('button-line-absolute-theme');
        bottomLine.classList.add('button-line-absolute-theme');
        bottomLeftLine.classList.add('button-line-absolute-theme');
        text.classList.add('text-primary');
      } else {
        topLine.classList.add('button-line-absolute-white');
        topRightLine.classList.add('button-line-absolute-white');
        bottomLine.classList.add('button-line-absolute-white');
        bottomLeftLine.classList.add('button-line-absolute-white');
        text.classList.add('text-white');
        topLine.classList.remove('button-line-absolute-theme');
        topRightLine.classList.remove('button-line-absolute-theme');
        bottomLine.classList.remove('button-line-absolute-theme');
        bottomLeftLine.classList.remove('button-line-absolute-theme');
        text.classList.remove('text-primary');
      }
    })
  }

  return link;
}

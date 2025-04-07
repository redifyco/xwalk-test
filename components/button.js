export function createWhiteBorderButton(label = 'Donate Now', href = '#') {

  const link = document.createElement('a');
  link.href = href;
  link.className = 'group relative inline-block w-fit border border-white p-2 lg:border-0';

  const topLine = document.createElement('span');
  topLine.className = 'button-line-absolute-white -top-1 -right-1 h-0.5 w-3/5 group-hover:w-9/12';

  const topRightLine = document.createElement('span');
  topRightLine.className = 'button-line-absolute-white -top-1 -right-1 h-full w-0.5 group-hover:h-9/12';

  const bottomLine = document.createElement('span');
  bottomLine.className = 'button-line-absolute-white -bottom-1 -left-1 h-0.5 w-3/5 group-hover:w-9/12';

  const bottomLeftLine = document.createElement('span');
  bottomLeftLine.className = 'button-line-absolute-white -bottom-1 -left-1 h-full w-0.5 group-hover:h-9/12';

  const text = document.createElement('span');
  text.className = 'px-6 py-2 text-white';
  text.textContent = label;

  // Appendi gli elementi
  link.appendChild(topLine);
  link.appendChild(topRightLine);
  link.appendChild(bottomLine);
  link.appendChild(bottomLeftLine);
  link.appendChild(text);

  return link;
}

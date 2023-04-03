
class SimpleComp {
  constructor(container) {
    this.container = container || this.block();
  }

  append(child) {
    this.container.appendChild(child);
  }

  clear(child) {
    this.container.replaceChildren();
  }

  button(value, onclick) {
    const elem = document.createElement('button');
    elem.textContent = value;
    elem.onclick = () => onclick(elem);
    return elem;
  }
  
  block(child) {
    const elem = document.createElement('div');
    if (typeof child === 'string') {
      child = document.createTextNode(child);
    } else {
      elem.style.paddingTop = '8px';
    }
    if (child) elem.appendChild(child);
    return elem;
  }

  divider() {
    const elem = document.createElement('hr');
    return elem;
  }
}




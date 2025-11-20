export const aria_browseract_tag = 'aria-browseract-tag';

export function dealDom(dom = document.body) {
  let i = 0;

  function traverseAndEnableShadowDOM(
    root: HTMLElement | ShadowRoot | Document,
    callback: (el: HTMLElement) => void,
  ) {
    const elements =
      root === document
        ? document.querySelectorAll('*')
        : root.querySelectorAll('*');

    // @ts-expect-error 111  
    elements.forEach((element: HTMLElement) => {
      if (element.shadowRoot) {
        traverseAndEnableShadowDOM(element.shadowRoot, callback);
      }

      callback(element);
    });
  }

  function addTag() {
    traverseAndEnableShadowDOM(dom, (el) => {
      if (el.nodeType !== Node.ELEMENT_NODE) return;
      i = i + 1;
      el.setAttribute(aria_browseract_tag, i + '');
    });
  }

  function traverseFindTag(
    root: HTMLElement | ShadowRoot | Document,
    key: string,
  ) {
    const elements =
      root === document
        ? document.querySelectorAll('*')
        : root.querySelectorAll('*');

    // @ts-expect-error 111    
    for (const element of elements) {
      if (element.shadowRoot) {
        const el = element.shadowRoot.querySelector(key);
        if (el) {
          return el;
        } else {
          traverseFindTag(element.shadowRoot, key);
        }
      }
    }
    return null;
  }

  function queryTag(tag: string) {
    const key = `[${aria_browseract_tag}="${tag}"]`;
    const el = dom.querySelector(key);
    if (el) {
      return el;
    } else {
      traverseFindTag(dom, key);
    }
  }

  function delTag() {
    traverseAndEnableShadowDOM(dom, (el) => {
      if (el.hasAttribute(aria_browseract_tag)) {
        el.removeAttribute(aria_browseract_tag);
      }
    });
    i = 0;
  }

  function selector(_selector: (el: HTMLElement) => boolean) {
    const list: HTMLElement[] = [];
    traverseAndEnableShadowDOM(dom, (el) => {
      if (_selector(el)) {
        list.push(el);
      }
    });
    return list;
  }

  return {
    queryTag,
    delTag,
    selector,
    addTag
  };
}
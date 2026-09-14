/**
 * <dkdjs-test> — throwaway diagnostic. Delete once the real element renders.
 *
 * The smallest possible custom element: no shadow DOM, no attributes, no
 * dependencies, no fonts. If THIS renders and dkdjs-home doesn't, the problem
 * is in my file. If this is blank too, the problem is the element setup —
 * tag name, selected source file, or Wix not serving the code yet.
 *
 * Tag Name: dkdjs-test
 */

class DkdjsTest extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block';
    this.style.minHeight = '200px';
    this.style.background = '#FF2E9A';
    this.style.color = '#0A0A0F';
    this.style.font = '700 20px/1.4 system-ui, sans-serif';
    this.style.padding = '28px';
    this.textContent = 'DKDJS TEST ELEMENT IS ALIVE — ' + new Date().toISOString();
  }
}

customElements.define('dkdjs-test', DkdjsTest);

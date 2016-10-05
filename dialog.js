{

  class DialogContent extends Jinkela {
    get tagName() { return 'dd'; }
    destroy() { this.element.remove(); }
    get styleSheet() { return `:scope { margin: 0; }`; }
  }

  class DialogHeaderCloseButton extends Jinkela {
    init() { this.element.addEventListener('click', event => this.click(event)); }
    click() {
      let event = document.createEvent('event');
      event.initEvent('dialogcancel', true);
      this.element.dispatchEvent(event);
    }
    get template() {
      return `
        <svg width="16" height="16" stroke="#4c4c4c">
          <line x1="0" y1="0" x2="16" y2="16" />
          <line x1="0" y1="16" x2="16" y2="0" />
        </svg>
      `;
    }
    get styleSheet() {
      return `
        :scope {
          position: absolute;
          margin: auto;
          width: 16px;
          height: 16px;
          top: 0;
          bottom: 0;
          right: 1em;
          color: inherit;
          text-decoration: none;
          cursor: pointer;
        }
      `;
    }
  }

  class DialogHeader extends Jinkela {
    init() { new DialogHeaderCloseButton().to(this); }
    get template() { return `<dt><h3>{title}</h3></dt>`; }
    get styleSheet() {
      return `
        :scope {
          overflow: hidden;
          line-height: 48px;
          padding: 0px 1em;
          border-bottom: 1px solid #ebe6e1;
          display: block;
          font-size: 16px;
          position: relative;
        }
        :scope > h3 {
          float: left;
          margin: 0;
          font-size: inherit;
          line-height: inherit;
        }
      `; 
    }
  }

  class DialogBox extends Jinkela {
    init() {
      this.element.addEventListener('click', event => this.click(event));
      this.header = new DialogHeader().to(this);
    }
    set(component) {
      component = component || new Jinkela();
      const render = () => {
        this.header.title = component.title || 'Dialog';
        if (this.content) this.content.destroy();
        this.content = new DialogContent().to(this);
        component.to(this.content);
      };
      const duration = 300;
      if (this.element.classList.contains('active')) {
        let player = this.element.animate([
          { offset: 0, transform: `${this.activeTransform} translateZ(1280px) scale(.5) rotateY(0deg)` },
          { offset: 1 / 2, transform: `${this.activeTransform} translateZ(1280px) scale(.5) rotateY(90deg)` },
          { offset: 1 / 2, transform: `${this.activeTransform} translateZ(1280px) scale(.5) rotateY(-90deg)` },
          { offset: 1, transform: `${this.activeTransform} translateZ(1280px) scale(.5) rotateY(0deg)` }
        ], { duration });
        setTimeout(render, duration / 2);
      } else {
        render();
        this.element.classList.add('active');
      }
    }
    unset() { this.element.classList.remove('active'); }
    click(event) { event.dontCancel = true; }
    get tagName() { return 'dl'; }
    get activeTransform() { return `translateX(-50%) translateY(-50%)`; }
    get styleSheet() {
      return `
        :scope {
          box-sizing: border-box;
          min-width: 514px;
          padding: 0;
          margin: auto;
          position: absolute;
          top: 50%;
          left: 50%;
          transition: transform 200ms ease;
          transform: translateX(-50%) translateY(-65%) scale(.8);
          background: #fff;
          display: inline-block;
          z-index: 1;
        }
        :scope.active {
          transform: ${this.activeTransform};
        }
      `;
    }
  }

  class Dialog extends Jinkela {
    init() {
      this.element.addEventListener('click', event => this.click(event));
      this.element.addEventListener('dialogcancel', event => this.cancel(event));
      this.box = new DialogBox().to(this);
    }
    get popup() {
      let value = content => {
        this.box.set(content);
        this.element.classList.add('active');
      };
      Object.defineProperty(this, 'popup', { configurable: true, value });
      return value;
    }
    get cancel() {
      let value = () => {
        this.element.classList.remove('active');
        this.box.unset();
      };
      Object.defineProperty(this, 'cancel', { configurable: true, value });
      return value;
    }
    click(event) {
      if (event.dontCancel || this.dontCancel) return;
      this.cancel();
    }
    get styleSheet() {
      return `
        :scope {
          transform-style: preserve-3d;
          transform: perspective(2560px);
          position: fixed;        
          z-index: 999;
          color: #666;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transition: visibility 200ms ease, opacity 200ms ease;
          visibility: hidden;
          opacity: 0;
          background: rgba(0,0,0,0.8);
          text-align: center;
        }
        :scope.active {
          visibility: visible;
          opacity: 1;
        }
      `;
    }
    static create() {
      let dialog = new this();
      let render = () => dialog.to(document.body);
      document.body ? render() : addEventListener('DOMContentLoaded', render);
      return dialog;
    }
  }

  var dialog = Dialog.create();

}

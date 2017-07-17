# Jinkela-Dialog

## Install

```bash
npm install jinkela-dialog
```

## Usage

### dialog.popup([component])

Popup a dialog.

* `component` **Jinkela** Show the component with dialog.

### dialog.cancel()

Close current dialog.

## Demo

```html
<script src="https://unpkg.com/jinkela@1.2.19/umd.js"></script>
<script src="https://unpkg.com/jinkela-dialog@0.1.6/dialog.js"></script>
<script>
class Foo extends Jinkela {
  get template() {
    return `
      <h1>
        Foo
      </h1>
    `;
  }
}

dialog.popup(new Foo());
</script>
```

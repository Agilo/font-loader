import AbstractFont, { InputOptions } from './abstract';
import FallbackFont from './fallback';

class Font extends AbstractFont {
  fallback: FallbackFont;
  constructor(options: InputOptions) {
    super(options);

    this.fallback = new FallbackFont({
      fontFamily: this.options.fontFamily,
      fontWeight: this.options.fontWeight,
      fontStyle: this.options.fontStyle,
      timeout: 300,
    });
  }

  public check() {
    if (this.testElement && this.testElement.clientWidth !== 0) {
      return true;
    }

    return false;
  }

  public load() {
    if (!this.promise) {
      this.promise = this.fallback.load().then(() => super.load());
    }

    return this.promise;
  }
}

export default Font;

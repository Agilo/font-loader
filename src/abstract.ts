import now from './utilities/now';

export interface Options {
  fontFamily: string;
  fontWeight: string | number;
  fontStyle: string;
  timeout: number;
}

export interface InputOptions {
  fontFamily: string;
  fontWeight?: string | number;
  fontStyle?: string;
  timeout?: number;
}

const defaultOptions = {
  fontFamily: '',
  fontWeight: 400,
  fontStyle: 'normal',
  timeout: 0,
};

abstract class AbstractFont {
  options: Options;
  testElement: HTMLParagraphElement | undefined;
  promise: Promise<void> | undefined;

  constructor(options: InputOptions) {
    if (
      typeof options.fontFamily !== 'string' ||
      !options.fontFamily.trim().length
    ) {
      throw new Error('fontFamily option is required!');
    }

    this.options = Object.assign({}, defaultOptions, options);
  }

  public getTestElementStyle() {
    return (
      'position:absolute;top:0;left:0;opacity:0;' +
      `font-family:${this.options.fontFamily};` +
      `font-weight:${this.options.fontWeight};` +
      `font-style:${this.options.fontStyle};`
    );
  }

  public addTestElement() {
    if (this.testElement) {
      return;
    }

    const elStyle = this.getTestElementStyle();
    this.testElement = document.createElement('p');

    if (elStyle) {
      this.testElement.setAttribute('style', elStyle);
    }

    this.testElement.innerText = 'A'.repeat(10);

    document.body.appendChild(this.testElement);
  }

  public abstract check(): boolean;

  public load() {
    if (!this.promise) {
      this.promise = new Promise<void>((resolve, reject) => {
        this.addTestElement();

        const startTime = now();

        const intervalId = setInterval(() => {
          if (true === this.check()) {
            clearInterval(intervalId);
            return resolve();
          }

          if (
            this.options.timeout > 0 &&
            now() - startTime > this.options.timeout
          ) {
            clearInterval(intervalId);
            return reject(
              new Error(
                `Loading of font "${this.options.fontFamily}", weight "${this.options.fontWeight}" and style "${this.options.fontStyle}" timeouted!`,
              ),
            );
          }
        }, 50);
      });
    }
    return this.promise;
  }
}

// AbstractFont.prototype.getStyleContent = function () {
//   return '';
// };

// AbstractFont.prototype.addStyle = function () {
//   if (this.style) {
//     return;
//   }

//   const styleContent = this.getStyleContent().trim();

//   if (!styleContent || !styleContent.length) {
//     return;
//   }

//   this.style = document.createElement('style');

//   this.style.innerHTML = styleContent;
//   document.head.appendChild(this.style);
// };


export default AbstractFont;

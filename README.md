# Font Loader

> a lightweight font loader

## Install

With [npm](https://npmjs.org/) installed, run

```
npm install @agilo/font-loader
```

## Usage

Load font via CSS @font-face or any other available method then:

```js
import fontLoader from '@agilo/font-loader';
const font = fontLoader( {
	fontFamily: 'FontFamily',
	fontWeight: 700,
	fontStyle: 'italic',
	timeout: 5000,
} );

font.load()
	.then( () => console.log( 'FontFamily is loaded!' ) )
	.catch( (error) => console.log( error ); );
```

## License

GNU General Public License v2.0

import now from './utilities/now';

const AbstractFont = function() {
	return this;
};

AbstractFont.prototype._isLoaded = false;
AbstractFont.prototype.defaults = {
	fontFamily: '',
	fontWeight: 400,
	fontStyle: 'normal',
	timeout: 0,
};

AbstractFont.prototype.initOptions = function( options = {} ) {
	if ( ! options.fontFamily || ! options.fontFamily.length ) {
		throw new Error( 'fontFamily must be defined!' );
	}

	this.options = Object.assign( {}, this.defaults, options );
};

AbstractFont.prototype.getStyleContent = function() {
	return '';
}

AbstractFont.prototype.addStyle = function() {
	if ( this.style ) {
		return;
	}

	const styleContent = this.getStyleContent().trim();

	if ( ! styleContent || ! styleContent.length ) {
		return;
	}

	this.style = document.createElement( 'style' );

	this.style.innerHTML = styleContent;
	document.head.appendChild( this.style );
};

AbstractFont.prototype.getTestElementStyle = function() {
	return 'position:absolute;top:0;left:0;opacity:0;' +
		`font-family:${this.options.fontFamily};` +
		`font-weight:${this.options.fontWeight};` +
		`font-style:${this.options.fontStyle};`;
};

AbstractFont.prototype.addTestElement = function() {
	if ( this.testElement ) {
		return;
	}

	const elStyle = this.getTestElementStyle();
	this.testElement = document.createElement( 'p' );

	if ( elStyle ) {
		this.testElement.setAttribute( 'style', elStyle );
	}

	this.testElement.innerText = 'A'.repeat( 10 );

	document.body.appendChild( this.testElement );
};

AbstractFont.prototype.check = function() {
	return false;
};

AbstractFont.prototype.isLoaded = function() {
	if ( true === this._isLoaded ) {
		return true;
	}

	if ( true === this.check() ) {
		this._isLoaded = true;

		return true;
	}

	return false;
};

AbstractFont.prototype.load = function() {
	return new Promise( ( resolve, reject ) => {
		this.addStyle();
		this.addTestElement();

		const startTime = now();

		const intervalId = setInterval( () => {
			if ( true === this.check() ) {
				clearInterval( intervalId );
				return resolve();
			}

			if ( this.options.timeout > 0 && ( now() - startTime ) > this.options.timeout ) {
				clearInterval( intervalId );
				return reject( new Error( `Load of font "${this.options.fontFamily}", weight "${this.options.fontWeight}" and style "${this.options.fontStyle}" timeouted!` ) );
			}
		}, 50 );
	} );
};

export default AbstractFont;

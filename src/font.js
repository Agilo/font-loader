import AbstractFont from './abstract';
import FallbackFont from './fallback';

const Font = function( options ) {
	this.initOptions( options );

	this.fallback = new FallbackFont( {
		fontFamily: this.options.fontFamily,
		fontWeight: this.options.fontWeight,
		fontStyle: this.options.fontStyle,
		timeout: 300,
	} );

	return this;
};

const prototype = Object.create( AbstractFont.prototype );

prototype.check = function() {
	if ( this.testElement && this.testElement.clientWidth !== 0 ) {
		return true;
	}

	return false;
};

prototype.load = function() {
	return this.fallback.load()
		.then( () => AbstractFont.prototype.load.call( this ) );
};

Font.prototype = prototype;

export default Font;

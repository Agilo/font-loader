const FontLoader = require('../dist/font-loader.js');

const fn = function(options) {
	return new FontLoader(options);
};

test('Empty fontFamily option throws an error', function() {
	const expectedError = new Error('fontFamily must be defined!');

	expect(fn).toThrow(expectedError);
	expect(fn.bind(null, {})).toThrow(expectedError);
	expect(fn.bind(null, {
		fontFamily: undefined
	})).toThrow(expectedError);
	expect(fn.bind(null, {
		fontFamily: null
	})).toThrow(expectedError);
	expect(fn.bind(null, {
		fontFamily: ''
	})).toThrow(expectedError);
	expect(fn.bind(null, {
		fontFamily: ' '
	})).toThrow(expectedError);
});

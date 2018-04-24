buildParamString = function(options) {
	let paramsString = '';
	let optionKey;
	for (optionKey in options) {
		if (paramsString === '') {
			paramsString = `${ optionKey }=${ options[optionKey] }`;
		} else {
			paramsString = `${ paramsString }&${ optionKey }=${ options[optionKey] }`;
		}
	}

	return paramsString;
};

RocketChat.buildParamString = function(options) {
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
}

RocketChat.isClientServer = function(actionParameters) {
	const clientServerKey = 'client_server';
	let isServer = false;
	let isClient = false;
	if (actionParameters[clientServerKey] === 'server') {
		isServer = true;
	} else if (actionParameters[clientServerKey] === 'client') {
		isClient = true;
	}

	return [isServer, isClient];
};

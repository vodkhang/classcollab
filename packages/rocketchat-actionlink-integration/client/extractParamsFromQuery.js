getValueFromStr = function(str) {
	var terms = str.split('=');
	var result = {};
	result[terms[0]] = terms[1]
	return result;
};

extractParamsFromQuery = function(str){
	result = {};
	paramstr = str.split('&');
	paramsDict = getValueFromStr(paramstr[0]);
	result = _.extend(result, paramsDict);
	console.log(result);
	return result;
};

buildParamStr = function(paramKey, param, result) {
	result = result + `&${paramKey}=` + param;
	return result;
};

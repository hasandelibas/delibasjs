
String.prototype.replaceAll = function (search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
};

Array.prototype.pop = function (index) {
	if(index!=undefined){
		return this.splice(index, 1)[0]
	}else{
		if(this.length > 0)
			return this.splice(this.length-1,1)[0]
		else
			return undefined;
	}
}

function nval(variable, index, def) {
	if(index instanceof Array){
		if(index.length>0){
			var p = index.pop(0);
			if( variable instanceof Object && p in variable ){
				return nval(variable[p] , index , def );
			}else{
				if(def!==undefined){
					return def;
				}else{
					return nval.def;
				}
			}
		}else{
			// RETURN LAST VALUE
			return variable;
		}

	}else{
		if( index in variable){
			return variable[index];
		}else{
			if (def !== undefined) {
				return def;
			} else {
				return nval.def;
			}
		}
	}
}
nval.def = null;

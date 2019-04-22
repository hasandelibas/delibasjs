
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


/*
	Front End Code Brocker
*/
function Broker(val,key,isJsonKey){
    if(isJsonKey==null)
        isJsonKey = false;
    if(typeof(val)=="object"){
        var ret =  key + " = {";
        if(isJsonKey==true)
            ret =  key + " : {";

        var keys = Object.keys(val);
        for (let i = 0; i < keys.length; i++) {
            const element = keys[i];
            ret += Broker(val[element],element,true)
        }
        ret += "}"
        return ret;
    }
    if(typeof(val)=="string"){
        if(isJsonKey==true)
            return key + " : \""+  val.replaceAll("\"","\\\"") + ","
        return key + " = \""+  val.replaceAll("\"","\\\"")

    }
    if(typeof(val)=="number"){
        if(isJsonKey==true)
            return key + " : " + val + ",";
        return key + " = " + val;
    }
    if(typeof(val)=="function"){
        if(isJsonKey==true)
            return key + " : " + val.toString() + ","
        return key + " = " + val.toString()
    }
}

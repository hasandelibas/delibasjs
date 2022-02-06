
function addslashes(string) {
  return string.replace(/\\/g, '\\\\').
      replace(/\u0008/g, '\\b').
      replace(/\t/g, '\\t').
      replace(/\n/g, '\\n').
      replace(/\f/g, '\\f').
      replace(/\r/g, '\\r').
      replace(/"/g, '\\"');
}


function cartesian(a, b, ...c){
  return (b ? cartesian([].concat(...a.map(d => b.map(e => [].concat(d, e)))), ...c) : a);
}



function val(obj,arr=[],defVal=undefined){
	if(defVal===undefined)
    defVal = null;
	if(obj==null){
		return defVal;
	}
	if(arr.length==0){
		return obj;
	}else {
		var index = arr.popAt(0);
		if( typeof(obj) =="object" &&  index in obj ){
			return cval(obj[index],arr,defVal)
		}else{
			return defVal;
		}
	}
}



Array.prototype.popAt = function(index) {
  if(index==null){
    index = this.length - 1;
  }
  return this.splice(index,1)[0];   
}

Array.prototype.distinct = function(fn=(a,b)=>{return a==b}){
  let arr = Array.from(this)
	let i = 0;
	for (i = 0; i < arr.length; i++) {
		const element = arr[i];
		let find = arr.filter( e=>{ return fn(element,e) } );
		for (let j = 1; j < find.length; j++) {
			const element = find[j];
			arr.popAt( arr.indexOf(element) )
		}
	}
	return arr;
}

Array.prototype.randomize = function() {
	var array = Array.from(this);
	var currentIndex = array.length, temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;
		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
}



/**
 * @param {RegExp | String} search
 * @param {String} replace
 */
String.prototype.replaceAll = function(search, replacement) {
	var target = this;
	return target.split(search).join(replacement);
}



/**
 * Remove "" signatures
 */
String.prototype.trimQuotes = function(){
	var str = this;
	str = str.trim();
	if(str[0]=="\"" || str[0] == "'" )
		str = str.substr(1)
	if(str[str.length-1]=="\"" || str[str.length-1] == "'" )
		str = str.substr(0,str.length-1)
	return str;
};


/**
 * Search requirsively charcater, if found: return
 * * [0] : start + founded + end
 * * [1] : founded
 * * [2] : start index
 * * [3] : end index
 * @param start start character ( { [
 * @param end end character ) } ]
 * @param position start position search
 */
String.prototype.matchRequirsive = function(start,end,position){
	var search = this;
	var total = 0,startLen = start.length, endLen = end.length;
	var startPoint = -1;
	for (let i = position; i < search.length - endLen+1; i++) {
		const element = search[i];
		//console.log(i,element,total,startPoint);
		if( search.substr(i,startLen) == start ){
			//console.log("S:",i)
			total++;
			if(startPoint==-1) startPoint = i;
			i+=startLen - 1;
		}
		if( search.substr(i,endLen) == end){
			//console.log("E:",i)
			total--;
			if(total==0 && startPoint!=-1){
				return [
					search.substr(startPoint,i+endLen-startPoint),
					search.substr(startPoint+startLen , i - startPoint - startLen),
					startPoint+startLen,
					i + endLen
				];
			}
			i+=endLen - 1;
		}
	}
	return null;
}


/**
 * Return removed sub string
 * **Example**
 * * "String".pop(1,1) = **"Sring"**
 * * Inverse of substring
 * @param start 
 * @param length 
 */
String.prototype.pop = function (start, length) {
	return this.substr(0,start) + this.substr(start+length);
}

/**
	 * Split text outer chars
	 * Ex: splitOuter ( '\n' , ['{','['] , ['}',']']  )
	 * @param {string} splitter 
	 * @param {Array<string>|string}start 
	 * @param {Array<string>|string}end 
	 */
String.prototype.splitOuter = function (splitter,start,end) {
	if(typeof start=="string") start = [start];
	if(typeof end=="string") end = [end];	

	var str = this;
	var mCount = start.map(e=>0);
	var sLens = start.map(e=>e.length);
	var splitterLength = splitter.length;

	var list = [];
	var splitPoint = 0;
	let canSplit = true;
	for (let i = 0; i < str.length; i++) {
		canSplit = true;
		for (let j = 0; j < start.length; j++) {
			const _sEl = start[j];
			const _eEl = end[j];
			if(_sEl==_eEl){
				if( str.substr(i, sLens[j] )==_sEl ){
					mCount[j]+= 1;
					mCount[j]= mCount[j] % 2;
				}
			}else{
				if( str.substr(i, sLens[j] )==_sEl ){
					mCount[j]++;
				}else if( str.substr(i, sLens[j] )==_eEl ){
					mCount[j]--;
				}
			}
			if(mCount[j]!=0) canSplit=false;
		}
		
		if( canSplit && str.substr(i,splitterLength)==splitter ){
			list.push(
				str.substr(splitPoint,i-splitPoint)
			);
			i+=splitterLength-1;
			splitPoint=i+1;
			
		}
	}
	list.push(
		str.substr(splitPoint)
	);
	return list;
}
	



/**
 * Return x digit string
 * * (1).toDigit(2)  => "01"
 * * (14).toDigit(3) => "014"
 * @param x Number of digit
 */
Number.prototype.toDigit = function(x){
	var str = this.toString();
	var len = str.length;
	for( ; x>len ; len++){
	  str="0"+str;
	}
	return str;
  }








/**
 * Convert json to href\n
 *	Example
 * 	url: user
 *  parameters: {name:"Hasan"}
 * 	user?name=Hasan
 * @param url
 * @param parameters 
 */
function $H(url, parameters){
	var qs = "";
	for(var key in parameters) {
	  var value = parameters[key];
	  qs += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
	}
	if (qs.length > 0){
	  qs = qs.substring(0, qs.length-1); //chop off last "&"
	  url = url + "?" + qs;
	}
	return url;
}

/**
 * Convert json to FormData
 */
function $FD(params){
	const formData = new FormData();
	if(params!=null && typeof params=="object")
		Object.keys(params).forEach(key => formData.append(key, params[key]));
	return formData;
}

/*
Convert FormData to UrlSearchParams 
 *  parameters: {name:"Hasan"}
 * 	user?name=Hasan
*/
function $USP(formData){
	const data = new URLSearchParams();
	for (const pair of formData ) {
		data.append(pair[0], pair[1]);
	}
	return data;
}


/**
	Tree Hierarchy

	_id			:number
	_children	:list
	_text		:string
	_data		:storage data

 */

/**
 * 
 * @param {*} tree Tree mechanzim.
 * @param {*} fn Function <item, text[], id[]> return boolean
 * @param {*} ret Function <item, text[], id[]>
 */
function TreeFilter(tree,fn,ret) {
  if(ret==null) ret = e=> e;
  let retList = [];
  TreeFilterReq(tree,[],[] )

  function TreeFilterReq(tree,textList,idList) {
    for (let i = 0; i < tree.length; i++) {
      const element = tree[i];

      if( fn(element,
            [].concat(textList,element._text) ,
            [].concat(idList,element._id)
        )) {
          retList.push( ret( element,
          [].concat(textList,element._text) ,
          [].concat(idList,element._id)
        ))
      }

      if( typeof(element)=="object" && element!=null && "_children" in element ){
        TreeFilterReq(element._children, 
          [].concat(textList,element._text) ,
          [].concat(idList,element._id) 
        )
      }
    }
      
  }
  return retList;
}


/**
 * 
 * @param {*} tree Tree mechanzim.
  * @param {*} ret Function <item, text[], id[]>
 */
function TreeMap(tree,ret) {
  if(ret==null) ret = e=> e;
  let retList = TreeFilterReq(tree,[],[] )

  function TreeFilterReq(tree,textList,idList) {
    var _retList = [];
    for (let i = 0; i < tree.length; i++) {
      const element = tree[i];
      let el = ret( element,
        [].concat(textList,element._text) ,
        [].concat(idList,element._id)
      );
      if( typeof(element)=="object" && element!=null && "_children" in element ){
        el._children = TreeFilterReq(element._children, 
          [].concat(textList,element._text) ,
          [].concat(idList,element._id) 
        )
      }
      _retList.push( el )
    }
    return _retList;
  }
  return retList;
}

//#endregion





// TRIGGER SYSTEM
function TriggerSystem(object){
	if(typeof object=="object"){
		let triggers=[];
		object._trigger_list=triggers;
		object.on = function(event,fn,order=0){
			triggers.push({event:event,fn:fn,order:order});
		}
		object.once = function(event,fn,order=0){
			triggers.push({event:event,fn:fn,order:order,once:true});
		}
		object.trigger=function(event,params){
			if(params==null) params=[{}];
			triggers.filter((e=>e.event==event)).sort((a,b)=>a.order-b.order).forEach(e=>e.fn.apply(object,params));	
			if(triggers.length>0)
				for(let i=triggers.length-1;i--;i>=0){
					if(triggers[i].event==event && triggers[i].once==true){
						console.log(triggers[i],triggers)
						triggers.splice(i,1);
					}
				}
			return Promise.resolve(params);
		}
		Object.defineProperty(object,"triggers",{
			get:()=>{
				var obj={};
				triggers.forEach(e=>obj[e.event]=e.fn);
				return obj;
			}
		})

	}else{
		console.warn("Trigger: This is not object",object);
	}
}
// #END



	


Element.prototype.remove = function(){
  this.parentElement.removeChild(this)
}
Element.prototype.empty = function(){
  while(this.childNodes.length>0){
    this.firstChild.remove()
  }
  return this;
}
Element.prototype.attr = function(data,value=undefined){
    if(value===null){
        this.removeAttribute(data);
        return this;
    }
    if(value===undefined){
        return this.getAttribute(data)
    }
    this.setAttribute(data,value);
    return this;
}


Node.prototype.index = function(){
  let parent = this.parentElement;
  if(parent==null) return -1; 
  for (let index = 0; index < parent.children.length; index++) {
    const element = parent.children.item(index);
    if(element==this){
      return index;
    }
  }
  return -1;
}

Node.prototype.addNext = function(node){
  let parent = this.parentElement;
  if(parent==null) throw "Parent Element not found";
  let index = this.index();
  if(index==parent.childNodes.length-1){
    parent.append(node);
  }else{
    parent.insertBefore(node, parent.childNodes[index+1] );
  }
}

Node.prototype.addPrev = function(node){
  let parent = this.parentElement;
  if(parent==null) throw "Parent Element not found";
  parent.insertBefore(node, this);
}

Node.prototype.text = function(value=undefined){
  if(value===undefined){
    return this.textContent;
  }
  this.textContent=value;
  return this;
}

Element.prototype.html = function(value=undefined){
  if(value===undefined){
    return this.innerHTML;
  }
  this.innerHTML=value;
  return this;
}

Node.prototype.movePrev = function(){
  var index = this.index();
  var el = this;
  if(index!=0)
  el.parentNode.insertBefore(el,el.parentNode.children[index-1]);	
}
Node.prototype.moveNext = function(){
  var index = this.index();
  var el = this;
  if(index!=el.parentNode.children.length-1){
    el.parentNode.insertBefore(el,el.parentNode.children[index+2]);	
  }
}

Node.prototype.replace = function(el){
  if(this.parentNode!=null){
    this.parentNode.replaceChild(el,this);
    return this;
  }
  return null;
}


Node.prototype.nearest = function(selector){
  for(let e of this.parents ){
    let els = Array.from(e.querySelectorAll(selector)) 
    if( els.length>0 ) 
      return els
  };
  return [];
}

Object.defineProperty(Node.prototype,"parent",{get:function(){return this.parentElement}})
Object.defineProperty(Node.prototype,"next",{get:function(){return this.nextSibling}})
Object.defineProperty(Node.prototype,"prev",{get:function(){return this.previousSibling}})
Object.defineProperty(Node.prototype,"first",{get:function(){return this.firstElementChild}})
Object.defineProperty(Node.prototype,"last",{get:function(){return this.lastElementChildd}})


Object.defineProperty(Node.prototype,"parents",{
  get:function(){
    let el = this;
    let list = [el]
    while(el!=null && el!=el.ownerDocument ){
      list.push(el)
      el=el.parent;
    }
    if(el!=null){
      list.push(el)
    }
    return list;
  }
});










function OnReady(process,order){}
(function(){
  OnReady.Object = {}
  TriggerSystem(OnReady.Object);  

  window.OnReady=function(process,order){
		OnReady.Object.on("load",process,order);
	}
  document.addEventListener('DOMContentLoaded', function() {
		OnReady.Object.trigger("load");
	})

})();



function OnAdded(selector,process,order){}
(function(){
	
	let triggers=[]
	
	window.OnAdded=function(selector,process,order){
		triggers.push({selector,process,order});
	}

  document.addEventListener('DOMContentLoaded', function() {
		function Check(nodes){
      for( const node of nodes ){
        for( const trigger of triggers ){
          let selector = trigger.selector;
          if(node.matches(selector)) trigger.process.apply(node,[node]);
          if(node.querySelectorAll(selector).length>0){
            for(const el of node.querySelectorAll(selector)){
              trigger.process.apply(el,[el]);
            }
          }
        }
      }
		}

		var observer = new MutationObserver((mutations)=>{
			mutations = mutations.sort((a,b)=>{return b.type.localeCompare(a.type)})
			for(const m of mutations){
				if(m.type=="childList"){
					let nodes = m.addedNodes;
					Check(nodes);
				}
			}
		});
		observer.observe(document.body, { 
			childList: true,
			subtree:true
		});
		Check(document.body);
	})
		
	
})()


























  








let Ajax = {
	ThenList:[],
	Then:function(fn){
		Ajax.ThenList.push(fn);
	},
	Post:function(url,data={}) {
		return new Promise((resolve,error)=>{
			fetch(url,{method:"POST",body:$USP($FD(data))}).then(e=>e.text()).then(data=>{
				for(let fn of Ajax.ThenList) fn( data)
				return resolve( data )
			}).catch(error);
		});
	},
	Json:function(url,data={}) {
		return new Promise((resolve,error)=>{
			fetch(url,{method:"POST",body:JSON.stringify(data),headers: { 'Content-Type': 'application/json' } }).then(e=>e.json()).then(data=>{
				for(let fn of Ajax.ThenList) fn( data )
				return resolve( data )
			}).catch(error);
		});
	},
	Get:function(url,data={}) {
		return new Promise((resolve,error)=>{
			fetch($H(url,data),{method:"GET"}).then(e=>e.text()).then(data=>{
				for(let fn of Ajax.ThenList) fn( data) 
				return resolve( data )
			}).catch(error);
		});
	}

};






/**
 * @description JsReq is a Javascript loader class. It loads js files on demand.
 * You can declare some aliases to shorten the inclusion process
 * @example
 *  // The loader may be a global object or an attribute of a global object to 
 *  // be accessible everywhere
 *  var loader = new JsReq();
 *  // myFunction will be the call alias for /path/to/myFunction.js 
 *  // (no need for .js as it is the default suffix)
 *  loader.register('myFunction', '/path/to/myFunction'); 
 *  // same for MyClass
 *  loader.register('MyClass', '/path/to/MyClass'); 
 *  // You can attach multiple alias to a single file
 *  loader.register( ['aFunction', 'anotherFunction'], '/path/to/fcts');
 *  // You can require multiple files at once
 *  loader.require( ['MyClass', 'aFunction'] );
 *  ...
 *  loader.require('MyClass');	// The file will be included once
 *  var M = new MyClass();
 *  loader.require('myFunction'); // The file will be included once
 *  var m = new myFunction();
 *  loader.include('/path/to/aFile'); // You can include a file without registering it
 *  
 *  // You can as well declare a path prefix and a file suffix to shorten the inclusion
 *  var loader2 = new JsReq('/path/', '.suffix.js');
 *  loader2.register('myFunction', 'to/myFunction');
 *  loader2.include('to/myFunction', true);
 *  
 * 
 * @author Pierre Marcotullio ( pierre[@t]mrgeek[d0t]com )
 * @licence MIT
 * Copyright © < Pierre Marcotullio >
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * The Software is provided "as is", without warranty of any kind, express or 
 * implied, including but not limited to the warranties of merchantability, 
 * fitness for a particular purpose and noninfringement. In no event shall the 
 * authors or copyright holders be liable for any claim, damages or other 
 * liability, whether in an action of contract, tort or otherwise, arising from, 
 * out of or in connection with the software or the use or other dealings in the 
 * Software.
 */

/**
 * Constructor
 * @param {String} pathPrefix (optional) This prefix will be included on all 
 * inclusions (default : "")
 * @param {String} fileSuffix (optional) This suffix will be appended on all 
 * inclusions (default : ".js" )
 */
var JsReq = function( pathPrefix, fileSuffix ) {
	this.pathPrefix		= pathPrefix || '';
	this.fileSuffix		= fileSuffix || '.js';
	this._importList	= new Array();
	this._fctRegister	= new Array();
};

/**
 * Includes a javascript file
 * @param {String} fileName
 * @param {Boolean} once (optional) include_once if true
 */
JsReq.prototype.include = function( fileName, once) {
	once = once || false;
	if( !once || !this._importList[fileName] ) {
		var script	= document.createElement('script');
		script.type = 'text/javascript';
		script.src	= this.pathPrefix + fileName + this.fileSuffix;
		document.getElementsByTagName('head')[0].appendChild(script);
		this._importList[fileName] = true;
	}
	return this;
};

/**
 * Binds a function to a fileName to include
 * @param {String | Array} fct the function name
 * @param {String} fileName the file name
 * @param {Boolean} overwrite (optional) default false
 */
JsReq.prototype.register = function( fct, fileName, overwrite ) {
	overwrite = overwrite || false;
	if( typeof(fct) == 'object' ) {
		for( var i in fct ) {
			this.register(fct[i], fileName);
		} 
	} else if( !this.registered(fct) || overwrite ) {
		this._fctRegister[fct] = fileName;
	}
	return this;
};


/**
 * Declares a function as required, if the js is not included, will include it
 * @para {String/Object} fct the function name
 */
JsReq.prototype.require = function( fct ) {
	if(typeof(fct) == 'object') {
		for( var i in fct ) {
			this.require( fct[i] );
		}
	} else if( this._fctRegister[fct] ) {
			this.include(this._fctRegister[fct], true);
	}
	return this;
};

/**
 * Returns if the function fct is registered
 * @param {String} fct
 */
JsReq.prototype.registered = function( fct ) { return (typeof(this._fctRegister[fct]) != 'undefined'); };
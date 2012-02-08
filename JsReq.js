/*
 * Script Loader
 * @author Pierre mrGeek (pierre[@t]mrgeek[d0t]fr)
 */

var Loader = function() {
	this._importList	= new Array();
	this._fctRegister	= new Array();
};

/**
 * Includes a javascript file
 * @param fileName string
 * @param once bool (optional) include_once if true
 */
Loader.prototype.include = function( fileName, once ) {
	if( !once || !this._importList[fileName] ) {
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src	= 'js/' + fileName + '.js';
		$('head').append(script);
		this._importList[fileName] = true;
	}
	return this;
};

/**
 * Binds a function to a fileName to include
 * @param fct string/array the function name
 * @param fileName string the file name
 * @param overwrite bool (optional) default false
 */
Loader.prototype.register = function( fct, fileName, overwrite ) {
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
 * @para fct string the function name
 */
Loader.prototype.require = function( fct ) {
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
 * @param fct string
 */
Loader.prototype.registered = function( fct ) { return (typeof(this._fctRegister[fct]) != 'undefined'); };
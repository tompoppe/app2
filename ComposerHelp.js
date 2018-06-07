/**
 * 
 */
"use strict";


module.exports = function ComposerHelp() {
	this.createCardName =createCardName;
};

function createCardName(pShortName){
	//shortname has form : aaa@bbb
	var indexOfAmp = pShortName.indexOf("@");
	if (indexOfAmp == -1){
		indexOfAmp = pShortName.length;
	}
	var totalLength = pShortName.length;
	var org = process.env.ORGANIZATION;
	var rval;
	if (org === undefined){
		rval=pShortName;
	}else{
		var p1 = pShortName.substring(0, indexOfAmp);
		var p2 = pShortName.substring(indexOfAmp);
		var rval = p1 +"." + org +"." + org + p2;	
	}
	return rval;

}

/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/Object',"sap/base/Log"],function(B,L){"use strict";var S=B.extend("sap.m.semantic.Segment",{constructor:function(C,o,s,f){if(!o){L.error("missing argumment: constructor expects a container reference",this);return;}C||(C=[]);this._aContent=C;this._oContainer=o;this._sContainerAggregationName=s;this._fnSortFunction=f;},getInterface:function(){return this;}});S.prototype.getStartIndex=function(){return 0;};S.prototype.getEndIndex=function(){return this.getStartIndex()+this._aContent.length;};S.prototype.getContent=function(){return this._aContent;};S.prototype.indexOfContent=function(C){return this._aContent.indexOf(C);};S.prototype.addContent=function(C,s){if(this._fnSortFunction){var i=this._matchSortToInsertIndex(C);if(typeof i!=='undefined'){this._insertContent(C,i,s);return C;}}var a=this.getEndIndex(),l=this._aContent.length,A="insert"+c(this._sContainerAggregationName);this._oContainer[A](C,a,s);this._aContent.splice(l,0,C);return C;};S.prototype.insertContent=function(C,i,s){if(this._fnSortFunction){var I=this._matchSortToInsertIndex(C);if(typeof I!=='undefined'){this._insertContent(C,I,s);return C;}}return this._insertContent(C,i,s);};S.prototype.removeContent=function(C,s){var l=this._aContent.indexOf(C),a="remove"+c(this._sContainerAggregationName);if(l>-1){this._aContent.splice(l,1);return this._oContainer[a](C,s);}};S.prototype.removeAllContent=function(s){var r=[],g=this._oContainer.getAggregation(this._sContainerAggregationName),a=this.getStartIndex(),e=this.getEndIndex(),A="remove"+c(this._sContainerAggregationName);for(var i=a;i<e;i++){var I=this._oContainer[A](g[i],s);if(I){r.push(I);}}this._aContent=[];return r;};S.prototype.destroy=function(s){var r=this.removeAllContent(s);for(var i=0;i<r.length;i++){r[i].destroy(s);}};S.prototype._insertContent=function(C,i,s){var I=Math.min(this.getStartIndex()+i,this.getEndIndex()),a="insert"+c(this._sContainerAggregationName);I=Math.max(I,0);this._oContainer[a](C,I,s);this._aContent.splice(i,0,C);return C;};S.prototype._matchSortToInsertIndex=function(C){for(var i=0;i<this._aContent.length;i++){if(this._fnSortFunction(C,this._aContent[i])<=0){return i;}}};function c(n){return n.charAt(0).toUpperCase()+n.substring(1);}return S;});

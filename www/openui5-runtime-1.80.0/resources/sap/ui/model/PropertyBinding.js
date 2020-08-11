/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Binding','./SimpleType','./DataState',"sap/ui/base/SyncPromise","sap/base/Log","sap/base/assert"],function(B,S,D,a,L,b){"use strict";var P=B.extend("sap.ui.model.PropertyBinding",{constructor:function(m,p,c,d){B.apply(this,arguments);},metadata:{"abstract":true,publicMethods:["getValue","setValue","setType","getType","setFormatter","getFormatter","getExternalValue","setExternalValue","getBindingMode"]}});P.prototype._getBoundValue=function(f){var v=this.getValue();return f(v);};P.prototype._setBoundValue=function(v,p){var d=this.getDataState(),t=this;if(this.oType){return a.resolve(v).then(function(v){return p(v);}).then(function(v){return a.all([v,t.oType.validateValue(v)]);}).then(function(r){return r[0];}).then(function(v){d.setInvalidValue(undefined);t.setValue(v);}).catch(function(e){d.setInvalidValue(v);t.checkDataState();throw e;}).unwrap();}else{d.setInvalidValue(undefined);t.setValue(v);}};P.prototype._rawToExternal=function(v){if(this.oType){v=this.oType.formatValue(v,this.sInternalType);}if(this.fnFormatter){v=this.fnFormatter(v);}return v;};P.prototype._externalToRaw=function(v){if(this.oType){v=this.oType.parseValue(v,this.sInternalType);}return v;};P.prototype._rawToInternal=function(v){var f;if(this.oType&&v!==null&&v!==undefined){f=this.oType.getModelFormat();b(f&&typeof f.parse==="function","The input format of "+this.oType+" should be an object with the 'parse' method");v=f.parse(v);}return v;};P.prototype._internalToRaw=function(v){var f;if(v!==null&&v!==undefined){f=this.oType.getModelFormat();b(f&&typeof f.format==="function","The model format of "+this.oType+" should be an object with the 'format' method");v=f.format(v);}return v;};P.prototype.getExternalValue=function(){switch(this.sInternalType){case"raw":return this.getRawValue();case"internal":return this.getInternalValue();default:return this._getBoundValue(this._rawToExternal.bind(this));}};P.prototype.setExternalValue=function(v){switch(this.sInternalType){case"raw":return this.setRawValue(v);case"internal":return this.setInternalValue(v);default:if(this.fnFormatter){L.warning("Tried to use twoway binding, but a formatter function is used");return;}return this._setBoundValue(v,this._externalToRaw.bind(this));}};P.prototype.getInternalValue=function(){return this._getBoundValue(this._rawToInternal.bind(this));};P.prototype.setInternalValue=function(v){return this._setBoundValue(v,this._internalToRaw.bind(this));};P.prototype.getRawValue=function(){return this._getBoundValue(function(v){return v;});};P.prototype.setRawValue=function(v){return this._setBoundValue(v,function(v){return v;});};P.prototype.setType=function(t,i){this.oType=t;this.sInternalType=i;};P.prototype.getType=function(){return this.oType;};P.prototype.setFormatter=function(f){this.fnFormatter=f;};P.prototype.getFormatter=function(){return this.fnFormatter;};P.prototype.getBindingMode=function(){return this.sMode;};P.prototype.setBindingMode=function(s){this.sMode=s;};P.prototype.resume=function(){this.bSuspended=false;this.checkUpdate(true);};return P;});

/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor","sap/base/util/deepClone","sap/base/util/deepEqual","sap/ui/model/json/JSONModel","sap/base/util/restricted/_merge","sap/base/util/restricted/_omit","sap/base/util/isPlainObject","sap/base/util/includes"],function(B,d,a,J,_,b,i,c){"use strict";var S={"string":"BASE_EDITOR.MAP.TYPES.STRING","boolean":"BASE_EDITOR.MAP.TYPES.BOOLEAN","number":"BASE_EDITOR.MAP.TYPES.NUMBER","integer":"BASE_EDITOR.MAP.TYPES.INTEGER","date":"BASE_EDITOR.MAP.TYPES.DATE","datetime":"BASE_EDITOR.MAP.TYPES.DATETIME"};var M=B.extend("sap.ui.integration.designtime.baseEditor.propertyEditor.mapEditor.MapEditor",{xmlFragment:"sap.ui.integration.designtime.baseEditor.propertyEditor.mapEditor.MapEditor",getConfigMetadata:function(){return Object.assign({},B.prototype.getConfigMetadata.call(this),{allowKeyChange:{defaultValue:true},allowTypeChange:{defaultValue:true},allowAddAndRemove:{defaultValue:true},allowedTypes:{defaultValue:["string"]},includeInvalidEntries:{defaultValue:true}});},init:function(){B.prototype.init.apply(this,arguments);this._itemsModel=new J();this._itemsModel.setDefaultBindingMode("OneWay");this.setModel(this._itemsModel,"itemsModel");this._supportedTypesModel=new J();this._supportedTypesModel.setDefaultBindingMode("OneWay");this.setModel(this._supportedTypesModel,"supportedTypes");this.attachModelContextChange(function(){if(this.getModel("i18n")){var r=this.getModel("i18n").getResourceBundle();this._aSupportedTypes=Object.keys(S).map(function(k){return{key:k,label:r.getText(S[k])};});this._setSupportedTypesModel();}},this);this.attachConfigChange(this._setSupportedTypesModel,this);this._mTypes={};},setValue:function(v){v=i(v)?v:{};B.prototype.setValue.call(this,v);var I=this._processValue(v);this._itemsModel.setData(I);},_processValue:function(v){return Object.keys(v).map(function(k){var f=this._prepareInputValue(v[k],k);this._mTypes[k]=f.type;var I={key:k,value:f};return this.getConfig().includeInvalidEntries||this._isValidItem(I,d(v[k]))?I:undefined;},this).filter(Boolean);},_prepareInputValue:function(v,k){var f=this.processInputValue(d(v),k);if(!f.type){f.type=this._mTypes[k]||this._getDefaultType(f.value);}return f;},_isValidItem:function(I){var t=I.value.type;return t&&c(this._getAllowedTypes(),t);},_getDefaultType:function(v){var A=this._getAllowedTypes();var t=typeof v;var C=c(A,t)?t:undefined;if(!C&&c(A,"string")){C="string";}return C;},_getAllowedTypes:function(){return(this.getConfig()||this.getConfigMetadata())["allowedTypes"];},_setSupportedTypesModel:function(){var A=this._getAllowedTypes();this._supportedTypesModel.setData(this._aSupportedTypes.filter(function(s){return c(A,s.key);}));},formatItemConfig:function(C){var k=C.key;var t=C.value.type;var v=C.value.value;var o=this.getConfig();return[{label:this.getI18nProperty("BASE_EDITOR.MAP.KEY"),path:"key",value:k,type:"string",enabled:o.allowKeyChange,itemKey:k,allowBindings:false},{label:this.getI18nProperty("BASE_EDITOR.MAP.TYPE"),path:"type",value:t,type:"enum","enum":this._getAllowedTypes(),visible:o.allowTypeChange,itemKey:k,allowBindings:false},{label:this.getI18nProperty("BASE_EDITOR.MAP.VALUE"),path:"value",value:v,type:t,itemKey:k}];},getExpectedWrapperCount:function(v){return this._processValue(v).length;},processInputValue:function(v){return{value:v};},processOutputValue:function(v){return v.value;},_onRemoveElement:function(e){var k=e.getSource().getBindingContext("itemsModel").getObject().key;var v=this.getValue();this.setValue(b(v,k));},_onAddElement:function(){var p=_({},this.getValue());var k=this._getUniqueKey(p);p[k]=this.processOutputValue(this._getItemTemplate());this.setValue(p);},_getItemTemplate:function(){return{value:"",type:"string"};},_isNewItem:function(I){return a(I.value,this._prepareInputValue(this.processOutputValue(this._getItemTemplate())));},_getUniqueKey:function(p){var k="key";var I=0;while(p.hasOwnProperty(k)){k="key"+ ++I;}return k;},_propertyEditorsChange:function(e){var p=e.getParameter("previousPropertyEditors");var P=e.getParameter("propertyEditors");if(Array.isArray(p)){p.forEach(function(o){o.detachValueChange(this._onItemChange,this);},this);}if(Array.isArray(P)){P.forEach(function(o){o.attachValueChange(this._onItemChange,this);},this);}},_onItemChange:function(e){var k=e.getSource().getConfig().itemKey;var C=e.getParameter("path");var h=this._getItemChangeHandlers()[C];if(typeof h!=='function'){h=this._onFieldChange;}h.call(this,k,e);},_getItemChangeHandlers:function(){return{"key":this._onKeyChange,"type":this._onTypeChange};},_onKeyChange:function(o,e){if(e.getParameter("previousValue")===undefined){return;}var E=_({},this.getValue());var I=e.getSource().getAggregation("propertyEditor").getContent();var n=e.getParameter("value");if(E.hasOwnProperty(o)&&(!E.hasOwnProperty(n)||n===o)){I.setValueState("None");if(n!==o){var N={};Object.keys(E).forEach(function(s){var f=s===o?n:s;N[f]=E[s];});this._mTypes[n]=this._mTypes[o];delete this._mTypes[o];this.setValue(N);}}else{I.setValueState("Error");I.setValueStateText(this.getI18nProperty("BASE_EDITOR.MAP.DUPLICATE_KEY"));}},_onTypeChange:function(k,e){if(e.getParameter("previousValue")===undefined){return;}var E=_({},this.getValue());var n=e.getParameter("value");var I=this.processInputValue(E[k]);I.type=n;E[k]=this.processOutputValue(I);this._mTypes[k]=n;this.setValue(E);},_onFieldChange:function(k,e){var E=_({},this.getValue());var p=e.getParameter("path");var v=e.getParameter("value");var I=this.processInputValue(E[k]);I[p]=v;E[k]=this.processOutputValue(I);this.setValue(E);},renderer:B.getMetadata().getRenderer().render});return M;});

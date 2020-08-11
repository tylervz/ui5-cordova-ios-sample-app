/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/integration/designtime/baseEditor/util/createPromise","sap/ui/integration/designtime/baseEditor/propertyEditor/PropertyEditorFactory","sap/ui/integration/designtime/baseEditor/PropertyEditors","sap/ui/integration/designtime/baseEditor/util/binding/resolveBinding","sap/ui/integration/designtime/baseEditor/util/binding/ObjectBinding","sap/ui/integration/designtime/baseEditor/util/isValidBindingString","sap/ui/integration/designtime/baseEditor/util/hasTag","sap/ui/core/Control","sap/ui/model/resource/ResourceModel","sap/base/util/ObjectPath","sap/base/util/each","sap/base/util/deepClone","sap/base/util/deepEqual","sap/base/util/values","sap/base/util/isPlainObject","sap/base/util/isEmptyObject","sap/base/util/includes","sap/base/util/restricted/_merge","sap/base/util/restricted/_omit","sap/ui/model/json/JSONModel","sap/base/i18n/ResourceBundle","sap/base/Log","sap/ui/integration/designtime/baseEditor/util/unset"],function(c,P,a,r,O,i,h,C,R,b,d,f,g,v,j,k,l,_,m,J,n,L,u){"use strict";var o="customProperty--";var B=C.extend("sap.ui.integration.designtime.baseEditor.BaseEditor",{metadata:{properties:{"json":{type:"object"},"config":{type:"object",defaultValue:{"i18n":["sap/ui/integration/designtime/baseEditor/i18n/i18n.properties"]}},"layout":{type:"string",defaultValue:"list"}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true}},events:{jsonChange:{parameters:{json:{type:"object"}}},propertyEditorsReady:{parameters:{propertyEditors:{type:"array"}}}}},constructor:function(){this._mObservableConfig={};this._mPropertyEditors={};this._aCancelHandlers=[];this._oDataModel=this._createDataModel();this._bInitFinished=false;this._setReady(false);C.prototype.constructor.apply(this,arguments);this._oDataModel.setData(this._prepareData(this.getJson()));this.attachJsonChange(function(e){var p=e.getParameter("json");this._oDataModel.setData(this._prepareData(p));this._checkReady();},this);},renderer:function(e,p){var q=p.getContent();e.openStart("div",p);e.openEnd();if(q.length){q.forEach(function(s){e.renderControl(s);});}else{p.getPropertyEditorsSync().forEach(function(s){e.renderControl(s);});}e.close("div");}});B.prototype.init=function(){};B.prototype.exit=function(){this._reset();this._oDataModel.destroy();};B.prototype._prepareData=function(e){var p=f(e);d(this._mObservableConfig,function(s,q){var t=q.path;if(t[0]==="/"){t=t.substr(1);}if(typeof b.get(t.split("/"),p)==="undefined"&&typeof q.defaultValue!=="undefined"){b.set(t.split("/"),f(q.defaultValue),p);}});return p;};B.prototype.setJson=function(p){var q;if(typeof p==="string"){try{q=JSON.parse(p);}catch(e){L.error("sap.ui.integration.designtime.baseEditor.BaseEditor: invalid JSON string is specified");}}else if(j(p)){q=_({},p);}else{L.error("sap.ui.integration.designtime.baseEditor.BaseEditor: unsupported data type specified in setJson()");}if(q&&JSON.stringify(this.getProperty("json"))!==JSON.stringify(q)){this.setProperty("json",q);this.fireJsonChange({json:q});}};B.prototype.setConfig=function(e){P.deregisterAllTypes();P.registerTypes(e.propertyEditors);var t={};if(!e.i18n){t.i18n=this.getMetadata().getProperty("config").getDefaultValue().i18n;}this.setProperty("config",this._mergeConfig(t,e),false);this._initialize();};B.prototype.addConfig=function(e){return this.setConfig(this._mergeConfig(this.getConfig(),e));};B.prototype._mergeConfig=function(t,s){var e=_({},t,s);e.i18n=[].concat(t.i18n||[],s.i18n||[]);return e;};B.prototype._reset=function(){this._bInitFinished=false;this._setReady(false);this._aCancelHandlers.forEach(function(e){e();});if(this._oI18nModel){this._oI18nModel.destroy();delete this._oI18nModel;}if(this._oConfigObserver){this._oConfigObserver.destroy();}d(this._mPropertyEditors,function(p,e){e.forEach(function(q){this.deregisterPropertyEditor(q,p);},this);}.bind(this));};B.prototype._initialize=function(){this._reset();var e=this.getConfig();if(typeof this.getProperty("json")==="undefined"){this.attachEventOnce("jsonChange",this._initialize);return;}if(e){this._oConfigObserver=new O();this._loadI18nBundles(e.i18n).then(function(p){this._oI18nModel=this._createI18nModel(p);this.setModel(this._oI18nModel,"i18n");this._oConfigObserver.addToIgnore(["template","itemLabel"]);this._oConfigObserver.setModel(this._oDataModel);this._oConfigObserver.setModel(this._oI18nModel,"i18n");var s=this._getContextPath();if(s){this._oConfigObserver.setModel(this._oDataModel,"context");this._oConfigObserver.setBindingContext(this._oDataModel.getContext(s),"context");}var q=r(e.properties,{"i18n":this._oI18nModel});this._mObservableConfig=Object.assign(this._mObservableConfig,this._prepareConfig(q));this._oConfigObserver.setObject(this._mObservableConfig);this._oConfigObserver.attachChange(function(E){var w=E.getParameter("path").split("/");var V=E.getParameter("value");var x=w.shift();var y=this.getPropertyEditorsByNameSync(x)||[];y.forEach(function(z){if(w[0]==="value"){z.setValue(V);}else{var A=E.getSource().getObject();var D=m(f(A[x]),"value");b.set(w,V,D);z.setConfig(D);}});},this);var t=this.getContent();if(t.length===0||t.length===1&&t[0]===this._oRootWrapper){this.removeAllContent();this._createEditors(this._oConfigObserver.getObject());}this._bInitFinished=true;this._checkReady();}.bind(this));}};B.prototype._createDataModel=function(){var M=new J();M.setDefaultBindingMode("OneWay");return M;};B.prototype._loadI18nBundles=function(e){return this._createPromise(function(p,q){Promise.all(e.map(function(I){return new Promise(function(p,s){n.create({url:sap.ui.require.toUrl(I),async:true}).then(p,s);});})).then(p,q);});};B.prototype._createI18nModel=function(e){var p=e.slice();var I=new R({bundle:p.shift()});I.setDefaultBindingMode("OneWay");p.forEach(function(q){I.enhance(q);});return I;};B.prototype._prepareConfig=function(p){var e={};d(p,function(K,q){e[K]=Object.assign({},this._preparePropertyConfig(q),{__propertyName:K});}.bind(this));return e;};B.prototype._preparePropertyConfig=function(p){var s=this._getContextPath();if(s&&!s.endsWith("/")){s=s+"/";}var e=p.path;if(!e.startsWith("/")&&s){e=s+e;}return Object.assign({},p,{path:e,value:"{"+e+"}"});};B.prototype._createEditors=function(p){var e=b.get(["layout",this.getLayout()],this.getConfig());if(j(e)||Array.isArray(e)){e=r(e,{"i18n":this._oI18nModel});}this._oRootWrapper=new a({config:v(p),layout:this.getLayout(),layoutConfig:e});this.addContent(this._oRootWrapper);return(Promise.all(v(this._mPropertyEditors).reduce(function(q,s){return q.concat(s);},[]).map(function(q){return q.ready();})).then(this._checkReady.bind(this)));};B.prototype._getRegistrationKey=function(p,K){if(typeof K!=="string"){if(p.isA("sap.ui.integration.designtime.baseEditor.PropertyEditor")&&!p.getConfig()&&!p.getBindingInfo("config")&&p.getPropertyName()){K=p.getPropertyName();}else{K=o+p.getId();}}return K;};B.prototype._addCustomProperty=function(K,e){var p=Object.assign({},this._mObservableConfig);p[K]=this._preparePropertyConfig(e);this._mObservableConfig=p;this._oConfigObserver.setObject(p);};B.prototype._removeCustomProperty=function(K){var e=m(this._mObservableConfig,K);this._mObservableConfig=e;this._oConfigObserver.setObject(e);};B.prototype.registerPropertyEditor=function(p,K){K=this._getRegistrationKey(p,K);var e=Array.isArray(this._mPropertyEditors[K])?this._mPropertyEditors[K]:[];this._mPropertyEditors[K]=e.concat(p);if(K.startsWith(o)){this._addCustomProperty(K,p.getConfig());}var V=b.get(K,this._oConfigObserver.getObject()).value;p.setValue(V);p.attachValueChange(this._onValueChange,this);p.attachReady(this._checkReady,this);};B.prototype.deregisterPropertyEditor=function(p,K){K=this._getRegistrationKey(p,K);var e=this._mPropertyEditors[K];if(K.startsWith(o)){this._removeCustomProperty(K);}p.detachValueChange(this._onValueChange,this);if(Array.isArray(e)){this._mPropertyEditors[K]=e.filter(function(I){return p!==I;});if(this._mPropertyEditors[K].length===0){delete this._mPropertyEditors[K];}}};B.prototype._setReady=function(e){var p=this._bIsReady;this._bIsReady=e;if(p!==true&&e===true){this.firePropertyEditorsReady({propertyEditors:this.getPropertyEditorsSync()});}};B.prototype._checkReady=function(){var e=this.getContent().filter(function(E){return(E.isA("sap.ui.integration.designtime.baseEditor.PropertyEditors")||E.isA("sap.ui.integration.designtime.baseEditor.propertyEditor.BasePropertyEditor"));});e.forEach(function(E){if(!sap.ui.base.EventProvider.hasListener(E,"ready",this._checkReady,this)){E.attachReady(this._checkReady,this);}},this);var A=[].concat(e,this.getPropertyEditorsSync());var I=(this._bInitFinished&&A.every(function(E){return E.isReady();}));this._setReady(I);};B.prototype.isReady=function(){return this._bIsReady;};B.prototype.ready=function(){return new Promise(function(e){if(this.isReady()){e();}else{this.attachEventOnce("propertyEditorsReady",e);}}.bind(this));};B.prototype._createPromise=function(e){var p=c(e);this._aCancelHandlers.push(p.cancel);var q=function(s,t){this._aCancelHandlers=this._aCancelHandlers.filter(function(e){return e!==s;});return t;}.bind(this,p.cancel);return p.promise.then(q,q);};B.prototype.getPropertyConfigByName=function(p){return m(b.get(p,this._oConfigObserver.getObject()),"value");};B.prototype.getPropertyEditorsByName=function(p){return new Promise(function(e){if(!this._mPropertyEditors||Object.keys(this._mPropertyEditors).length===0){this.attachEventOnce("propertyEditorsReady",e);}else{e();}}.bind(this)).then(function(){return this.getPropertyEditorsByNameSync(p);}.bind(this));};B.prototype.getPropertyEditorsByNameSync=function(p){var e=this._mPropertyEditors[p];return Array.isArray(e)&&e.slice()||null;};B.prototype.getPropertyEditorsByTag=function(t){return new Promise(function(e){if(!this._mPropertyEditors||Object.keys(this._mPropertyEditors).length===0){this.attachEventOnce("propertyEditorsReady",e);}else{e();}}.bind(this)).then(function(){return this.getPropertyEditorsByTagSync(t);}.bind(this));};B.prototype.getConfigsByTag=function(t){var p=this.getConfig().properties;return Object.keys(p).filter(function(s){return h(p[s],t);}).map(function(s){return p[s];});};B.prototype.getPropertyEditorsByTagSync=function(t){return this.getPropertyEditorsSync().filter(function(p){return h(p.getConfig(),t);});};B.prototype.getPropertyEditorsSync=function(){return v(this._mPropertyEditors).reduce(function(e,p){return e.concat(p);},[]).sort(function(p,e){return parseInt(p.getId().match(/\d+$/))-parseInt(e.getId().match(/\d+$/));});};B.prototype.getJson=function(){return _({},this.getProperty("json"));};B.prototype._getContextPath=function(){var e=this.getConfig();var s=e&&e.context||null;if(s&&s[0]!=="/"){s="/"+s;}return s;};B.prototype._onValueChange=function(e){var p=e.getSource();var s=e.getParameter("path");var q=this.getJson()||{};var V=e.getParameter("value");if(s[0]==="/"){s=s.substr(1);}else{throw new Error("BaseEditor._onValueChange: unknown relative path - '"+s+"'");}var t=s.split("/");b.set(t,V,q);if(typeof V==="undefined"||g(V,p.getRuntimeConfig().defaultValue)||Array.isArray(V)&&V.length===0||j(V)&&k(V)){u(q,t);}this.setJson(q);};return B;});

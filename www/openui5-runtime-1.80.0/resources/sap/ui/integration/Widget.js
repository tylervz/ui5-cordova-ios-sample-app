/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/Core","sap/ui/core/Control","sap/ui/integration/util/Manifest","sap/base/Log","sap/ui/integration/WidgetRenderer","sap/base/util/LoaderExtensions","sap/ui/core/ComponentContainer","sap/ui/integration/util/Destinations"],function(q,C,a,W,L,b,c,d,D){"use strict";var M={APP_TYPE:"/sap.app/type",PARAMS:"/sap.widget/configuration/parameters"};var e=a.extend("sap.ui.integration.Widget",{metadata:{library:"sap.ui.integration",properties:{manifest:{type:"any",defaultValue:""},parameters:{type:"object",defaultValue:null},baseUrl:{type:"string",defaultValue:""},manifestChanges:{type:"object[]"}},aggregations:{_content:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},associations:{host:{}},events:{action:{parameters:{actionSource:{type:"sap.ui.core.Control"},manifestParameters:{type:"object"},parameters:{type:"object"}}},manifestReady:{parameters:{}}}},renderer:b});e.prototype.init=function(){this.setBusyIndicatorDelay(0);};e.prototype.onBeforeRendering=function(){if(this._bApplyManifest){this._bApplyManifest=false;var m=this.getManifest();if(!m){this.destroyManifest();}else{this.createManifest(m,this.getBaseUrl());}}};e.prototype.exit=function(){this.destroyManifest();};e.prototype.destroyManifest=function(){if(this._oWidgetManifest){this._oWidgetManifest.destroy();this._oWidgetManifest=null;}this.destroyAggregation("_content");};e.prototype.setManifest=function(v){this.setProperty("manifest",v);this._bApplyManifest=true;return this;};e.prototype.setManifestChanges=function(v){this.setProperty("manifestChanges",v);this._bApplyManifest=true;return this;};e.prototype.setParameters=function(v){this.setProperty("parameters",v);this._bApplyManifest=true;return this;};e.prototype.getManifest=function(){var v=this.getProperty("manifest");if(v&&typeof v==="object"){return q.extend(true,{},v);}return v;};e.prototype.getManifestWithMergedChanges=function(){if(!this._oWidgetManifest||!this._oWidgetManifest._oManifest){L.error("The manifest is not ready. Consider using the 'manifestReady' event.","sap.ui.integration.Widget");return{};}return q.extend(true,{},this._oWidgetManifest._oManifest.getRawJson());};e.prototype.createManifest=function(m,B){var o={};this._isManifestReady=false;if(typeof m==="string"){o.manifestUrl=m;m=null;}this.setBusy(true);this._oWidgetManifest=new W("sap.widget",m,B,this.getManifestChanges());return this._oWidgetManifest.load(o).then(function(){this._isManifestReady=true;this.fireManifestReady();this._applyManifest();}.bind(this)).catch(this._applyManifest.bind(this));};e.prototype.getParameters=function(){var v=this.getProperty("parameters");if(v&&typeof v==="object"){return q.extend(true,{},v);}return v;};e.prototype.getCombinedParameters=function(){if(!this._isManifestReady){L.error("The manifest is not ready. Consider using the 'manifestReady' event.","sap.ui.integration.widgets.Card");return null;}var p=this._oWidgetManifest.getProcessedParameters(this.getProperty("parameters")),r={},k;for(k in p){r[k]=p[k].value;}return r;};e.prototype.getManifestEntry=function(p){if(!this._isManifestReady){L.error("The manifest is not ready. Consider using the 'manifestReady' event.","sap.ui.integration.Widget");return null;}return this._oWidgetManifest.get(p);};e.prototype.getHostInstance=function(){var h=this.getHost();if(!h){return null;}return C.byId(h);};e.prototype.resolveDestination=function(k){var o=this._oWidgetManifest.get("/sap.widget/configuration/destinations"),f=new D(this.getHostInstance(),o);return f.getUrl(k);};e.prototype._applyManifest=function(){var p=this.getParameters(),A=this._oWidgetManifest.get(M.APP_TYPE);if(A&&A!=="widget"){L.error("sap.app/type entry in manifest is not 'widget'");}this._registerManifestModulePath();this._oWidgetManifest.processParameters(p);return this._createComponent(this._oWidgetManifest.getJson(),this.getBaseUrl());};e.prototype._registerManifestModulePath=function(){if(!this._oWidgetManifest){return;}var A=this._oWidgetManifest.get("/sap.app/id");if(A){c.registerResourcePath(A.replace(/\./g,"/"),this._oWidgetManifest.getUrl());}else{L.error("Widget sap.app/id entry in the manifest is mandatory");}};e.prototype._createComponent=function(m,B){var o={manifest:m};if(B){o.url=B;o.altManifestUrl=B;}return sap.ui.core.Component.load(o).then(function(f){var g=f(),h=new d({component:g.getId()});if(g.onWidgetReady){g.onWidgetReady(this);}h.attachEvent("action",function(E){var p=E.getParameter("parameters");this.fireEvent("action",{actionSource:E.getParameter("actionSource"),manifestParameters:p,parameters:p});}.bind(this));this.setAggregation("_content",h);this.setBusy(false);this.fireEvent("_ready");}.bind(this));};e.prototype.loadDesigntime=function(){if(!this._oWidgetManifest){return Promise.reject("Manifest not yet available");}var A=this._oWidgetManifest.get("/sap.app/id");if(!A){return Promise.reject("App id not maintained");}var m=A.replace(/\./g,"/");return new Promise(function(r,f){var s=m+"/"+(this._oWidgetManifest.get("/sap.widget/designtime")||"designtime/Widget.designtime");if(s){sap.ui.require([s,"sap/base/util/deepClone"],function(o,g){r({designtime:o,manifest:g(this._oWidgetManifest.oJson,30)});}.bind(this),function(){f({error:s+" not found"});});}else{f();}}.bind(this));};return e;});

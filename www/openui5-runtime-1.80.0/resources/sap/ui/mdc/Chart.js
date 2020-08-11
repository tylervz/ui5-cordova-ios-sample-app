/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Core","sap/ui/mdc/Control","sap/ui/base/SyncPromise","sap/ui/mdc/util/loadModules","./ChartRenderer","sap/ui/base/ManagedObjectObserver","sap/ui/model/json/JSONModel","sap/ui/mdc/library","sap/ui/model/base/ManagedObjectModel","sap/ui/model/Sorter","sap/base/Log","sap/base/util/deepEqual","sap/ui/Device","sap/ui/mdc/chart/ToolbarHandler"],function(C,a,S,l,b,M,J,c,d,e,L,f,D,T){"use strict";var g,h,m,n,o,F="sap.ui.mdc.IFilter";var p=a.extend("sap.ui.mdc.Chart",{metadata:{library:"sap.ui.mdc",defaultAggregation:"items",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%",invalidate:true},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%",invalidate:true},delegate:{type:"object",group:"Data",defaultValue:{name:"sap/ui/mdc/ChartDelegate"}},header:{type:"string",group:"Misc",defaultValue:null},noDataText:{type:"string"},chartType:{type:"string",group:"Misc",defaultValue:"column"},selectionMode:{type:"string",group:"Misc",defaultValue:"MULTIPLE"},p13nMode:{type:"sap.ui.mdc.ChartP13nMode[]"},legendVisible:{type:"boolean",group:"Misc",defaultValue:true},vizProperties:{type:"object",group:"Misc"},_colorings:{type:"object",visibility:"_hidden",byValue:true},ignoreToolbarActions:{type:"sap.ui.mdc.ChartToolbarActionType[]",defaultValue:[]},minWidth:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"240px",invalidate:true},minHeight:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"400px",invalidate:true},sortConditions:{type:"object"}},aggregations:{data:{multiple:true},items:{type:"sap.ui.mdc.chart.Item",multiple:true},actions:{type:"sap.ui.core.Control",multiple:true,forwarding:{idSuffix:"--toolbar",aggregation:"actions"}},_chart:{type:"sap.chart.Chart",multiple:false},_toolbar:{type:"sap.ui.mdc.ActionToolbar",multiple:false},_breadcrumbs:{type:"sap.m.Breadcrumbs",multiple:false},selectionDetailsActions:{type:"sap.ui.mdc.chart.SelectionDetailsActions",multiple:false}},associations:{filter:{type:F,multiple:false}},events:{selectionDetailsActionPressed:{parameters:{action:{type:"sap.ui.core.Item"},itemContexts:{type:"sap.ui.model.Context"},level:{type:"sap.m.SelectionDetailsActionLevel"}}}}}});p.prototype.init=function(){this._oObserver=new M(this.update.bind(this));this._oAdaptationController=null;this._oObserver.observe(this,{aggregations:["items","_chart"],properties:["ignoreToolbarActions","p13nMode"]});this._oManagedObjectModel=new d(this);this.setModel(this._oManagedObjectModel,"$mdcChart");a.prototype.init.apply(this,arguments);};p.prototype.initModules=function(i){this.initControlDelegate(i[0]);g=i[1];n=i[2];o=i[3];};function q(){return["sap/chart/Chart","sap/ui/mdc/chart/ChartTypeButton","sap/ui/mdc/chart/MeasureItem"];}p.prototype.applySettings=function(s,i){if(s){delete s.actions;}var j=(s&&s.delegate)||this.getDelegate();var k=j&&j.name;var r=[k].concat(q());this.oChartPromise=l(r).then(function onModulesLoaded(t){this.initModules(t);if(this.bIsDestroyed){return S.reject();}return this.getControlDelegate().fetchProperties(this);}.bind(this)).then(function createInnerChart(P){if(this.bIsDestroyed){return S.reject();}var A=s&&s.actions;T.createToolbar(this,A);this._createDrillBreadcrumbs();var I={};P.forEach(function(t){I[t.name]=t;});return this._createInnerChart(s,I);}.bind(this)).catch(function applySettingsHandleException(E){if(E){L.error("The control could not be initialized.",E,this.getMetadata().getName());}}.bind(this));return a.prototype.applySettings.apply(this,arguments);};p.prototype.bindAggregation=function(N,B,s){if(N=="data"){this.oDataInfo=B;var i=this.getAggregation("_chart");if(i&&this.bDelegateInitialized){this.getControlDelegate().rebindChart(this,B,s);}else if(this.oChartPromise){this.oChartPromise.then(function(i){this.getControlDelegate().rebindChart(this,B,s);}.bind(this));}return this;}return a.prototype.bindAggregation.apply(this,arguments);};p.prototype.getBindingInfo=function(N){if(N=="data"){return this.oDataInfo;}return a.prototype.getBindingInfo.apply(this,arguments);};p.prototype.setLegendVisible=function(v){this.setVizProperties({'legend':{'visible':v},'sizeLegend':{'visible':v}});return this.setProperty("legendVisible",v);};p.prototype._createInnerChart=function(s,I){s=s||{};var k={},r,v=[],t=[],u=[],V={};k.chartType='{$mdcChart>/chartType}';k.dimensions=[];k.measures=[];k.id=this.getId()+"--innerChart";k.height='100%';k.width='100%';k.vizProperties='{$mdcChart>/vizProperties}';s.items=s.items||[];function w(j){if(this&&this.getVizItemType()=="Dimension"){k.dimensions.push(j);}else{k.measures.push(j);}}function x(r,z){if(r.getCriticality()){z._addCriticality(r);}u.push(r.getKey());if(r.getAdditionalColoringMeasures){for(var j=0;j<r.getAdditionalColoringMeasures().length;j++){if(t.indexOf(r.getAdditionalColoringMeasures()[j])==-1){t.push(r.getAdditionalColoringMeasures()[j]);}}}}function y(){var K,j;for(var i=0;i<t.length;i++){K=t[i];if(u.indexOf(K)==-1){j=this.getControlDelegate().retrieveAggregationItem("items",I[K]);j=o.getVizItemSettings(j.settings);v.push(o.createVizChartItem(j).then(w));}}}for(var i=0;i<s.items.length;i++){r=s.items[i];x(r,this);if(I[r.getKey()]){V=this.getControlDelegate().retrieveAggregationItem("items",I[r.getKey()]).settings;}else{V=undefined;}v.push(r.toVizChartItem(V).then(w.bind(r)));}y();var W=new Promise(function(j){sap.ui.require(["sap/ui/fl/apply/api/FlexRuntimeInfoAPI"],function(z){if(!z.isFlexSupported({element:this})){return Promise.resolve();}z.waitForChanges({element:this}).then(function(){return j();});}.bind(this));}.bind(this));return Promise.all(v,W).then(function(){var j=new g(k);j.setVisibleDimensions([]);j.setVisibleMeasures([]);j.setInResultDimensions([]);this._oObserver.observe(j,{bindings:["data"],aggregations:["dimensions","measures"]});this.setAggregation("_chart",j);return j;}.bind(this));};p.prototype.setSelectionMode=function(v){var i=this.getAggregation("_chart");if(i){i.setSelectionMode(v);if(v!=="NONE"){this._prepareSelection();}}else if(this.oChartPromise){this.oChartPromise.then(function(i){if(i){i.setSelectionMode(v);if(v!=="NONE"){this._prepareSelection();}}}.bind(this));}return this.setProperty("selectionMode",v,true);};p.prototype.addItem=function(i,s){var j=this.getAggregation("_chart");if(j){i.toChart(j);}else if(this.oChartPromise){this.oChartPromise.then(function(j){if(j){this.toChart(j);}}.bind(i));}this._oObserver.observe(i,{properties:["visible","inResult","role"]});return this.addAggregation("items",i,s);};p.prototype.insertItem=function(i,I,s){if(i.getCriticality()){this._addCriticality(i);}var j=this.getAggregation("_chart");if(j){i.toChart(j);}else if(this.oChartPromise){this.oChartPromise.then(function(j){if(j){this.toChart(j);}}.bind(i));}this._oObserver.observe(i,{properties:["visible","inResult","role"]});return this.insertAggregation("items",i,I,s);};p.prototype.removeItem=function(i,s){this._oObserver.unobserve(i);return this.removeAggregation("items",i,s);};p.prototype.exit=function(){a.prototype.exit.apply(this,arguments);if(this._oAdaptationController){this._oAdaptationController.destroy();this._oAdaptationController=null;}this.oChartPromise=null;var i=this.getAggregation("_chart");if(i){i.destroy();}};p.prototype.getItemsByKeys=function(I){var j=[],k=this.getItems();I.forEach(function(s){for(var i=k.length-1;i>=0;i--){if(k[i].getKey()==s){j.push(k[i]);break;}}});return j;};p.prototype._showDrillDown=function(){if(m){if(!this._oDrillDownPopover){m.createDrillDownPopover(this);}return m.showDrillDownPopover(this);}return new Promise(function(r,i){sap.ui.require(["sap/ui/mdc/chart/DrillStackHandler"],function(j){m=j;m.createDrillDownPopover(this);m.showDrillDownPopover(this).then(function(k){r(k);});}.bind(this));}.bind(this));};p.prototype._createDrillBreadcrumbs=function(){if(m){if(!this._oDrillBreadcrumbs){return m.createDrillBreadcrumbs(this);}return Promise.resolve(this._oDrillBreadcrumbs);}return new Promise(function(r,i){sap.ui.require(["sap/ui/mdc/chart/DrillStackHandler"],function(j){m=j;m.createDrillBreadcrumbs(this).then(function(){r();});}.bind(this));}.bind(this));};p.prototype._getPropertyData=function(){return new Promise(function(r,i){if(!this.aFetchedProperties){return this.oChartPromise.then(function(){return this.getControlDelegate().fetchProperties(this);}.bind(this)).then(function(j){this.aFetchedProperties=j;r(j);}.bind(this));}else{r(this.aFetchedProperties);}}.bind(this));};p.prototype.getAvailableChartTypes=function(){var j=[];var k=this.getAggregation("_chart");if(k){var A=k.getAvailableChartTypes().available;if(j){var r=C.getLibraryResourceBundle("sap.chart.messages");for(var i=0;i<A.length;i++){var t=A[i].chart;j.push({key:t,icon:n.mMatchingIcon[t],text:r.getText("info/"+t),selected:(t==this.getChartType())});}}}return j;};p.prototype.getTypeInfo=function(){var t=this.getChartType(),i=C.getLibraryResourceBundle("sap.ui.mdc");var I={icon:n.mMatchingIcon[t],text:i.getText("chart.CHART_TYPE_TOOLTIP",[t])};return I;};p.prototype.getManagedObjectModel=function(){return this._oManagedObjectModel;};p.prototype.update=function(i){var j=this.getAggregation("_chart");if(j){this._update(j,i);}else if(this.oChartPromise){this.oChartPromise.then(function(j){if(j){this._update(j,i);}}.bind(this));}};p.prototype._update=function(j,k){var I=this.getItems(),v,r,V=[],s=[],t=[],u={};if(k.name==="ignoreToolbarActions"||k.name==="p13nMode"){T.updateToolbar(this);return;}if(k.name==="data"&&k.type==="binding"&&k.mutation==="prepare"&&k.object.isA("sap.chart.Chart")){k.bindingInfo.sorter=this._getSorters();}this._aInResultProperties=[];for(var i=0;i<I.length;i++){r=I[i];v=r.getVizItemType()=="Measure"?j.getMeasureByName(r.getKey()):j.getDimensionByName(r.getKey());if(!v){continue;}if(r.getVisible()){if(r.getVizItemType()=="Measure"){V.push(v.getName());if(r.getDataPoint()){u[v.getName()]=r.getDataPoint();}}else{s.push(v.getName());}this._aInResultProperties.push(v.getName());}if(r.getVizItemType()=="Dimension"){if(r.getInResult()){t.push(v.getName());this._aInResultProperties.push(v.getName());}}}var R=false;if(!f(s,j.getVisibleDimensions())){j.setVisibleDimensions(s);R=true;}if(!f(V,j.getVisibleMeasures())){j.setVisibleMeasures(V);R=true;}if(!f(t,j.getInResultDimensions())){j.setInResultDimensions(t);R=true;}if(R){this._rebind();this._updateSemanticalPattern(j,V,u);this._updateColoring(j,s,V);}if(m&&this.getAggregation("_breadcrumbs")){m._updateDrillBreadcrumbs(this,this.getAggregation("_breadcrumbs"));}};p.prototype._updateSemanticalPattern=function(i,v,j){for(var k=0;k<v.length;k++){var r=j[v[k]];if(r){if(r.targetValue||r.foreCastValue){var A=i.getMeasureByName(v[k]);A.setSemantics("actual");if(r.targetValue!=null){var R=i.getMeasureByName(r.targetValue);if(R){R.setSemantics("reference");}else{L.error("sap.ui.mdc.Chart: "+r.targetValue+" is not a valid measure");}}if(r.foreCastValue){var P=i.getMeasureByName(r.foreCastValue);if(P){P.setSemantics("projected");}else{L.error("sap.ui.comp.SmartChart: "+r.ForecastValue.Path+" is not a valid measure");}}A.setSemanticallyRelatedMeasures({referenceValueMeasure:r.targetValue,projectedValueMeasure:r.foreCastValue});}}}};p.prototype._updateColoring=function(i,v,V,j){var r=this.getProperty("_colorings"),k;if(r&&r.Criticality){var A;for(k=0;k<v.length;k++){if(r.Criticality.DimensionValues[v[k]]){A={coloring:"Criticality",parameters:{dimension:v[k]}};delete r.Criticality.MeasureValues;break;}}if(!A){delete r.Criticality.DimensionValues;for(var s in r.Criticality.MeasureValues){if(V.indexOf(s)==-1){delete r.Criticality.MeasureValues[s];}}A={coloring:"Criticality",parameters:{measure:V}};}if(A){i.setColorings(r);i.setActiveColoring(A);}}};p.prototype._prepareSelection=function(){if(h){h.prepareChart(this);}else{if(!this.oSelectionHandlerPromise){this.oSelectionHandlerPromise=new Promise(function(r,i){sap.ui.require(["sap/ui/mdc/chart/SelectionHandler"],function(j){h=j;r(true);});});}this.oSelectionHandlerPromise.then(function(){h.prepareChart(this);}.bind(this));}};p.prototype._getSorters=function(){var s;var i=this.getSortConditions()?this.getSortConditions().sorters:[];i.forEach(function(j){if(this._aInResultProperties.indexOf(j.name)!=-1){var k=new e(j.name,j.descending);if(s){s.push(k);}else{s=[k];}}}.bind(this));return s;};p.prototype._rebind=function(){if(!this.isInnerChartBound()){return;}var B=this.oDataInfo;if(B){if(this.bDelegateInitialized){this.getControlDelegate().updateBindingInfo(this,B);}B.sorter=this._getSorters();B.binding.bHasAnalyticalInfo=true;}this.bindAggregation("data",B);this._updateInnerChartNoDataText();this._renderOverlay(false);};p.prototype.setFilter=function(v){if(this._validateFilter(v)){this._deregisterFilter();this.setAssociation("filter",v,true);this._registerFilter();this._updateInnerChartNoDataText();}return this;};p.prototype._validateFilter=function(v){var i=typeof v==="object"?v:C.byId(v);if(!i||i.isA(F)){return true;}throw new Error("\""+v+"\" is not valid for association \"filter\" of mdc.Chart. Please use an object that implements \""+F+"\" interface");};p.prototype._registerFilter=function(){var i=C.byId(this.getFilter());if(i){i.attachSearch(this._rebind,this);i.attachFiltersChanged(this._onFiltersChanged,this);}};p.prototype._deregisterFilter=function(){var i=C.byId(this.getFilter());if(i){i.detachSearch(this._rebind,this);i.detachFiltersChanged(this._onFiltersChanged,this);}};p.prototype.isInnerChartBound=function(){return this.getAggregation("_chart")?this.getAggregation("_chart").isBound("data"):false;};p.prototype._onFiltersChanged=function(E){if(this.isInnerChartBound()&&E.getParameter("conditionsBased")){this._renderOverlay(true);}};p.prototype._renderOverlay=function(s){if(this.getAggregation("_chart")){var $=this.getAggregation("_chart").$(),i=$.find(".sapUiMdcChartOverlay");if(s&&i.length===0){i=jQuery("<div>").addClass("sapUiOverlay sapUiMdcChartOverlay").css("z-index","1");$.append(i);}else if(!s){i.remove();}}};p.prototype.setNoDataText=function(N){this.setProperty("noDataText",N,true);this._updateInnerChartNoDataText();return this;};p.prototype._updateInnerChartNoDataText=function(){var i=this.getAggregation("_chart");if(!i){return;}i.setCustomMessages({'NO_DATA':this._getNoDataText()});};p.prototype._getNoDataText=function(){var N=this.getNoDataText();if(N){return N;}var r=C.getLibraryResourceBundle("sap.ui.mdc");if(!this.isInnerChartBound()){if(this.getFilter()){return r.getText("chart.NO_DATA_WITH_FILTERBAR");}return r.getText("chart.NO_DATA");}return r.getText("chart.NO_RESULTS");};p.prototype._addCriticality=function(i){var j=this.getProperty("_colorings");j=j||{Criticality:{DimensionValues:{},MeasureValues:{}}};var k=i.getCriticality(),r={};if(i.getVizItemType()=="Dimension"){for(var K in k){r[K]={Values:k[K]};}j.Criticality.DimensionValues[i.getKey()]=r;}else{for(var K in k){r[K]=k[K];}j.Criticality.MeasureValues[i.getKey()]=r;}this.setProperty("_colorings",j);};p.prototype.getCollectionModel=function(){var B=this.getBindingInfo("data");return B?this.getModel(B.model):null;};p.prototype.getCollectionPath=function(){var B=this.getBindingInfo("data");return B?B.path:null;};p.prototype.done=function(){return this.oChartPromise;};return p;},true);
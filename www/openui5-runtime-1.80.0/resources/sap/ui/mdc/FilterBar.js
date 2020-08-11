/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/filterbar/aligned/FilterContainer","sap/ui/mdc/filterbar/aligned/FilterItemLayout","sap/ui/mdc/filterbar/FilterBarBase","sap/ui/mdc/filterbar/FilterBarBaseRenderer",'sap/m/library','sap/m/Button'],function(F,a,b,c,l,B){"use strict";var d=b.extend("sap.ui.mdc.FilterBar",{metadata:{designtime:"sap/ui/mdc/designtime/filterbar/FilterBar.designtime",properties:{showAdaptFiltersButton:{type:"boolean",defaultValue:true},showGoButton:{type:"boolean",defaultValue:true},p13nMode:{type:"sap.ui.mdc.FilterBarP13nMode[]"},_p13nModeItem:{type:"boolean",visibility:"hidden",defaultValue:false},_p13nModeValue:{type:"boolean",visibility:"hidden",defaultValue:false}}},renderer:c});var e=l.ButtonType;d.prototype._createInnerLayout=function(){this._cLayoutItem=a;this._oFilterBarLayout=new F();this._oFilterBarLayout.getInner().setParent(this);this._oFilterBarLayout.getInner().addStyleClass("sapUiMdcFilterBarBaseAFLayout");this.setAggregation("layout",this._oFilterBarLayout,true);this._addButtons();};d.prototype.setP13nMode=function(m){var o=this.getP13nMode();this.setProperty("p13nMode",m||[],false);m&&m.forEach(function(M){if(!o||o.indexOf(M)<0){this._setP13nMode(M,true);}}.bind(this));o&&o.forEach(function(M){if(!m||m.indexOf(M)<0){this._setP13nMode(M,false);}}.bind(this));return this;};d.prototype._setP13nMode=function(m,v){switch(m){case"Item":this._setP13nModeItem(v);break;case"Value":this._setP13nModeValue(v);break;}};d.prototype._getP13nModeItem=function(){return this._oModel.getProperty("/_p13nModeItem");};d.prototype._setP13nModeItem=function(v){this._oModel.setProperty("/_p13nModeItem",v,true);};d.prototype._getP13nModeValue=function(){return this._oModel.getProperty("/_p13nModeValue");};d.prototype._setP13nModeValue=function(v){this._oModel.setProperty("/_p13nModeValue",v,false);this.bPersistValues=v;};d.prototype._addButtons=function(){if(this._oFilterBarLayout){this.setProperty("_filterCount",this._oRb.getText("filterbar.ADAPT"),false);this._btnAdapt=new B(this.getId()+"-btnAdapt",{type:e.Transparent,text:"{"+b.INNER_MODEL_NAME+">/_filterCount}",press:this.onAdaptFilters.bind(this)});this._btnAdapt.setModel(this._oModel,b.INNER_MODEL_NAME);this._btnAdapt.bindProperty("visible",{parts:[{path:'/showAdaptFiltersButton',model:b.INNER_MODEL_NAME},{path:"/_p13nModeItem",model:b.INNER_MODEL_NAME}],formatter:function(v,V){return v&&V;}});this._btnAdapt.addStyleClass("sapUiMdcFilterBarBaseButtonPaddingRight");this._oFilterBarLayout.addButton(this._btnAdapt);this._btnSearch=new B(this.getId()+"-btnSearch",{text:this._oRb.getText("filterbar.GO"),press:this.onSearch.bind(this),type:e.Emphasized});this._btnSearch.setModel(this._oModel,b.INNER_MODEL_NAME);this._btnSearch.bindProperty("visible",{parts:[{path:'/showGoButton',model:b.INNER_MODEL_NAME},{path:"/liveMode",model:b.INNER_MODEL_NAME}],formatter:function(v,V){return v&&((this._isPhone())?true:!V);}.bind(this)});this._oFilterBarLayout.addButton(this._btnSearch);}};return d;});

/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/UIComponent","sap/ui/core/ComponentContainer","sap/ui/core/mvc/XMLView","sap/ui/rta/command/CommandFactory","sap/ui/dt/DesignTime","sap/ui/dt/DesignTimeStatus","sap/ui/dt/OverlayRegistry","sap/ui/fl/ChangePersistence","sap/ui/model/Model","sap/ui/fl/registry/Settings","sap/ui/fl/write/api/PersistenceWriteAPI","sap/ui/fl/Cache","sap/ui/fl/Layer","sap/ui/thirdparty/sinon-4","sap/ui/fl/library"],function(U,C,X,a,D,b,O,c,M,S,P,d,L,s){"use strict";var e=function(m,o){if(e._only&&(m.indexOf(e._only)<0)){return;}if(typeof o.xmlView==="string"){o.xmlView={viewContent:o.xmlView};}var f=s.sandbox.create();o.before=o.before||function(){};o.after=o.after||function(){};QUnit.module(m,function(){QUnit.test("When using the 'controlEnablingCheck' function to test if your control is ready for UI adaptation at runtime",function(v){v.ok(o.afterAction,"then you implement a function to check if your action has been successful: See the afterAction parameter.");v.ok(o.afterUndo,"then you implement a function to check if the undo has been successful: See the afterUndo parameter.");v.ok(o.afterRedo,"then you implement a function to check if the redo has been successful: See the afterRedo parameter.");v.ok(o.xmlView,"then you provide an XML view to test on: See the.xmlView parameter.");var x=new DOMParser().parseFromString(o.xmlView.viewContent,"application/xml").documentElement;v.ok(x.tagName.match("View$"),"then you use the sap.ui.core.mvc View tag as the first tag in your view");v.ok(o.action,"then you provide an action: See the action parameter.");v.ok(o.action.name,"then you provide an action name: See the action.name parameter.");v.ok(o.action.controlId||o.action.control,"then you provide the control or control's id to operate the action on: See the action.controlId.");});});var g="sap.ui.rta.control.enabling.comp";var h=false;var A=true;var i=U.extend(g,{metadata:{manifest:{"sap.app":{id:g,type:"application"},getEntry:function(){return{type:"application"};}}},createContent:function(){var v=Object.assign({},o.xmlView);v.id=this.createId("view");if(v.async===undefined){v.async=this.getComponentData().async;}var V=new X(v);return V;}});function j(v){this.oUiComponent=new i({id:"comp",componentData:{async:v}});this.oUiComponentContainer=new C({component:this.oUiComponent,height:'100%'});this.oUiComponentContainer.placeAt(o.placeAt||"qunit-fixture");this.oView=this.oUiComponent.getRootControl();if(o.model instanceof M){this.oView.setModel(o.model);}sap.ui.getCore().applyChanges();return Promise.all([this.oView.loaded(),o.model&&o.model.getMetaModel()&&o.model.getMetaModel().loaded()]);}function k(v){var x=[];if(o.previousActions){x=x.concat(o.previousActions);}x.push(o.action);var y=[];return x.reduce(function(z,B){return z.then(l.bind(this,v,B)).then(function(E){y.push(E);});}.bind(this),Promise.resolve()).then(function(){return y;});}function l(v,x){return Promise.resolve().then(function(){var y;var z;var E;if(typeof x.control==="function"){y=x.control(this.oView);}else{y=this.oView.byId(x.controlId);}var B=x.name;return y.getMetadata().loadDesignTime(y).then(function(){if(x.parameter){if(typeof x.parameter==="function"){z=x.parameter(this.oView);}else{z=x.parameter;}}else{z={};}sap.ui.getCore().applyChanges();this.oDesignTime=new D({rootElements:[this.oView]});return new Promise(function(F){this.oDesignTime.attachEventOnce("synced",function(){var G=O.getOverlay(y);E=G.getDesignTimeMetadata();var R=E.getAction("getResponsibleElement",y);var H;if(x.name==="move"){var I=O.getOverlay(z.movedElements[0].element);var J=I.getRelevantContainer();y=J;E=I.getParentAggregationOverlay().getDesignTimeMetadata();}else if(x.name==="addODataProperty"){var K=E.getActionDataFromAggregations("addODataProperty",y);v.equal(K.length,1,"there should be only one aggregation with the possibility to do addODataProperty action");H=G.getAggregationOverlay(K[0].aggregation);E=H.getDesignTimeMetadata();}else if(Array.isArray(x.name)){var N=E.getActionDataFromAggregations(x.name[0],y,undefined,x.name[1]);v.equal(N.length,1,"there should be only one aggregation with the possibility to do an add "+x.name[1]+" action");H=G.getAggregationOverlay(N[0].aggregation);E=H.getDesignTimeMetadata();B="addDelegateProperty";}else if(R){if(x.name==="reveal"){y=x.revealedElement(this.oView);G=O.getOverlay(x.revealedElement(this.oView));E=G.getDesignTimeMetadata();}else{y=R;G=O.getOverlay(y);E=G.getDesignTimeMetadata();F(y.getMetadata().loadDesignTime(y));}}F();}.bind(this));}.bind(this));}.bind(this)).then(function(){var F=new a({flexSettings:{layer:o.layer||L.CUSTOMER}});return F.getCommandFor(y,B,z,E);}).then(function(F){v.ok(F,"then the registration for action to change type, the registration for change and control type to change handler is available and "+o.action.name+" is a valid action");return F;});}.bind(this)).catch(function(y){throw new Error(y);});}function n(v){return v.reduce(function(x,y){return x.then(y.execute.bind(y));},Promise.resolve());}function u(v){var x=v.slice().reverse();return x.reduce(function(y,z){return y.then(z.undo.bind(z));},Promise.resolve());}function p(v){v.forEach(function(x){x.destroy();});}function q(v,x,y){var R={remainingCommands:[],deletedCommands:[]};if(x.length===1){R.remainingCommands.push(x[0]);return Promise.resolve(R);}var z=x.map(function(B){return B.getPreparedChange();});return P._condense({selector:v,changes:z}).then(function(B){if(o.changesAfterCondensing!==undefined){y.equal(o.changesAfterCondensing,B.length,"after condensing the amount of changes is correct");}var E=B.map(function(F){return F.getId();});x.forEach(function(F){if(E.indexOf(F.getPreparedChange().getId())>-1){R.remainingCommands.push(F);}else{R.deletedCommands.push(F);}});return R;});}function r(v){v.forEach(function(x){var y=x.getPreparedChange();if(x.getAppComponent){P.remove({change:y,selector:x.getAppComponent()});}});}function t(v){var x=[];f.stub(c.prototype,"getChangesForComponent").resolves(x);f.stub(c.prototype,"getCacheKey").resolves("etag-123");return j.call(this,h).then(function(){return k.call(this,v);}.bind(this)).then(function(y){this.aCommands=y;y.forEach(function(z){x.push(z.getPreparedChange());});this.oUiComponentContainer.destroy();return j.call(this,A);}.bind(this));}if(!o.jsOnly){QUnit.module(m+" on async views",{before:function(v){this.hookContext={};return o.before.call(this.hookContext,v);},after:function(v){return o.after.call(this.hookContext,v);},beforeEach:function(){f.stub(S,"getInstance").resolves({_oSettings:{}});},afterEach:function(){this.oUiComponentContainer.destroy();this.oDesignTime.destroy();p(this.aCommands);f.restore();}},function(){QUnit.test("When applying the change directly on the XMLView",function(v){return t.call(this,v).then(function(x){var V=x[0];return o.afterAction(this.oUiComponent,V,v);}.bind(this));});QUnit.test("When executing on XML and reverting the change in JS (e.g. variant switch)",function(v){return t.call(this,v).then(function(){return u(this.aCommands);}.bind(this)).then(function(){r(this.aCommands);}.bind(this)).then(function(){sap.ui.getCore().applyChanges();o.afterUndo(this.oUiComponent,this.oView,v);}.bind(this));});QUnit.test("When executing on XML, reverting the change in JS (e.g. variant switch) and applying again",function(v){return t.call(this,v).then(function(){return q(this.oView,this.aCommands,v);}.bind(this)).then(function(x){this.aRemainingCommands=x.remainingCommands;return u(this.aCommands);}.bind(this)).then(function(){r(this.aCommands);}.bind(this)).then(function(){return n(this.aRemainingCommands);}.bind(this)).then(function(){sap.ui.getCore().applyChanges();o.afterRedo(this.oUiComponent,this.oView,v);}.bind(this));});});}function w(v){if(v.getStatus()!==b.SYNCED){return new Promise(function(R){this.oDesignTime.attachEventOnce("synced",R);}.bind(this));}return Promise.resolve();}QUnit.module(m,{before:function(v){this.hookContext={};return o.before.call(this.hookContext,v);},after:function(v){return o.after.call(this.hookContext,v);},beforeEach:function(v){f.stub(c.prototype,"getChangesForComponent").returns(Promise.resolve([]));f.stub(c.prototype,"getCacheKey").returns(d.NOTAG);f.stub(S,"getInstance").returns(Promise.resolve({_oSettings:{}}));return j.call(this,h).then(k.bind(this,v)).then(function(x){this.aCommands=x;}.bind(this));},afterEach:function(){this.oDesignTime.destroy();this.oUiComponentContainer.destroy();p(this.aCommands);f.restore();}},function(){QUnit.test("When executing the underlying command on the control at runtime",function(v){return n(this.aCommands).then(w.bind(this,this.oDesignTime)).then(function(){sap.ui.getCore().applyChanges();return o.afterAction(this.oUiComponent,this.oView,v);}.bind(this));});QUnit.test("When executing and undoing the command",function(v){return n(this.aCommands).then(w.bind(this,this.oDesignTime)).then(u.bind(null,this.aCommands)).then(r.bind(null,this.aCommands)).then(function(){sap.ui.getCore().applyChanges();return o.afterUndo(this.oUiComponent,this.oView,v);}.bind(this));});QUnit.test("When executing, undoing and redoing the command",function(v){return n(this.aCommands).then(w.bind(this,this.oDesignTime)).then(q.bind(this,this.oView,this.aCommands,v)).then(function(x){this.aRemainingCommands=x.remainingCommands;return u(this.aCommands);}.bind(this)).then(r.bind(null,this.aCommands)).then(function(){return n(this.aRemainingCommands);}.bind(this)).then(function(){sap.ui.getCore().applyChanges();return o.afterRedo(this.oUiComponent,this.oView,v);}.bind(this));});});};e.skip=function(){};e.only=function(m){e._only=m;};return e;});
/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./PluginBase","sap/ui/core/Core","sap/ui/base/ManagedObjectObserver"],function(P,C,M){"use strict";var D=P.extend("sap.m.plugins.DataStateIndicator",{metadata:{library:"sap.m",properties:{filter:{type:"function",invalidate:false},messageLinkText:{type:"string",visibility:"hidden"},messageLinkVisible:{type:"boolean",defaultValue:true,visibility:"hidden"}},events:{dataStateChange:{allowPreventDefault:true,parameters:{dataState:{type:"sap.ui.model.DataState"}}}}}});D.prototype.setMessageLinkText=function(l){this.setProperty("messageLinkText",l,true);this._updateMessageLinkControl();return this;};D.prototype.getMessageLinkText=function(){return this.getProperty("messageLinkText");};D.prototype.setMessageLinkVisible=function(v){this.setProperty("messageLinkVisible",v,true);if(this._oLink){this._oLink.setVisible(v);}return this;};D.prototype.getMessageLinkVisible=function(){return this.getProperty("messageLinkVisible");};D.prototype.isApplicable=function(c){if(!c.addAriaLabelledBy||!P.prototype.isApplicable.apply(this,arguments)||!c.getMetadata().getAllPrivateAggregations()["_messageStrip"]||!this._getBindingName()){return false;}return true;};D.prototype.onActivate=function(c){var b=this._getBindingName();var B=c.getBinding(b);if(B){B.attachAggregatedDataStateChange(this._onAggregatedDataStateChange,this);this._processDataState(B.getDataState());}this._oObserver=new M(this._observeChanges.bind(this));this._oObserver.observe(c,{bindings:[b]});};D.prototype.onDeactivate=function(c){var b=this._getBindingName();var B=c.getBinding(b);if(B){B.detachAggregatedDataStateChange(this._onAggregatedDataStateChange,this);B.getDataState().getMessages().forEach(function(m){m.removeControlId(c.getId());});}if(this._oMessageStrip){this._oMessageStrip.destroy();this._oMessageStrip=null;}if(this._oLink){this._oLink.destroy();this._oLink=null;}this._oObserver.unobserve(c,{bindings:[b]});this._oObserver.destroy();this._oObserver=null;};D.prototype.showMessage=function(t,T){if(!this.getEnabled()||!this.getControl()||(!t&&!this._oMessageStrip)){return;}if(this._oMessageStrip){this._oMessageStrip.setText(t).setType(T).setVisible(!!t);return;}sap.ui.require(["sap/m/MessageStrip"],function(a){var c=this.getControl();this._oMessageStrip=new a({showCloseButton:true,showIcon:true}).addStyleClass("sapUiTinyMargin");this._updateMessageLinkControl();c.setAggregation("_messageStrip",this._oMessageStrip);c.addAriaLabelledBy(this._oMessageStrip);this.showMessage(t,T);}.bind(this));};D.prototype._updateMessageLinkControl=function(){if(!this._oMessageStrip){return;}var m=this.getMessageLinkText();if(!m){this._oMessageStrip.setLink(null);return;}else if(this._oLink){this._oLink.setText(m);this._oMessageStrip.setLink(this._oLink);}if(!this._oLink){sap.ui.require(["sap/m/Link"],function(L){this._oLink=new L({text:m,visible:this.getMessageLinkVisible(),press:[function(){this.fireEvent("messageLinkPressed");},this]});this._oMessageStrip.setLink(this._oLink);}.bind(this));}};D.prototype.refresh=function(){if(this.isActive()){var b=this._getBindingName();var B=this.getControl().getBinding(b);if(B){this._processDataState(B.getDataState());}}};D.prototype._getBindingName=function(){return this.getControlPluginConfig("defaultBindingName");};D.prototype._translate=function(b){var B="DATASTATE_"+b;var m=this.getControl().getMetadata();var l=m.getLibraryName();var c=m.getName().split(".").pop().toUpperCase();var r=C.getLibraryResourceBundle(l);var s=c+"_"+B;if(r.hasText(s)){return r.getText(s);}if(l=="sap.m"){return r.getText(B);}return C.getLibraryResourceBundle("sap.m").getText(B);};D.prototype._processDataState=function(d){if(!d||!d.getChanges().messages||!this.fireDataStateChange({dataState:d},true)){return;}var m=d.getMessages();var c=this.getControl();var f=this.getFilter();if(f){m=m.filter(function(o){return f(o,c);});}if(m.length){var F=m[0];var b=this._getBindingName();var B=c.getBinding(b).getPath();var t={None:0,Information:1,Success:2,Warning:4,Error:8};var u=false;var s="";var S=0;var a="";m.forEach(function(o){if(o.getControlIds().indexOf(c.getId())==-1){o.addControlId(c.getId());u=true;}S|=t[o.getType()];});if(m.length==1&&F.getTarget()&&F.getTarget().endsWith(B)){a=F.getMessage();}else{if(S&t.Error&&S&t.Warning){s="ISSUE";}else if(S&t.Error){s="ERROR";}else if(S&t.Warning){s="WARNING";}else if(S&t.Success||S&t.Information){s="NOTIFICATION";}if(s){a=this._translate(s);}}this.showMessage(a,F.getType());if(u){C.getMessageManager().getMessageModel().checkUpdate(false,true);}}else{this.showMessage("");}};D.prototype._onAggregatedDataStateChange=function(e){this._processDataState(e.getParameter("dataState"));};D.prototype._observeChanges=function(c){var b=c.bindingInfo.binding;if(b){var o=(c.mutation=="ready")?"attach":"detach";b[o+"AggregatedDataStateChange"](this._onAggregatedDataStateChange,this);}};P.setConfig({"sap.m.ListBase":{defaultBindingName:"items"},"sap.ui.table.Table":{defaultBindingName:"rows"}},D);return D;});

/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/library","sap/ui/Device","sap/ui/core/InvisibleText","./ListItemBaseRenderer"],function(l,D,I,L){"use strict";var a=l.ListGrowingDirection;var b=l.ListKeyboardMode;var T=l.ToolbarDesign;var c={apiVersion:2};c.ModeOrder={None:0,Delete:1,MultiSelect:-1,SingleSelect:1,SingleSelectLeft:-1,SingleSelectMaster:0};c.render=function(r,C){r.openStart("div",C);r.class("sapMList");if(C.getInset()){r.class("sapMListInsetBG");}r.style("width",C.getWidth());if(C.getBackgroundDesign){r.class("sapMListBG"+C.getBackgroundDesign());}var t=C.getTooltip_AsString();if(t){r.attr("title",t);}var s=C.getStickyStyleValue();if(s){r.class("sapMSticky");r.class("sapMSticky"+s);}this.renderContainerAttributes(r,C);r.openEnd();r.renderControl(C.getAggregation("_messageStrip"));var h=C.getHeaderText();var H=C.getHeaderToolbar();if(H){H.setDesign(T.Transparent,true);H.addStyleClass("sapMListHdr");H.addStyleClass("sapMListHdrTBar");H.addStyleClass("sapMTBHeader-CTX");r.renderControl(H);}else if(h){r.openStart("header",C.getId("header"));r.class("sapMListHdr").class("sapMListHdrText").openEnd();r.text(h);r.close("header");}var o=C.getInfoToolbar();if(o){o.setDesign(T.Info,true);o.addStyleClass("sapMListInfoTBar");r.openStart("div").class("sapMListInfoTBarContainer").openEnd();r.renderControl(o);r.close("div");}var d=C.getItems(),S=C.getShowNoData(),R=C.shouldRenderItems()&&d.length,e=C.getKeyboardMode()==b.Edit?-1:0,u=C.getGrowingDirection()==a.Upwards&&C.getGrowing();if(u){this.renderGrowing(r,C);}this.renderDummyArea(r,C,"before",-1);this.renderListStartAttributes(r,C);r.class("sapMListUl");if(C._iItemNeedsHighlight){r.class("sapMListHighlight");}if(R||S){r.attr("tabindex",e);}r.class("sapMListShowSeparators"+C.getShowSeparators());r.class("sapMListMode"+C.getMode());if(C._iItemNeedsNavigated){r.class("sapMListNavigated");}r.openEnd();this.renderListHeadAttributes(r,C);if(R){if(u){d.reverse();}for(var i=0;i<d.length;i++){r.renderControl(d[i]);}}var v=C.getVisibleItems().length>0;if(S&&(!R||!v)){this.renderNoData(r,C);}this.renderListEndAttributes(r,C);this.renderDummyArea(r,C,"after",e);if(!u){this.renderGrowing(r,C);}if(C.getFooterText()){r.openStart("footer",C.getId("footer")).class("sapMListFtr").openEnd();r.text(C.getFooterText());r.close("footer");}r.close("div");};c.renderContainerAttributes=function(r,C){};c.renderListHeadAttributes=function(r,C){};c.renderListStartAttributes=function(r,C){r.openStart("ul",C.getId("listUl"));r.class("sapMListItems");C.addNavSection(C.getId("listUl"));r.accessibilityState(C,this.getAccessibilityState(C));};c.getAriaRole=function(C){return"listbox";};c.getNoDataAriaRole=function(){return null;};c.getAriaLabelledBy=function(C){var h=C.getHeaderToolbar();if(h){var t=h.getTitleControl();if(t){return t.getId();}}else if(C.getHeaderText()){return C.getId("header");}};c.getAriaDescribedBy=function(C){if(C.getFooterText()){return C.getId("footer");}};c.getAccessibilityState=function(C){var r=this.getAriaRole(C);return{role:r,multiselectable:(r&&C._bSelectionMode)?C.getMode()=="MultiSelect":undefined,labelledby:{value:this.getAriaLabelledBy(C),append:true},describedby:{value:this.getAriaDescribedBy(C),append:true}};};c.renderListEndAttributes=function(r,C){r.close("ul");};c.renderNoData=function(r,C){r.openStart("li",C.getId("nodata"));r.attr("tabindex",C.getKeyboardMode()==b.Navigation?-1:0);var A=this.getNoDataAriaRole();if(A){r.attr("role",A);}r.class("sapMLIB").class("sapMListNoData").class("sapMLIBTypeInactive");L.addFocusableClasses.call(L,r);r.openEnd();r.openStart("div",C.getId("nodata-text")).class("sapMListNoDataText").openEnd();r.text(C.getNoDataText(true));r.close("div");r.close("li");};c.renderDummyArea=function(r,C,A,t){r.openStart("div",C.getId(A)).attr("tabindex",t);if(D.system.desktop){r.class("sapMListDummyArea");}r.openEnd().close("div");};c.renderGrowing=function(r,C){var g=C._oGrowingDelegate;if(g){g.render(r);}};c.getAriaAnnouncement=function(B){return I.getStaticId("sap.m",B);};return c;},true);

/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/Object','sap/ui/core/format/NumberFormat','sap/m/library','sap/ui/model/ChangeReason','sap/ui/base/ManagedObjectMetadata','sap/ui/core/HTML','sap/m/CustomListItem',"sap/base/security/encodeXML"],function(B,N,l,C,M,H,a,e){"use strict";var L=l.ListType;var b=l.ListGrowingDirection;var G=B.extend("sap.m.GrowingEnablement",{constructor:function(c){B.apply(this);this._oControl=c;this._oControl.bUseExtendedChangeDetection=true;this._oControl.addDelegate(this);var r=this._oControl.getItems(true).length;this._iRenderedDataItems=r;this._iLimit=r;this._bLoading=false;this._sGroupingPath="";this._bDataRequested=false;this._oContainerDomRef=null;this._iLastItemsCount=0;this._iTriggerTimer=0;this._aChunk=[];this._oRM=null;},destroy:function(){if(this._oTrigger){this._oTrigger.destroy();this._oTrigger=null;}if(this._oScrollDelegate){this._oScrollDelegate.setGrowingList(null);this._oScrollDelegate=null;}if(this._oRM){this._oRM.destroy();this._oRM=null;}this._oControl.$("triggerList").remove();this._oControl.bUseExtendedChangeDetection=false;this._oControl.removeDelegate(this);this._oContainerDomRef=null;this._oControl=null;},render:function(r){r.openStart("div",this._oControl.getId()+"-triggerList");r.class("sapMListUl").class("sapMGrowingList");r.style("display","none");r.openEnd();r.renderControl(this._getTrigger());r.close("div");},onAfterRendering:function(){var c=this._oControl;if(c.getGrowingScrollToLoad()){var s=l.getScrollDelegate(c);if(s){this._oScrollDelegate=s;s.setGrowingList(this.onScrollToLoad.bind(this),c.getGrowingDirection(),this._updateTrigger.bind(this,false));}}else if(this._oScrollDelegate){this._oScrollDelegate.setGrowingList(null);this._oScrollDelegate=null;}if(!this._bLoading){this._updateTriggerDelayed(false);}},setTriggerText:function(t){this._oControl.$("triggerText").text(t);},reset:function(){this._iLimit=0;var o=this._oControl.getBindingInfo("items");this._oControl.oExtendedChangeDetectionConfig=(!o||!o.template)?null:{replace:true};},shouldReset:function(c){var m=C;return c==m.Sort||c==m.Filter||c==m.Context;},getInfo:function(){return{total:this._oControl.getMaxItemsCount(),actual:this._iRenderedDataItems};},onScrollToLoad:function(){var t=this._oControl.getDomRef("triggerList");if(this._bLoading||!t||t.style.display!="none"){return;}if(this._oControl.getGrowingDirection()==b.Upwards){var s=this._oScrollDelegate;this._oScrollPosition={left:s.getScrollLeft(),top:s.getScrollHeight()};}this.requestNewPage();},requestNewPage:function(){if(!this._oControl||this._bLoading){return;}var o=this._oControl.getBinding("items");if(o&&!o.isLengthFinal()||this._iLimit<this._oControl.getMaxItemsCount()){if(this._oControl.getMetadata().hasProperty("enableBusyIndicator")){this._bParentEnableBusyIndicator=this._oControl.getEnableBusyIndicator();this._oControl.setEnableBusyIndicator(false);}this._iLimit+=this._oControl.getGrowingThreshold();this._updateTriggerDelayed(true);this.updateItems("Growing");}},_onBeforePageLoaded:function(c){this._bLoading=true;this._oControl.onBeforePageLoaded(this.getInfo(),c);},_onAfterPageLoaded:function(c){this._bLoading=false;this._updateTriggerDelayed(false);this._oControl.onAfterPageLoaded(this.getInfo(),c);if(this._oControl.setEnableBusyIndicator){this._oControl.setEnableBusyIndicator(this._bParentEnableBusyIndicator);}},_getTrigger:function(){var t=this._oControl.getId()+"-trigger",T=this._oControl.getGrowingTriggerText();T=T||sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("LOAD_MORE_DATA");this._oControl.addNavSection(t);if(this._oTrigger){this.setTriggerText(T);return this._oTrigger;}this._oTrigger=new a({id:t,busyIndicatorDelay:0,type:L.Active,content:new H({content:'<div class="sapMGrowingListTrigger">'+'<div class="sapMSLIDiv sapMGrowingListTriggerText">'+'<span class="sapMSLITitle" id="'+t+'Text">'+e(T)+'</span>'+'</div>'+'<div class="sapMGrowingListDescription sapMSLIDescription" id="'+t+'Info"></div>'+'</div>'})}).setParent(this._oControl,null,true).attachPress(this.requestNewPage,this).addDelegate({onsapenter:function(E){this.requestNewPage();E.preventDefault();},onsapspace:function(E){this.requestNewPage();E.preventDefault();},onAfterRendering:function(E){var $=this._oTrigger.$();$.removeAttr("aria-selected");$.attr({"tabindex":0,"role":"button","aria-labelledby":t+"Text"+" "+t+"Info"});}},this);this._oTrigger.getList=function(){};this._oTrigger.TagName="div";return this._oTrigger;},_getListItemInfo:function(){return("[ "+this._iRenderedDataItems+" / "+N.getFloatInstance().format(this._oControl.getMaxItemsCount())+" ]");},_getGroupingPath:function(o){var s=o.aSorters||[];var S=s[0]||{};return(S.fnGroup)?S.sPath||"":"";},_getDomIndex:function(i){if(typeof i!="number"){return i;}if(this._oControl.hasPopin&&this._oControl.hasPopin()){return(i*2);}return i;},_getHasScrollbars:function(){if(!this._oScrollDelegate){return false;}if(this._iRenderedDataItems>=40){return true;}return this._oScrollDelegate.getMaxScrollTop()>this._oControl.getDomRef("triggerList").clientHeight;},destroyListItems:function(s){this._oControl.destroyItems(s);this._iRenderedDataItems=0;this._aChunk=[];},addListItem:function(c,o,s){var d=this._oControl,f=o.binding,i=this.createListItem(c,o);if(f.isGrouped()){var I=d.getItems(true),g=I[I.length-1],m=o.model,h=f.getGroup(i.getBindingContext(m));if(g&&g.isGroupHeader()){d.removeAggregation("items",g,true);this._fnAppendGroupItem=this.appendGroupItem.bind(this,h,g,s);g=I[I.length-1];}if(!g||h.key!==f.getGroup(g.getBindingContext(m)).key){var j=(o.groupHeaderFactory)?o.groupHeaderFactory(h):null;if(d.getGrowingDirection()==b.Upwards){this.applyPendingGroupItem();this._fnAppendGroupItem=this.appendGroupItem.bind(this,h,j,s);}else{this.appendGroupItem(h,j,s);}}}d.addAggregation("items",i,s);if(s){this._aChunk.push(i);}},applyPendingGroupItem:function(){if(this._fnAppendGroupItem){this._fnAppendGroupItem();this._fnAppendGroupItem=undefined;}},appendGroupItem:function(g,o,s){o=this._oControl.addItemGroup(g,o,s);if(s){this._aChunk.push(o);}},createListItem:function(c,o){this._iRenderedDataItems++;var i=o.factory(M.uid("clone"),c);return i.setBindingContext(c,o.model);},updateItemsBindingContext:function(d,m){if(!d.length){return;}var I=this._oControl.getItems(true);for(var i=0,c=0,o;i<I.length;i++){o=I[i];if(!o.isGroupHeader()){o.setBindingContext(d[c++],m);}}},applyChunk:function(I,d){this.applyPendingGroupItem();var c=this._aChunk.length;if(!c){return;}if(this._oControl.getGrowingDirection()==b.Upwards){this._aChunk.reverse();if(I===true){I=0;}else if(typeof I=="number"){I=this._iRenderedDataItems-c-I;}}d=d||this._oContainerDomRef;this._oRM=this._oRM||sap.ui.getCore().createRenderManager();for(var i=0;i<c;i++){this._oRM.renderControl(this._aChunk[i]);}this._oRM.flush(d,false,this._getDomIndex(I));this._aChunk=[];},addListItems:function(c,o,s){for(var i=0;i<c.length;i++){this.addListItem(c[i],o,s);}},rebuildListItems:function(c,o,s){this.destroyListItems(s);this.addListItems(c,o,s);if(s){var h=this._oContainerDomRef.contains(document.activeElement);this.applyChunk(false);h&&this._oControl.focus();}else{this.applyPendingGroupItem();}},insertListItem:function(c,o,i){var I=this.createListItem(c,o);this._oControl.insertAggregation("items",I,i,true);this._aChunk.push(I);},deleteListItem:function(i){this._oControl.getItems(true)[i].destroy(true);this._iRenderedDataItems--;},refreshItems:function(c){if(!this._bDataRequested){this._bDataRequested=true;this._onBeforePageLoaded(c);}if(!this._iLimit||this.shouldReset(c)||!this._oControl.getItems(true).length){this._iLimit=this._oControl.getGrowingThreshold();}this._oControl.getBinding("items").getContexts(0,this._iLimit);},updateItems:function(c){var o=this._oControl,d=o.getBinding("items"),f=o.getBindingInfo("items"),I=o.getItems(true);if(!this._iLimit||this.shouldReset(c)||!I.length){this._iLimit=o.getGrowingThreshold();}if(this._bDataRequested){this._bDataRequested=false;}else{this._onBeforePageLoaded(c);}var g=d.getContexts(0,this._iLimit)||[];if(g.dataRequested){this._bDataRequested=true;if(g.diff&&!g.diff.length){return;}}this._oContainerDomRef=o.getItemsContainerDomRef();var D=g.diff,F=false,v;if(!g.length){this.destroyListItems();}else if(!this._oContainerDomRef){this.rebuildListItems(g,f);}else if(!D||!I.length&&D.length){if(o.shouldRenderItems()){this.rebuildListItems(g,f,true);}}else if(d.isGrouped()||o.checkGrowingFromScratch()){if(this._sGroupingPath!=this._getGroupingPath(d)){F=true;}else{for(var i=0;i<D.length;i++){var h=D[i],j=g[h.index];if(h.type=="delete"||h.type=="replace"){F=true;break;}else if(h.index!=this._iRenderedDataItems){F=true;break;}else{this.addListItem(j,f,true);v=true;}}}}else{if(this._sGroupingPath){o.removeGroupHeaders(true);}v=-1;var k=-1;for(var i=0;i<D.length;i++){var h=D[i],m=h.index,j=g[m];if(h.type=="delete"){if(v!=-1){this.applyChunk(v);k=-1;v=-1;}this.deleteListItem(m);}else if(h.type=="insert"){if(v==-1){v=m;}else if(k>-1&&m!=k+1){this.applyChunk(v);v=m;}this.insertListItem(j,f,m);k=m;}}}if(F){this.rebuildListItems(g,f,true);}else if(this._oContainerDomRef&&D){this.updateItemsBindingContext(g,f.model);this.applyChunk(v);}this._oContainerDomRef=null;this._sGroupingPath=this._getGroupingPath(d);if(!this._bDataRequested){this._onAfterPageLoaded(c);}},_updateTriggerDelayed:function(c){if(this._oControl.getGrowingScrollToLoad()){this._iTriggerTimer&&window.cancelAnimationFrame(this._iTriggerTimer);this._iTriggerTimer=window.requestAnimationFrame(this._updateTrigger.bind(this,c));}else{this._updateTrigger(c);}},_updateTrigger:function(c){var t=this._oTrigger,o=this._oControl,v=o&&o.getVisibleItems().length>0;if(!t||!o||!v||!o.shouldRenderItems()||!o.getDomRef()){return;}var d=o.getBinding("items");if(!d){return;}t.setBusy(c);t.$().toggleClass("sapMGrowingListBusyIndicatorVisible",c);if(c){t.setActive(false);o.$("triggerList").css("display","");}else{var i=o.getItems(true),I=i.length,f=d.getLength()||0,g=d.isLengthFinal(),h=o.getGrowingScrollToLoad(),T=t.getDomRef();if(T&&T.contains(document.activeElement)){(i[this._iLastItemsCount]||o).focus();}if(!I||!this._iLimit||(g&&this._iLimit>=f)||(h&&this._getHasScrollbars())){o.$("triggerList").css("display","none");}else{if(g){o.$("triggerInfo").css("display","block").text(this._getListItemInfo());}t.$().removeClass("sapMGrowingListBusyIndicatorVisible");o.$("triggerList").css("display","");}this._iLastItemsCount=this._oControl.getItems(true).length;if(h&&this._oScrollPosition===undefined&&o.getGrowingDirection()==b.Upwards){this._oScrollPosition={left:0,top:0};}if(I>0&&this._oScrollPosition){var s=this._oScrollDelegate,S=this._oScrollPosition;s.scrollTo(S.left,s.getScrollHeight()-S.top);this._oScrollPosition=null;}}}});return G;});

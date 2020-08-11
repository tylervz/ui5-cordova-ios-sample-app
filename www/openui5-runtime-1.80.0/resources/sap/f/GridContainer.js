/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/Core","sap/ui/base/ManagedObjectObserver",'sap/ui/core/ResizeHandler',"sap/ui/core/delegate/ItemNavigation","sap/f/GridContainerRenderer","sap/ui/Device","sap/ui/layout/cssgrid/VirtualGrid","sap/f/GridContainerSettings","sap/base/strings/capitalize","sap/ui/core/InvisibleRenderer"],function(l,C,a,M,R,I,G,D,V,b,c,d){"use strict";var e=a.getConfiguration().getRTL();var E=16;var o=["sap.f.Card","sap.ui.integration.widgets.Card","sap.m.GenericTile"];function f(){return!D.browser.msie&&!(D.browser.edge&&D.browser.version<E);}function g(i){var k=i.getLayoutData();return k?k.getColumns():1;}function h(i){var k=i.getLayoutData();return k?k.getActualRows():1;}function j(i){var k=i.getLayoutData();return k?k.hasAutoHeight():true;}var m=C.extend("sap.f.GridContainer",{metadata:{library:"sap.f",interfaces:["sap.f.dnd.IGridDroppable"],properties:{width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:""},containerQuery:{type:"boolean",group:"Behavior",defaultValue:false},snapToRow:{type:"boolean",group:"Appearance",defaultValue:false},allowDenseFill:{type:"boolean",group:"Appearance",defaultValue:false},inlineBlockLayout:{type:"boolean",group:"Appearance",defaultValue:false}},defaultAggregation:"items",aggregations:{items:{type:"sap.ui.core.Control",multiple:true,singularName:"item",dnd:true},layout:{type:"sap.f.GridContainerSettings",multiple:false},layoutXS:{type:"sap.f.GridContainerSettings",multiple:false},layoutS:{type:"sap.f.GridContainerSettings",multiple:false},layoutM:{type:"sap.f.GridContainerSettings",multiple:false},layoutL:{type:"sap.f.GridContainerSettings",multiple:false},layoutXL:{type:"sap.f.GridContainerSettings",multiple:false},_defaultLayout:{type:"sap.f.GridContainerSettings",multiple:false,visibility:"hidden"}},events:{layoutChange:{parameters:{layout:{type:"string"}}},borderReached:{parameters:{event:{type:"jQuery.Event"}}}},dnd:{draggable:false,droppable:true}}});m.prototype.bUseExtendedChangeDetection=true;m.prototype.getActiveLayoutSettings=function(){var s=this.getAggregation(this._sActiveLayout);if(!s&&this._sActiveLayout==="layoutXS"){s=this.getAggregation("layoutS");}if(!s){s=this.getAggregation("layout")||this.getAggregation("_defaultLayout");}return s;};m.prototype._onBeforeItemRendering=function(){var i=this.getParent();if(i._reflectItemVisibilityToWrapper(this)&&!f()){i._scheduleIEPolyfill();}};m.prototype._onAfterItemRendering=function(){var i=this.getParent(),F;if(i._hasOwnVisualFocus(this)){F=this.getFocusDomRef();F.setAttribute("tabindex",-1);F.tabIndex=-1;}if(!i._resizeListeners[this.getId()]){i._resizeListeners[this.getId()]=R.register(this,i._resizeItemHandler);}i._setItemNavigationItems();if(!f()){i._scheduleIEPolyfill();return;}i._applyItemAutoRows(this);};m.prototype._reflectItemVisibilityToWrapper=function(i){var k=i.getDomRef(),n=document.getElementById(d.createInvisiblePlaceholderId(i)),p,$;if(!k&&!n){return false;}p=(k?k:n).parentElement;$=jQuery(p);if(i.getVisible()&&$.hasClass("sapFGridContainerInvisiblePlaceholder")){$.removeClass("sapFGridContainerInvisiblePlaceholder");}else if(!i.getVisible()&&!$.hasClass("sapFGridContainerInvisiblePlaceholder")){$.addClass("sapFGridContainerInvisiblePlaceholder");return true;}return false;};m.prototype._onItemChange=function(i){if(i.name!=="items"||!i.child){return;}if(i.mutation==="insert"){i.child.addEventDelegate(this._itemDelegate,i.child);}else if(i.mutation==="remove"){i.child.removeEventDelegate(this._itemDelegate,i.child);}};m.prototype._deregisterResizeListeners=function(){var k,i;for(k in this._resizeListeners){i=this._resizeListeners[k];R.deregister(i);}delete this._resizeListeners;D.resize.detachHandler(this._resizeDeviceHandler);};m.prototype._setItemNavigationItems=function(){if(!this._isRenderingFinished){return;}var t=this,w=[];if(!t._itemNavigation){t._itemNavigation=new I().setCycling(false).attachEvent(I.Events.FocusLeave,this._onItemNavigationFocusLeave,this).attachEvent(I.Events.BorderReached,this._onItemNavigationBorderReached,this).setDisabledModifiers({sapnext:["alt","meta"],sapprevious:["alt","meta"]});t.addDelegate(this._itemNavigation);}t.$().children().map(function(i,W){if(W.getAttribute("class").indexOf("sapFGridContainerItemWrapper")>-1){w.push(W);}});t._itemNavigation.setRootDomRef(t.getDomRef());t._itemNavigation.setItemDomRefs(w);t._itemNavigation.setFocusedIndex(0);};m.prototype._onItemNavigationFocusLeave=function(i){var k=this._itemNavigation.getFocusedDomRef();this._itemNavigation.getItemDomRefs().forEach(function(n,p){if(k===n){var q=p++;this._itemNavigation.setFocusedIndex(q);}}.bind(this));this._itemNavigationFocusLeft=true;};m.prototype._detectActiveLayout=function(){var w=(this.getContainerQuery()&&this.getDomRef())?this._getComputedWidth():D.resize.width,r=D.media.getCurrentRange("GridContainerRangeSet",w),L="layout"+r.name,O=this.getActiveLayoutSettings(),s=false;if(!w){return false;}if(this._sActiveLayout!==L){this.addStyleClass("sapFGridContainer"+c(L));if(this._sActiveLayout){this.removeStyleClass("sapFGridContainer"+c(this._sActiveLayout));}this._sActiveLayout=L;s=O!==this.getActiveLayoutSettings();this.fireLayoutChange({layout:this._sActiveLayout});}return s;};m.prototype._getActiveGridStyles=function(){var s=this.getActiveLayoutSettings(),i=s.getColumns()||"auto-fill",k=s.getColumnSize(),n=s.getMinColumnSize(),p=s.getMaxColumnSize(),S={"grid-gap":s.getGap()};if(n&&p){S["grid-template-columns"]="repeat("+i+", minmax("+n+", "+p+"))";}else{S["grid-template-columns"]="repeat("+i+", "+k+")";}if(this.getInlineBlockLayout()){S["grid-auto-rows"]="min-content";}else{S["grid-auto-rows"]=s.getRowSize();}return S;};m.prototype.init=function(){this._oRb=a.getLibraryResourceBundle("sap.f");this.setAggregation("_defaultLayout",new b());this._initRangeSet();this._resizeListeners={};this._itemDelegate={onBeforeRendering:this._onBeforeItemRendering,onAfterRendering:this._onAfterItemRendering};this._itemsObserver=new M(this._onItemChange.bind(this));this._itemsObserver.observe(this,{aggregations:["items"]});this._resizeHandler=this._resize.bind(this);this._resizeDeviceHandler=this._resizeDevice.bind(this);D.resize.attachHandler(this._resizeDeviceHandler);this._resizeItemHandler=this._resizeItem.bind(this);if(!f()){this._attachDndPolyfill();}};m.prototype.insertItem=function(i,k){if(!this.getDomRef()||!f()){return this.insertAggregation("items",i,k);}var r=a.createRenderManager(),w=this._createItemWrapper(i),t=this._getItemAt(k),n=this.getDomRef();if(t){n.insertBefore(w,t.getDomRef().parentElement);}else{n.insertBefore(w,n.lastChild);}this.insertAggregation("items",i,k,true);i.addStyleClass("sapFGridContainerItemInnerWrapper");r.render(i,w);r.destroy();return this;};m.prototype.removeItem=function(i){var r=this.removeAggregation("items",i,true),k=this.getDomRef(),n=r.getDomRef();if(!k||!n||!f()){this.invalidate();return r;}k.removeChild(n.parentElement);return r;};m.prototype.onBeforeRendering=function(){this._detectActiveLayout();var r=this._resizeListeners[this.getId()];if(r){R.deregister(r);}this._isRenderingFinished=false;};m.prototype.onAfterRendering=function(){this._resizeListeners[this.getId()]=R.register(this.getDomRef(),this._resizeHandler);this._isRenderingFinished=true;this._setItemNavigationItems();this._applyLayout(true);};m.prototype.exit=function(){this._deregisterResizeListeners();if(this._itemsObserver){this._itemsObserver.disconnect();delete this._itemsObserver;}if(this._itemNavigation){this.removeDelegate(this._itemNavigation);this._itemNavigation.destroy();delete this._itemNavigation;this._itemNavigation=null;}if(!f()){this._detachDndPolyfill();}};m.prototype._initRangeSet=function(){if(!D.media.hasRangeSet("GridContainerRangeSet")){D.media.initRangeSet("GridContainerRangeSet",[375,600,1024,1440],"px",["XS","S","M","L","XL"]);}};m.prototype._resize=function(){if(!this._isWidthChanged()){return;}var s=this._detectActiveLayout();this._applyLayout(s);};m.prototype._resizeDevice=function(){if(!this.getContainerQuery()){this._resize();}};m.prototype._isWidthChanged=function(){var i=this._getComputedWidth(),v=D.resize.width;if(this._lastGridWidth===i&&this._lastViewportWidth===v){return false;}this._lastGridWidth=i;this._lastViewportWidth=v;return true;};m.prototype._getComputedWidth=function(){if(!this.getDomRef()){return null;}return this.getDomRef().getBoundingClientRect().width;};m.prototype._resizeItem=function(i){if(!f()){if(!this._bDraggingInAnotherContainer){this._scheduleIEPolyfill();}this._bDraggingInAnotherContainer=false;return;}this._applyItemAutoRows(i.control);};m.prototype._applyLayout=function(s){if(!this._isRenderingFinished){return;}if(!f()){this._scheduleIEPolyfill(s);return;}if(s){this.$().css(this._getActiveGridStyles());this.getItems().forEach(this._applyItemAutoRows.bind(this));}this._enforceMaxColumns();};m.prototype._applyItemAutoRows=function(i){if(!this._isRenderingFinished){return;}if(this.getInlineBlockLayout()){return;}if(j(i)){var $=i.$(),s=this.getActiveLayoutSettings(),r=s.calculateRowsForItem($.outerHeight());if(!r){return;}$.parent().css({'grid-row':'span '+Math.max(r,h(i))});}};m.prototype._enforceMaxColumns=function(){var s=this.getActiveLayoutSettings(),i=s.getComputedColumnsCount(this.$().innerWidth());if(!i){return;}this.getItems().forEach(function(k){k.$().parent().css("grid-column","span "+Math.min(g(k),i));});};m.prototype._getItemAt=function(i){var k=this.getItems(),t;if(i<0){i=0;}if(k.length&&k[i]){t=k[i];}return t;};m.prototype._createItemWrapper=function(i){var s=G.getStylesForItemWrapper(i,this),S=s.styles,k=s.classes,w=document.createElement("div");w.setAttribute("tabindex","0");S.forEach(function(v,K){w.style.setProperty(K,v);});k.forEach(function(v){w.classList.add(v);});return w;};m.prototype._scheduleIEPolyfill=function(i){if(this._iPolyfillCallId){clearTimeout(this._iPolyfillCallId);}if(i){this._applyIEPolyfillLayout();return;}this._iPolyfillCallId=setTimeout(this._applyIEPolyfillLayout.bind(this),0);};m.prototype._applyIEPolyfillLayout=function(){if(!this._isRenderingFinished){return;}if(this.bIsDestroyed){return;}var $=this.$(),n=$.innerWidth(),s=this.getActiveLayoutSettings(),p=s.getMinColumnSizeInPx()||s.getColumnSizeInPx(),r=s.getRowSizeInPx(),q=s.getGapInPx(),t=s.getComputedColumnsCount(n),u=parseInt($.css("padding-top").replace("px","")),v=parseInt($.css("padding-left").replace("px","")),w=this.getItems();if(!p||!r){return;}if(!w.length){return;}var x=new V();x.init({numberOfCols:Math.max(1,t),cellWidth:p,cellHeight:r,unitOfMeasure:"px",gapSize:q,topOffset:u?u:0,leftOffset:v?v:0,allowDenseFill:this.getAllowDenseFill(),rtl:e,width:n});var i,k,y,z,A,B,F=[];var H=function(K){x.fitElement(K+'',this._polyfillDropIndicator.columns||s.calculateColumnsForItem(Math.round(this._polyfillDropIndicator.width)),this._polyfillDropIndicator.rows||s.calculateRowsForItem(Math.round(this._polyfillDropIndicator.height)));F.push({id:K+'',domRef:this._polyfillDropIndicator.domRef});}.bind(this);for(i=0,k=0;i<w.length;i++){if(this._polyfillDropIndicator&&this._polyfillDropIndicator.insertAt===i){H(k);k++;}y=w[i];z=y.$();if(!z.is(":visible")){continue;}A=g(y);if(j(y)){B=this._calcAutoRowsForPolyfill(y,s);}else{B=h(y);}x.fitElement(k+'',A,B);F.push({id:k+'',domRef:z.parent()});k++;}if(this._polyfillDropIndicator&&this._polyfillDropIndicator.insertAt>=w.length){H(w.length);}x.calculatePositions();F.forEach(function(J){var K=x.getItems()[J.id];J.domRef.css({position:'absolute',top:K.top,left:K.left,width:K.width,height:K.height});});$.css("height",x.getHeight()+"px");if(!this.getWidth()&&s.getColumns()){if(!this.getContainerQuery()){$.css("width",x.getWidth()+"px");}}};m.prototype._calcAutoRowsForPolyfill=function(i,k){var $=i.$(),n,r;if($.hasClass("sapFCardAnalytical")){n=$[0].scrollHeight;}else{n=$.outerHeight();}r=Math.max(k.calculateRowsForItem(n),h(i));return r;};m.prototype._polyfillAfterDragOver=function(i){var $=i.getParameter("indicator");this._polyfillDropIndicator={rows:i.getParameter("rows"),columns:i.getParameter("columns"),width:i.getParameter("width"),height:i.getParameter("height"),domRef:$,insertAt:$.index()};this._scheduleIEPolyfill();};m.prototype._polyfillAfterDragEnd=function(i){this._polyfillDropIndicator=null;};m.prototype._polyfillDraggingInAnotherContainer=function(){this._bDraggingInAnotherContainer=true;};m.prototype._attachDndPolyfill=function(){this.attachEvent("_gridPolyfillAfterDragOver",this._polyfillAfterDragOver,this);this.attachEvent("_gridPolyfillAfterDragEnd",this._polyfillAfterDragEnd,this);this.attachEvent("_gridPolyfillDraggingInAnotherContainer",this._polyfillDraggingInAnotherContainer,this);};m.prototype._detachDndPolyfill=function(){this.detachEvent("_gridPolyfillAfterDragOver",this._polyfillAfterDragOver,this);this.detachEvent("_gridPolyfillAfterDragEnd",this._polyfillAfterDragEnd,this);this.detachEvent("_gridPolyfillDraggingInAnotherContainer",this._polyfillDraggingInAnotherContainer,this);};m.prototype.forwardTab=function(F){this.$(F?"after":"before").focus();};m.prototype.onsaptabnext=function(i){if(!this._itemNavigation){return;}var n=this._itemNavigation.getItemDomRefs(),L=this._itemNavigation.getFocusedIndex(),$=jQuery(n[L]),T=[];var A=$.find(":sapTabbable");A.map(function(p,q){if(q.className.indexOf("DummyArea")===-1){T.push(q);}});var t=jQuery(T),k=t.length===1?0:t.length-1;if(k===-1||(t.control(k)&&t.control(k).getId()===i.target.id)){this._lastFocusedElement=i.target;this.forwardTab(true);}};m.prototype.onsaptabprevious=function(i){if(!i.target.classList.contains("sapFGridContainerItemWrapper")){this._lastFocusedElement=i.target;return;}var t=i.target.id;if(t===this.getId("nodata")){this.forwardTab(false);}else if(t===this.getId("trigger")){this.focusPrevious();i.preventDefault();}this._lastFocusedElement=null;this.forwardTab(false);};m.prototype.onmousedown=function(i){this._bIsMouseDown=true;};m.prototype.onmouseup=function(i){var $=jQuery(i.target).closest('.sapFGridContainerItemWrapperNoVisualFocus'),k;if($.length){k=$.children().eq(0).control()[0];if(k&&k.getFocusDomRef()===document.activeElement){this._lastFocusedElement=null;$.focus();}}this._bIsMouseDown=false;};m.prototype.onfocusin=function(i){var $=jQuery(i.target).closest('.sapFGridContainerItemWrapperNoVisualFocus'),k,n,p;if(!this._bIsMouseDown&&$.length){k=$.children().eq(0).control()[0];if(k&&k.getFocusDomRef()===i.target){this._lastFocusedElement=null;$.focus();return;}}if(i.target.classList.contains("sapFGridContainerItemWrapper")){this._lastFocusedElement=null;}if(this._itemNavigationFocusLeft){this._itemNavigationFocusLeft=false;n=this._itemNavigation.getItemDomRefs();p=this._itemNavigation.getFocusedIndex();if(this._lastFocusedElement){this._lastFocusedElement.focus();}else{n[p].focus();}}};m.prototype._onItemNavigationBorderReached=function(i){this.fireEvent("borderReached",{event:i.getParameter("event")});};m.prototype.onsapnext=function(i){var k=this._itemNavigation.getItemDomRefs();if(k.indexOf(i.target)===-1){i.stopImmediatePropagation(true);}};m.prototype.onsapprevious=function(i){var k=this._itemNavigation.getItemDomRefs();if(k.indexOf(i.target)===-1){i.stopImmediatePropagation(true);}};["onkeypress","onkeyup","onkeydown","onsapenter","onsapselect","onsapspace"].forEach(function(n){m.prototype[n]=function(i){if(!i.target.classList.contains('sapFGridContainerItemWrapper')){return;}if(n==="onsapspace"){i.preventDefault();}var k=jQuery(i.target.firstChild).control()[0],F=k.getFocusDomRef(),p=jQuery(F).control()[0];if(p&&p[n]){p[n].call(p,i);}};});m.prototype._hasOwnVisualFocus=function(i){return o.indexOf(i.getMetadata().getName())>-1;};return m;});

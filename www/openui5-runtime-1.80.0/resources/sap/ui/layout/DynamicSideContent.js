/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/thirdparty/jquery','sap/ui/core/Control','sap/ui/core/ResizeHandler','sap/ui/core/delegate/ScrollEnablement','sap/ui/layout/library',"sap/ui/qunit/utils/waitForThemeApplied",'./DynamicSideContentRenderer'],function(q,C,R,a,l,w,D){"use strict";var b=l.SideContentPosition;var c=l.SideContentFallDown;var d=l.SideContentVisibility;var e=C.extend("sap.ui.layout.DynamicSideContent",{metadata:{library:"sap.ui.layout",properties:{showSideContent:{type:"boolean",group:"Appearance",defaultValue:true},showMainContent:{type:"boolean",group:"Appearance",defaultValue:true},sideContentVisibility:{type:"sap.ui.layout.SideContentVisibility",group:"Appearance",defaultValue:d.ShowAboveS},sideContentFallDown:{type:"sap.ui.layout.SideContentFallDown",group:"Appearance",defaultValue:c.OnMinimumWidth},equalSplit:{type:"boolean",group:"Appearance",defaultValue:false},containerQuery:{type:"boolean",group:"Behavior",defaultValue:false},sideContentPosition:{type:"sap.ui.layout.SideContentPosition",group:"Appearance",defaultValue:b.End}},defaultAggregation:"mainContent",events:{breakpointChanged:{parameters:{currentBreakpoint:{type:"string"}}}},aggregations:{mainContent:{type:"sap.ui.core.Control",multiple:true},sideContent:{type:"sap.ui.core.Control",multiple:true}},designTime:"sap/ui/layout/designtime/DynamicSideContent.designtime",dnd:{draggable:false,droppable:true}}});var S="S",M="M",L="L",X="XL",H="sapUiHidden",f="sapUiDSCSpan12",g="sapUiDSCMCFixed",h="sapUiDSCSCFixed",i=3,j=4,k=6,m=8,n=9,o=12,I="Invalid Breakpoint. Expected: S, M, L or XL",p="SCGridCell",r="MCGridCell",s=720,t=1024,u=1440;e.prototype.setSideContentVisibility=function(v,x){this.setProperty("sideContentVisibility",v,true);if(!x&&this.$().length){this._setResizeData(this.getCurrentBreakpoint());this._changeGridState();}return this;};e.prototype.setShowSideContent=function(v,x){if(v===this.getShowSideContent()){return this;}this.setProperty("showSideContent",v,true);this._SCVisible=v;if(!x&&this.$().length){this._setResizeData(this.getCurrentBreakpoint(),this.getEqualSplit());if(this._currentBreakpoint===S){this._MCVisible=true;}this._changeGridState();}return this;};e.prototype.setShowMainContent=function(v,x){if(v===this.getShowMainContent()){return this;}this.setProperty("showMainContent",v,true);this._MCVisible=v;if(!x&&this.$().length){this._setResizeData(this.getCurrentBreakpoint(),this.getEqualSplit());if(this._currentBreakpoint===S){this._SCVisible=true;}this._changeGridState();}return this;};e.prototype.isSideContentVisible=function(){if(this._currentBreakpoint===S){return this._SCVisible&&this.getProperty("showSideContent");}else{return this.getProperty("showSideContent");}};e.prototype.isMainContentVisible=function(){if(this._currentBreakpoint===S){return this._MCVisible&&this.getProperty("showMainContent");}else{return this.getProperty("showMainContent");}};e.prototype.setEqualSplit=function(v){this._MCVisible=true;this._SCVisible=true;this.setProperty("equalSplit",v,true);if(this._currentBreakpoint){this._setResizeData(this._currentBreakpoint,v);this._changeGridState();}return this;};e.prototype.addSideContent=function(v){this.addAggregation("sideContent",v,true);this._rerenderControl(this.getAggregation("sideContent"),this.$(p));return this;};e.prototype.addMainContent=function(v){this.addAggregation("mainContent",v,true);this._rerenderControl(this.getAggregation("mainContent"),this.$(r));return this;};e.prototype.toggle=function(){if(this._currentBreakpoint===S){if(!this.getProperty("showMainContent")){this.setShowMainContent(true,true);this._MCVisible=false;}if(!this.getProperty("showSideContent")){this.setShowSideContent(true,true);this._SCVisible=false;}if(this._MCVisible&&!this._SCVisible){this._SCVisible=true;this._MCVisible=false;}else if(!this._MCVisible&&this._SCVisible){this._MCVisible=true;this._SCVisible=false;}this._changeGridState();}return this;};e.prototype.getCurrentBreakpoint=function(){return this._currentBreakpoint;};e.prototype.onBeforeRendering=function(){this._bSuppressInitialFireBreakPointChange=true;this._detachContainerResizeListener();this._SCVisible=this.getProperty("showSideContent");this._MCVisible=this.getProperty("showMainContent");if(!this.getContainerQuery()){this._iWindowWidth=q(window).width();this._setBreakpointFromWidth(this._iWindowWidth);this._setResizeData(this._currentBreakpoint,this.getEqualSplit());}};e.prototype.onAfterRendering=function(){if(this.getContainerQuery()){this._attachContainerResizeListener();this._adjustToScreenSize();}else{var v=this;q(window).on("resize",function(){v._adjustToScreenSize();});}this._changeGridState();this._initScrolling();};e.prototype.exit=function(){this._detachContainerResizeListener();if(this._oSCScroller){this._oSCScroller.destroy();this._oSCScroller=null;}if(this._oMCScroller){this._oMCScroller.destroy();this._oMCScroller=null;}};e.prototype.getScrollDelegate=function(v){var x=v,y=this.getParent(),B=this._getBreakPointFromWidth(),z=this.getShowMainContent()&&this._MCVisible,A=this.getShowSideContent()&&this._SCVisible;if(B&&B!==L&&B!==X){if(x&&((x.sParentAggregationName==="sideContent"&&!A)||(x.sParentAggregationName==="mainContent"&&!z))){return;}else{while(y&&(!y.getScrollDelegate||!y.getScrollDelegate())){y=y.getParent();}return y.getScrollDelegate();}}if(this._oMCScroller&&this._oSCScroller){while(x&&x.getId()!==this.getId()){if(x.sParentAggregationName==="mainContent"&&z){return this._oMCScroller;}if(x.sParentAggregationName==="sideContent"&&A){return this._oSCScroller;}x=x.getParent();}}return;};e.prototype._rerenderControl=function(v,$){if(this.getDomRef()){var x=sap.ui.getCore().createRenderManager();this.getRenderer().renderControls(x,v);x.flush($[0]);x.destroy();}return this;};e.prototype._initScrolling=function(){var v=this.getId(),x=v+"-"+p,y=v+"-"+r;if(!this._oSCScroller&&!this._oMCScroller){var a=sap.ui.requireSync("sap/ui/core/delegate/ScrollEnablement");this._oSCScroller=new a(this,null,{scrollContainerId:x,horizontal:false,vertical:true});this._oMCScroller=new a(this,null,{scrollContainerId:y,horizontal:false,vertical:true});}};e.prototype._attachContainerResizeListener=function(){w().then(function(){if(!this._sContainerResizeListener){setTimeout(function(){this._sContainerResizeListener=R.register(this,this._adjustToScreenSize.bind(this));}.bind(this),0);}}.bind(this));};e.prototype._detachContainerResizeListener=function(){if(this._sContainerResizeListener){R.deregister(this._sContainerResizeListener);this._sContainerResizeListener=null;}};e.prototype._getBreakPointFromWidth=function(W){if(W<=s&&this._currentBreakpoint!==S){return S;}else if((W>s)&&(W<=t)&&this._currentBreakpoint!==M){return M;}else if((W>t)&&(W<=u)&&this._currentBreakpoint!==L){return L;}else if(W>u&&this._currentBreakpoint!==X){return X;}return this._currentBreakpoint;};e.prototype._setBreakpointFromWidth=function(W){this._currentBreakpoint=this._getBreakPointFromWidth(W);if(this._bSuppressInitialFireBreakPointChange){this._bSuppressInitialFireBreakPointChange=false;}else{this.fireBreakpointChanged({currentBreakpoint:this._currentBreakpoint});}};e.prototype._adjustToScreenSize=function(){if(this.getContainerQuery()){this._iWindowWidth=this.$().parent().width();}else{this._iWindowWidth=q(window).width();}if(this._iWindowWidth!==this._iOldWindowWidth){this._iOldWindowWidth=this._iWindowWidth;this._oldBreakPoint=this._currentBreakpoint;this._currentBreakpoint=this._getBreakPointFromWidth(this._iWindowWidth);if((this._oldBreakPoint!==this._currentBreakpoint)||(this._currentBreakpoint===M&&this.getSideContentFallDown()===c.OnMinimumWidth)){this._setResizeData(this._currentBreakpoint,this.getEqualSplit());this._changeGridState();}this._setBreakpointFromWidth(this._iWindowWidth);}};e.prototype._setResizeData=function(v,x){var y=this.getSideContentVisibility(),z=this.getSideContentFallDown();if(!x){switch(v){case S:this._setSpanSize(o,o);if(this.getProperty("showSideContent")&&this.getProperty("showMainContent")){this._SCVisible=y===d.AlwaysShow;}this._bFixedSideContent=false;break;case M:var A=Math.ceil((33.333/100)*this._iWindowWidth);if(z===c.BelowL||z===c.BelowXL||(A<=320&&z===c.OnMinimumWidth)){this._setSpanSize(o,o);this._bFixedSideContent=false;}else{this._setSpanSize(j,m);this._bFixedSideContent=true;}this._SCVisible=y===d.ShowAboveS||y===d.AlwaysShow;this._MCVisible=true;break;case L:if(z===c.BelowXL){this._setSpanSize(o,o);}else{this._setSpanSize(j,m);}this._SCVisible=y===d.ShowAboveS||y===d.ShowAboveM||y===d.AlwaysShow;this._MCVisible=true;this._bFixedSideContent=false;break;case X:this._setSpanSize(i,n);this._SCVisible=y!==d.NeverShow;this._MCVisible=true;this._bFixedSideContent=false;break;default:throw new Error(I);}}else{switch(v){case S:this._setSpanSize(o,o);this._SCVisible=false;break;default:this._setSpanSize(k,k);this._SCVisible=true;this._MCVisible=true;}this._bFixedSideContent=false;}return this;};e.prototype._shouldSetHeight=function(){var v,B,O,x,y,F,z;v=(this._iScSpan+this._iMcSpan)===o;B=this._MCVisible&&this._SCVisible;O=!this._MCVisible&&this._SCVisible;x=this._MCVisible&&!this._SCVisible;y=O||x;F=this._fixedSideContent;z=this.getSideContentVisibility()===d.NeverShow;return((v&&B)||y||F||z);};e.prototype._changeGridState=function(){var $=this.$(p),v=this.$(r),x=this.getProperty("showMainContent"),y=this.getProperty("showSideContent");if(this._bFixedSideContent){$.removeClass().addClass(h);v.removeClass().addClass(g);}else{$.removeClass(h);v.removeClass(g);}if(this._SCVisible&&this._MCVisible&&y&&x){if(!this._bFixedSideContent){v.removeClass().addClass("sapUiDSCSpan"+this._iMcSpan);$.removeClass().addClass("sapUiDSCSpan"+this._iScSpan);}if(this._shouldSetHeight()){$.css("height","100%").css("float","left");v.css("height","100%").css("float","left");}else{$.css("height","auto").css("float","none");v.css("height","auto").css("float","none");}}else if(!this._SCVisible&&!this._MCVisible){v.addClass(H);$.addClass(H);}else if(this._MCVisible&&x){v.removeClass().addClass(f);$.addClass(H);}else if(this._SCVisible&&y){$.removeClass().addClass(f);v.addClass(H);}else if(!x&&!y){v.addClass(H);$.addClass(H);}v.addClass("sapUiDSCM");$.addClass("sapUiDSCS");};e.prototype._setSpanSize=function(v,x){this._iScSpan=v;this._iMcSpan=x;};return e;});
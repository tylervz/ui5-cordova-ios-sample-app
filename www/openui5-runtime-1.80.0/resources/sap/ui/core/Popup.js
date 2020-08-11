/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/Device','sap/ui/base/ManagedObject','sap/ui/base/Object','sap/ui/base/ObjectPool','./Control','./IntervalTrigger','./RenderManager','./Element','./ResizeHandler','./library',"sap/base/assert","sap/base/Log","sap/base/util/Version","sap/base/util/uid","sap/base/util/extend","sap/base/util/deepExtend","sap/ui/dom/containsOrEquals","sap/ui/thirdparty/jquery","sap/ui/events/F6Navigation","sap/ui/events/isMouseEventDelayed","sap/ui/base/EventProvider","sap/ui/dom/jquery/control","sap/ui/dom/jquery/Focusable","sap/ui/dom/jquery/rect"],function(D,M,B,O,C,I,R,E,a,b,c,L,V,u,d,f,g,q,F,h,k){"use strict";var m=b.CSSSize;var n=b.OpenState;var P=M.extend("sap.ui.core.Popup",{constructor:function(o,e,S,A){c(arguments.length==0||(o&&typeof o==="object"),"oContent must be an object or there may be no arguments at all");c((e===undefined||e===true||e===false),"bModal must be true, false, or undefined");c((S===undefined||S===true||S===false),"bShadow must be true, false, or undefined");c((A===undefined||A===true||A===false),"bAutoClose must be true, false, or undefined");M.apply(this);this._popupUID=u();this.bOpen=false;this.eOpenState=n.CLOSED;this._mEvents={};this._mEvents["sap.ui.core.Popup.addFocusableContent-"+this._popupUID]=this._addFocusableArea;this._mEvents["sap.ui.core.Popup.removeFocusableContent-"+this._popupUID]=this._removeFocusableArea;this._mEvents["sap.ui.core.Popup.closePopup-"+this._popupUID]=this._closePopup;this._mEvents["sap.ui.core.Popup.onFocusEvent-"+this._popupUID]=this.onFocusEvent;this._mEvents["sap.ui.core.Popup.increaseZIndex-"+this._popupUID]=this._increaseMyZIndex;this._mEvents["sap.ui.core.Popup.contains-"+this._popupUID]=this._containsEventBusWrapper;if(o){this.setContent(o);}this._oDefaultPosition={my:P.Dock.CenterCenter,at:P.Dock.CenterCenter,of:document,offset:"0 0",collision:"flip"};this._oPosition=Object.assign({},this._oDefaultPosition);this._bModal=!!e;this._oPreviousFocus=null;this._sInitialFocusId=null;this._bShadow=typeof(S)==="boolean"?S:true;this._bAutoClose=!!A;this._animations={open:null,close:null};this._durations={open:"fast",close:"fast"};this._iZIndex=-1;this._oBlindLayer=null;this.setNavigationMode();if(this.touchEnabled){this._fAutoCloseHandler=function(i){if(i.isMarked("delayedMouseEvent")||i.isMarked("cancelAutoClose")){return;}if(this.eOpenState===n.CLOSING||this.eOpenState===n.CLOSED){return;}if(!this._contains(i.target)){this.close();}};}this._F6NavigationHandler=function(i){var j={},l=this._sF6NavMode,t;if(l=="DOCK"){if(this._bModal){l="NONE";}else if(this._oLastPosition&&this._oLastPosition.of){t=this._getOfDom(this._oLastPosition.of);if(!t||t===document){t=null;l="NONE";}}}switch(l){case"SCOPE":j.scope=this._$()[0];break;case"DOCK":j.target=t;var $=q(t).parents("[data-sap-ui-popup]");j.scope=$.length?$[0]:null;break;default:j.skip=true;}F.handleF6GroupNavigation(i,j);};},metadata:{library:"sap.ui.core",publicMethods:["open","close","setContent","getContent","setPosition","setShadow","setModal","getModal","setAutoClose","setAutoCloseAreas","setExtraContent","isOpen","getAutoClose","getOpenState","setAnimations","setDurations","attachOpened","attachClosed","detachOpened","detachClosed"],associations:{"childPopups":{type:"sap.ui.core.Popup",multiple:true,visibility:"hidden"}},events:{"opened":{},"closed":{}}}});P.prototype.getChildPopups=function(){return this.getAssociation("childPopups",[]);};P.prototype.addChildPopup=function(v){return this.addAssociation("childPopups",v);};P.prototype.removeChildPopup=function(v){return this.removeAssociation("childPopups",v);};P._activateBlindLayer=true;P.blStack=[];P.Dock={BeginTop:"begin top",BeginCenter:"begin center",BeginBottom:"begin bottom",LeftTop:"left top",LeftCenter:"left center",LeftBottom:"left bottom",CenterTop:"center top",CenterCenter:"center center",CenterBottom:"center bottom",RightTop:"right top",RightCenter:"right center",RightBottom:"right bottom",EndTop:"end top",EndCenter:"end center",EndBottom:"end bottom"};P.prototype.touchEnabled=D.support.touch&&(D.browser.safari||!D.system.combi);P.prototype.preventBrowserFocus=D.support.touch&&!D.system.combi;B.extend("sap.ui.core.Popup.Layer",{constructor:function(){var e=this.getDomString();this._$Ref=q(e).appendTo(sap.ui.getCore().getStaticAreaRef());}});P.Layer.prototype.init=function(o,z){this._$Ref.css({"visibility":"visible","z-index":z});this.update(o,z);this._$Ref.insertAfter(o).show();};P.Layer.prototype.update=function(o,z){if(o.length){var e=o.rect();this._$Ref.css({"left":e.left,"top":e.top});if(o.css("right")!="auto"&&o.css("right")!="inherit"){this._$Ref.css({"right":o.css("right"),"width":"auto"});}else{this._$Ref.css({"width":e.width,"right":"auto"});}if(o.css("bottom")!="auto"&&o.css("bottom")!="inherit"){this._$Ref.css({"bottom":o.css("bottom"),"height":"auto"});}else{this._$Ref.css({"height":e.height,"bottom":"auto"});}if(typeof(z)==="number"){this._$Ref.css("z-index",z);}}};P.Layer.prototype.reset=function(){if(this._$Ref.length){this._$Ref[0].style.display="none";this._$Ref[0].style.visibility="hidden";this._$Ref.appendTo(sap.ui.getCore().getStaticAreaRef());}};P.Layer.prototype.getDomString=function(){L.error("sap.ui.core.Popup.Layer: getDomString function must be overwritten!");return"";};P.Layer.extend("sap.ui.core.Popup.BlindLayer",{constructor:function(){P.Layer.apply(this);}});P.BlindLayer.prototype.getDomString=function(){return"<div class=\"sapUiBliLy\" id=\"sap-ui-blindlayer-"+u()+"\"><iframe scrolling=\"no\" tabIndex=\"-1\"></iframe></div>";};P.prototype.oBlindLayerPool=new O(P.BlindLayer);P.Layer.extend("sap.ui.core.Popup.ShieldLayer",{constructor:function(){P.Layer.apply(this);}});P.ShieldLayer.prototype.getDomString=function(){return"<div class=\"sapUiPopupShield\" id=\"sap-ui-shieldlayer-"+u()+"\"></div>";};P.prototype.oShieldLayerPool=new O(P.ShieldLayer);(function(){var l=0;var i=Math.pow(2,32)-1;P.setInitialZIndex=function(e){if(e>=i){throw new Error("Z-index can't be higher than Number.MAX_SAFE_INTEGER");}l=Math.max(e,this.getLastZIndex());};P.getLastZIndex=function(){return l;};P.prototype.getLastZIndex=function(){return P.getLastZIndex();};P.getNextZIndex=function(){l+=10;if(l>=i){throw new Error("Z-index can't be higher than Number.MAX_SAFE_INTEGER");}return l;};P.prototype.getNextZIndex=function(){return P.getNextZIndex();};}());var r=function(o,e){if((!o&&e)||(o&&!e)){return false;}if(!o&&!e){return true;}var i=3;var l=Math.abs(o.left-e.left);var t=Math.abs(o.top-e.top);var w=Math.abs(o.width-e.width);var H=Math.abs(o.height-e.height);if(l>i||t>i||w>i||H>i){return false;}return true;};P.prototype.open=function(i,j,l,o,t,v,w){c(this.oContent,"Popup content must have been set by now");if(this.eOpenState!=n.CLOSED){return;}this.eOpenState=n.OPENING;var S;try{S=sap.ui.getCore().getStaticAreaRef();S=sap.ui.getCore().getUIArea(S);}catch(e){L.error(e);throw new Error("Popup cannot be opened because static UIArea cannot be determined.");}this._bContentAddedToStatic=false;if(this.oContent instanceof C&&!this.oContent.getParent()){S.addContent(this.oContent,true);this._bContentAddedToStatic=true;}if(this.oContent.getUIArea){var A=this.oContent.getUIArea();if(A===null){L.error("The Popup content with id "+this.oContent.getId()+"is NOT connected with any UIArea and further invalidation may not work properly");}else if(P._bEnableUIAreaCheck&&A.getRootNode().id!==S.getRootNode().id){L.warning("The Popup content is NOT connected with the static-UIArea and may not work properly!");}}if(typeof(i)=="string"){w=v;v=t;t=o;o=l;l=j;j=i;i=-1;}if(i===undefined){i=-1;}c(i===-1||(typeof i==="number"&&i%1==0),"iDuration must be an integer (or omitted)");c(j===undefined||typeof j==="string","my must be a string or empty");c(l===undefined||typeof l==="string","at must be a string or empty");c(!o||typeof o==="object"||typeof o==="function","of must be empty or an object");c(!t||typeof t==="string","offset must be empty or a string");c(!v||typeof v==="string","collision must be empty or a string");this._oPreviousFocus=P.getCurrentFocusInfo();if(this.isInPopup(o)||this.isInPopup(this._oPosition.of)){var x=this.getParentPopupId(o)||this.getParentPopupId(this._oPosition.of);var y="";var z=this.getContent();if(z instanceof E){y=z.getId();}else if(typeof z==="object"){y=z.id;}this.addChildToPopup(x,y);this.addChildToPopup(x,this._popupUID);}var $=this._$(true);var G="fast";if((i===0)||(i>0)){G=i;}else if((this._durations.open===0)||(this._durations.open>0)){G=this._durations.open;}var H;if(j||l||o||t||v){H=this._createPosition(j,l,o,t,v);this._oPosition=H;}else{H=this._oPosition;}if(!H.of){H.of=this._oPosition.of||document;}this._iZIndex=this._iZIndex===this.getLastZIndex()?this._iZIndex:this.getNextZIndex();var J=sap.ui.getCore().getStaticAreaRef();$.css({"position":"absolute","visibility":"hidden"});if(!($[0].parentNode==J)){$.appendTo(J);}$.css("z-index",this._iZIndex);L.debug("position popup content "+$.attr("id")+" at "+(window.JSON?JSON.stringify(H.at):String(H.at)));this._applyPosition(H);if(w!==undefined){this.setFollowOf(w);}$.toggleClass("sapUiShd",this._bShadow);var K=$[0];if(K){K.style.display="none";K.style.visibility="visible";}var N=G==0;this._duringOpen(!N);if(N){this._opened();}else if(this._animations.open){this._animations.open.call(null,$,G,this._opened.bind(this));}else{$.fadeIn(G,this._opened.bind(this));}};P.prototype._getDomRefToFocus=function(){var $=this._$(false,true),o,e;if(this._shouldGetFocusAfterOpen()){if(this._sInitialFocusId){e=sap.ui.getCore().byId(this._sInitialFocusId);if(e){o=e.getFocusDomRef();}o=o||window.document.getElementById(this._sInitialFocusId);}o=o||$.firstFocusableDomRef();}return o;};P.prototype._opened=function(){if(this.eOpenState!==n.OPENING){return;}this.bOpen=true;var $=this._$(false,true);if($[0]&&$[0].style){$[0].style.display="block";}if(this._shouldGetFocusAfterOpen()){var e=this._getDomRefToFocus();if(e){e.focus();}var o=this._getOfDom(this._oLastPosition.of);var i=q(o).rect();if(this._oLastOfRect&&i&&!r(this._oLastOfRect,i)){this._applyPosition(this._oLastPosition);}}this.eOpenState=n.OPEN;if(this.getFollowOf()){P.DockTrigger.addListener(P.checkDocking,this);}this._updateBlindLayer();this.fireOpened();};P.prototype._duringOpen=function(o){var $=this._$(false,true),S=sap.ui.getCore().getStaticAreaRef(),e=document.getElementById(S.id+"-firstfe");P._clearSelection();this._setupUserSelection();if(h()){if(this._oTopShieldLayer){clearTimeout(this._iTopShieldRemoveTimer);this._iTopShieldRemoveTimer=null;}else{this._oTopShieldLayer=this.oShieldLayerPool.borrowObject($,this._iZIndex+1);}this._iTopShieldRemoveTimer=setTimeout(function(){this.oShieldLayerPool.returnObject(this._oTopShieldLayer);this._oTopShieldLayer=null;this._iTopShieldRemoveTimer=null;}.bind(this),500);}if(!!D.browser.msie&&!D.os.windows_phone&&P._activateBlindLayer){this._oBlindLayer=this.oBlindLayerPool.borrowObject($,this._iZIndex-1);}if(this._bModal){this._showBlockLayer();}if(o&&e&&this._shouldGetFocusAfterOpen()&&!this.isInPopup(document.activeElement)&&this._getDomRefToFocus()!==document.activeElement){e.focus({preventScroll:true});}if(this.oContent instanceof E){this.oContent.addDelegate(this);}this.bOpen=true;this._activateFocusHandle();this._$(false,true).on("keydown",q.proxy(this._F6NavigationHandler,this));if(this._oBlindLayer){this._resizeListenerId=a.register(this._$().get(0),q.proxy(this.onresize,this));}};P.prototype._shouldGetFocusAfterOpen=function(){return this._bModal||this._bAutoClose||this._sInitialFocusId;};P.prototype._contains=function(o){var e=this._$().get(0);if(!e){return false;}var i=g(e,o);var j;if(!i){j=this.getChildPopups();i=j.some(function(l){var t=(l?window.document.getElementById(l):null);var i=g(t,o);if(!i){var v="sap.ui.core.Popup.contains-"+l;var w={domRef:o};sap.ui.getCore().getEventBus().publish("sap.ui",v,w);i=w.contains;}return i;});}if(!i){p.forEach(function(S){i=i||q(o).closest(S).length>0;});}return i;};P.prototype._containsEventBusWrapper=function(e,i,o){o.contains=this._contains(o.domRef);};P.prototype.onFocusEvent=function(o){var e=q.event.fix(o);if(arguments.length>1&&arguments[1]==="sap.ui.core.Popup.onFocusEvent-"+this._popupUID){e=q.event.fix(arguments[2]);}var t=(e.type=="focus"||e.type=="activate")?"focus":"blur";var i=false;if(t=="focus"){var j=this._$().get(0);if(j){i=this._contains(e.target);L.debug("focus event on "+e.target.id+", contains: "+i);if(this._bModal&&!i){var T=P.blStack.length>0&&P.blStack[P.blStack.length-1].popup===this;if(T){if(D.system.desktop||q(e.target).is(":input")){if(this.oLastBlurredElement){setTimeout(function(){if(this.oLastBlurredElement){this.oLastBlurredElement.focus();}}.bind(this),0);}else{j.focus();}}}}else if(this._bAutoClose&&i&&this._sTimeoutId){clearTimeout(this._sTimeoutId);this._sTimeoutId=null;}}}else if(t=="blur"){L.debug("blur event on "+e.target.id);if(this._bModal){this.oLastBlurredElement=e.target;}else if(this._bAutoClose){if(!this.touchEnabled&&!this._sTimeoutId){if(e.target===document.activeElement){return;}var l=typeof this._durations.close==="string"?0:this._durations.close;this._sTimeoutId=setTimeout(function(){this.close(l,"autocloseBlur");var v=this._oLastPosition&&this._oLastPosition.of;if(v){var w=this.getParentPopupId(v);if(w){var x="sap.ui.core.Popup.onFocusEvent-"+w;sap.ui.getCore().getEventBus().publish("sap.ui",x,e);}}}.bind(this),l);}}}};P.prototype.setInitialFocusId=function(i){c(!i||typeof i==="string","sId must be a string or empty");this._sInitialFocusId=i;};P.prototype.close=function(i){if(P._autoCloseDebug){return;}if(this._sTimeoutId){clearTimeout(this._sTimeoutId);this._sTimeoutId=null;if(arguments.length>1){var A=arguments[1];if(typeof A=="string"&&A=="autocloseBlur"&&this._isFocusInsidePopup()){return;}}}c(i===undefined||(typeof i==="number"&&(i%1==0)),"iDuration must be empty or an integer");if(this.eOpenState==n.CLOSED||this.eOpenState==n.CLOSING){return;}var e="fast";if((i===0)||(i>0)){e=i;}else if((this._durations.close===0)||(this._durations.close>0)){e=this._durations.close;}this.eOpenState=n.CLOSING;if(this.getFollowOf()){P.DockTrigger.removeListener(P.checkDocking,this);}if(this.oContent&&this._bContentAddedToStatic){sap.ui.getCore().getEventBus().publish("sap.ui","__beforePopupClose",{domNode:this._$().get(0)});var S=sap.ui.getCore().getStaticAreaRef();S=sap.ui.getCore().getUIArea(S);S.removeContent(S.indexOfContent(this.oContent),true);}this._bContentAddedToStatic=false;this._sTimeoutId=null;this._deactivateFocusHandle();this._$(false,true).off("keydown",this._F6NavigationHandler);if(this.oContent instanceof E){this.oContent.removeDelegate(this);}var $=this._$();if(this._bEventBusEventsRegistered){this._unregisterEventBusEvents();}if(this._oBlindLayer){this.oBlindLayerPool.returnObject(this._oBlindLayer);}this._oBlindLayer=null;if(h()){if(this._oBottomShieldLayer){clearTimeout(this._iBottomShieldRemoveTimer);this._iBottomShieldRemoveTimer=null;}else{this._oBottomShieldLayer=this.oShieldLayerPool.borrowObject($,this._iZIndex-3);}this._iBottomShieldRemoveTimer=setTimeout(function(){this.oShieldLayerPool.returnObject(this._oBottomShieldLayer);this._oBottomShieldLayer=null;this._iBottomShieldRemoveTimer=null;}.bind(this),500);}if(this.isInPopup(this._oLastPosition.of)){var j=this.getParentPopupId(this._oLastPosition.of);var l="";var o=this.getContent();if(o instanceof E){l=o.getId();}else if(typeof o==="object"){l=o.id;}this.removeChildFromPopup(j,l);this.removeChildFromPopup(j,this._popupUID);}if(this._bModal&&this.preventBrowserFocus){$.one("mousedown",function(t){t.preventDefault();});}this._duringClose();if(e==0){this._closed();}else if(this._animations.close){this._animations.close.call(null,$,e,this._closed.bind(this));}else{$.fadeOut(e,this._closed.bind(this));}};P.prototype._closed=function(){var $=this._$(false,true);if(this._bModal){this._hideBlockLayer();}P._clearSelection();this._restoreUserSelection();if($.length){var o=$.get(0);if(o){o.style.display="none";o.style.visibility="hidden";o.style.left="0px";o.style.top="0px";o.style.right="";}$=this._$(false,true);o=$.length?$[0]:null;if(o){o.style.display="none";o.style.visibility="hidden";o.style.left="0px";o.style.top="0px";o.style.right="";}}if(this._bModal){P.applyFocusInfo(this._oPreviousFocus);this._oPreviousFocus=null;this.oLastBlurredElement=null;}this.bOpen=false;this.eOpenState=n.CLOSED;var e=this.getChildPopups();for(var j=0,l=e.length;j<l;j++){this.closePopup(e[j]);}this.fireClosed();};P.prototype._duringClose=function(){if(this._resizeListenerId){a.deregister(this._resizeListenerId);this._resizeListenerId=null;}};P.getCurrentFocusInfo=function(){var e=null;var i=sap.ui.getCore().getCurrentFocusedControlId();if(i){var o=sap.ui.getCore().byId(i);e={'sFocusId':i,'oFocusInfo':o?o.getFocusInfo():{}};}else{try{var j=document.activeElement;if(j&&j.nodeName){e={'sFocusId':j.id,'oFocusedElement':j,'oFocusInfo':{}};}}catch(l){e=null;}}if(e){e.popup=this;}return e;};P.applyFocusInfo=function(o){var e={preventScroll:true};if(o){var i=sap.ui.getCore().byId(o.sFocusId);if(i){i.applyFocusInfo(Object.assign(e,o.oFocusInfo));}else{var j=((o.sFocusId?window.document.getElementById(o.sFocusId):null))||o.oFocusedElement;if(j){j.focus(e);}}}};P.prototype.setContent=function(o){c(typeof o==="object","oContent must be an object");this.oContent=o;return this;};P.prototype.getContent=function(){return this.oContent;};P.prototype.setPosition=function(e,i,o,j,l){c(typeof e==="string","my must be a string");c(typeof i==="string"||(typeof i==="object"&&(typeof i.left==="number")&&(typeof i.top==="number")),"my must be a string or an object with 'left' and 'top' properties");c(!o||typeof o==="object"||typeof o==="function","of must be empty or an object");c(!j||typeof j==="string","offset must be empty or a string");c(!l||typeof l==="string","collision must be empty or a string");this._oPosition=this._createPosition(e,i,o,j,l);if(this.eOpenState!=n.CLOSED){this._applyPosition(this._oPosition);this._oBlindLayer&&this._oBlindLayer.update(this._$());}return this;};P.prototype._createPosition=function(e,i,o,j,l){var N=false;if(e&&(e.indexOf("+")>=0||e.indexOf("-")>=0)){N=true;if(j&&j!="0 0"){L.warning("offset used in my and in offset, the offset value will be ignored","sap.ui.core.Popup","setPosition");}j=null;}var t=d({},this._oDefaultPosition,{"my":e||this._oDefaultPosition.my,"at":i||this._oDefaultPosition.at,"of":o,"offset":j,"collision":l});if(!q.ui.version){if(P._bNewOffset==null){P._bNewOffset=true;var $=q(document.createElement("div"));$.position({of:window,using:function(y,z){P._bNewOffset=(z!==undefined);}});}}var v=[];var w=[];if(P._bNewOffset||V(q.ui.version).compareTo("1.8.23")>0){if(j&&j!="0 0"){v=t.my.split(" ");w=j.split(" ");var S=[parseInt(w[0])<0?"":"+",parseInt(w[1])<0?"":"+"];t.my=v[0]+S[0]+w[0]+" "+v[1]+S[1]+w[1];t.offset=null;}}else if(N){v=t.my.split(" ");w=["",""];var x=v[0].indexOf("+");if(x<0){x=v[0].indexOf("-");}if(x>=0){w[0]=v[0].slice(x);v[0]=v[0].slice(0,x);}x=v[1].indexOf("+");if(x<0){x=v[1].indexOf("-");}if(x>=0){w[1]=v[1].slice(x);v[1]=v[1].slice(0,x);}t.my=v[0]+" "+v[1];t.offset=w[0]+" "+w[1];}return t;};P.prototype._getPositionOffset=function(){var o=[];if(this._oPosition.my&&(this._oPosition.my.indexOf("+")>=0||this._oPosition.my.indexOf("-")>=0)){var e=this._oPosition.my.split(" ");var i=e[0].indexOf("+");if(i<0){i=e[0].indexOf("-");}if(i>=0){o[0]=e[0].slice(i);}i=e[1].indexOf("+");if(i<0){i=e[1].indexOf("-");}if(i>=0){o[1]=e[1].slice(i);}}else if(this._oPosition.offset){o=this._oPosition.offset.split(" ");}return o;};P.prototype._applyPosition=function(o){var e=sap.ui.getCore().getConfiguration().getRTL();var $=this._$();if($.length){var A=o.at;var i=$.get(0);if(typeof(A)==="string"){i.style.display="block";i.style.left="";i.style.right="";$.position(this._resolveReference(this._convertPositionRTL(o,e)));this._fixPositioning(o,e);}else if(m.isValid(A.left)&&m.isValid(A.top)){$.css({"left":A.left,"top":A.top});}else if(m.isValid(A.right)&&m.isValid(A.top)){$.css({"right":A.right,"top":A.top});}else if(typeof(A.left)==="number"&&typeof(A.top)==="number"){var j=$[0];if(j&&j.style.right){var w=$.outerWidth();$.css({"right":(document.documentElement.clientWidth-(A.left+w))+"px","top":A.top+"px"});}else{$.css({"left":A.left+"px","top":A.top+"px"});}}this._oLastPosition=o;this._oLastOfRect=this._calcOfRect(o.of);}};P.prototype._calcOfRect=function(o){var e=this._getOfDom(o);if(e){return q(e).rect();}return null;};P.prototype._getOfDom=function(o){if(o instanceof q.Event){return null;}var $;if(typeof(o)==="string"){$=q(document.getElementById(o));}else if(o instanceof q){$=o;}else{$=q(o instanceof E?o.getDomRef():o);}return $[0];};P.prototype._convertPositionRTL=function(o,e){var i=Object.assign({},o);if(e){var N=false;if(i.my&&(i.my.indexOf("+")>=0||i.my.indexOf("-")>=0)){N=true;}if((i.offset||N)&&((i.my.indexOf("begin")>-1)||(i.my.indexOf("end")>-1))&&((i.at.indexOf("begin")>-1)||(i.at.indexOf("end")>-1))){if(N){var j=i.my.split(" ");if(j.length==2){i.my="";if(j[0]){if(j[0].indexOf("begin")>-1||j[0].indexOf("end")>-1){if(j[0].indexOf("+")>-1){j[0]=j[0].replace("+","-");}else if(j[0].indexOf("-")>-1){j[0]=j[0].replace("-","+");}}i.my=j[0];}if(j[1]){if(j[1].indexOf("begin")>-1||j[1].indexOf("end")>-1){if(j[1].indexOf("+")>-1){j[1]=j[1].replace("+","-");}else if(j[1].indexOf("-")>-1){j[1]=j[1].replace("-","+");}}if(j[0]){i.my=i.my+" ";}i.my=i.my+j[1];}}}else{i.offset=this._mirrorOffset(i.offset);}}i.my=i.my.replace("begin","right").replace("end","left");i.at=i.at.replace("begin","right").replace("end","left");}else{i.my=i.my.replace("end","right").replace("begin","left");i.at=i.at.replace("end","right").replace("begin","left");}return i;};P.prototype._mirrorOffset=function(o){var e=q.trim(o).split(/\s/);var i=parseInt(e[0]);return(-i)+" "+e[e.length-1];};P.prototype._fixPositioning=function(e,i){var j=e.my;var $=this._$();var l=0;if(typeof(j)==="string"){if(i&&((j.indexOf("right")>-1)||(j.indexOf("begin")>-1)||(j.indexOf("center")>-1))){$=this._$();l=q(window).width()-$.outerWidth()-$.offset().left;$.css({"right":l+"px","left":""});}else if((j.indexOf("right")>-1)||(j.indexOf("end")>-1)){$=this._$();l=q(window).width()-$.outerWidth()-$.offset().left;$.css({"right":l+"px","left":""});}}};P.prototype._resolveReference=function(o){var e=o;if(o.of instanceof E){e=Object.assign({},o,{of:o.of.getDomRef()});}return e;};P.prototype.setShadow=function(S){c(typeof S==="boolean","bShowShadow must be boolean");this._bShadow=S;if(this.eOpenState!=n.CLOSED){this._$().toggleClass("sapUiShd",S);}return this;};P.prototype.setModal=function(e,i){c(typeof e==="boolean","bModal must be boolean");c(!i||typeof i==="string","sModalCSSClass must be empty or a string");var o=this._bModal;this._bModal=e;this._sModalCSSClass=i;if(this.isOpen()){if(o!==e){P._clearSelection();if(e){this._setupUserSelection();this._showBlockLayer();}else{this._hideBlockLayer();this._restoreUserSelection();}if(this.touchEnabled&&this._bAutoClose){if(!e){q(document).on("touchstart mousedown",q.proxy(this._fAutoCloseHandler,this));}else{q(document).off("touchstart mousedown",this._fAutoCloseHandler);}}}}return this;};P.prototype.getModal=function(){return this._bModal;};P.prototype.setNavigationMode=function(e){if(e!="NONE"&&e!="DOCK"&&e!="SCOPE"){this._sF6NavMode="NONE";}this._sF6NavMode=e;};P.prototype.setAutoClose=function(A){c(typeof A==="boolean","bAutoClose must be boolean");if(this.touchEnabled&&this.isOpen()&&this._bAutoClose!==A){if(!this._bModal){if(A){q(document).on("touchstart mousedown",q.proxy(this._fAutoCloseHandler,this));}else{q(document).off("touchstart mousedown",this._fAutoCloseHandler);}}}this._bAutoClose=A;return this;};P.prototype.setExtraContent=function(e){c(Array.isArray(e),"Extra popup content must be an array which contains either sap.ui.core.Element, DOM Element or an ID");if(!this._aExtraContent){this._aExtraContent=[];}var j=function(x){return{onBeforeRendering:function(){var y=x.getDomRef();if(y&&this.isOpen()){if(D.browser.msie){q(y).off("deactivate."+this._popupUID,this.fEventHandler);}else{y.removeEventListener("blur",this.fEventHandler,true);}}},onAfterRendering:function(){var y=x.getDomRef();if(y&&this.isOpen()){if(D.browser.msie){q(y).on("deactivate."+this._popupUID,this.fEventHandler);}else{y.addEventListener("blur",this.fEventHandler,true);}}}};};var o,t,v,w;for(var i=0,l=e.length;i<l;i++){t=e[i];if(t instanceof E){o=t.getId();}else if(typeof t==="object"){o=t.id;}else if(typeof t==="string"){o=t;}if(this.getChildPopups().indexOf(o)===-1){this.addChildPopup(o);w={id:o};if(t instanceof E){v=j(t);t.addEventDelegate(v,this);w.delegate=v;}this._aExtraContent.push(w);}}return this;};P.prototype.setAutoCloseAreas=P.prototype.setExtraContent;P.prototype.setAnimations=function(o,e){c(o===null||typeof o==="function","fnOpen must be a function");c(e===null||typeof e==="function","fnClose must be a function");if(o&&(typeof(o)=="function")){this._animations.open=o;}if(e&&(typeof(e)=="function")){this._animations.close=e;}return this;};P.prototype.setDurations=function(o,i){c(o===null||(typeof o==="number"&&(o%1==0)),"iOpenDuration must be null or an integer");c(!i||(typeof i==="number"&&(i%1==0)),"iOpenDuration must be undefined or an integer");if((o>0)||(o===0)){this._durations.open=o;}if((i>0)||(i===0)){this._durations.close=i;}return this;};P.CLOSE_ON_SCROLL="close_Popup_if_of_is_moved";P.prototype._fnCloseOnScroll=function(e){this.close();};P.prototype.setFollowOf=function(e){P.DockTrigger.removeListener(P.checkDocking,this);var U=false;this._bFollowOf=true;this._followOfHandler=null;if(typeof(e)==="function"){this._followOfHandler=e;U=true;}else if(typeof(e)==="boolean"){U=e;}else if(e===P.CLOSE_ON_SCROLL){this._followOfHandler=this._fnCloseOnScroll;U=true;}else{this._bFollowOf=false;if(e!==null){L.error("Trying to set an invalid type to 'followOf: "+e);}}if(U&&this._oLastPosition){this._oLastOfRect=this._calcOfRect(this._oLastPosition.of);}if(this._bFollowOf&&this.getOpenState()===n.OPEN){P.DockTrigger.addListener(P.checkDocking,this);}};P.prototype.getAutoClose=function(){return this._bAutoClose;};P.prototype.getFollowOf=function(){if(this._bFollowOf){return typeof(this._followOfHandler)==="function"?this._followOfHandler:true;}return false;};P.prototype.isOpen=function(){return this.bOpen;};P.prototype.getOpenState=function(){return this.eOpenState;};P.prototype.destroy=function(){if(this._resizeListenerId){a.deregister(this._resizeListenerId);this._resizeListenerId=null;}this.close(0);this.oContent=null;if(this._bFollowOf){this.setFollowOf(null);}if(this._bEventBusEventsRegistered){this._unregisterEventBusEvents();}if(this._iTopShieldRemoveTimer){clearTimeout(this._iTopShieldRemoveTimer);this.oShieldLayerPool.returnObject(this._oTopShieldLayer);this._oTopShieldLayer=null;this._iTopShieldRemoveTimer=null;}if(this._iBottomShieldRemoveTimer){clearTimeout(this._iBottomShieldRemoveTimer);this.oShieldLayerPool.returnObject(this._oBottomShieldLayer);this._oBottomShieldLayer=null;this._iBottomShieldRemoveTimer=null;}if(this._aExtraContent){var e;this._aExtraContent.forEach(function(A){if(A.delegate){e=q(document.getElementById(A.id)).control(0);if(e){e.removeEventDelegate(A.delegate);}}});}M.prototype.destroy.apply(this,arguments);};P.prototype.exit=function(){delete this._mEvents;};P.prototype._addFocusEventListeners=function(e,j,o){if(!this.fEventHandler){this.fEventHandler=q.proxy(this.onFocusEvent,this);}var $=this._$();var t=this.getChildPopups();var v={};var i=0,l=0;if($.length){if(document.addEventListener&&!D.browser.msie){document.addEventListener("focus",this.fEventHandler,true);$.get(0).addEventListener("blur",this.fEventHandler,true);for(i=0,l=t.length;i<l;i++){v=(t[i]?window.document.getElementById(t[i]):null);if(v){v.addEventListener("blur",this.fEventHandler,true);}}}else{q(document).on("activate."+this._popupUID,this.fEventHandler);$.on("deactivate."+this._popupUID,this.fEventHandler);for(i=0,l=t.length;i<l;i++){v=(t[i]?window.document.getElementById(t[i]):null);if(v){q(v).on("deactivate."+this._popupUID,this.fEventHandler);}}}}};P.prototype._removeFocusEventListeners=function(e,j,o){var $=this._$(false,true);if(!$.length){return;}var t=this.getChildPopups();var v={};var i=0,l=0;if(document.removeEventListener&&!D.browser.msie){document.removeEventListener("focus",this.fEventHandler,true);$.get(0).removeEventListener("blur",this.fEventHandler,true);for(i=0,l=t.length;i<l;i++){v=(t[i]?window.document.getElementById(t[i]):null);if(v){v.removeEventListener("blur",this.fEventHandler,true);}this.closePopup(t[i]);}}else{q(document).off("activate."+this._popupUID,this.fEventHandler);$.off("deactivate."+this._popupUID,this.fEventHandler);for(i=0,l=t.length;i<l;i++){v=(t[i]?window.document.getElementById(t[i]):null);if(v){q(v).off("deactivate."+this._popupUID,this.fEventHandler);}}}this.fEventHandler=null;};P.prototype._activateFocusHandle=function(){if(this._bModal||this._bAutoClose){this._addFocusEventListeners();}if(this.touchEnabled&&!this._bModal&&this._bAutoClose){q(document).on("touchstart mousedown",q.proxy(this._fAutoCloseHandler,this));}};P.prototype._deactivateFocusHandle=function(){if(this.fEventHandler){this._removeFocusEventListeners();}if(this.touchEnabled&&!this._bModal&&this._bAutoClose){q(document).off("touchstart mousedown",this._fAutoCloseHandler);}};P.prototype._registerEventBusEvents=function(e,i,o){var t=this;q.each(t._mEvents,function(j,l){sap.ui.getCore().getEventBus().subscribe("sap.ui",j,l,t);});this._bEventBusEventsRegistered=true;};P.prototype._unregisterEventBusEvents=function(e,i,o){var t=this;q.each(t._mEvents,function(j,l){sap.ui.getCore().getEventBus().unsubscribe("sap.ui",j,l,t);});delete this._bEventBusEventsRegistered;};P.prototype._addFocusableArea=function(e,i,o){if(this.getChildPopups().indexOf(o.id)===-1){this.addChildPopup(o.id);}};P.prototype._removeFocusableArea=function(e,i,o){this.removeChildPopup(o.id);};P.prototype._closePopup=function(e,i,o){this.close(typeof this._durations.close==="string"?0:this._durations.close);};P.prototype._setIdentity=function($){if(typeof $==="object"){$.attr("data-sap-ui-popup",this._popupUID);}else{L.warning("Incorrect DomRef-type for 'setIdentity': "+$,this);return;}if(!this._bEventBusEventsRegistered){this._registerEventBusEvents();}};P.prototype._$=function(e,G){var $;if(this.oContent instanceof C){$=this.oContent.$();if(e||($.length===0&&!G)){L.info("Rendering of popup content: "+this.oContent.getId());if($.length>0){R.preserveContent($[0],true,false);}sap.ui.getCore().getRenderManager().render(this.oContent,sap.ui.getCore().getStaticAreaRef());$=this.oContent.$();}}else if(this.oContent instanceof E){$=this.oContent.$();}else{$=q(this.oContent);}this._setIdentity($);return $;};function _(e){if(P._blockLayerStateProvider){P._blockLayerStateProvider.fireEvent("blockLayerStateChange",e);}}P.attachBlockLayerStateChange=function(o,e,l){if(!P._blockLayerStateProvider){P._blockLayerStateProvider=new k();}P._blockLayerStateProvider.attachEvent("blockLayerStateChange",o,e,l);};P.detachBlockLayerStateChange=function(e,l){if(P._blockLayerStateProvider){P._blockLayerStateProvider.detachEvent("blockLayerStateChange",e,l);}};P.prototype._showBlockLayer=function(){var $=q("#sap-ui-blocklayer-popup"),e="sapUiBLy"+(this._sModalCSSClass?" "+this._sModalCSSClass:"");if($.length===0){$=q('<div id="sap-ui-blocklayer-popup" tabindex="0" class="'+e+'"></div>');$.appendTo(sap.ui.getCore().getStaticAreaRef());}else{$.removeClass().addClass(e);}P.blStack.push({zIndex:this._iZIndex-2,popup:this});$.css({"z-index":this._iZIndex-2,"visibility":"visible"}).show();q("html").addClass("sapUiBLyBack");if(P.blStack.length===1){_({visible:true,zIndex:P.blStack[0].zIndex});}};P.prototype._hideBlockLayer=function(){var l=P.blStack.pop();var $=q("#sap-ui-blocklayer-popup");if($.length){var o=$.get(0);if(P.blStack.length>0){o.style.zIndex=P.blStack[P.blStack.length-1].zIndex;o.style.visibility="visible";o.style.display="block";}else{o.style.visibility="hidden";o.style.display="none";window.setTimeout(function(){q("html").removeClass("sapUiBLyBack");},0);_({visible:false,zIndex:l.zIndex});}}};P.prototype._isFocusInsidePopup=function(){var o=this._$(false).get(0);if(o&&g(o,document.activeElement)){return true;}return false;};P.DockTrigger=I;P.checkDocking=function(){if(this.getOpenState()===n.OPEN){var o=this._getOfDom(this._oLastPosition.of),e;if(o){if((o===window)||(o===window.document)||g(document.documentElement,o)){e=q(o).rect();}else if(o.id){var N=window.document.getElementById(o.id);var i=q(N).rect();if(i&&!r(e,i)){e=i;this._oLastPosition.of=N;}}}if(!e){this.close();return;}else if(e.left===0&&e.top===0&&e.height===0&&e.height===0&&this._oLastPosition.of.id){this._oLastPosition.of=window.document.getElementById(this._oLastPosition.of.id);o=this._getOfDom(this._oLastPosition.of);e=q(o).rect();if(!e){this.close();return;}}if(this._oLastOfRect){if(!r(this._oLastOfRect,e)){if(this._followOfHandler){var l=f({},this._oLastPosition),j=f({},this._oLastOfRect);this._followOfHandler({lastPosition:l,lastOfRect:j,currentOfRect:e});}else{this._applyPosition(this._oLastPosition);}}}}};P.prototype.ontouchstart=function(e){this.onmousedown(e,true);this._bMousedownCalled=true;};P.prototype.onmousedown=function(e,S){if(this._bMousedownCalled&&!S){this._bMousedownCalled=false;return;}if(this._iZIndex===this.getLastZIndex()||this.getModal()){return;}this._increaseMyZIndex("","mousedown",e);};P.prototype._increaseMyZIndex=function(e,j,o){var t=this.getParentPopup(this._oLastPosition.of);if(o&&o.type==="mousedown"||o&&o.isFromParentPopup||t.length===0){this._iZIndex=this.getNextZIndex();var $=this._$(false,true);$.css("z-index",this._iZIndex);if(this._oBlindLayer){this._oBlindLayer.update($,this._iZIndex-1);}if(o&&!o.type||o&&o.type!="mousedown"||j==="mousedown"){var v=this.getChildPopups();for(var i=0,l=v.length;i<l;i++){this.increaseZIndex(v[i],true);}}}else if(t.length>0){var w=q(t.get(0)).attr("data-sap-ui-popup");this.increaseZIndex(w,false);}};P.prototype.onAfterRendering=function(e){var o=this.getContent();var $=o instanceof E?o.$():q(o);$.toggleClass("sapUiShd",this._bShadow);$.css("position","absolute");this._setIdentity($);var i=$[0];var l=i.style.left;var j=i.style.right;var t=i.style.top;var v=i.style.bottom;if(!(l&&l!="auto"||j&&j!="auto"||t&&t!="auto"||v&&v!="auto")){L.debug("reposition popup content "+$.attr("id")+" at "+(window.JSON?JSON.stringify(this._oLastPosition.at):String(this._oLastPosition.at)));this._applyPosition(this._oLastPosition);}$.show().css({"visibility":"visible","z-index":this._iZIndex});if(this._oBlindLayer){this._resizeListenerId=a.register(this._$().get(0),q.proxy(this.onresize,this));}if(this.isOpen()&&(this.getModal()||this.getAutoClose())){this._addFocusEventListeners();}this._$(false,true).on("keydown",q.proxy(this._F6NavigationHandler,this));};P.prototype.onBeforeRendering=function(e){if(this._resizeListenerId){a.deregister(this._resizeListenerId);this._resizeListenerId=null;}if(this.isOpen()&&(this.getModal()||this.getAutoClose())){this._removeFocusEventListeners();}this._$(false,true).off("keydown",this._F6NavigationHandler);};P.prototype.onresize=function(e){if(this.eOpenState!=n.CLOSED&&this._oBlindLayer){var t=this;setTimeout(function(){t._updateBlindLayer();},0);}};P.prototype._updateBlindLayer=function(){if(this.eOpenState!=n.CLOSED&&this._oBlindLayer){this._oBlindLayer.update(this._$(false,true));}};P.prototype.isInPopup=function(t){var $=this.getParentPopup(t);return $&&$.length>0;};P.prototype.getParentPopup=function(t){var T=t?t:this;var $=q(T instanceof E?T.getDomRef():T);return $.closest("[data-sap-ui-popup]");};P.prototype.getParentPopupId=function(t){var $=this.getParentPopup(t);return $.attr("data-sap-ui-popup");};P.prototype.addChildToPopup=function(e,i){var j="sap.ui.core.Popup.addFocusableContent-"+e;sap.ui.getCore().getEventBus().publish("sap.ui",j,{id:i});};P.prototype.removeChildFromPopup=function(e,i){var j="sap.ui.core.Popup.removeFocusableContent-"+e;sap.ui.getCore().getEventBus().publish("sap.ui",j,{id:i});};P.prototype.closePopup=function(e){var i="sap.ui.core.Popup.closePopup-"+e;sap.ui.getCore().getEventBus().publish("sap.ui",i);};P.prototype.increaseZIndex=function(e,i){var j="sap.ui.core.Popup.increaseZIndex-"+e;sap.ui.getCore().getEventBus().publish("sap.ui",j,{isFromParentPopup:i?i:false});};P.prototype.focusTabChain=function(e){var S=e.event.target,N=e.that.getMetadata().getName(),o;if((!e.$FocusablesContent||!e.$FocusablesFooter)||(!e.$FocusablesContent.length&&!e.$FocusablesFooter.length)){return;}if(S.id===e.firstFocusable){L.debug("First dummy focus element was focused","",N);if(e.$FocusablesFooter.length>0){L.debug("Last footer element will be focused","",N);o=e.$FocusablesFooter[e.$FocusablesFooter.length-1];}else{L.debug("Last content element will be focused","",N);o=e.$FocusablesContent[e.$FocusablesContent.length-1];}}else if(S.id===e.lastFocusable){L.debug("Last dummy focus element was focues","",N);if(e.$FocusablesContent.length>0){L.debug("First content element will be focused","",N);o=e.$FocusablesContent[0];}else{L.debug("First footer element will be focused","",N);o=e.$FocusablesFooter[0];}}if(o){setTimeout(function(){var i=sap.ui.getCore().byId(o.id);if(i instanceof C){L.debug("Focus will be handled by "+i.getMetadata().getName(),"",N);}else{L.debug("oFocusDomRef will be focused","",N);}if(i){i.focus();}else if(o){o.focus();}return i?i.getId():o.id;},0);}};P.prototype._setupUserSelection=function(){var $=this._$(false,true);P._markAsUserSelectable($,this._bModal||P.blStack.length>0);if(this._bModal){if(P.blStack.length>0){var l=P.blStack[P.blStack.length-1];P._markAsNotUserSelectable(l.popup._$(false,true),true);}else{P._markAsNotUserSelectable(q("html"),true);P._markExternalContentAsUserSelectable(true);}}};P.prototype._restoreUserSelection=function(){var $=this._$(false,true);P._markAsNotUserSelectable($,false);if(P.blStack.length>0){P._markAsUserSelectable(P.blStack[P.blStack.length-1].popup._$(false,true),true);}else{P._markAsUserSelectable(q("html"),false);P._markExternalContentAsNotUserSelectable(false);}};P._clearSelection=function(){var S=document.getSelection();if(!S.isCollapsed){S.removeAllRanges();}};P._markAsUserSelectable=function($,e){if(!(D.browser.msie||D.browser.edge)){$.removeClass("sapUiNotUserSelectable");if(e){$.addClass("sapUiUserSelectable");}}};P._markAsNotUserSelectable=function($,e){if(!(D.browser.msie||D.browser.edge)){$.removeClass("sapUiUserSelectable");if(e){$.addClass("sapUiNotUserSelectable");}}};var p=new Set(),s="[data-sap-ui-integration-popup-content]";p.add(s);P.addExternalContent=function(S,e){if(!Array.isArray(S)){S=[S];}S.forEach(Set.prototype.add.bind(p));if(e){P.markExternalContentAsSelectable();}};P.removeExternalContent=function(S,e){if(!Array.isArray(S)){S=[S];}if(e){P.markExternalContentAsNotSelectable();}S.forEach(function(i){if(i!==s){p.delete(i);}});};P.markExternalContentAsSelectable=function(){P._clearSelection();if(P.blStack.length>0){P._markExternalContentAsUserSelectable(true);}};P.markExternalContentAsNotSelectable=function(){P._clearSelection();if(P.blStack.length>0){P._markExternalContentAsNotUserSelectable(false);}};P._getExternalContent=function(){var e=[];if(p.size>0){p.forEach(function(S){var $=q(S);if($.length>0){e.push($);}});}return e;};P._markExternalContentAsUserSelectable=function(e){var i=P._getExternalContent();i.forEach(function($){P._markAsUserSelectable($,e);});};P._markExternalContentAsNotUserSelectable=function(e){var i=P._getExternalContent();i.forEach(function($){P._markAsNotUserSelectable($,e);});};return P;});
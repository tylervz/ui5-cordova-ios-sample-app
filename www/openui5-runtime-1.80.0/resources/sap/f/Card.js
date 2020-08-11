/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/f/CardRenderer","sap/f/library","sap/ui/core/InvisibleText","sap/ui/core/Core"],function(C,a,l,I,b){"use strict";var H=l.cards.HeaderPosition;var c=C.extend("sap.f.Card",{metadata:{library:"sap.f",interfaces:["sap.f.ICard"],properties:{width:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",group:"Appearance",defaultValue:"auto"},headerPosition:{type:"sap.f.cards.HeaderPosition",group:"Appearance",defaultValue:H.Top}},aggregations:{header:{type:"sap.f.cards.IHeader",multiple:false},content:{type:"sap.ui.core.Control",multiple:false}}},renderer:a});c.prototype.init=function(){this._oRb=b.getLibraryResourceBundle("sap.f");this._ariaText=new I({id:this.getId()+"-ariaText"});this._ariaText.setText(this._oRb.getText("ARIA_ROLEDESCRIPTION_CARD"));};c.prototype.exit=function(){if(this._ariaText){this._ariaText.destroy();this._ariaText=null;}};c.prototype.getCardHeader=function(){return this.getHeader();};c.prototype.getCardHeaderPosition=function(){return this.getHeaderPosition();};c.prototype.getCardContent=function(){return this.getContent();};c.prototype.getFocusDomRef=function(){return this.getCardHeader()?this.getCardHeader().getDomRef():this.getDomRef();};return c;});
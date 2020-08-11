/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/ListItemBaseRenderer","sap/ui/core/Renderer","sap/m/library"],function(L,R,l){"use strict";var a=l.ListType;var b=l.ListMode;var M=-1;var G=R.extend(L);G.apiVersion=2;G.renderLIAttributes=function(r,o){r.class("sapFGLI");};G.renderContentFormer=function(r,o){this.renderHighlight(r,o);};G.renderLIContentWrapper=function(r,o){r.openStart("div").class("sapFGLIWrapper").openEnd();this.renderToolbar(r,o);L.renderLIContentWrapper.apply(this,arguments);r.close("div");};G.renderContentLatter=function(r,o){};G.renderToolbar=function(r,o){var m=o.getMode(),i=m===b.Delete,t=o.getType();if(!o.getCounter()&&(m===""||m===b.None||m===b.SingleSelectMaster)&&(t===a.Inactive||t===a.Active)){return;}r.openStart("div",o.getId()+"-gridListItemToolbar");r.class("sapFGLIToolbar");r.openEnd();if(!i){this.renderMode(r,o,M);}this.renderToolbarSpacer(r);L.renderContentLatter.apply(this,arguments);r.close("div");};G.renderLIContent=function(r,o){o.getContent().forEach(r.renderControl,r);};G.renderToolbarSpacer=function(r){r.openStart("div").class("sapFGLIToolbarSpacer").openEnd().close("div");};return G;},true);
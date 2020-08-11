/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Control","sap/ui/core/Core"],function(l,C,a){"use strict";var R=C.extend("sap.ui.layout.ResponsiveSplitterPage",{metadata:{library:"sap.ui.layout",associations:{content:{type:"sap.ui.core.Control",multiple:false,singularName:"content"}}},renderer:{apiVersion:2,render:function(r,c){r.openStart("div",c).class("sapUiResponsiveSplitterPage").openEnd();var o=a.byId(c.getAssociation("content"));if(o){r.renderControl(o);}r.close("div");}}});return R;});

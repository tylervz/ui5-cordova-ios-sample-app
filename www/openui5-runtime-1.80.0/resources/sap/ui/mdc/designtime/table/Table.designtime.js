/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/table/TableSettings"],function(T){"use strict";return{name:"{name}",description:"{description}",actions:{settings:function(){return{handler:function(c,p){return new Promise(function(r,a){var A=T._getAdaptationController(c);var R=A.getAfterChangesCreated();var e=function(E){var C=E.getParameter("container");C.isPopupAdaptationAllowed=function(){return false;};C.addStyleClass(p.styleClass);};A.attachEvent("beforeP13nContainerOpens",e);A.setAfterChangesCreated(function(o,C){r(C);});var f=function(E){var s=E.getParameter("reason");if(s=="Cancel"){r([]);}A.setAfterChangesCreated(R);A.detachEvent("beforeP13nContainerOpens",e);A.detachEvent("afterP13nContainerCloses",f);};A.attachEvent("afterP13nContainerCloses",f);A.showP13n(c,"Item");});}};}}};});

/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/mdc/BaseDelegate'],function(B){"use strict";var L=Object.assign({},B,{fetchLinkItems:function(p,b,i){return Promise.resolve(null);},fetchLinkType:function(p){return Promise.resolve({type:2,directLink:undefined});},fetchAdditionalContent:function(p,b){return Promise.resolve([]);},modifyLinkItems:function(p,b,l){return Promise.resolve(l);},beforeNavigationCallback:function(p,e){return Promise.resolve(true);}});return L;},true);

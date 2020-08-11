/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/BaseDelegate"],function(B){"use strict";var F=Object.assign({},B);F.fetchProperties=function(f){return Promise.resolve([]);};F.beforeAddFilterFlex=function(p,f,P){return Promise.resolve(null);};F.afterRemoveFilterFlex=function(f,o,p){return Promise.resolve(true);};return F;});

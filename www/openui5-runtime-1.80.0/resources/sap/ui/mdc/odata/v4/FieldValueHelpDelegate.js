/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/mdc/field/FieldValueHelpDelegate',"sap/ui/mdc/odata/v4/BaseDelegate"],function(F,B){"use strict";var O=Object.assign({},F,B);O.isSearchSupported=function(p,l){return!!l.changeParameters;};O.executeSearch=function(p,l,s){if(s){l.changeParameters({$search:s});}else{l.changeParameters({$search:undefined});}};O.checkBindingsPending=function(p,b){var P=[];for(var i=0;i<b.length;i++){var o=b[i];if(o&&o.requestValue){P.push(o.requestValue());}}if(P.length>0){return Promise.all(P);}return null;};return O;});

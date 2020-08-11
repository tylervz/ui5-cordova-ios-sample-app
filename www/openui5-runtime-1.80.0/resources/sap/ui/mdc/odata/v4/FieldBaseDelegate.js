/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/mdc/field/FieldBaseDelegate',"sap/ui/mdc/odata/v4/BaseDelegate"],function(F,B){"use strict";var O=Object.assign({},F,B);O.getDataTypeClass=function(p,t){return B.getTypeUtil().getDataTypeClassName(t);};O.getBaseType=function(p,t,f,c){return B.getTypeUtil().getBaseType(t,f,c);};O.initializeTypeFromBinding=function(p,t,v){var r={};if(t&&(t.isA("sap.ui.model.odata.type.Unit")||t.isA("sap.ui.model.odata.type.Currency"))&&Array.isArray(v)&&v.length>2&&v[2]!==undefined){t.formatValue(v,"string");r.bTypeInitialized=true;r.mCustomUnits=v[2];}return r;};O.initializeInternalUnitType=function(p,t,T){if(T&&T.mCustomUnits){t.formatValue([null,null,T.mCustomUnits],"string");}};O.getDefaultFieldValueHelpDelegate=function(p){return{name:"sap/ui/mdc/odata/v4/FieldValueHelpDelegate",payload:{}};};return O;});

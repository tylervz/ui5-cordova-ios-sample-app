/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BindingHelper","./CardActions","sap/ui/base/Object","sap/ui/integration/cards/AdaptiveContent","sap/ui/integration/cards/AnalyticalContent","sap/ui/integration/cards/AnalyticsCloudContent","sap/ui/integration/cards/CalendarContent","sap/ui/integration/cards/ComponentContent","sap/ui/integration/cards/ListContent","sap/ui/integration/cards/ObjectContent","sap/ui/integration/cards/TableContent","sap/ui/integration/cards/TimelineContent"],function(B,C,a,A,b,c,d,e,L,O,T,f){"use strict";var g=a.extend("sap.ui.integration.util.ContentFactory",{metadata:{library:"sap.ui.integration"},constructor:function(o){a.call(this);this._oCard=o;}});g.prototype.create=function(m){var o=this._oCard,t=m.cardType;return new Promise(function(r,h){var i=this.getClass(t);if(!i){h(t.toUpperCase()+" content type is not supported.");return;}var j=new i();j.loadDependencies(m.contentManifest).then(function(){if((m.cardManifest&&m.cardManifest.isDestroyed())||(m.dataProviderFactory&&m.dataProviderFactory.isDestroyed())){h();return;}var k=new C({card:o});j._sAppId=m.appId;j.setServiceManager(m.serviceManager);j.setDataProviderFactory(m.dataProviderFactory);j.setIconFormatter(m.iconFormatter);j.setActions(k);if(t.toLowerCase()!=="adaptivecard"){j.setConfiguration(B.createBindingInfos(m.contentManifest),t);}else{j.setConfiguration(m.contentManifest);}r(j);}).catch(function(E){h(E);});}.bind(this));};g.prototype.getClass=function(t){switch(t.toLowerCase()){case"adaptivecard":return A;case"analytical":return b;case"calendar":return d;case"component":return e;case"list":return L;case"object":return O;case"table":return T;case"timeline":return f;default:return null;}};return g;});
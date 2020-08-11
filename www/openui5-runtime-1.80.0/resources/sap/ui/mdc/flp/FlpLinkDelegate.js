/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/mdc/LinkDelegate","sap/ui/mdc/link/LinkItem","sap/ui/mdc/link/Factory","sap/ui/mdc/link/Log","sap/base/Log","sap/base/util/isPlainObject","sap/ui/mdc/link/SemanticObjectMapping","sap/ui/mdc/link/SemanticObjectMappingItem","sap/ui/mdc/link/SemanticObjectUnavailableAction"],function(L,a,F,b,S,i,c,d,e){"use strict";var f=Object.assign({},L);f.fetchLinkItems=function(p,B,I){var C=B?B.getObject(B.getPath()):undefined;var g=[];if(I){I.initialize(f._getSemanticObjects(p));g.forEach(function(o){I.addIntent(b.IntentType.API,{text:o.getText(),intent:o.getHref()});});}var s=f._calculateSemanticAttributes(C,p,I);return f._retrieveNavigationTargets("",s,p,I).then(function(l,o){return Promise.resolve(l);});};f.fetchLinkType=function(p){var s={};var P=null;var h=function(g){return g.filter(function(j){return!s[j];}).length===0;};var A=function(g){return g.some(function(j){return s[j]&&(s[j].exists===true);});};var r=function(){if(!P){P=new Promise(function(g){var C=F.getService("CrossApplicationNavigation");if(!C){S.error("FlpLinkDelegate: Service 'CrossApplicationNavigation' could not be obtained");return g({});}C.getDistinctSemanticObjects().then(function(D){D.forEach(function(j){s[j]={exists:true};});P=null;return g(s);},function(){S.error("FlpLinkDelegate: getDistinctSemanticObjects() of service 'CrossApplicationNavigation' failed");return g({});});});}return P;};var H=function(g){if(h(g)){return Promise.resolve(A(g));}return r().then(function(){return A(g);});};if(p&&p.semanticObjects){return H(p.semanticObjects).then(function(g){return Promise.resolve({type:!!g?2:0,directLink:undefined});});}else{throw new Error("no payload or semanticObjects found");}};f._calculateSemanticAttributes=function(C,p,I){var s=f._getSemanticObjects(p);var m=f._convertSemanticObjectMapping(f._getSemanticObjectMappings(p));if(!s.length){s.push("");}var r={};s.forEach(function(g){if(I){I.addContextObject(g,C);}r[g]={};for(var A in C){var o=null,t=null;if(I){o=I.getSemanticObjectAttribute(g,A);if(!o){o=I.createAttributeStructure();I.addSemanticObjectAttribute(g,A,o);}}if(C[A]===undefined||C[A]===null){if(o){o.transformations.push({value:undefined,description:"\u2139 Undefined and null values have been removed in FlpLinkDelegate."});}continue;}if(i(C[A])){if(o){o.transformations.push({value:undefined,description:"\u2139 Plain objects has been removed in FlpLinkDelegate."});}continue;}var h=(m&&m[g]&&m[g][A])?m[g][A]:A;if(o&&A!==h){t={value:undefined,description:"\u2139 The attribute "+A+" has been renamed to "+h+" in FlpLinkDelegate.",reason:"\ud83d\udd34 A com.sap.vocabularies.Common.v1.SemanticObjectMapping annotation is defined for semantic object "+g+" with source attribute "+A+" and target attribute "+h+". You can modify the annotation if the mapping result is not what you expected."};}if(r[g][h]){S.error("FlpLinkDelegate: The attribute "+A+" can not be renamed to the attribute "+h+" due to a clash situation. This can lead to wrong navigation later on.");}r[g][h]=C[A];if(o){if(t){o.transformations.push(t);var j=I.createAttributeStructure();j.transformations.push({value:C[A],description:"\u2139 The attribute "+h+" with the value "+C[A]+" has been added due to a mapping rule regarding the attribute "+A+" in FlpLinkDelegate."});I.addSemanticObjectAttribute(g,h,j);}}}});return r;};f._retrieveNavigationTargets=function(A,s,p,I){if(!p.semanticObjects){return new Promise(function(r){r([]);});}var g=p.semanticObjects;var h=p.sourceControl;var N={ownNavigation:undefined,availableActions:[]};return sap.ui.getCore().loadLibrary('sap.ui.fl',{async:true}).then(function(){return new Promise(function(r){sap.ui.require(['sap/ui/fl/Utils'],function(U){var C=F.getService("CrossApplicationNavigation");var u=F.getService("URLParsing");if(!C||!u){S.error("FlpLinkDelegate: Service 'CrossApplicationNavigation' or 'URLParsing' could not be obtained");return r(N.availableActions,N.ownNavigation);}var o=sap.ui.getCore().byId(h);var j=U.getAppComponentForControl(o);var P=g.map(function(k){return[{semanticObject:k,params:s?s[k]:undefined,appStateKey:A,ui5Component:j,sortResultsBy:"text"}];});return new Promise(function(){C.getLinks(P).then(function(l){if(!l||!l.length){return r(N.availableActions,N.ownNavigation);}var k=f._getSemanticObjectUnavailableActions(p);var m=f._convertSemanticObjectUnavailableAction(k);var q=C.hrefForExternal();if(q&&q.indexOf("?")!==-1){q=q.split("?")[0];}if(q){q+="?";}var t=function(w,x){return!!m&&!!m[w]&&m[w].indexOf(x)>-1;};var v=function(w){var x=u.parseShellHash(w.intent);if(t(x.semanticObject,x.action)){return;}var H=C.hrefForExternal({target:{shellHash:w.intent}},j);if(w.intent&&w.intent.indexOf(q)===0){N.ownNavigation=new a({href:H,text:w.text});return;}var y=new a({key:(x.semanticObject&&x.action)?(x.semanticObject+"-"+x.action):undefined,text:w.text,description:undefined,href:H,icon:undefined,initiallyVisible:(w.tags&&w.tags.indexOf("superiorAction")>-1)});N.availableActions.push(y);if(I){I.addSemanticObjectIntent(x.semanticObject,{intent:y.getHref(),text:y.getText()});}};for(var n=0;n<g.length;n++){l[n][0].forEach(v);}return r(N.availableActions,N.ownNavigation);},function(){S.error("FlpLinkDelegate: '_retrieveNavigationTargets' failed executing getLinks method");return r(N.availableActions,N.ownNavigation);});});});});});};f._getSemanticObjects=function(p){return p.semanticObjects?p.semanticObjects:[];};f._getSemanticObjectUnavailableActions=function(p){var s=[];if(p.semanticObjectUnavailableActions){p.semanticObjectUnavailableActions.forEach(function(o){s.push(new e({semanticObject:o.semanticObject,actions:o.actions}));});}return s;};f._getSemanticObjectMappings=function(p){var s=[];var g=[];if(p.semanticObjectMappings){p.semanticObjectMappings.forEach(function(o){g=[];if(o.items){o.items.forEach(function(h){g.push(new d({key:h.key,value:h.value}));});}s.push(new c({semanticObject:o.semanticObject,items:g}));});}return s;};f._convertSemanticObjectMapping=function(s){if(!s.length){return undefined;}var m={};s.forEach(function(o){if(!o.getSemanticObject()){throw Error("FlpLinkDelegate: 'semanticObject' property with value '"+o.getSemanticObject()+"' is not valid");}m[o.getSemanticObject()]=o.getItems().reduce(function(M,I){M[I.getKey()]=I.getValue();return M;},{});});return m;};f._convertSemanticObjectUnavailableAction=function(s){if(!s.length){return undefined;}var m={};s.forEach(function(o){if(!o.getSemanticObject()){throw Error("FlpLinkDelegate: 'semanticObject' property with value '"+o.getSemanticObject()+"' is not valid");}m[o.getSemanticObject()]=o.getActions();});return m;};return f;},true);

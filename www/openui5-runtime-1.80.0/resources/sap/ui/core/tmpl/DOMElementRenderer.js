/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/base/security/encodeXML"],function(L,e){"use strict";var D={apiVersion:2};var r=/^(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i;D.render=function(R,E){var s=e(E.getTag()),i=r.test(s);if(i){R.voidStart(s,E);}else{R.openStart(s,E);}E.getAttributes().forEach(function(A){var n=A.getName().toLowerCase();if(n==="class"){var c=A.getValue().split(" ");c.forEach(function(C){var C=C.trim();if(C){R.class(C);}});}else if(n==="style"){var S=A.getValue().split(";");S.forEach(function(b){var I=b.indexOf(":");if(I!=-1){var k=b.substring(0,I).trim();var v=b.substring(I+1).trim();R.style(e(k),v);}});}else if(A.getName()){R.attr(e(A.getName()),A.getValue());}else{L.error("Attributes must have a non-empty name");}});if(i){R.voidEnd();}else{R.openEnd();}var a=E.getElements(),h=!!E.getText()||a.length>0;if(h){if(i){L.error("Void element '"+s+"' is rendered with children");}if(E.getText()){R.text(E.getText());}a.forEach(function(I,c){R.renderControl(c);});R.close(s);}};return D;},true);

/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/Log","sap/ui/base/BindingParser","sap/ui/performance/Measurement","sap/ui/thirdparty/jquery"],function(L,B,M,q){'use strict';var a="sap.ui.model.odata.AnnotationHelper",r=/[\\\{\}:]/,b,d=/^(\/dataServices\/schema\/\d+\/entityContainer\/\d+\/entitySet\/\d+)(?:\/|$)/,p=[a],P=a+"/followPath",f=/^(\/dataServices\/schema\/\d+\/(?:complex|entity)Type\/\d+)(?:\/|$)/,u={"Edm.Boolean":"sap.ui.model.odata.type.Boolean","Edm.Byte":"sap.ui.model.odata.type.Byte","Edm.Date":"sap.ui.model.odata.type.Date","Edm.DateTime":"sap.ui.model.odata.type.DateTime","Edm.DateTimeOffset":"sap.ui.model.odata.type.DateTimeOffset","Edm.Decimal":"sap.ui.model.odata.type.Decimal","Edm.Double":"sap.ui.model.odata.type.Double","Edm.Float":"sap.ui.model.odata.type.Single","Edm.Guid":"sap.ui.model.odata.type.Guid","Edm.Int16":"sap.ui.model.odata.type.Int16","Edm.Int32":"sap.ui.model.odata.type.Int32","Edm.Int64":"sap.ui.model.odata.type.Int64","Edm.SByte":"sap.ui.model.odata.type.SByte","Edm.Single":"sap.ui.model.odata.type.Single","Edm.String":"sap.ui.model.odata.type.String","Edm.Stream":"sap.ui.model.odata.type.Stream","Edm.Time":"sap.ui.model.odata.type.Time","Edm.TimeOfDay":"sap.ui.model.odata.type.TimeOfDay"};b={descend:function(o,v,e){var t=q.extend({},o);b.expectType(o,typeof v==="number"?"array":"object");t.path=o.path+"/"+v;t.value=o.value[v];if(e===true){t.asExpression=true;}else if(e){b.expectType(t,e);}return t;},error:function(o,m,c){m=o.path+": "+m;L.error(m,b.toErrorString(o.value),c||a);throw new SyntaxError(m);},expectType:function(o,e){var E,v=o.value;if(e==="array"){E=!Array.isArray(v);}else{E=typeof v!==e||v===null||Array.isArray(v);}if(E){b.error(o,"Expected "+e);}},followPath:function(i,R){var A,s,c,I,m=i.getModel(),e,o={associationSetEnd:undefined,navigationAfterMultiple:false,isMultiple:false,navigationProperties:[],resolvedPath:undefined},S,t;M.average(P,"",p);s=b.getPath(R);c=s!==undefined&&b.getStartingPoint(i,s);if(!c){M.end(P);return undefined;}e=s.split("/");while(s&&e.length&&c){S=e[0];I=S.indexOf("@");if(I===0){c+="/"+S.slice(1);e.shift();continue;}t=m.getObject(c);A=m.getODataAssociationEnd(t,S);if(A){o.associationSetEnd=m.getODataAssociationSetEnd(t,S);o.navigationProperties.push(S);if(o.isMultiple){o.navigationAfterMultiple=true;}o.isMultiple=A.multiplicity==="*";c=m.getODataEntityType(A.type,true);e.shift();continue;}c=m.getODataProperty(t,e,true);}o.resolvedPath=c;M.end(P);return o;},getPath:function(R){if(R){if(R.hasOwnProperty("AnnotationPath")){return R.AnnotationPath;}if(R.hasOwnProperty("Path")){return R.Path;}if(R.hasOwnProperty("PropertyPath")){return R.PropertyPath;}if(R.hasOwnProperty("NavigationPropertyPath")){return R.NavigationPropertyPath;}}return undefined;},getStartingPoint:function(i,s){var e,m=f.exec(i.getPath()),o;if(m){return m[1];}m=d.exec(i.getPath());if(m){if(!s){return m[1];}o=i.getModel();e=o.getObject(m[1]);return o.getODataEntityType(e.entityType,true);}return undefined;},property:function(o,v,e){return b.descend(o,v,e).value;},resultToString:function(R,e,w){var v=R.value;function c(A){var C,F,s=R.parameters&&b.toJSON(R.parameters),h=s&&s!=="{}",i,t=u[R.type];A=A&&!R.ignoreTypeInPath&&t;if(A||r.test(v)||h){i="{path:"+b.toJSON(v);if(A){i+=",type:'"+t+"'";C=b.toJSON(R.constraints);if(C&&C!=="{}"){i+=",constraints:"+C;}F=R.formatOptions&&b.toJSON(R.formatOptions);if(F&&F!=="{}"){i+=",formatOptions:"+F;}}if(h){i+=",parameters:"+s;}return i+"}";}return"{"+v+"}";}function g(R){switch(R.type){case"Edm.Boolean":case"Edm.Double":case"Edm.Int32":return String(R.value);default:return b.toJSON(R.value);}}switch(R.result){case"binding":return(e?"$":"")+c(w);case"composite":if(e){throw new Error("Trying to embed a composite binding into an expression binding");}return v;case"constant":if(R.type==="edm:Null"){return e?"null":null;}if(e){return g(R);}return typeof v==="string"?B.complexParser.escape(v):String(v);case"expression":return e?v:"{="+v+"}";}},toErrorString:function(v){var j;if(typeof v!=="function"){try{j=b.toJSON(v);if(j!==undefined&&j!=="null"){return j;}}catch(e){}}return String(v);},toJSON:function(v){var s,e=false,R="",i,c;s=JSON.stringify(v);if(s===undefined){return undefined;}for(i=0;i<s.length;i+=1){switch(c=s.charAt(i)){case"'":R+="\\'";break;case'"':if(e){R+=c;e=false;}else{R+="'";}break;case"\\":if(e){R+="\\\\";}e=!e;break;default:if(e){R+="\\";e=false;}R+=c;}}return R;}};return b;},false);

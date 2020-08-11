/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/SimpleType','sap/ui/model/FormatException','sap/ui/model/ParseException','sap/ui/model/ValidateException','sap/ui/model/type/String','sap/ui/mdc/enum/FieldDisplay','sap/ui/mdc/condition/FilterOperatorUtil','sap/ui/mdc/condition/Condition','sap/ui/mdc/enum/BaseType','sap/ui/mdc/enum/ConditionValidated','sap/base/util/merge','sap/ui/base/SyncPromise'],function(S,F,P,V,a,b,c,C,B,d,m,e){"use strict";var f=S.extend("sap.ui.mdc.field.ConditionType",{constructor:function(A,D){S.apply(this,arguments);this.sName="Condition";this._oResourceBundle=sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");}});f.prototype.destroy=function(){S.prototype.destroy.apply(this,arguments);if(this._oDefaultType){this._oDefaultType.destroy();delete this._oDefaultType;}this._bDestroyed=true;};f.prototype.formatValue=function(A,I){if(A==undefined||A==null||this._bDestroyed){return null;}if(typeof A!=="object"||!A.operator||!A.values||!Array.isArray(A.values)){throw new F("No valid condition provided");}if(!I){I="string";}var T=l.call(this);var O=n.call(this);var D=this.oFormatOptions.isUnit;r.call(this,A,O);if(D){A=m({},A);if(A.values[0]&&Array.isArray(A.values[0])){A.values[0]=A.values[0][1];}if(A.operator!=="EQ"){A.operator="EQ";if(A.values[1]){A.values.splice(1,1);}}}r.call(this,A,T);switch(this.getPrimitiveType(I)){case"string":case"any":var E=k.call(this);if(A.operator==="EQ"&&E!==b.Value&&A.validated===d.Validated&&!A.values[1]){var G=this.oFormatOptions.bindingContext;return e.resolve().then(function(){return z.call(this,A.values[0],A.inParameters,A.outParameters,G);}.bind(this)).then(function(H){if(H){A=m({},A);if(typeof H==="object"){A=t.call(this,A,H);}else if(A.values.length===1){A.values.push(H);}else{A.values[1]=H;}}return _.call(this,A);}.bind(this)).catch(function(H){if(H instanceof F&&x.call(this)){return _.call(this,A);}else{throw H;}}.bind(this)).unwrap();}return _.call(this,A);default:if(T&&A.values.length>=1){return T.formatValue(A.values[0],I);}throw new F("Don't know how to format Condition to "+I);}};function _(A){var D=k.call(this);var T=l.call(this);if(this.oFormatOptions.hideOperator&&A.values.length===1){return T.formatValue(A.values[0],"string");}var O=c.getOperator(A.operator);if(!O){throw new F("No valid condition provided, Operator wrong.");}return O.format(A,T,D);}f.prototype.parseValue=function(A,I){if(this._bDestroyed){return null;}if(!I){I="string";}else if(I==="any"&&typeof A==="string"){I="string";}var N=this.oFormatOptions.navigateCondition;if(N){var O=this.formatValue(N,I);if(O===A){return m({},N);}}var D=k.call(this);var E=w.call(this);var T=l.call(this);var G=n.call(this);var H=o.call(this);var J=this.oFormatOptions.isUnit;var K;if(A===null||A===undefined||(A===""&&!E)){if(!q.call(this,T)&&!J){return null;}}s.call(this,T);s.call(this,G);switch(this.getPrimitiveType(I)){case"string":var L;var M=false;var U=false;if(H.length===1){L=c.getOperator(H[0]);U=true;}else{var Q=c.getMatchingOperators(H,A);if(Q.length===0){L=c.getDefaultOperator(v.call(this,T));if(L&&H.indexOf(L.name)<0){L=undefined;}if(E&&!q.call(this,T)&&H.indexOf("EQ")>=0){M=!!L&&L.name!=="EQ";L=c.getEQOperator();}U=true;}else{L=Q[0];}}if(L){var R;var W=q.call(this,T);if(!W&&L.validateInput&&E){R=h.call(this,L,A,T,U,M,H,D,true);if(R instanceof Promise){return u.call(this,R);}else{return R;}}else if(A===""&&!W){return g.call(this,null,T);}else{try{if(A===""&&W&&U){R=C.createCondition(L.name,[T.parseValue(A,"string",T._aCurrentValue)],undefined,undefined,d.NotValidated);}else{R=L.getCondition(A,T,D,U);}}catch(X){if(X instanceof P&&G){G.parseValue(A,"string",G._aCurrentValue);}throw X;}}if(R){return g.call(this,R,T);}}throw new P("Cannot parse value "+A);default:if(T){if(H.length===1){K=H[0];}else{K=c.getDefaultOperator(v.call(this,T)).name;if(K&&H.indexOf(K)<0){K=undefined;}}if(K){return C.createCondition(K,[T.parseValue(A,I)],undefined,undefined,d.NotValidated);}}throw new P("Don't know how to parse Condition from "+I);}};function g(A,T){var I=this.oFormatOptions.isUnit;var O=n.call(this);var U=null;if(I){var M;if(O._aCurrentValue){M=O._aCurrentValue[0];}if(A){if(A.operator!=="EQ"){throw new P("unsupported operator");}U=A.values[0];A.values=[[M,U]];}else{A=C.createCondition("EQ",[[M,null]],undefined,undefined,d.NotValidated);}r.call(this,A,O);}else if(A){var N=T.getMetadata().getName();var D=this.oFormatOptions.delegate;var E=this.oFormatOptions.payload;if(D&&D.getTypeUtil(E).getBaseType(N)===B.Unit&&!A.values[0][1]&&T._aCurrentValue){U=T._aCurrentValue[1]?T._aCurrentValue[1]:null;A.values[0][1]=U;if(A.operator==="BT"){A.values[1][1]=U;}}r.call(this,A,T);r.call(this,A,O);}return A;}function h(O,A,T,U,D,E,G,H){var K;var I;var J=true;var L=true;var M=false;var N;var Q;var R=this.oFormatOptions.bindingContext;var W;if(A===""){K=A;N=A;}else{W=O.getValues(A,G,U);K=H?W[0]:W[1];I=H?W[1]:W[0];M=G!==b.Value;L=G===b.Value||G===b.ValueDescription;N=L?K||I:I||K;}var X=function(Z){if(Z&&!(Z instanceof P)&&!(Z instanceof F)){throw Z;}if(!Z._bNotUnique){if(H&&W[0]&&W[1]){return h.call(this,O,A,T,U,D,E,G,false);}if(D){return i.call(this,T,E,A,G);}}if(x.call(this)){return j.call(this,T,E,A,G);}throw new P(Z.message);};var Y=function($){if($){return C.createCondition(O.name,[$.key,$.description],$.inParameters,$.outParameters,d.Validated);}else if(A===""){return null;}else{return X.call(this,new P(this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST",[A])));}};try{Q=T.parseValue(N,"string");T.validateValue(Q);}catch(Z){if(Z&&!(Z instanceof P)&&!(Z instanceof V)){throw Z;}J=false;L=false;Q=undefined;}return e.resolve().then(function(){return y.call(this,N,Q,R,L,J,M);}.bind(this)).then(function($){var a1=Y.call(this,$);return g.call(this,a1,T);}.bind(this)).catch(function(Z){var $=X.call(this,Z);return g.call(this,$,T);}.bind(this)).unwrap();}function i(T,O,A,D){var E=c.getDefaultOperator(v.call(this,T));var G;if(E&&O.indexOf(E.name)>=0){G=E.getCondition(A,T,b.Value,true);G.validated=d.NotValidated;}return G;}function j(T,O,A,D){var E;if(O.length===1){E=c.getOperator(O[0]);}else if(O.indexOf("EQ")>=0){E=c.getOperator("EQ");}if(!E){throw new P("Cannot parse value "+A);}var G=E.getCondition(A,T,b.Value,true);G.validated=d.NotValidated;return G;}f.prototype.validateValue=function(A){var T=l.call(this);var O=n.call(this);var D=o.call(this);var I=this.oFormatOptions.isUnit;if(A===undefined||this._bDestroyed){return null;}else if(A===null){if(c.onlyEQ(D)){try{if(T._sParsedEmptyString===""){T.validateValue("");}else{T.validateValue(null);}}catch(E){if(E instanceof V){throw E;}else{return null;}}}return null;}if(typeof A!=="object"||!A.operator||!A.values||!Array.isArray(A.values)){throw new V(this._oResourceBundle.getText("field.VALUE_NOT_VALID"));}var G=c.getOperator(A.operator,D);if(I){A=m({},A);if(A.values[0]&&Array.isArray(A.values[0])){A.values[0]=A.values[0][1];}G=c.getEQOperator();}if(!G){throw new V("No valid condition provided, Operator wrong.");}try{G.validate(A.values,T);}catch(H){if(H instanceof V&&O){G.validate(A.values,O);}throw H;}};function k(){var D=this.oFormatOptions.display;if(!D){D=b.Value;}return D;}function l(){var T=this.oFormatOptions.valueType;if(!T){if(!this._oDefaultType){this._oDefaultType=new a();}T=this._oDefaultType;}return T;}function n(){return this.oFormatOptions.originalDateType;}function o(){var O=this.oFormatOptions.operators;if(!O||O.length===0){O=c.getOperatorsForType(B.String);}return O;}function p(){var I=this.oFormatOptions.fieldHelpID;if(I){var A=sap.ui.getCore().byId(I);if(A&&A.isUsableForValidation()){return A;}}return null;}function q(T){return T&&T.isA("sap.ui.model.CompositeType");}function r(A,T){if(q.call(this,T)&&A&&A.values[0]){T._aCurrentValue=A.values[0];}}function s(T){if(q.call(this,T)&&!T._aCurrentValue){T._aCurrentValue=[];}}function t(A,R){A.values=[R.key,R.description];if(R.inParameters){A.inParameters=R.inParameters;}if(R.outParameters){A.outParameters=R.outParameters;}return A;}function u(A){if(this.oFormatOptions.asyncParsing){this.oFormatOptions.asyncParsing(A);}return A;}function v(T){var A=T.getMetadata().getName();var D=T.oFormatOptions;var E=T.oConstraints;var G=this.oFormatOptions.delegate;var H=this.oFormatOptions.payload;var I=G?G.getTypeUtil(H).getBaseType(A,D,E):B.String;if(I===B.Unit){I=B.Numeric;}return I;}function w(){var A=p.call(this);var D=this.oFormatOptions.delegate;var E=this.oFormatOptions.payload;if(D){return D.isInputValidationEnabled(E,A);}else{return!!A;}}function x(){var A=p.call(this);var D=this.oFormatOptions.delegate;var E=this.oFormatOptions.payload;if(D){return D.isInvalidInputAllowed(E,A);}else if(A){return!A.getValidateInput();}else{return true;}}function y(A,D,E,G,H,I){var J=p.call(this);var K=this.oFormatOptions.delegate;var L=this.oFormatOptions.payload;if(K){return K.getItemForValue(L,J,A,D,E,G,H,I);}else if(J){return J.getItemForValue(A,D,undefined,undefined,E,G,H,I);}}function z(K,I,O,A){var D=p.call(this);var E=this.oFormatOptions.delegate;var G=this.oFormatOptions.payload;if(E){return E.getDescription(G,D,K,I,O,A);}else if(D){return D.getTextForKey(K,I,O,A);}}return f;});

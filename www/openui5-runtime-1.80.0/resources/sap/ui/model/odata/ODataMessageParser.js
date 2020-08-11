/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/model/odata/ODataUtils","sap/ui/core/library","sap/ui/thirdparty/URI","sap/ui/core/message/MessageParser","sap/ui/core/message/Message","sap/base/Log","sap/ui/thirdparty/jquery"],function(O,c,U,M,a,L,q){"use strict";var C="sap.ui.model.odata.ODataMessageParser",r=/^\/+|\/$/g,b=c.MessageType,s={"error":b.Error,"info":b.Information,"success":b.Success,"warning":b.Warning};var d=M.extend("sap.ui.model.odata.ODataMessageParser",{metadata:{publicMethods:["parse","setProcessor","getHeaderField","setHeaderField"]},constructor:function(S,m){M.apply(this);this._serviceUrl=e(this._parseUrl(S).url);this._metadata=m;this._processor=null;this._headerField="sap-message";this._lastMessages=[];}});d.prototype.getHeaderField=function(){return this._headerField;};d.prototype.setHeaderField=function(F){this._headerField=F;return this;};d.prototype.parse=function(R,o,G,m,i){var j=[],k={request:o,response:R,url:o?o.requestUri:R.requestUri};if(R.statusCode>=200&&R.statusCode<300){this._parseHeader(j,R,k);}else if(R.statusCode>=400&&R.statusCode<600){this._parseBody(j,R,k);}else{L.warning("No rule to parse OData response with status "+R.statusCode+" for messages");}this._propagateMessages(j,k,G,m,!i);};d.prototype._getAffectedTargets=function(m,R,G,i){var A=Object.assign({"":true},G,i),E,j=this._parseUrl(R.url).url;if(R.request&&R.request.key&&R.request.created){A[R.request.key]=true;}if(j.startsWith(this._serviceUrl)){j=j.slice(this._serviceUrl.length+1);}E=this._metadata._getEntitySetByPath(j);if(E){A[E.name]=true;}m.forEach(function(o){o.getTargets().forEach(function(t){var p,S,T;if(!t){return;}T=t.replace(r,"");A[T]=true;S=T.lastIndexOf("/");if(S>0){p=T.slice(0,S);A[p]=true;}});});return A;};d.prototype._propagateMessages=function(m,R,G,i,S){var A,D=R.request.deepPath,k=[],p=D&&R.request.updateAggregatedMessages,t=R.request.headers&&R.request.headers["sap-messages"]==="transientOnly",j=[],n,o,u;function v(w,T){return T.some(function(x){return A[x];})||p&&w.aFullTargets.some(function(F){return F.startsWith(D);});}if(t){k=this._lastMessages;n=m.some(function(w){return!w.getPersistent()&&!w.getTechnical();});if(n){L.error("Unexpected non-persistent message in response, but requested only "+"transition messages",undefined,C);}}else{A=this._getAffectedTargets(m,R,G,i);o=R.response.statusCode;u=(o>=200&&o<300);this._lastMessages.forEach(function(w){var T=w.getTargets().map(function(x){x=x.replace(r,"");var P=x.lastIndexOf(")/");if(P>0){x=x.substr(0,P+1);}return x;});if(u||S){if(!w.getPersistent()&&v(w,T)){j.push(w);}else{k.push(w);}}else if(!w.getPersistent()&&w.getTechnical()&&v(w,T)){j.push(w);}else{k.push(w);}});}this.getProcessor().fireMessageChange({oldMessages:j,newMessages:m});this._lastMessages=k.concat(m);};d.prototype._createMessage=function(m,R,i){var p=m.target&&m.target.indexOf("/#TRANSIENT#")===0||m.transient||m.transition,t,T=typeof m.message==="object"?m.message.value:m.message,j=m["@sap.severity"]||m.severity;m.transition=!!p;t=this._createTargets(m,R,i);return new a({code:m.code||"",description:m.description,descriptionUrl:m.longtext_url||"",fullTarget:t.aDeepPaths,message:T,persistent:!!p,processor:this._processor,target:t.aTargets,technical:i,technicalDetails:{headers:R.response.headers,statusCode:R.response.statusCode},type:s[j]||j});};d.prototype._getFunctionTarget=function(F,R,u){var t="";var i;if(R.response&&R.response.headers&&R.response.headers["location"]){t=R.response.headers["location"];var p=t.lastIndexOf(this._serviceUrl);if(p>-1){t=t.substr(p+this._serviceUrl.length);}}else{var A=null;if(F.extensions){for(i=0;i<F.extensions.length;++i){if(F.extensions[i].name==="action-for"){A=F.extensions[i].value;break;}}}var E;if(A){E=this._metadata._getEntityTypeByName(A);}else if(F.entitySet){E=this._metadata._getEntityTypeByPath(F.entitySet);}else if(F.returnType){E=this._metadata._getEntityTypeByName(F.returnType);}if(E){var m=this._metadata._getEntitySetByType(E);if(m&&E&&E.key&&E.key.propertyRef){var I="";var P;if(E.key.propertyRef.length===1){P=E.key.propertyRef[0].name;if(u.parameters[P]){I=u.parameters[P];}}else{var k=[];for(i=0;i<E.key.propertyRef.length;++i){P=E.key.propertyRef[i].name;if(u.parameters[P]){k.push(P+"="+u.parameters[P]);}}I=k.join(",");}t="/"+m.name+"("+I+")";}else if(!m){L.error("Could not determine path of EntitySet for function call: "+u.url);}else{L.error("Could not determine keys of EntityType for function call: "+u.url);}}}return t;};d._isResponseForCreate=function(R){var o=R.request,i=R.response;if(o.method==="POST"&&i.statusCode==201&&i.headers["location"]){return true;}if(o.key&&o.created&&i.statusCode>=400){return false;}};d.prototype._createTarget=function(o,R,i,j){var k,m,F,p,P,n,u,t,v,D="",w=R.request,x=R.response;if(o===undefined&&!i&&w.headers["sap-message-scope"]==="BusinessObject"||i&&j){return{deepPath:"",target:""};}o=o||"";o=o.startsWith("/#TRANSIENT#")?o.slice(12):o;if(o[0]!=="/"){m=d._isResponseForCreate(R);if(m===true){v=x.headers["location"];}else if(m===false){v=w.key;}else{v=R.url;}t=this._parseUrl(v);u=t.url;p=u.indexOf(this._serviceUrl);if(p>-1){n=u.slice(p+this._serviceUrl.length);}else{n="/"+u;}if(!m){F=this._metadata._getFunctionImportMetadata(n,w.method);if(F){n=this._getFunctionTarget(F,R,t);D=n;}}if(!D&&w.deepPath){D=w.deepPath;}if(n.slice(n.lastIndexOf("/")).indexOf("(")>-1||!this._metadata._isCollection(n)){D=o?D+"/"+o:D;o=o?n+"/"+o:n;}else{D=D+o;o=n+o;}}k=this._processor.resolve(o,undefined,true);while(k&&k.lastIndexOf("/")>0&&k!==P){P=k;k=this._processor.resolve(k,undefined,true)||P;}o=k||o;return{deepPath:this._metadata._getReducedPath(D||o),target:O._normalizeKey(o)};};d.prototype._createTargets=function(m,R,i){var D=[],j=Array.isArray(m.additionalTargets)?[m.target].concat(m.additionalTargets):[m.target],t,T=[],k=this;if(m.propertyref!==undefined&&j[0]!==undefined){L.warning("Used the message's 'target' property for target calculation; the property"+" 'propertyref' is deprecated and must not be used together with 'target'",R.url,C);}else if(j[0]===undefined){j[0]=m.propertyref;}j.forEach(function(A){t=k._createTarget(A,R,i,m.transition);D.push(t.deepPath);T.push(t.target);});return{aDeepPaths:D,aTargets:T};};d.prototype._parseHeader=function(m,R,j){var F=this.getHeaderField();if(!R.headers){return;}for(var k in R.headers){if(k.toLowerCase()===F.toLowerCase()){F=k;}}if(!R.headers[F]){return;}var n=R.headers[F];var S=null;try{S=JSON.parse(n);m.push(this._createMessage(S,j));if(Array.isArray(S.details)){for(var i=0;i<S.details.length;++i){m.push(this._createMessage(S.details[i],j));}}}catch(o){L.error("The message string returned by the back-end could not be parsed: '"+o.message+"'");return;}};d.prototype._parseBody=function(m,R,i){var j=g(R);if(j&&j.indexOf("xml")>-1){this._parseBodyXML(m,R,i,j);}else{this._parseBodyJSON(m,R,i);}h(m);};d.prototype._addGenericError=function(m,R){m.push(this._createMessage({description:R.response.body,message:sap.ui.getCore().getLibraryResourceBundle().getText("CommunicationError"),severity:b.Error,transition:true},R,true));};d.prototype._parseBodyXML=function(j,R,k,o){try{var D=new DOMParser().parseFromString(R.body,o);var E=f(D,["error","errordetail"]);if(!E.length){this._addGenericError(j,k);return;}for(var i=0;i<E.length;++i){var N=E[i];var p={};p["severity"]=b.Error;for(var n=0;n<N.childNodes.length;++n){var t=N.childNodes[n];var u=t.nodeName;if(u==="errordetails"||u==="details"||u==="innererror"||u==="#text"){continue;}if(u==="message"&&t.hasChildNodes()&&t.firstChild.nodeType!==window.Node.TEXT_NODE){for(var m=0;m<t.childNodes.length;++m){if(t.childNodes[m].nodeName==="value"){p["message"]=t.childNodes[m].text||t.childNodes[m].textContent;}}}else{p[t.nodeName]=t.text||t.textContent;}}j.push(this._createMessage(p,k,true));}}catch(v){this._addGenericError(j,k);L.error("Error message returned by server could not be parsed");}};d.prototype._parseBodyJSON=function(m,R,j){try{var E=JSON.parse(R.body);var o;if(E["error"]){o=E["error"];}else{o=E["odata.error"];}if(!o){this._addGenericError(m,j);L.error("Error message returned by server did not contain error-field");return;}o["severity"]=b.Error;m.push(this._createMessage(o,j,true));var F=null;if(Array.isArray(o.details)){F=o.details;}else if(o.innererror&&Array.isArray(o.innererror.errordetails)){F=o.innererror.errordetails;}else{F=[];}for(var i=0;i<F.length;++i){m.push(this._createMessage(F[i],j,true));}}catch(k){this._addGenericError(m,j);L.error("Error message returned by server could not be parsed");}};d.prototype._parseUrl=function(u){var m={url:u,parameters:{},hash:""};var p=-1;p=u.indexOf("#");if(p>-1){m.hash=m.url.substr(p+1);m.url=m.url.substr(0,p);}p=u.indexOf("?");if(p>-1){var P=m.url.substr(p+1);m.parameters=U.parseQuery(P);m.url=m.url.substr(0,p);}return m;};function g(R){if(R&&R.headers){for(var H in R.headers){if(H.toLowerCase()==="content-type"){return R.headers[H].replace(/([^;]*);.*/,"$1");}}}return false;}var l=document.createElement("a");function e(u){l.href=u;return U.parse(l.href).path;}function f(D,E){var j=[];var m={};for(var i=0;i<E.length;++i){m[E[i]]=true;}var o=D;while(o){if(m[o.tagName]){j.push(o);}if(o.hasChildNodes()){o=o.firstChild;}else{while(!o.nextSibling){o=o.parentNode;if(!o||o===D){o=null;break;}}if(o){o=o.nextSibling;}}}return j;}function h(m){if(m.length>1){for(var i=1;i<m.length;i++){if(m[0].getCode()==m[i].getCode()&&m[0].getMessage()==m[i].getMessage()){m.shift();break;}}}}return d;});
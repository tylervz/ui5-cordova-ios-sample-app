/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.sjax","sap/base/Log","sap/base/util/UriParameters","sap/ui/core/Core","sap/ui/thirdparty/URI"],function(q,L,U,C,a){"use strict";var r=/\/\$batch($|\?)/,b=/(?:^|\r\n)Content-Id\s*:\s*(\S+)/i,c=/^(.*)?:\s*(.*)$/,j="application/json;charset=UTF-8;IEEE754Compatible=true",m={},M="\r\nContent-Type: application/http\r\n"+"Content-Transfer-Encoding: binary\r\n",d=/^Content-Type:\s*multipart\/mixed;\s*boundary=/i,u=U.fromQuery(window.location.search),A=u.get("autoRespondAfter"),R=u.get("realOData"),e=/^(\S+) (\S+)$/,f=/^(GET|DELETE|MERGE|PATCH|POST) (\S+) HTTP\/1\.1$/,D={},g=/^(OData-Version|DataServiceVersion)$/i,p=R==="true"||R==="proxy",h=p||R==="direct",s=u.get("supportAssistant")==="true",T;if(h){document.title=document.title+" (real OData)";}function k(o,E,P){var i=QUnit.objectType(o),n=QUnit.objectType(E),N;if(i==="string"&&n==="regexp"){if(!E.test(o)){throw new Error(P+": actual value "+o+" does not match expected regular expression "+E);}return;}if(i!==n){throw new Error(P+": actual type "+i+" does not match expected type "+n);}if(i==="array"){if(o.length<E.length){throw new Error(P+": array length: "+o.length+" < "+E.length);}}if(i==="array"||i==="object"){for(N in E){k(o[N],E[N],P==="/"?P+N:P+"/"+N);}}else if(o!==E){throw new Error(P+": actual value "+o+" does not match expected value "+E);}}function l(o,E,i,n){try{k(o,E,"/");QUnit.assert.pushResult({result:n,actual:o,expected:E,message:i});}catch(t){QUnit.assert.pushResult({result:!n,actual:o,expected:E,message:(i||"")+" failed because of "+t.message});}}T={awaitRendering:function(){if(sap.ui.getCore().getUIDirty()){return new Promise(function(i){function n(){if(sap.ui.getCore().getUIDirty()){setTimeout(n,1);}else{i();}}n();});}},deepContains:function(o,E,i){l(o,E,i,true);},notDeepContains:function(o,E,i){l(o,E,i,false);},useFakeServer:function(S,B,F){var i;function n(P,Q){var V=H(P,Q.requestBody),W=E(Q);Q.respond(200,q.extend({},W,{"Content-Type":"multipart/mixed;boundary="+V.boundary}),y(V,W));}function o(P){var Q={code:P.code||200,headers:P.headers||{},ifMatch:P.ifMatch};if(P.source){Q.message=K(B+P.source);Q.headers["Content-Type"]=Q.headers["Content-Type"]||v(P.source);}else if(typeof P.message==="object"){Q.headers["Content-Type"]=j;Q.message=JSON.stringify(P.message);}else{Q.message=P.message;}return Q;}function t(){var P,Q,V={};for(Q in F){P=F[Q];if(!Q.includes(" ")){Q="GET "+Q;}if(Array.isArray(P)){V[Q]=P.map(o);}else{V[Q]=[o(P)];}}return V;}function v(P){if(/\.xml$/.test(P)){return"application/xml";}if(/\.json$/.test(P)){return j;}return"application/x-octet-stream";}function w(P,Q,V){L.error(Q.requestLine,V,"sap.ui.test.TestUtils");return{code:P,headers:{"Content-Type":"text/plain"},message:V};}function x(P){return P.slice(0,P.indexOf("\r\n"));}function y(P,Q){var V=[""];P.parts.forEach(function(W){V.push(W.boundary?"\r\nContent-Type: multipart/mixed;boundary="+W.boundary+"\r\n\r\n"+y(W,Q):z(W,Q));});V.push("--\r\n");return V.join("--"+P.boundary);}function z(P,Q){var V=q.extend({},Q,P.headers);return M+(P.contentId?"Content-ID: "+P.contentId+"\r\n":"")+"\r\nHTTP/1.1 "+P.code+" \r\n"+Object.keys(V).map(function(W){return W+": "+V[W];}).join("\r\n")+"\r\n\r\n"+(P.message||"")+"\r\n";}function E(P){var Q,V={};for(Q in P.requestHeaders){if(g.test(Q)){V[Q]=P.requestHeaders[Q];}}return V;}function G(P,Q){var V,W=i[P.method+" "+P.url];W=(W||[]).filter(function(V){if(typeof V.ifMatch==="function"){return V.ifMatch(P);}return!V.ifMatch||V.ifMatch.test(P.requestBody);});if(W.length){V=W[0];}else{switch(P.method){case"HEAD":V={code:200};break;case"DELETE":case"MERGE":case"PATCH":V={code:204};break;case"POST":V={code:200,headers:{"Content-Type":j},message:P.requestBody};break;}}if(V){L.info(P.method+" "+P.url,'{"If-Match":'+JSON.stringify(P.requestHeaders["If-Match"])+'}',"sap.ui.test.TestUtils");}else{V=w(404,P,"No mock data found");}V.headers=q.extend({},E(P),V.headers);if(Q&&V.code<300){V.contentId=Q;}return V;}function H(P,Q){var V;Q=Q.replace(/^\s+/,"");V=x(Q);return{boundary:x(Q).slice(2),parts:Q.split(V).slice(1,-1).map(function(W){var X,Y,Z,$,_,a1;W=W.slice(2);Y=x(W);if(d.test(Y)){$=H(P,W.slice(Y.length+4));X=$.parts.filter(function(b1){return b1.code>=300;});return X.length?X[0]:$;}a1=W.indexOf("\r\n\r\n")+4;_=I(P,W.slice(a1));Z=b.exec(W.slice(0,a1));return G(_,Z&&Z[1]);})};}function I(P,Q){var V=Q.indexOf("\r\n\r\n"),W,X,Y={requestHeaders:{}};Y.requestBody=Q.slice(V+4,Q.length-2);Q=Q.slice(0,V);W=Q.split("\r\n");Y.requestLine=W.shift();X=f.exec(Y.requestLine);if(X){Y.method=X[1];Y.url=P+X[2];W.forEach(function(Z){var X=c.exec(Z);if(X){Y.requestHeaders[X[1]]=X[2];}});}return Y;}function J(P){var Q=P.url;if(r.test(Q)){n(Q.slice(0,Q.indexOf("/$batch")+1),P);}else{N(P);}}function K(P){var Q=m[P];if(!Q){q.ajax({async:false,url:P,dataType:"text",success:function(V){Q=V;}});if(!Q){throw new Error(P+": resource not found");}m[P]=Q;}return Q;}function N(P){var Q=G(P);P.respond(Q.code,Q.headers,Q.message);}function O(){var P,Q;i=t();Q=sinon.fakeServer.create();S.add(Q);Q.autoRespond=true;if(A){Q.autoRespondAfter=parseInt(A);}Q.respondWith("GET",/./,N);Q.respondWith("DELETE",/./,N);Q.respondWith("HEAD",/./,N);Q.respondWith("PATCH",/./,N);Q.respondWith("MERGE",/./,N);Q.respondWith("POST",/./,J);P=Q.restore;Q.restore=function(){sinon.FakeXMLHttpRequest.filters=[];P.apply(this,arguments);};sinon.xhr.supportsCORS=q.support.cors;sinon.FakeXMLHttpRequest.useFilters=true;sinon.FakeXMLHttpRequest.addFilter(function(V,W){return V!=="DELETE"&&V!=="HEAD"&&V!=="MERGE"&&V!=="PATCH"&&V!=="POST"&&!(V+" "+W in i);});}B=sap.ui.require.toUrl(B).replace(/(^|\/)resources\/(~[-a-zA-Z0-9_.]*~\/)?/,"$1test-resources/")+"/";O();},withNormalizedMessages:function(n){var S=sinon.sandbox.create();try{var o=sap.ui.getCore(),G=o.getLibraryResourceBundle;S.stub(o,"getLibraryResourceBundle").returns({getText:function(K,t){var v=K,w=G.call(o).getText(K),i;for(i=0;i<10;i+=1){if(w.indexOf("{"+i+"}")>=0){v+=" "+(i>=t.length?"{"+i+"}":t[i]);}}return v;}});n.apply(this);}finally{S.verifyAndRestore();}},isRealOData:function(){return h;},isSupportAssistant:function(){return s;},getRealOData:function(){return R?"&realOData="+R:"";},proxy:function(i){var P,Q;if(!p){return i;}Q=i.indexOf("?");P=sap.ui.require.toUrl("sap/ui").replace("resources/sap/ui","proxy");return new a(P+i,document.baseURI).pathname().toString()+(Q>=0?i.slice(Q):"");},retrieveData:function(K){var v=D[K];delete D[K];return v;},setData:function(K,v){D[K]=v;},setupODataV4Server:function(S,F,i,n){var o={};if(h){return;}if(!n){n="/";}else if(n.slice(-1)!=="/"){n+="/";}Object.keys(F).forEach(function(t){var v=e.exec(t),w,x;if(v){w=v[1]||"GET";x=v[2];}else{w="GET";x=t;}if(!x.startsWith("/")){x=n+x;}o[w+" "+x]=F[t];});T.useFakeServer(S,i||"sap/ui/core/qunit/odata/v4/data",o);}};return T;},true);

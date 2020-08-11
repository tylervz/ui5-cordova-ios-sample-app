/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/model/BindingMode','sap/ui/model/Context','sap/ui/model/Model','./ODataUtils','./CountMode','./ODataContextBinding','./ODataListBinding','./ODataMetadata','./ODataPropertyBinding','./ODataTreeBinding','sap/ui/model/FilterProcessor','sap/ui/model/odata/ODataMetaModel','sap/ui/thirdparty/URI','sap/ui/thirdparty/datajs',"sap/base/util/uid","sap/base/util/merge","sap/base/Log","sap/base/assert","sap/base/security/encodeURL","sap/ui/thirdparty/jquery","sap/base/util/isPlainObject"],function(B,C,M,O,a,b,c,d,e,f,F,g,U,h,u,m,L,n,o,q,p){"use strict";var r=M.extend("sap.ui.model.odata.ODataModel",{constructor:function(s,j,i,P,H,t,w,l){M.apply(this,arguments);var k,R,v,A=null,x,y,D,S,z,E,G=this;if(typeof(s)==="object"){j=s;s=j.serviceUrl;}if(typeof j==="object"){i=j.user;P=j.password;H=j.headers;t=j.tokenHandling;l=j.loadMetadataAsync;w=j.withCredentials;v=j.maxDataServiceVersion;k=j.useBatch;R=j.refreshAfterChange;A=j.annotationURI;x=j.loadAnnotationsJoined;D=j.defaultCountMode;y=j.metadataNamespaces;S=j.serviceUrlParams;z=j.metadataUrlParams;E=j.skipMetadataAnnotationParsing;j=j.json;}this.oServiceData={};this.sDefaultBindingMode=B.OneWay;this.mSupportedBindingModes={"OneWay":true,"OneTime":true,"TwoWay":true};this.mUnsupportedFilterOperators={"Any":true,"All":true};this.bCountSupported=true;this.bJSON=j;this.bCache=true;this.aPendingRequestHandles=[];this.oRequestQueue={};this.aBatchOperations=[];this.oHandler;this.bTokenHandling=t!==false;this.bWithCredentials=w===true;this.bUseBatch=k===true;this.bRefreshAfterChange=R!==false;this.sMaxDataServiceVersion=v;this.bLoadMetadataAsync=!!l;this.bLoadAnnotationsJoined=x===undefined?true:x;this.sAnnotationURI=A;this.sDefaultCountMode=D||a.Both;this.oMetadataLoadEvent=null;this.oMetadataFailedEvent=null;this.bSkipMetadataAnnotationParsing=E;this.oHeaders={};this.setHeaders(H);this.oData={};this.oMetadata=null;this.oAnnotations=null;this.aUrlParams=[];if(s.indexOf("?")==-1){this.sServiceUrl=s;}else{var I=s.split("?");this.sServiceUrl=I[0];if(I[1]){this.aUrlParams.push(I[1]);}}if(sap.ui.getCore().getConfiguration().getStatistics()){this.aUrlParams.push("sap-statistics=true");}this.sServiceUrl=this.sServiceUrl.replace(/\/$/,"");var J=this._createRequestUrl("$metadata",undefined,z);if(!r.mServiceData[J]){r.mServiceData[J]={};}this.oServiceData=r.mServiceData[J];if(this.bTokenHandling&&this.oServiceData.securityToken){this.oHeaders["x-csrf-token"]=this.oServiceData.securityToken;}this.sUser=i;this.sPassword=P;this.oHeaders["Accept-Language"]=sap.ui.getCore().getConfiguration().getLanguageTag();if(!this.oServiceData.oMetadata){this.oServiceData.oMetadata=new d(J,{async:this.bLoadMetadataAsync,user:this.sUser,password:this.sPassword,headers:this.mCustomHeaders,namespaces:y,withCredentials:this.bWithCredentials});}this.oMetadata=this.oServiceData.oMetadata;this.pAnnotationsLoaded=this.oMetadata.loaded();if(this.sAnnotationURI||!this.bSkipMetadataAnnotationParsing){var K=this._getAnnotationParser();if(!this.bSkipMetadataAnnotationParsing){if(!this.bLoadMetadataAsync){this.addAnnotationXML(this.oMetadata.sMetadataBody,!!this.sAnnotationURI);}else{this.pAnnotationsLoaded=this.oMetadata.loaded().then(function(N,Q){if(this.bDestroyed){return Promise.reject();}return this.addAnnotationXML(Q["metadataString"],N);}.bind(this,!!this.sAnnotationURI));}}if(this.sAnnotationURI){if(this.bLoadMetadataAsync){this.pAnnotationsLoaded=this.pAnnotationsLoaded.then(K.addUrl.bind(K,this.sAnnotationURI));}else{this.pAnnotationsLoaded=Promise.all([this.pAnnotationsLoaded,K.addUrl(this.sAnnotationURI)]);}}}if(S){this.aUrlParams=this.aUrlParams.concat(O._createUrlParamsArray(S));}this.onMetadataLoaded=function(N){G._initializeMetadata();G.initialize();};this.onMetadataFailed=function(N){G.fireMetadataFailed(N.getParameters());};if(!this.oMetadata.isLoaded()){this.oMetadata.attachLoaded(this.onMetadataLoaded);this.oMetadata.attachFailed(this.onMetadataFailed);}if(this.oMetadata.isFailed()){this.refreshMetadata();}if(this.oMetadata.isLoaded()){this._initializeMetadata(true);}if(this.bJSON){if(this.sMaxDataServiceVersion==="3.0"){this.oHeaders["Accept"]="application/json;odata=fullmetadata";}else{this.oHeaders["Accept"]="application/json";}this.oHandler=h.jsonHandler;}else{this.oHeaders["Accept"]="application/atom+xml,application/atomsvc+xml,application/xml";this.oHandler=h.atomHandler;}this.oHeaders["MaxDataServiceVersion"]="2.0";if(this.sMaxDataServiceVersion){this.oHeaders["MaxDataServiceVersion"]=this.sMaxDataServiceVersion;}this.oHeaders["DataServiceVersion"]="2.0";},metadata:{publicMethods:["create","remove","update","submitChanges","getServiceMetadata","read","hasPendingChanges","refresh","refreshMetadata","resetChanges","isCountSupported","setCountSupported","setDefaultCountMode","getDefaultCountMode","forceNoCache","setProperty","getSecurityToken","refreshSecurityToken","setHeaders","getHeaders","setUseBatch"]}});r.M_EVENTS={RejectChange:"rejectChange",MetadataLoaded:"metadataLoaded",MetadataFailed:"metadataFailed",AnnotationsLoaded:"annotationsLoaded",AnnotationsFailed:"annotationsFailed"};r.mServiceData={};r.prototype.fireRejectChange=function(P){this.fireEvent("rejectChange",P);return this;};r.prototype.attachRejectChange=function(D,i,l){this.attachEvent("rejectChange",D,i,l);return this;};r.prototype.detachRejectChange=function(i,l){this.detachEvent("rejectChange",i,l);return this;};r.prototype._initializeMetadata=function(D){var t=this;this.bUseBatch=this.bUseBatch||this.oMetadata.getUseBatch();var i=function(j){if(!!j){t.metadataLoadEvent=setTimeout(i.bind(t),0);}else{if(t.oMetadata){t.fireMetadataLoaded({metadata:t.oMetadata});L.debug("ODataModel fired metadataloaded");}}};if(this.sAnnotationURI&&this.bLoadAnnotationsJoined){if(this.oAnnotations&&(this.oAnnotations.bInitialized||this.oAnnotations.isFailed())){i(!this.bLoadMetadataAsync);}else{this.oAnnotations.attachEventOnce("loaded",function(){i(true);});}}else{i(D);}};r.prototype.fireAnnotationsLoaded=function(P){if(!this.bLoadMetadataAsync){setTimeout(this.fireEvent.bind(this,"annotationsLoaded",P),0);}else{this.fireEvent("annotationsLoaded",P);}return this;};r.prototype.attachAnnotationsLoaded=function(D,i,l){this.attachEvent("annotationsLoaded",D,i,l);return this;};r.prototype.detachAnnotationsLoaded=function(i,l){this.detachEvent("annotationsLoaded",i,l);return this;};r.prototype.fireAnnotationsFailed=function(P){if(!this.bLoadMetadataAsync){setTimeout(this.fireEvent.bind(this,"annotationsFailed",P),0);}else{this.fireEvent("annotationsFailed",P);}L.debug("ODataModel fired annotationsFailed");return this;};r.prototype.attachAnnotationsFailed=function(D,i,l){this.attachEvent("annotationsFailed",D,i,l);return this;};r.prototype.detachAnnotationsFailed=function(i,l){this.detachEvent("annotationsFailed",i,l);return this;};r.prototype.fireMetadataLoaded=function(P){this.fireEvent("metadataLoaded",P);return this;};r.prototype.attachMetadataLoaded=function(D,i,l){this.attachEvent("metadataLoaded",D,i,l);return this;};r.prototype.detachMetadataLoaded=function(i,l){this.detachEvent("metadataLoaded",i,l);return this;};r.prototype.fireMetadataFailed=function(P){this.fireEvent("metadataFailed",P);return this;};r.prototype.attachMetadataFailed=function(D,i,l){this.attachEvent("metadataFailed",D,i,l);return this;};r.prototype.detachMetadataFailed=function(i,l){this.detachEvent("metadataFailed",i,l);return this;};r.prototype.refreshMetadata=function(){if(this.oMetadata&&this.oMetadata.refresh){this.oMetadata.refresh();}};r.prototype._createRequestUrl=function(P,i,j,k,l){var s,R,t,v="";if(P&&P.indexOf('?')!=-1){t=P.substr(P.indexOf('?')+1);P=P.substr(0,P.indexOf('?'));}R=this._normalizePath(P,i);if(!k){v=this.sServiceUrl+R;}else{v=R.substr(R.indexOf('/')+1);}s=O._createUrlParamsArray(j);if(this.aUrlParams){s=s.concat(this.aUrlParams);}if(t){s.push(t);}if(s.length>0){v+="?"+s.join("&");}if(l===undefined){l=true;}if(l===false){var w=q.now();var x=v.replace(/([?&])_=[^&]*/,"$1_="+w);v=x+((x===v)?(/\?/.test(v)?"&":"?")+"_="+w:"");}return v;};r.prototype._loadData=function(P,i,s,E,j,H,k){var R,l,t=this;function _(D,z){var A=D,G={};if(z.statusCode==204){if(s){s(null);}if(k){k(null);}t.fireRequestCompleted({url:l.requestUri,type:"GET",async:l.async,info:"Accept headers:"+t.oHeaders["Accept"],infoObject:{acceptHeaders:t.oHeaders["Accept"]},success:true});return;}if(!A){L.fatal("The following problem occurred: No data was retrieved by service: "+z.requestUri);t.fireRequestCompleted({url:l.requestUri,type:"GET",async:l.async,info:"Accept headers:"+t.oHeaders["Accept"],infoObject:{acceptHeaders:t.oHeaders["Accept"]},success:false});return false;}if(t.bUseBatch){var I=t._getBatchErrors(D);if(I.length>0){v(I[0]);return false;}if(A.__batchResponses&&A.__batchResponses.length>0){A=A.__batchResponses[0].data;}else{L.fatal("The following problem occurred: No data was retrieved by service: "+z.requestUri);}}x=x.concat(A.results);if(A.__next){var J=new U(A.__next);l.requestUri=J.absoluteTo(z.requestUri).toString();w(l);}else{if(A.results){var V,K;for(K in x){V=x[K];if(x===V){continue;}A.results[K]=V;}}if(A.results&&!Array.isArray(A.results)){A=A.results;}t._importData(A,G);if(t.sChangeKey&&G){var N=t.sChangeKey.substr(t.sChangeKey.lastIndexOf('/')+1);if(G[N]){delete t.oRequestQueue[t.sChangeKey];t.sChangeKey=null;}}if(s){s(A);}t.checkUpdate(false,false,G);if(k){k(A);}t.fireRequestCompleted({url:l.requestUri,type:"GET",async:l.async,info:"Accept headers:"+t.oHeaders["Accept"],infoObject:{acceptHeaders:t.oHeaders["Accept"]},success:true});}}function v(z){if(t.bTokenHandling&&z.response){var T=t._getHeader("x-csrf-token",z.response.headers);if(!l.bTokenReset&&z.response.statusCode=='403'&&T&&T.toLowerCase()=="required"){t.resetSecurityToken();l.bTokenReset=true;w();return;}}var A=t._handleError(z);if(E){E(z,R&&R.bAborted);}t.fireRequestCompleted({url:l.requestUri,type:"GET",async:l.async,info:"Accept headers:"+t.oHeaders["Accept"],infoObject:{acceptHeaders:t.oHeaders["Accept"]},success:false,errorobject:A});if(!R||!R.bAborted){A.url=l.requestUri;t.fireRequestFailed(A);}}function w(){if(t.bUseBatch){t.updateSecurityToken();var z=U.parse(l.requestUri).query;var A=t._createRequestUrl(P,null,z,t.bUseBatch);l=t._createRequest(A,"GET",true);if(t.bTokenHandling){delete l.headers["x-csrf-token"];}var D=t._createBatchRequest([l],true);R=t._request(D,_,v,h.batchHandler,undefined,t.getServiceMetadata());}else{R=t._request(l,_,v,t.oHandler,undefined,t.getServiceMetadata());}if(H){var W={abort:function(){R.bAborted=true;R.abort();}};H(W);}}var x=[];var y=this._createRequestUrl(P,null,i,null,j||this.bCache);l=this._createRequest(y,"GET",true);if(t.bTokenHandling){delete l.headers["x-csrf-token"];}this.fireRequestSent({url:l.requestUri,type:"GET",async:l.async,info:"Accept headers:"+this.oHeaders["Accept"],infoObject:{acceptHeaders:this.oHeaders["Accept"]}});w();};r.prototype._importData=function(D,k){var t=this,l,K,R,E;if(D.results){l=[];q.each(D.results,function(i,j){l.push(t._importData(j,k));});return l;}else{K=this._getKey(D);E=this.oData[K];if(!E){E=D;this.oData[K]=E;}q.each(D,function(N,P){if(P&&(P.__metadata&&P.__metadata.uri||P.results)&&!P.__deferred){R=t._importData(P,k);if(Array.isArray(R)){E[N]={__list:R};}else{E[N]={__ref:R};}}else if(!P||!P.__deferred){E[N]=P;}});k[K]=true;return K;}};r.prototype._removeReferences=function(D){var t=this,l;if(D.results){l=[];q.each(D.results,function(i,j){l.push(t._removeReferences(j));});return l;}else{q.each(D,function(P,i){if(i){if(i["__ref"]||i["__list"]){delete D[P];}}});return D;}};r.prototype._restoreReferences=function(D){var t=this,l,R=[];if(D.results){l=[];q.each(D.results,function(i,j){l.push(t._restoreReferences(j));});return l;}else{q.each(D,function(P,i){if(i&&i["__ref"]){var k=t._getObject("/"+i["__ref"]);n(k,"ODataModel inconsistent: "+i["__ref"]+" not found!");if(k){delete i["__ref"];D[P]=k;t._restoreReferences(k);}}else if(i&&i["__list"]){q.each(i["__list"],function(j,E){var k=t._getObject("/"+i["__list"][j]);n(k,"ODataModel inconsistent: "+i["__list"][j]+" not found!");if(k){R.push(k);t._restoreReferences(k);}});delete i["__list"];i.results=R;R=[];}});return D;}};r.prototype.removeData=function(){this.oData={};};r.prototype.initialize=function(){var i=this.getBindings();q.each(i,function(I,j){j.initialize();});};r.prototype.refresh=function(i,R){if(R){this.removeData();}this._refresh(i);};r.prototype._refresh=function(i,j,E){var k=this.getBindings();q.each(k,function(I,l){l.refresh(i,j,E);});};r.prototype.checkUpdate=function(i,A,j,k){if(A){if(!this.sUpdateTimer){this.sUpdateTimer=setTimeout(function(){this.checkUpdate(i,false,j);}.bind(this),0);}return;}if(this.sUpdateTimer){clearTimeout(this.sUpdateTimer);this.sUpdateTimer=null;}var l=this.getBindings();q.each(l,function(I,s){if(!k||this.isMetaModelPath(s.getPath())){s.checkUpdate(i,j);}}.bind(this));};r.prototype.bindProperty=function(P,i,j){var k=new e(this,P,i,j);return k;};r.prototype.bindList=function(P,i,s,j,k){var l=new c(this,P,i,s,j,k);return l;};r.prototype.bindTree=function(P,i,j,k){var l=new f(this,P,i,j,k);return l;};r.prototype.createBindingContext=function(P,i,j,k,R){var R=!!R,s=this.resolve(P,i);if(typeof i=="function"){k=i;i=null;}if(typeof j=="function"){k=j;j=null;}if(!s){if(k){k(null);}return null;}var D=this._getObject(P,i),K,N,t=this;if(!R){R=this._isReloadNeeded(s,D,j);}if(!R){K=this._getKey(D);N=this.getContext('/'+K);if(k){k(N);}return N;}if(k){var I=!P.startsWith("/");if(s){var l=[],v=this.createCustomParams(j);if(v){l.push(v);}this._loadData(s,l,function(D){K=D?t._getKey(D):undefined;if(K&&i&&I){var w=i.getPath();w=w.substr(1);if(t.oData[w]){t.oData[w][P]={__ref:K};}}N=t.getContext('/'+K);k(N);},function(){k(null);});}else{k(null);}}};r.prototype._isReloadNeeded=function(s,D,P){var N,j=[],S,k=[];if(!s){return false;}if(!D){return true;}if(P&&P["expand"]){N=P["expand"].replace(/\s/g,"");j=N.split(',');}if(j){for(var i=0;i<j.length;i++){var l=j[i].indexOf("/");if(l!==-1){var t=j[i].slice(0,l);var v=j[i].slice(l+1);j[i]=[t,v];}}}for(var i=0;i<j.length;i++){var w=j[i];if(Array.isArray(w)){var x=D[w[0]];var y=w[1];if(!x||(x&&x.__deferred)){return true;}else{if(x){if(x.__list&&x.__list.length>0){for(var z=0;z<x.__list.length;z++){var A="/"+x.__list[z];var E=this.getObject(A);var R=this._isReloadNeeded(A,E,{expand:y});if(R){return true;}}}else if(x.__ref){var A="/"+x.__ref;var E=this.getObject(A);var R=this._isReloadNeeded(A,E,{expand:y});if(R){return true;}}}}}else{if(D[w]===undefined||(D[w]&&D[w].__deferred)){return true;}}}if(P&&P["select"]){S=P["select"].replace(/\s/g,"");k=S.split(',');}for(var i=0;i<k.length;i++){if(D[k[i]]===undefined){return true;}}if(k.length==0){var G=this.oMetadata._getEntityTypeByPath(s);if(!G){return false;}else{for(var i=0;i<G.property.length;i++){if(D[G.property[i].name]===undefined){return true;}}}}return false;};r.prototype.destroyBindingContext=function(i){};r.prototype.createCustomParams=function(P){var i=[],j,s={expand:true,select:true};for(var N in P){if(N in s){i.push("$"+N+"="+o(P[N]));}if(N=="custom"){j=P[N];for(var N in j){if(N.indexOf("$")==0){L.warning("Trying to set OData parameter "+N+" as custom query option!");}else{i.push(N+"="+o(j[N]));}}}}return i.join("&");};r.prototype.bindContext=function(P,i,j){var k=new b(this,P,i,j);return k;};r.prototype.setCountSupported=function(i){this.bCountSupported=i;};r.prototype.isCountSupported=function(){return this.bCountSupported;};r.prototype.setDefaultCountMode=function(s){this.sDefaultCountMode=s;};r.prototype.getDefaultCountMode=function(){return this.sDefaultCountMode;};r.prototype._getKey=function(i,D){var k,s;if(i instanceof C){k=i.getPath().substr(1);}else if(i&&i.__metadata&&i.__metadata.uri){s=i.__metadata.uri;k=s.substr(s.lastIndexOf("/")+1);}if(D){k=decodeURIComponent(k);}return k;};r.prototype.getKey=function(i,D){return this._getKey(i,D);};r.prototype.createKey=function(s,k,D){var E=this.oMetadata._getEntityTypeByPath(s),K=s,t=this,N,v,P;n(E,"Could not find entity type of collection \""+s+"\" in service metadata!");K+="(";if(E.key.propertyRef.length==1){N=E.key.propertyRef[0].name;n(N in k,"Key property \""+N+"\" is missing in object!");P=this.oMetadata._getPropertyMetadata(E,N);v=O.formatValue(k[N],P.type);K+=D?v:encodeURIComponent(v);}else{q.each(E.key.propertyRef,function(i,j){if(i>0){K+=",";}N=j.name;n(N in k,"Key property \""+N+"\" is missing in object!");P=t.oMetadata._getPropertyMetadata(E,N);v=O.formatValue(k[N],P.type);K+=N;K+="=";K+=D?v:encodeURIComponent(v);});}K+=")";return K;};r.prototype.getProperty=function(P,i,I){var v=this._getObject(P,i);if(I==null||I==undefined){return v;}if(!p(v)){return v;}v=m({},v);if(I==true){return this._restoreReferences(v);}else{return this._removeReferences(v);}};r.prototype._getObject=function(P,i){var N=this.isLegacySyntax()?this.oData:null,R=this.resolve(P,i),s,D,j,k,K,l;if(this.oMetadata&&R&&R.indexOf('/#')>-1){if(this.isMetaModelPath(R)){s=R.indexOf('/##');l=this.getMetaModel();if(!this.bMetaModelLoaded){return null;}D=R.substr(0,s);j=R.substr(s+3);k=l.getMetaContext(D);N=l.getProperty(j,k);}else{N=this.oMetadata._getAnnotation(R);}}else{if(i){K=i.getPath();K=K.substr(1);N=this.oData[K];}if(!P){return N;}var t=P.split("/"),I=0;if(!t[0]){N=this.oData;I++;}while(N&&t[I]){N=N[t[I]];if(N){if(N.__ref){N=this.oData[N.__ref];}else if(N.__list){N=N.__list;}else if(N.__deferred){N=undefined;}}I++;}}return N;};r.prototype.updateSecurityToken=function(){if(this.bTokenHandling){if(!this.oServiceData.securityToken){this.refreshSecurityToken();}if(this.bTokenHandling){this.oHeaders["x-csrf-token"]=this.oServiceData.securityToken;}}};r.prototype.resetSecurityToken=function(){delete this.oServiceData.securityToken;delete this.oHeaders["x-csrf-token"];};r.prototype.getSecurityToken=function(){var t=this.oServiceData.securityToken;if(!t){this.refreshSecurityToken();t=this.oServiceData.securityToken;}return t;};r.prototype.refreshSecurityToken=function(s,E,A){var t=this,i,T;A=A===true;i=this._createRequestUrl("/");var R=this._createRequest(i,"GET",A);R.headers["x-csrf-token"]="Fetch";function _(D,k){if(k){T=t._getHeader("x-csrf-token",k.headers);if(T){t.oServiceData.securityToken=T;t.oHeaders["x-csrf-token"]=T;}else{t.resetSecurityToken();t.bTokenHandling=false;}}if(s){s(D,k);}}function j(k){t.resetSecurityToken();t.bTokenHandling=false;t._handleError(k);if(E){E(k);}}return this._request(R,_,j,undefined,undefined,this.getServiceMetadata());};r.prototype._submitRequest=function(R,i,s,E,H,I){var t=this,j,k={};function _(D,w){if(i&&H){var x=t._getBatchErrors(D);if(x.length>0){l(x[0]);return false;}if(D.__batchResponses&&D.__batchResponses.length>0){j=D.__batchResponses[0].data;if(!j&&D.__batchResponses[0].__changeResponses){j=D.__batchResponses[0].__changeResponses[0].data;}}D=j;}if(I){if(D&&D.__batchResponses){q.each(D.__batchResponses,function(y,w){if(w&&w.data){t._importData(w.data,k);}});}}t._handleETag(R,w,i);t._updateRequestQueue(R,i);if(t._isRefreshNeeded(R,w)){t._refresh(false,R.keys,R.entityTypes);}if(s){s(D,w);}}function l(w){if(t.bTokenHandling&&w.response){var T=t._getHeader("x-csrf-token",w.response.headers);if(!R.bTokenReset&&w.response.statusCode=='403'&&T&&T.toLowerCase()=="required"){t.resetSecurityToken();R.bTokenReset=true;v();return;}}t._handleError(w);if(E){E(w);}}function v(){if(t.bTokenHandling){delete R.headers["x-csrf-token"];}if(t.bTokenHandling&&R.method!=="GET"){t.updateSecurityToken();if(t.bTokenHandling){R.headers["x-csrf-token"]=t.oServiceData.securityToken;}}if(i){return t._request(R,_,l,h.batchHandler,undefined,t.getServiceMetadata());}else{return t._request(R,_,l,t.oHandler,undefined,t.getServiceMetadata());}}return v();};r.prototype._createBatchRequest=function(s,A){var t,R,v={},P={},K={},E={};P.__batchRequests=s;t=this.sServiceUrl+"/$batch";if(this.aUrlParams.length>0){t+="?"+this.aUrlParams.join("&");}q.extend(v,this.mCustomHeaders,this.oHeaders);delete v["Content-Type"];R={headers:v,requestUri:t,method:"POST",data:P,user:this.sUser,password:this.sPassword,async:A};if(A){R.withCredentials=this.bWithCredentials;}q.each(s,function(i,w){if(w["__changeRequests"]){q.each(w["__changeRequests"],function(j,x){if(x.keys&&x.method!="POST"){q.each(x.keys,function(k,l){K[k]=l;});}else if(x.entityTypes&&x.method=="POST"){q.each(x.entityTypes,function(l,k){E[l]=k;});}});}});R.keys=K;R.entityTypes=E;return R;};r.prototype._handleETag=function(R,k,l){var s,E,t,v,w,x;if(l){w=R.data.__batchRequests;x=k.data.__batchResponses;if(x&&w){for(var i=0;i<w.length;i++){t=w[i].__changeRequests;if(x[i]){v=x[i].__changeResponses;if(t&&v){for(var j=0;j<t.length;j++){if(t[j].method=="MERGE"||t[j].method=="PUT"){s=t[j].requestUri.replace(this.sServiceUrl+'/','');if(!s.startsWith("/")){s="/"+s;}E=this._getObject(s);if(E&&E.__metadata&&v[j].headers&&v[j].headers.ETag){E.__metadata.etag=v[j].headers.ETag;}}}}}else{L.warning("could not update ETags for batch request: corresponding response for request missing");}}}else{L.warning("could not update ETags for batch request: no batch responses/requests available");}}else{s=R.requestUri.replace(this.sServiceUrl+'/','');if(!s.startsWith("/")){s="/"+s;}E=this._getObject(s);if(E&&E.__metadata&&k.headers.ETag){E.__metadata.etag=k.headers.ETag;}}};r.prototype._handleBatchErrors=function(R,D){this._getBatchErrors(D);this._handleETag();};r.prototype._getBatchErrors=function(D){var E=[],s;q.each(D.__batchResponses,function(i,j){if(j.message){s="The following problem occurred: "+j.message;if(j.response){s+=j.response.statusCode+","+j.response.statusText+","+j.response.body;}E.push(j);L.fatal(s);}if(j.__changeResponses){q.each(j.__changeResponses,function(i,k){if(k.message){s="The following problem occurred: "+k.message;if(k.response){s+=k.response.statusCode+","+k.response.statusText+","+k.response.body;}E.push(k);L.fatal(s);}});}});return E;};r.prototype._handleError=function(E){var P={},t;var s="The following problem occurred: "+E.message;P.message=E.message;if(E.response){if(this.bTokenHandling){t=this._getHeader("x-csrf-token",E.response.headers);if(E.response.statusCode=='403'&&t&&t.toLowerCase()=="required"){this.resetSecurityToken();}}s+=E.response.statusCode+","+E.response.statusText+","+E.response.body;P.statusCode=E.response.statusCode;P.statusText=E.response.statusText;P.responseText=E.response.body;}L.fatal(s);return P;};r.prototype.getData=function(P,i,I){return this.getProperty(P,i,I);};r.prototype._getETag=function(P,i,E){var s,j,I;if(E){s=E;}else{if(i&&i.__metadata){s=i.__metadata.etag;}else if(P){j=P.replace(this.sServiceUrl+'/','');I=j.indexOf("?");if(I>-1){j=j.substr(0,I);}if(this.oData.hasOwnProperty(j)){s=this.getProperty('/'+j+'/__metadata/etag');}}}return s;};r.prototype._createRequest=function(s,i,A,P,E){var j={},k;q.extend(j,this.mCustomHeaders,this.oHeaders);k=this._getETag(s,P,E);if(k&&i!="GET"){j["If-Match"]=k;}if(this.bJSON&&i!="DELETE"&&this.sMaxDataServiceVersion==="2.0"){j["Content-Type"]="application/json";}if(i=="MERGE"&&!this.bUseBatch){j["x-http-method"]="MERGE";i="POST";}var R={headers:j,requestUri:s,method:i,user:this.sUser,password:this.sPassword,async:A};if(P){R.data=P;}if(A){R.withCredentials=this.bWithCredentials;}return R;};r.prototype._isRefreshNeeded=function(R,i){var j=false,E,k=[],t=this;if(!this.bRefreshAfterChange){return j;}if(R.data&&Array.isArray(R.data.__batchRequests)){if(i){k=t._getBatchErrors(i.data);q.each(k,function(I,l){if(l.response&&l.response.statusCode=="412"){E=l.response.statusCode;return false;}});if(!!E){return false;}}q.each(R.data.__batchRequests,function(I,l){if(Array.isArray(l.__changeRequests)){q.each(l.__changeRequests,function(I,s){j=j||t._isRefreshNeeded(s);return!j;});}return!j;});}else{if(R.method==="GET"){return false;}else{if(i&&i.statusCode=="412"){j=false;}else{j=true;}}}return j;};r.prototype.update=function(P,D,i){var s,E,j,R,k,l,t,v,w,S,K,x,A=false;if(i instanceof C||arguments.length>3){l=i;s=arguments[3];E=arguments[4];j=arguments[5];}else{l=i.context||i.oContext;s=i.success||i.fnSuccess;E=i.error||i.fnError;t=i.eTag||i.sETag;j=typeof(i.merge)=="undefined"?i.bMerge===true:i.merge===true;A=typeof(i.async)=="undefined"?i.bAsync===true:i.async===true;x=i.urlParameters;}k=this._createRequestUrl(P,l,x,this.bUseBatch);if(j){R=this._createRequest(k,"MERGE",A,D,t);}else{R=this._createRequest(k,"PUT",A,D,t);}P=this._normalizePath(P,l);S=this._getObject(P);R.keys={};if(S){K=this._getKey(S);R.keys[K]=true;}if(this.bUseBatch){w=this._createBatchRequest([{__changeRequests:[R]}],A);v=this._submitRequest(w,this.bUseBatch,s,E,true);}else{v=this._submitRequest(R,this.bUseBatch,s,E);}return v;};r.prototype.create=function(P,D,i){var R,j,s,k,E,l,S,t,A=false,v;if(i&&typeof(i)=="object"&&!(i instanceof C)){l=i.context;S=i.success;v=i.urlParameters;t=i.error;A=i.async===true;}else{l=i;S=arguments[3];t=arguments[4];}s=this._createRequestUrl(P,l,v,this.bUseBatch);R=this._createRequest(s,"POST",A,D);P=this._normalizePath(P,l);E=this.oMetadata._getEntityTypeByPath(P);R.entityTypes={};if(E){R.entityTypes[E.entityType]=true;}if(this.bUseBatch){j=this._createBatchRequest([{__changeRequests:[R]}],A);k=this._submitRequest(j,this.bUseBatch,S,t,true);}else{k=this._submitRequest(R,this.bUseBatch,S,t);}return k;};r.prototype.remove=function(P,i){var j,E,s,S,k,R,l,t,K,v,_,w,x,y,A=false,z=this;if((i instanceof C)||arguments[2]){j=i;S=arguments[2];k=arguments[3];}else if(i){j=i.context||i.oContext;S=i.success||i.fnSuccess;k=i.error||i.fnError;t=i.eTag||i.sETag;v=i.payload||i.oPayload;A=typeof(i.async)=="undefined"?i.bAsync===true:i.async===true;y=i.urlParameters;}_=function(D,G){E=l.substr(l.lastIndexOf('/')+1);if(E.indexOf('?')!=-1){E=E.substr(0,E.indexOf('?'));}delete z.oData[E];delete z.mContexts["/"+E];if(S){S(D,G);}};l=this._createRequestUrl(P,j,y,this.bUseBatch);R=this._createRequest(l,"DELETE",A,v,t);P=this._normalizePath(P,j);s=this._getObject(P);R.keys={};if(s){K=this._getKey(s);R.keys[K]=true;}if(this.bUseBatch){w=this._createBatchRequest([{__changeRequests:[R]}],A);x=this._submitRequest(w,this.bUseBatch,_,k,true);}else{x=this._submitRequest(R,this.bUseBatch,_,k);}return x;};r.prototype.callFunction=function(s,P){var R,i,j,k,l,t,v,S,E,A,w="GET",x={},y=this;if(P&&typeof(P)=="object"){w=P.method?P.method:w;t=P.urlParameters;v=P.context;S=P.success;E=P.error;A=P.async===true;}else{w=P;t=arguments[2];v=arguments[3];S=arguments[4];E=arguments[5];A=arguments[6]===true;}l=this.oMetadata._getFunctionImportMetadata(s,w);n(l,"Function "+s+" not found in the metadata !");if(l){j=this._createRequestUrl(s,v,null,this.bUseBatch);var z=U(j);if(l.parameter!=null){q.each(t,function(D,G){var H=l.parameter.filter(function(J){return J.name==D&&J.mode=="In";});if(H.length>0){var I=H[0];x[D]=O.formatValue(G,I.type);}else{L.warning("Parameter "+D+" is not defined for function call "+s+"!");}});}if(w==="GET"){return y.read(s,v,x,true,S,E);}else{q.each(x,function(D,G){z.addQuery(D,G);});R=this._createRequest(z.toString(),w,A);if(this.bUseBatch){i=this._createBatchRequest([{__changeRequests:[R]}],A);k=this._submitRequest(i,this.bUseBatch,S,E,true);}else{k=this._submitRequest(R,this.bUseBatch,S,E);}return k;}}};r.prototype.read=function(P,i){var R,s,j,k,l,t,A,S,E,v,w,x,y,z,D,G,H;if(i&&typeof(i)=="object"&&!(i instanceof C)){l=i.context;t=i.urlParameters;A=i.async!==false;S=i.success;E=i.error;v=i.filters;w=i.sorters;}else{l=i;t=arguments[2];A=arguments[3]!==false;S=arguments[4];E=arguments[5];}A=A!==false;H=O._createUrlParamsArray(t);y=O.createSortParams(w);if(y){H.push(y);}if(v&&!this.oMetadata){L.fatal("Tried to use filters in read method before metadata is available.");}else{G=this._normalizePath(P,l);D=this.oMetadata&&this.oMetadata._getEntityTypeByPath(G);z=F.groupFilters(v);x=O.createFilterParams(z,this.oMetadata,D);if(x){H.push(x);}}s=this._createRequestUrl(P,l,H,this.bUseBatch);R=this._createRequest(s,"GET",A);if(this.bUseBatch){k=this._createBatchRequest([R],A);j=this._submitRequest(k,this.bUseBatch,S,E,true);}else{j=this._submitRequest(R,this.bUseBatch,S,E);}return j;};r.prototype.createBatchOperation=function(P,s,D,i){var j={},E,S,k,l;q.extend(j,this.mCustomHeaders,this.oHeaders);if(P.startsWith("/")){P=P.substr(1);}if(i){E=i.sETag;}if(s!="GET"){E=this._getETag(P,D,E);if(E){j["If-Match"]=E;}}if(this.bJSON){if(s!="DELETE"&&s!="GET"&&this.sMaxDataServiceVersion==="2.0"){j["Content-Type"]="application/json";}}else{j["Content-Type"]="application/atom+xml";}var R={requestUri:P,method:s.toUpperCase(),headers:j};if(D){R.data=D;}if(s!="GET"&&s!="POST"){if(P&&P.indexOf("/")!=0){P='/'+P;}S=this._getObject(P);if(S){k=this._getKey(S);R.keys={};R.keys[k]=true;}}else if(s=="POST"){var N=P;if(P.indexOf('?')!=-1){N=P.substr(0,P.indexOf('?'));}l=this.oMetadata._getEntityTypeByPath(N);if(l){R.entityTypes={};R.entityTypes[l.entityType]=true;}}return R;};r.prototype.addBatchReadOperations=function(R){if(!Array.isArray(R)||R.length<=0){L.warning("No array with batch operations provided!");return false;}var t=this;q.each(R,function(i,j){if(j.method!="GET"){L.warning("Batch operation should be a GET operation!");return false;}t.aBatchOperations.push(j);});};r.prototype.addBatchChangeOperations=function(i){if(!Array.isArray(i)||i.length<=0){return false;}q.each(i,function(I,j){if(j.method!="POST"&&j.method!="PUT"&&j.method!="MERGE"&&j.method!="DELETE"){L.warning("Batch operation should be a POST/PUT/MERGE/DELETE operation!");return false;}});this.aBatchOperations.push({__changeRequests:i});};r.prototype.clearBatch=function(){this.aBatchOperations=[];};r.prototype.submitBatch=function(s,E,A,i){var R,j,t=this;function _(D,v){if(s){s(D,v,t._getBatchErrors(D));}}if(!(typeof(s)=="function")){var k=A;var l=E;A=s;s=l;E=k;}A=A!==false;if(this.aBatchOperations.length<=0){L.warning("No batch operations in batch. No request will be triggered!");return false;}R=this._createBatchRequest(this.aBatchOperations,A);j=this._submitRequest(R,true,_,E,false,i);this.clearBatch();return j;};r.prototype.getServiceMetadata=function(){if(this.oMetadata&&this.oMetadata.isLoaded()){return this.oMetadata.getServiceMetadata();}};r.prototype.getServiceAnnotations=function(){if(this.oAnnotations&&this.oAnnotations.getAnnotationsData){return this.oAnnotations.getAnnotationsData();}};r.prototype.submitChanges=function(s,E,P){var R,i,t=this,j,k,T,l,S,K;if(this.sChangeKey){j=this.sChangeKey.replace(this.sServiceUrl,'');S=this._getObject(j);i=S;if(p(S)){i=m({},S);if(i.__metadata){T=i.__metadata.type;l=i.__metadata.etag;delete i.__metadata;if(T||l){i.__metadata={};}if(T){i.__metadata.type=T;}if(!!l){i.__metadata.etag=l;}}q.each(i,function(x,y){if(y&&y.__deferred){delete i[x];}});var v=this.oMetadata._getEntityTypeByPath(j);if(v){var N=this.oMetadata._getNavigationPropertyNames(v);q.each(N,function(I,x){delete i[x];});}i=this._removeReferences(i);}if(P&&P.sETag){k=P.sETag;}R=this._createRequest(this.sChangeKey,"MERGE",true,i,k);if(this.sUrlParams){R.requestUri+="?"+this.sUrlParams;}R.keys={};if(S){K=this._getKey(S);R.keys[K]=true;}this.oRequestQueue[this.sChangeKey]=R;}if(q.isEmptyObject(this.oRequestQueue)){return undefined;}if(this.bUseBatch){var w=[];q.each(this.oRequestQueue,function(K,x){delete x._oRef;var y=m({},x);x._oRef=y;y.requestUri=y.requestUri.replace(t.sServiceUrl+'/','');y.data._bCreate?delete y.data._bCreate:false;w.push(y);});R=this._createBatchRequest([{__changeRequests:w}],true);this._submitRequest(R,this.bUseBatch,s,E,true);}else{q.each(this.oRequestQueue,function(K,x){delete x._oRef;var y=m({},x);x._oRef=y;if(y.data&&y.data._bCreate){delete y.data._bCreate;}t._submitRequest(y,this.bUseBatch,s,E,true);});}return undefined;};r.prototype._updateRequestQueue=function(R,k){var l,s,t,v=this;if(k){l=R.data.__batchRequests;if(l){for(var i=0;i<l.length;i++){s=l[i].__changeRequests;if(s){for(var j=0;j<s.length;j++){t=s[j];q.each(this.oRequestQueue,function(K,w){if(w._oRef===t&&K!==v.sChangeKey){delete v.oRequestQueue[K];delete v.oData[K];delete v.mContexts["/"+K];}else if(v.sChangeKey&&K===v.sChangeKey){delete v.oRequestQueue[K];v.sChangeKey=null;}});}}}}}else{q.each(this.oRequestQueue,function(K,w){if(w._oRef===R&&K!==v.sChangeKey){delete v.oRequestQueue[K];delete v.oData[K];delete v.mContexts["/"+K];}else if(v.sChangeKey&&K===v.sChangeKey){delete v.oRequestQueue[K];v.sChangeKey=null;}});}};r.prototype.resetChanges=function(s,E){var P;if(this.sChangeKey){P=this.sChangeKey.replace(this.sServiceUrl,'');this._loadData(P,null,s,E);}};r.prototype.setProperty=function(P,v,j,A){var s,E={},D={},k=this._createRequestUrl(P,j),l=P.substring(0,P.lastIndexOf("/")),K,t,w={},x=false;if(!this.resolve(P,j)){return false;}k=k.replace(this.sServiceUrl+'/','');k=k.substring(0,k.indexOf("/"));k=this.sServiceUrl+'/'+k;s=P.substr(P.lastIndexOf("/")+1);D=this._getObject(l,j);if(!D){return false;}t=l.split("/");for(var i=t.length-1;i>=0;i--){E=this._getObject(t.join("/"),j);if(E){K=this._getKey(E);if(K){break;}}t.splice(i-1,1);}if(!K){K=this._getKey(j);}if(K){w[K]=true;}if(D._bCreate){D[s]=v;x=true;this.checkUpdate(false,A,w);}else{if(!this.sChangeKey){this.sChangeKey=k;}if(this.sChangeKey==k){D[s]=v;x=true;this.checkUpdate(false,A,w);}else{this.fireRejectChange({rejectedValue:v,oldValue:D[s]});}}return x;};r.prototype._isHeaderPrivate=function(H){switch(H.toLowerCase()){case"accept":case"accept-language":case"maxdataserviceversion":case"dataserviceversion":return true;case"x-csrf-token":return this.bTokenHandling;default:return false;}};r.prototype.setHeaders=function(H){var i={},t=this;if(H){q.each(H,function(s,j){if(t._isHeaderPrivate(s)){L.warning("Not allowed to modify private header: "+s);}else{i[s]=j;}});this.mCustomHeaders=i;}else{this.mCustomHeaders={};}if(this.oAnnotations){this.oAnnotations.setHeaders(this.mCustomHeaders);}};r.prototype.getHeaders=function(){return q.extend({},this.mCustomHeaders,this.oHeaders);};r.prototype._getHeader=function(s,H){var i;for(i in H){if(i.toLowerCase()===s.toLowerCase()){return H[i];}}return null;};r.prototype.hasPendingChanges=function(){return this.sChangeKey!=null;};r.prototype.updateBindings=function(i){this.checkUpdate(i);};r.prototype.forceNoCache=function(i){this.bCache=!i;};r.prototype.setTokenHandlingEnabled=function(t){this.bTokenHandling=t;};r.prototype.setUseBatch=function(i){this.bUseBatch=i;};r.prototype.formatValue=function(v,t){return O.formatValue(v,t);};r.prototype.deleteCreatedEntry=function(i){if(i){var P=i.getPath();delete this.mContexts[P];if(P.startsWith("/")){P=P.substr(1);}delete this.oRequestQueue[P];delete this.oData[P];}};r.prototype.createEntry=function(P,v){var E={},k,s,R;if(!P.startsWith("/")){P="/"+P;}var j=this.oMetadata._getEntityTypeByPath(P);if(!j){n(j,"No Metadata for collection "+P+" found");return undefined;}if(typeof v==="object"&&!Array.isArray(v)){E=v;}else{for(var i=0;i<j.property.length;i++){var l=j.property[i];var t=v&&v.indexOf(l.name)>-1;if(!v||t){E[l.name]=this._createPropertyValue(l.type);if(t){v.splice(v.indexOf(l.name),1);}}}if(v){n(v.length===0,"No metadata for the following properties found: "+v.join(","));}}E._bCreate=true;k=P.substring(1)+"('"+u()+"')";this.oData[k]=E;E.__metadata={type:""+j.entityType};s=this._createRequestUrl(P);R=this._createRequest(s,"POST",true,E);R.entityTypes={};R.entityTypes[j.entityType]=true;this.oRequestQueue[k]=R;return this.getContext("/"+k);};r.prototype._createPropertyValue=function(t){var T=this.oMetadata._splitName(t);var N=T.namespace;var s=T.name;if(N.toUpperCase()!=='EDM'){var j={};var k=this.oMetadata._getObjectMetadata("complexType",s,N);n(k,"Complex type "+t+" not found in the metadata !");for(var i=0;i<k.property.length;i++){var P=k.property[i];j[P.name]=this._createPropertyValue(P.type);}return j;}else{return this._getDefaultPropertyValue(s,N);}};r.prototype._getDefaultPropertyValue=function(t,N){return undefined;};r.prototype._normalizePath=function(P,i){if(P&&P.indexOf('?')!=-1){P=P.substr(0,P.indexOf('?'));}if(!i&&!P.startsWith("/")){P='/'+P;L.warning(this+" path "+P+" should be absolute if no Context is set");}return this.resolve(P,i);};r.prototype.setRefreshAfterChange=function(R){this.bRefreshAfterChange=R;};r.prototype.isList=function(P,i){var P=this.resolve(P,i);return P&&P.substr(P.lastIndexOf("/")).indexOf("(")===-1;};r.prototype.isMetaModelPath=function(P){return P.indexOf("##")==0||P.indexOf("/##")>-1;};r.prototype._request=function(R,s,E,H,i,j){if(this.bDestroyed){return{abort:function(){}};}var t=this;function w(l){return function(){if(t.aPendingRequestHandles){var I=t.aPendingRequestHandles.indexOf(k);if(I>-1){t.aPendingRequestHandles.splice(I,1);}}if(!(k&&k.bSuppressErrorHandlerCall)){l.apply(this,arguments);}};}var k=h.request(R,w(s||h.defaultSuccess),w(E||h.defaultError),H,i,j);if(R.async!==false){this.aPendingRequestHandles.push(k);}return k;};r.prototype.destroy=function(){this.bDestroyed=true;if(this.aPendingRequestHandles){for(var i=this.aPendingRequestHandles.length-1;i>=0;i--){var R=this.aPendingRequestHandles[i];if(R&&R.abort){R.bSuppressErrorHandlerCall=true;R.abort();}}delete this.aPendingRequestHandles;}if(!!this.oMetadataLoadEvent){clearTimeout(this.oMetadataLoadEvent);}if(!!this.oMetadataFailedEvent){clearTimeout(this.oMetadataFailedEvent);}if(this.oMetadata){this.oMetadata.detachLoaded(this.onMetadataLoaded);this.oMetadata.detachFailed(this.onMetadataFailed);if(!this.oMetadata.isLoaded()&&!this.oMetadata.hasListeners("loaded")){this.oMetadata.destroy();delete this.oServiceData.oMetadata;}delete this.oMetadata;}if(this.oAnnotations){this.oAnnotations.detachFailed(this.onAnnotationsFailed);this.oAnnotations.detachLoaded(this.onAnnotationsLoaded);this.oAnnotations.destroy();delete this.oAnnotations;delete this.pAnnotationsLoaded;}M.prototype.destroy.apply(this,arguments);};r.prototype._getAnnotationParser=function(A){if(!this.oAnnotations){var i=sap.ui.requireSync("sap/ui/model/odata/ODataAnnotations");this.oAnnotations=new i({annotationData:A,url:null,metadata:this.oMetadata,async:this.bLoadMetadataAsync,headers:this.mCustomHeaders});this.oAnnotations.attachFailed(this.onAnnotationsFailed,this);this.oAnnotations.attachLoaded(this.onAnnotationsLoaded,this);}return this.oAnnotations;};r.prototype.onAnnotationsFailed=function(E){this.fireAnnotationsFailed(E.getParameters());};r.prototype.onAnnotationsLoaded=function(E){this.fireAnnotationsLoaded(E.getParameters());};r.prototype.addAnnotationUrl=function(v){var j=[].concat(v),k=[],A=[],E=[],t=this;q.each(j,function(i,s){var I=s.indexOf("$metadata");if(I>=0){if(I==0){s=t.sServiceUrl+'/'+s;}k.push(s);}else{A.push(s);}});return this.oMetadata._addUrl(k).then(function(P){return Promise.all(q.map(P,function(i){E=E.concat(i.entitySets);return t.addAnnotationXML(i["metadataString"]);}));}).then(function(){return t._getAnnotationParser().addUrl(A);}).then(function(P){return{annotations:P.annotations,entitySets:E};});};r.prototype.addAnnotationXML=function(x,s){return new Promise(function(i,j){this._getAnnotationParser().setXML(null,x,{success:i,error:j,fireEvents:!s});}.bind(this));};r.prototype.getMetaModel=function(){var t=this;if(!this.oMetaModel){this.oMetaModel=new g(this.oMetadata,this.oAnnotations,{addAnnotationUrl:this.addAnnotationUrl.bind(this),annotationsLoadedPromise:this.oMetadata.isLoaded()&&(!this.oAnnotations||this.oAnnotations.isLoaded())?null:this.pAnnotationsLoaded});this.oMetaModel.loaded().then(function(){t.bMetaModelLoaded=true;t.checkUpdate(false,false,null,true);});}return this.oMetaModel;};return r;});

/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./_GroupLock","./_Helper","./_Requestor","sap/base/Log","sap/base/util/isEmptyObject","sap/ui/base/SyncPromise"],function(_,a,b,L,c,S){"use strict";var r=/\(\$uid=[-\w]+\)$/,m="@com.sap.vocabularies.Common.v1.Messages",d=/^-?\d+$/,e=/^([^(]*)(\(.*\))$/;function f(i,p,k,D){if(k.$count!==undefined){s(i,p,k,k.$count+D);}}function g(R,p){return p===""||R===p||R.startsWith(p+"/");}function s(i,p,k,v){if(typeof v==="string"){v=parseInt(v);}a.updateExisting(i,p,k,{$count:v});}function C(R,i,q,k,G,l){this.iActiveUsages=1;this.mChangeListeners={};this.fnGetOriginalResourcePath=G;this.iInactiveSince=Infinity;this.mPatchRequests={};this.oPendingRequestsPromise=null;this.mPostRequests={};this.oRequestor=R;this.bSentRequest=false;this.bSortExpandSelect=k;this.setResourcePath(i);this.setQueryOptions(q);this.bSharedRequest=l;}C.prototype._delete=function(G,E,p,o,i){var k=p.split("/"),D=k.pop(),l=k.join("/"),t=this;this.checkSharedRequest();this.addPendingRequest();return this.fetchValue(_.$cached,l).then(function(v){var n=D?v[C.from$skip(D,v)]:v,H,K=a.getPrivateAnnotation(n,"predicate"),q=a.buildPath(l,Array.isArray(v)?K:D),T=a.getPrivateAnnotation(n,"transient");if(T===true){throw new Error("No 'delete' allowed while waiting for server response");}if(T){G.unlock();t.oRequestor.removePost(T,n);return undefined;}if(n["$ui5.deleting"]){throw new Error("Must not delete twice: "+E);}n["$ui5.deleting"]=true;H={"If-Match":o||n};E+=t.oRequestor.buildQueryString(t.sMetaPath,t.mQueryOptions,true);return t.oRequestor.request("DELETE",E,G,H,undefined,undefined,undefined,undefined,a.buildPath(t.getOriginalResourcePath(n),q)).catch(function(u){if(u.status!==404){delete n["$ui5.deleting"];throw u;}}).then(function(){if(Array.isArray(v)){i(t.removeElement(v,Number(D),K,l),v);}else{if(D){a.updateExisting(t.mChangeListeners,l,v,C.makeUpdateData([D],null));}else{n["$ui5.deleted"]=true;}i();}t.oRequestor.getModelInterface().reportBoundMessages(t.sResourcePath,[],[q]);});}).finally(function(){t.removePendingRequest();});};C.prototype.addPendingRequest=function(){var R;if(!this.oPendingRequestsPromise){this.oPendingRequestsPromise=new S(function(i){R=i;});this.oPendingRequestsPromise.$count=0;this.oPendingRequestsPromise.$resolve=R;}this.oPendingRequestsPromise.$count+=1;};C.prototype.calculateKeyPredicate=function(i,t,M){var p,T=t[M];if(T&&T.$Key){p=a.getKeyPredicate(i,M,t);if(p){a.setPrivateAnnotation(i,"predicate",p);}}return p;};C.prototype.checkSharedRequest=function(){if(this.bSharedRequest){throw new Error(this+" is read-only");}};C.prototype.create=function(G,p,i,t,E,k,l){var n,K=E&&E["@$ui5.keepTransientPath"],o,q=this;function u(){a.removeByPath(q.mPostRequests,i,E);n.splice(n.indexOf(E),1);n.$created-=1;f(q.mChangeListeners,i,n,-1);delete n.$byPredicate[t];if(!i){q.adjustReadRequests(0,-1);}G.cancel();}function v(){q.addPendingRequest();a.setPrivateAnnotation(E,"transient",true);l();}function w(x,y){var z=y.getGroupId();a.setPrivateAnnotation(E,"transient",z);a.addByPath(q.mPostRequests,i,E);return S.all([q.oRequestor.request("POST",x,y,null,o,v,u,undefined,a.buildPath(q.sResourcePath,i,t)),q.fetchTypes()]).then(function(R){var A=R[0],B;a.deletePrivateAnnotation(E,"postBody");a.deletePrivateAnnotation(E,"transient");E["@$ui5.context.isTransient"]=false;a.removeByPath(q.mPostRequests,i,E);q.visitResponse(A,R[1],a.getMetaPath(a.buildPath(q.sMetaPath,i)),i+t,K);if(!K){B=a.getPrivateAnnotation(A,"predicate");if(B){n.$byPredicate[B]=E;a.updateTransientPaths(q.mChangeListeners,t,B);}}a.updateSelected(q.mChangeListeners,a.buildPath(i,B||t),E,A,a.getQueryOptionsForPath(q.mQueryOptions,i).$select);q.removePendingRequest();return E;},function(A){if(A.canceled){throw A;}q.removePendingRequest();k(A);if(q.fetchTypes().isRejected()){throw A;}return w(x,q.oRequestor.lockGroup(q.oRequestor.getGroupSubmitMode(z)==="API"?z:"$parked."+z,q,true,true));});}this.checkSharedRequest();E=a.merge({},E);E=b.cleanPayload(E);o=a.merge({},E);a.setPrivateAnnotation(E,"postBody",o);a.setPrivateAnnotation(E,"transientPredicate",t);E["@$ui5.context.isTransient"]=true;n=this.getValue(i);if(!Array.isArray(n)){throw new Error("Create is only supported for collections; '"+i+"' does not reference a collection");}n.unshift(E);n.$created+=1;f(this.mChangeListeners,i,n,1);n.$byPredicate=n.$byPredicate||{};n.$byPredicate[t]=E;if(!i){q.adjustReadRequests(0,1);}return p.then(function(x){x+=q.oRequestor.buildQueryString(q.sMetaPath,q.mQueryOptions,true);return w(x,G);});};C.prototype.deregisterChange=function(p,l){if(!this.bSharedRequest){a.removeByPath(this.mChangeListeners,p,l);}};C.prototype.drillDown=function(D,p,G,k){var o=S.resolve(D),E,l,n,t=false,q=this;function u(i){L.error("Failed to drill-down into "+p+", invalid segment: "+i,q.toString(),"sap.ui.model.odata.v4.lib._Cache");return undefined;}function v(V,i,w){var x=n.slice(0,w).join("/"),R,y;if(Array.isArray(V)){return u(i);}return q.oRequestor.getModelInterface().fetchMetadata(q.sMetaPath+"/"+a.getMetaPath(x)).then(function(z){if(!z){return u(i);}if(z.$Type==="Edm.Stream"){R=V[i+"@odata.mediaReadLink"];y=q.oRequestor.getServiceUrl();return R||a.buildPath(y+q.sResourcePath,x);}if(!t){if(!E&&!Array.isArray(D)){E=D;l=0;}return E&&q.fetchLateProperty(G,E,n.slice(0,l).join("/"),n.slice(l).join("/"),n.slice(l,w).join("/"))||u(i);}if(z.$kind==="NavigationProperty"){return null;}if(!z.$Type.startsWith("Edm.")){return{};}if("$DefaultValue"in z){return z.$Type==="Edm.String"?z.$DefaultValue:a.parseLiteral(z.$DefaultValue,z.$Type,x);}return null;});}if(!p){return o;}n=p.split("/");return n.reduce(function(w,x,i){return w.then(function(V){var I,M,y;if(x==="$count"){return Array.isArray(V)?V.$count:u(x);}if(V===undefined||V===null){return undefined;}if(typeof V!=="object"||x==="@$ui5._"||Array.isArray(V)&&(x[0]==="$"||x==="length")){return u(x);}if(a.hasPrivateAnnotation(V,"predicate")){E=V;l=i;}y=V;t=t||a.getPrivateAnnotation(V,"transient");M=e.exec(x);if(M){if(M[1]){V=V[M[1]];}if(V){V=V.$byPredicate[M[2]];}}else{I=C.from$skip(x,V);if(k&&I===x&&(V[x]===undefined||V[x]===null)){V[x]={};}V=V[I];}return V===undefined&&x[0]!=="#"&&x[0]!=="@"?v(y,x,i+1):V;});},o);};C.prototype.fetchLateProperty=function(G,R,i,k,M){var F,l,n,p,q,o,t=a.getMetaPath(i),T=this.fetchTypes().getResult(),u=[k],v=this;function w(Q,B){var x=a.buildPath(F,B),E=T[x],y;if(!E){E=v.fetchType(T,x).getResult();}if(B){(E.$Key||[]).forEach(function(K){if(typeof K==="object"){K=K[Object.keys(K)[0]];}u.push(a.buildPath(B,K));});u.push(B+"/@odata.etag");u.push(B+"/@$ui5._/predicate");}if(Q.$expand){y=Object.keys(Q.$expand)[0];w(Q.$expand[y],a.buildPath(B,y));}}if(!this.mLateQueryOptions){return undefined;}F=a.buildPath(this.sMetaPath,t);q=a.intersectQueryOptions(a.getQueryOptionsForPath(this.mLateQueryOptions,i),[k],this.oRequestor.getModelInterface().fetchMetadata,F,{});if(!q){return undefined;}w(q);l=a.buildPath(this.sResourcePath,i);o=l+this.oRequestor.buildQueryString(F,q,false,true);p=this.mPropertyRequestByPath[o];if(!p){n=l+this.oRequestor.buildQueryString(F,this.mQueryOptions,true);p=this.oRequestor.request("GET",n,G.getUnlockedCopy(),undefined,undefined,undefined,undefined,F,undefined,false,q).then(function(D){v.visitResponse(D,T,F,i);return D;}).finally(function(){delete v.mPropertyRequestByPath[o];});this.mPropertyRequestByPath[o]=p;}return p.then(function(D){var x=a.getPrivateAnnotation(D,"predicate");if(x&&a.getPrivateAnnotation(R,"predicate")!==x){throw new Error("GET "+o+": Key predicate changed from "+a.getPrivateAnnotation(R,"predicate")+" to "+x);}if(D["@odata.etag"]!==R["@odata.etag"]){throw new Error("GET "+o+": ETag changed");}a.updateSelected(v.mChangeListeners,i,R,D,u);return a.drillDown(R,M.split("/"));});};C.prototype.fetchType=function(t,M){var i=this;return this.oRequestor.fetchTypeForPath(M).then(function(T){var o,p=[];if(T){o=i.oRequestor.getModelInterface().fetchMetadata(M+"/"+m).getResult();if(o){T=Object.create(T);T[m]=o;}t[M]=T;(T.$Key||[]).forEach(function(k){if(typeof k==="object"){k=k[Object.keys(k)[0]];p.push(i.fetchType(t,M+"/"+k.slice(0,k.lastIndexOf("/"))));}});return S.all(p).then(function(){return T;});}});};C.prototype.fetchTypes=function(){var p,t,i=this;function k(B,q){if(q&&q.$expand){Object.keys(q.$expand).forEach(function(n){var M=B;n.split("/").forEach(function(l){M+="/"+l;p.push(i.fetchType(t,M));});k(M,q.$expand[n]);});}}if(!this.oTypePromise){p=[];t={};p.push(this.fetchType(t,this.sMetaPath));k(this.sMetaPath,this.mQueryOptions);this.oTypePromise=S.all(p).then(function(){return t;});}return this.oTypePromise;};C.prototype.getMeasureRangePromise=function(){return undefined;};C.prototype.getValue=function(p){throw new Error("Unsupported operation");};C.prototype.getOriginalResourcePath=function(E){return this.fnGetOriginalResourcePath&&this.fnGetOriginalResourcePath(E)||this.sResourcePath;};C.prototype.hasChangeListeners=function(){return!c(this.mChangeListeners);};C.prototype.hasPendingChangesForPath=function(p){return Object.keys(this.mPatchRequests).some(function(R){return g(R,p);})||Object.keys(this.mPostRequests).some(function(R){return g(R,p);});};C.prototype.patch=function(p,D){var t=this;this.checkSharedRequest();return this.fetchValue(_.$cached,p).then(function(o){a.updateExisting(t.mChangeListeners,p,o,D);return o;});};C.prototype.refreshSingle=function(G,p,i,D){var t=this;this.checkSharedRequest();return this.fetchValue(_.$cached,p).then(function(E){var k=a.getPrivateAnnotation(E[i],"predicate"),R=a.buildPath(t.sResourcePath,p,k),q=Object.assign({},a.getQueryOptionsForPath(t.mQueryOptions,p));delete q.$apply;delete q.$count;delete q.$filter;delete q.$orderby;delete q.$search;R+=t.oRequestor.buildQueryString(t.sMetaPath,q,false,t.bSortExpandSelect);t.bSentRequest=true;return S.all([t.oRequestor.request("GET",R,G,undefined,undefined,D),t.fetchTypes()]).then(function(l){var o=l[0];t.replaceElement(E,i,k,o,l[1],p);return o;});});};C.prototype.refreshSingleWithRemove=function(G,p,i,D,o){var t=this;this.checkSharedRequest();return S.all([this.fetchValue(_.$cached,p),this.fetchTypes()]).then(function(R){var E=R[0],k=E[i],l=a.getPrivateAnnotation(k,"predicate"),q=Object.assign({},a.getQueryOptionsForPath(t.mQueryOptions,p)),F=q.$filter,n=a.buildPath(t.sResourcePath,p),T=R[1];delete q.$count;delete q.$orderby;q.$filter=(F?"("+F+") and ":"")+a.getKeyFilter(k,t.sMetaPath,T);n+=t.oRequestor.buildQueryString(t.sMetaPath,q,false,t.bSortExpandSelect);t.bSentRequest=true;return t.oRequestor.request("GET",n,G,undefined,undefined,D).then(function(u){if(u.value.length>1){throw new Error("Unexpected server response, more than one entity returned.");}else if(u.value.length===0){t.removeElement(E,i,l,p);t.oRequestor.getModelInterface().reportBoundMessages(t.sResourcePath,[],[p+l]);o();}else{t.replaceElement(E,i,l,u.value[0],T,p);}});});};C.prototype.registerChange=function(p,l){if(!this.bSharedRequest){a.addByPath(this.mChangeListeners,p,l);}};C.prototype.removeElement=function(E,i,p,k){var o,t;i=C.getElementIndex(E,p,i);o=E[i];E.splice(i,1);delete E.$byPredicate[p];t=a.getPrivateAnnotation(o,"transientPredicate");if(t){E.$created-=1;delete E.$byPredicate[t];}else if(!k){this.iLimit-=1;this.adjustReadRequests(i,-1);}f(this.mChangeListeners,k,E,-1);return i;};C.prototype.removePendingRequest=function(){if(this.oPendingRequestsPromise){this.oPendingRequestsPromise.$count-=1;if(!this.oPendingRequestsPromise.$count){this.oPendingRequestsPromise.$resolve();this.oPendingRequestsPromise=null;}}};C.prototype.replaceElement=function(E,i,p,o,t,k){var O,T;i=C.getElementIndex(E,p,i);O=E[i];E[i]=E.$byPredicate[p]=o;T=a.getPrivateAnnotation(O,"transientPredicate");if(T){o["@$ui5.context.isTransient"]=false;E.$byPredicate[T]=o;a.setPrivateAnnotation(o,"transientPredicate",T);}this.visitResponse(o,t,a.getMetaPath(a.buildPath(this.sMetaPath,k)),k+p);};C.prototype.resetChangesForPath=function(p){var t=this;Object.keys(this.mPatchRequests).forEach(function(R){var i,k;if(g(R,p)){k=t.mPatchRequests[R];for(i=k.length-1;i>=0;i-=1){t.oRequestor.removePatch(k[i]);}delete t.mPatchRequests[R];}});Object.keys(this.mPostRequests).forEach(function(R){var E,i,T;if(g(R,p)){E=t.mPostRequests[R];for(i=E.length-1;i>=0;i-=1){T=a.getPrivateAnnotation(E[i],"transient");t.oRequestor.removePost(T,E[i]);}delete t.mPostRequests[R];}});};C.prototype.setActive=function(A){if(A){this.iActiveUsages+=1;this.iInactiveSince=Infinity;}else{this.iActiveUsages-=1;if(!this.iActiveUsages){this.iInactiveSince=Date.now();}this.mChangeListeners={};}};C.prototype.setLateQueryOptions=function(q){this.mLateQueryOptions={$select:q.$select,$expand:q.$expand};};C.prototype.setProperty=function(p,v,E){var t=this;this.checkSharedRequest();return this.fetchValue(_.$cached,E,null,null,true).then(function(o){a.updateSelected(t.mChangeListeners,E,o,C.makeUpdateData(p.split("/"),v));});};C.prototype.setQueryOptions=function(q){this.checkSharedRequest();if(this.bSentRequest){throw new Error("Cannot set query options: Cache has already sent a request");}this.mQueryOptions=q;this.sQueryString=this.oRequestor.buildQueryString(this.sMetaPath,q,false,this.bSortExpandSelect);};C.prototype.setResourcePath=function(R){this.checkSharedRequest();this.sResourcePath=R;this.sMetaPath=a.getMetaPath("/"+R);this.oTypePromise=undefined;this.mLateQueryOptions=null;this.mPropertyRequestByPath={};};C.prototype.toString=function(){return this.oRequestor.getServiceUrl()+this.sResourcePath+this.sQueryString;};C.prototype.update=function(G,p,v,E,i,k,u,l,n){var o,q=p.split("/"),U,t=this;this.checkSharedRequest();try{o=this.fetchValue(_.$cached,k);}catch(w){if(!w.$cached){throw w;}o=S.resolve({"@odata.etag":"*"});}return o.then(function(x){var F=a.buildPath(k,p),y=G.getGroupId(),O,z,A,B,T,D,H=C.makeUpdateData(q,v);function I(){a.removeByPath(t.mPatchRequests,F,z);a.updateExisting(t.mChangeListeners,k,x,C.makeUpdateData(q,O));}function J(K,M){var R;function N(){R=t.oRequestor.lockGroup(y,t,true);if(n){n();}}z=t.oRequestor.request("PATCH",i,K,{"If-Match":x},H,N,I,undefined,a.buildPath(t.getOriginalResourcePath(x),k),M);a.addByPath(t.mPatchRequests,F,z);return S.all([z,t.fetchTypes()]).then(function(Q){var V=Q[0];a.removeByPath(t.mPatchRequests,F,z);if(!l){t.visitResponse(V,Q[1],a.getMetaPath(a.buildPath(t.sMetaPath,k)),k);}a.updateExisting(t.mChangeListeners,k,x,l?{"@odata.etag":V["@odata.etag"]}:V);},function(w){var Q=y;a.removeByPath(t.mPatchRequests,F,z);if(!E||w.canceled){throw w;}E(w);switch(t.oRequestor.getGroupSubmitMode(y)){case"API":break;case"Auto":if(!t.oRequestor.hasChanges(y,x)){Q="$parked."+y;}break;default:throw w;}R.unlock();R=undefined;return J(t.oRequestor.lockGroup(Q,t,true,true),true);}).finally(function(){if(R){R.unlock();}});}if(!x){throw new Error("Cannot update '"+p+"': '"+k+"' does not exist");}T=a.getPrivateAnnotation(x,"transient");if(T){if(T===true){throw new Error("No 'update' allowed while waiting for server response");}if(T.startsWith("$parked.")){B=T;T=T.slice(8);}if(T!==y){throw new Error("The entity will be created via group '"+T+"'. Cannot patch via group '"+y+"'");}}O=a.drillDown(x,q);a.updateAll(t.mChangeListeners,k,x,H);A=a.getPrivateAnnotation(x,"postBody");if(A){a.updateAll({},k,A,H);}if(u){U=u.split("/");u=a.buildPath(k,u);D=t.getValue(u);if(D===undefined){L.debug("Missing value for unit of measure "+u+" when updating "+F,t.toString(),"sap.ui.model.odata.v4.lib._Cache");}else{a.merge(T?A:H,C.makeUpdateData(U,D));}}if(T){if(B){a.setPrivateAnnotation(x,"transient",T);t.oRequestor.relocate(B,A,T);}G.unlock();return Promise.resolve();}t.oRequestor.relocateAll("$parked."+y,y,x);i+=t.oRequestor.buildQueryString(t.sMetaPath,t.mQueryOptions,true);return J(G);});};C.prototype.visitResponse=function(R,t,k,l,K,n){var o,H=false,p={},q=this.oRequestor.getServiceUrl()+this.sResourcePath,u=this;function v(M,i,z){H=true;if(M&&M.length){p[i]=M;M.forEach(function(A){if(A.longtextUrl){A.longtextUrl=a.makeAbsolute(A.longtextUrl,z);}});}}function w(B,i){return i?a.makeAbsolute(i,B):B;}function x(I,M,z,A){var B={},i,D,E,F;for(i=0;i<I.length;i+=1){E=I[i];D=z===""?n+i:i;if(E&&typeof E==="object"){y(E,M,z,A,D);F=a.getPrivateAnnotation(E,"predicate");if(!z){o.push(F||D.toString());}if(F){B[F]=E;I.$byPredicate=B;}}}}function y(i,M,I,z,A){var B,D,T=t[M],E=T&&T[m]&&T[m].$Path,F;z=w(z,i["@odata.context"]);D=u.calculateKeyPredicate(i,t,M);if(A!==undefined){I=a.buildPath(I,D||A);}else if(!K&&D){B=r.exec(I);if(B){I=I.slice(0,-B[0].length)+D;}}if(l&&!o){o=[I];}if(E){F=a.drillDown(i,E.split("/"));if(F!==undefined){v(F,I,z);}}Object.keys(i).forEach(function(G){var J,N=M+"/"+G,O=i[G],Q=a.buildPath(I,G);if(G.endsWith("@odata.mediaReadLink")){i[G]=a.makeAbsolute(O,z);}if(G.includes("@")){return;}if(Array.isArray(O)){O.$created=0;O.$count=undefined;J=i[G+"@odata.count"];if(J){s({},"",O,J);}else if(!i[G+"@odata.nextLink"]){s({},"",O,O.length);}x(O,N,Q,w(z,i[G+"@odata.context"]));}else if(O&&typeof O==="object"){y(O,N,Q,z);}});}if(n!==undefined){o=[];x(R.value,k||this.sMetaPath,"",w(q,R["@odata.context"]));}else if(R&&typeof R==="object"){y(R,k||this.sMetaPath,l||"",q);}if(H){this.oRequestor.getModelInterface().reportBoundMessages(this.getOriginalResourcePath(R),p,o);}};function h(R,i,q,k,D,l){C.call(this,R,i,q,k,function(){return D;},l);this.sContext=undefined;this.aElements=[];this.aElements.$byPredicate={};this.aElements.$count=undefined;this.aElements.$created=0;this.aElements.$tail=undefined;this.iLimit=Infinity;this.aReadRequests=[];this.bServerDrivenPaging=false;this.oSyncPromiseAll=undefined;}h.prototype=Object.create(C.prototype);h.prototype.adjustReadRequests=function(i,o){this.aReadRequests.forEach(function(R){if(R.iStart>=i){R.iStart+=o;R.iEnd+=o;}});};h.prototype.fetchValue=function(G,p,D,l,i){var E,F=p.split("/")[0],o,t=this;G.unlock();if(this.aElements.$byPredicate[F]){o=S.resolve();}else if((G===_.$cached||F!=="$count")&&this.aElements[F]!==undefined){o=S.resolve(this.aElements[F]);}else{if(!this.oSyncPromiseAll){E=this.aElements.$tail?this.aElements.concat(this.aElements.$tail):this.aElements;this.oSyncPromiseAll=S.all(E);}o=this.oSyncPromiseAll;}return o.then(function(){t.registerChange(p,l);return t.drillDown(t.aElements,p,G,i);});};h.prototype.fill=function(p,k,E){var i,n=Math.max(this.aElements.length,1024);if(E>n){if(this.aElements.$tail&&p){throw new Error("Cannot fill from "+k+" to "+E+", $tail already in use, # of elements is "+this.aElements.length);}this.aElements.$tail=p;E=this.aElements.length;}for(i=k;i<E;i+=1){this.aElements[i]=p;}this.oSyncPromiseAll=undefined;};h.prototype.getQueryString=function(){var q=Object.assign({},this.mQueryOptions),E,k,F=q.$filter,i,K,l=[],Q=this.sQueryString,t;for(i=0;i<this.aElements.$created;i+=1){E=this.aElements[i];if(!E["@$ui5.context.isTransient"]){t=t||this.fetchTypes().getResult();K=a.getKeyFilter(E,this.sMetaPath,t);if(K){l.push(K);}}}if(l.length){k="not ("+l.join(" or ")+")";if(F){q.$filter="("+F+") and "+k;Q=this.oRequestor.buildQueryString(this.sMetaPath,q,false,this.bSortExpandSelect);}else{Q+=(Q?"&":"?")+"$filter="+a.encode(k,false);}}return Q;};h.prototype.getReadRange=function(k,l,p){var E=this.aElements;function n(k,o){var i;for(i=k;i<o;i+=1){if(E[i]===undefined){return true;}}return false;}if(n(k+l,k+l+p/2)){l+=p;}if(n(Math.max(k-p/2,0),k)){l+=p;k-=p;if(k<0){l+=k;if(isNaN(l)){l=Infinity;}k=0;}}return{length:l,start:k};};h.prototype.getResourcePath=function(i,E){var k=this.aElements.$created,q=this.getQueryString(),D=q?"&":"?",l=E-i,R=this.sResourcePath+q;if(i<k){throw new Error("Must not request created element");}i-=k;if(i>0||l<Infinity){R+=D+"$skip="+i;}if(l<Infinity){R+="&$top="+l;}return R;};h.prototype.getValue=function(p){var o=this.drillDown(this.aElements,p,_.$cached);if(o.isFulfilled()){return o.getResult();}};h.prototype.handleResponse=function(k,E,R,t){var l=-1,n,o=this.aElements.$created,p,i,O=this.aElements.$count,q,u=R.value.length;this.sContext=R["@odata.context"];this.visitResponse(R,t,undefined,undefined,undefined,k);for(i=0;i<u;i+=1){p=R.value[i];this.aElements[k+i]=p;q=a.getPrivateAnnotation(p,"predicate");if(q){this.aElements.$byPredicate[q]=p;}}n=R["@odata.count"];if(n){this.iLimit=l=parseInt(n);}if(R["@odata.nextLink"]){this.bServerDrivenPaging=true;if(E<this.aElements.length){for(i=k+u;i<E;i+=1){delete this.aElements[i];}}else{this.aElements.length=k+u;}}else if(u<E-k){if(l===-1){l=O&&O-o;}l=Math.min(l!==undefined?l:Infinity,k-o+u);this.aElements.length=o+l;this.iLimit=l;if(!n&&l>0&&!this.aElements[l-1]){l=undefined;}}if(l!==-1){s(this.mChangeListeners,"",this.aElements,l!==undefined?l+o:undefined);}};h.prototype.read=function(I,l,p,G,D){var i,n,E,k,o=-1,q=this.oPendingRequestsPromise||this.aElements.$tail,R,t=this;if(I<0){throw new Error("Illegal index "+I+", must be >= 0");}if(l<0){throw new Error("Illegal length "+l+", must be >= 0");}if(q){return q.then(function(){return t.read(I,l,p,G,D);});}R=this.getReadRange(I,l,this.bServerDrivenPaging?0:p);k=Math.min(R.start+R.length,this.aElements.$created+this.iLimit);n=Math.min(k,Math.max(R.start,this.aElements.length)+1);for(i=R.start;i<n;i+=1){if(this.aElements[i]!==undefined){if(o>=0){this.requestElements(o,i,G.getUnlockedCopy(),D);D=undefined;o=-1;}}else if(o<0){o=i;}}if(o>=0){this.requestElements(o,k,G.getUnlockedCopy(),D);}G.unlock();E=this.aElements.slice(I,k);if(this.aElements.$tail){E.push(this.aElements.$tail);}return S.all(E).then(function(){var u=t.aElements.slice(I,k);u.$count=t.aElements.$count;return{"@odata.context":t.sContext,value:u};});};h.prototype.requestElements=function(i,E,G,D){var p,R={iEnd:E,iStart:i},t=this;this.aReadRequests.push(R);this.bSentRequest=true;p=S.all([this.oRequestor.request("GET",this.getResourcePath(i,E),G,undefined,undefined,D),this.fetchTypes()]).then(function(k){if(t.aElements.$tail===p){t.aElements.$tail=undefined;}t.handleResponse(R.iStart,R.iEnd,k[0],k[1]);}).catch(function(o){t.fill(undefined,R.iStart,R.iEnd);throw o;}).finally(function(){t.aReadRequests.splice(t.aReadRequests.indexOf(R),1);});this.fill(p,i,E);};h.prototype.requestSideEffects=function(G,p,N,k,l){var E,F=[],q,R,t=this.fetchTypes().getResult(),o=this,i;function u(n){var v=a.getKeyFilter(n,o.sMetaPath,t);F.push(v);return v;}this.checkSharedRequest();if(this.oPendingRequestsPromise){return this.oPendingRequestsPromise.then(function(){return o.requestSideEffects(G,p,N,k,l);});}q=a.intersectQueryOptions(this.mLateQueryOptions||this.mQueryOptions,p,this.oRequestor.getModelInterface().fetchMetadata,this.sMetaPath,N,"",true);if(!q){return S.resolve();}if(l===undefined){if(!u(this.aElements[k])){return null;}}else{for(i=0;i<this.aElements.length;i+=1){E=this.aElements[i];if(!E||a.hasPrivateAnnotation(E,"transient")){continue;}if((i<k||i>=k+l)&&!a.hasPrivateAnnotation(E,"transientPredicate")){delete this.aElements.$byPredicate[a.getPrivateAnnotation(E,"predicate")];delete this.aElements[i];continue;}if(!u(E)){return null;}}this.aElements.length=l?Math.min(k+l,this.aElements.length):this.aElements.$created;if(!F.length){return S.resolve();}}q.$filter=F.join(" or ");a.selectKeyProperties(q,t[this.sMetaPath]);delete q.$count;delete q.$orderby;delete q.$search;R=this.sResourcePath+this.oRequestor.buildQueryString(this.sMetaPath,q,false,true);return this.oRequestor.request("GET",R,G).then(function(v){var E,w,i,n;function x(y){y=y.slice(w.length+1);return p.indexOf(y)<0;}if(v.value.length!==F.length){throw new Error("Expected "+F.length+" row(s), but instead saw "+v.value.length);}o.visitResponse(v,t,undefined,"",false,NaN);for(i=0,n=v.value.length;i<n;i+=1){E=v.value[i];w=a.getPrivateAnnotation(E,"predicate");a.updateAll(o.mChangeListeners,w,o.aElements.$byPredicate[w],E,x);}});};function P(R,i,q){C.call(this,R,i,q);this.oPromise=null;}P.prototype=Object.create(C.prototype);P.prototype._delete=function(){throw new Error("Unsupported");};P.prototype.create=function(){throw new Error("Unsupported");};P.prototype.fetchValue=function(G,p,D,l,i){var t=this;if(i){throw new Error("Unsupported argument: bCreateOnDemand");}if(this.oPromise){G.unlock();}else{this.bSentRequest=true;this.oPromise=S.resolve(this.oRequestor.request("GET",this.sResourcePath+this.sQueryString,G,undefined,undefined,D,undefined,this.sMetaPath));}return this.oPromise.then(function(R){t.registerChange("",l);return R.value;});};P.prototype.update=function(){throw new Error("Unsupported");};function j(R,i,q,k,l,G,p,M){C.call(this,R,i,q,k,G,l);this.sMetaPath=M||this.sMetaPath;this.bPost=p;this.bPosting=false;this.oPromise=null;}j.prototype=Object.create(C.prototype);j.prototype.fetchValue=function(G,p,D,l,i){var R=this.sResourcePath+this.sQueryString,t=this;if(this.oPromise){G.unlock();}else{if(this.bPost){throw new Error("Cannot fetch a value before the POST request");}this.bSentRequest=true;this.oPromise=S.all([this.oRequestor.request("GET",R,G,undefined,undefined,D,undefined,this.sMetaPath),this.fetchTypes()]).then(function(k){t.visitResponse(k[0],k[1]);return k[0];});}return this.oPromise.then(function(o){if(o["$ui5.deleted"]){throw new Error("Cannot read a deleted entity");}t.registerChange(p,l);return t.drillDown(o,p,G,i);});};j.prototype.getValue=function(p){var o;if(this.oPromise&&this.oPromise.isFulfilled()){o=this.drillDown(this.oPromise.getResult(),p,_.$cached);if(o.isFulfilled()){return o.getResult();}}};j.prototype.post=function(G,D,E){var i,H="POST",t=this;this.checkSharedRequest();if(!this.bPost){throw new Error("POST request not allowed");}if(this.bPosting){throw new Error("Parallel POST requests not allowed");}if(E){i=G.getGroupId();this.oRequestor.relocateAll("$parked."+i,i,E);}if(D){H=D["X-HTTP-Method"]||H;delete D["X-HTTP-Method"];if(this.oRequestor.isActionBodyOptional()&&!Object.keys(D).length){D=undefined;}}this.bPosting=true;this.bSentRequest=true;this.oPromise=S.all([this.oRequestor.request(H,this.sResourcePath+this.sQueryString,G,E&&{"If-Match":E},D),this.fetchTypes()]).then(function(R){t.visitResponse(R[0],R[1]);return R[0];}).finally(function(){t.bPosting=false;});return this.oPromise;};j.prototype.requestSideEffects=function(G,p,n,R){var o=this.oPromise,q,i,t=this;this.checkSharedRequest();q=o&&a.intersectQueryOptions(this.mLateQueryOptions||this.mQueryOptions,p,this.oRequestor.getModelInterface().fetchMetadata,this.sMetaPath,n);if(!q){return S.resolve();}R=(R||this.sResourcePath)+this.oRequestor.buildQueryString(this.sMetaPath,q,false,true);i=S.all([this.oRequestor.request("GET",R,G),this.fetchTypes(),this.fetchValue(_.$cached,"")]).then(function(k){var N=k[0],O=k[2];t.visitResponse(N,k[1]);a.updateAll(t.mChangeListeners,"",O,N,function(l){return p.indexOf(l)<0;});return O;});this.oPromise=i.catch(function(){return o;});return i;};C.create=function(R,i,q,k,D,l){var n,K,p,o,t;if(l){p=i+R.buildQueryString(a.getMetaPath("/"+i),q,false,k);t=R.$mSharedCollectionCacheByPath;if(!t){t=R.$mSharedCollectionCacheByPath={};}o=t[p];if(o){o.setActive(true);}else{K=Object.keys(t);n=K.length;if(n>100){K.filter(function(u){return!t[u].iActiveUsages;}).sort(function(u,v){return t[u].iInactiveSince-t[v].iInactiveSince;}).every(function(u){delete t[u];n-=1;return n>100;});}o=t[p]=new h(R,i,q,k,D,l);}return o;}return new h(R,i,q,k,D);};C.createProperty=function(R,i,q){return new P(R,i,q);};C.createSingle=function(R,i,q,k,l,G,p,M){return new j(R,i,q,k,l,G,p,M);};C.from$skip=function(i,k){return d.test(i)?k.$created+Number(i):i;};C.getElementIndex=function(E,k,i){var o=E[i];if(!o||a.getPrivateAnnotation(o,"predicate")!==k){i=E.indexOf(E.$byPredicate[k]);}return i;};C.makeUpdateData=function(p,v){return p.reduceRight(function(V,i){var R={};R[i]=V;return R;},v);};return C;},false);

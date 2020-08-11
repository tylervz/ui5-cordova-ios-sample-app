/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/Utils","sap/ui/fl/Layer","sap/ui/rta/appVariant/AppVariantUtils","sap/ui/core/BusyIndicator","sap/base/util/UriParameters","sap/ui/fl/registry/Settings","sap/ui/fl/write/_internal/appVariant/AppVariantFactory","sap/base/util/merge"],function(F,L,A,B,U,S,a,m){"use strict";var o;var b;var r;var c;var _;var g=function(){return F.getAppDescriptor(r);};var G=function(){return S.getInstance();};var s=function(){window.onbeforeunload=_;};var f=function(C){var M=C?"MSG_DO_NOT_CLOSE_BROWSER_CURRENTLY_ADAPTING":"MSG_DO_NOT_CLOSE_BROWSER";_=window.onbeforeunload;window.onbeforeunload=A.handleBeforeUnloadEvent;return A.showMessage(M);};var t=function(i,j){return b.triggerCatalogPublishing(i,j,true);};var T=function(i){return b.triggerCatalogPublishing(i,null,false);};var R=function(i,C){if(o){A.closeOverviewDialog();return this.onGetOverview(true,C);}else if(!o&&i){B.hide();return this.onGetOverview(true,C);}return Promise.resolve();};var d=function(i,I,C){return i?A.navigateToFLPHomepage():R.call(this,!I,C);};var e=function(i,j){if(i&&i.response&&i.response.IAMId){return b.notifyKeyUserWhenPublishingIsReady(i.response.IAMId,j,true);}return Promise.resolve();};var h=function(i,j){if(i&&i.response&&i.response.IAMId&&i.response.inProgress){return b.notifyKeyUserWhenPublishingIsReady(i.response.IAMId,j,false);}return Promise.resolve();};sap.ui.getCore().getEventBus().subscribe("sap.ui.rta.appVariant.manageApps.controller.ManageApps","navigate",function(){if(o){o.destroy();o=null;}});return{onGetOverview:function(i,l){var D=g();return new Promise(function(j){var C=function(){A.closeOverviewDialog();};sap.ui.require(["sap/ui/rta/appVariant/AppVariantOverviewDialog"],function(k){if(!o){o=new k({idRunningApp:D["sap.app"].id,isOverviewForKeyUser:i,layer:l});}o.attachCancel(C);o.oPopup.attachOpened(function(){j(o);});o.open();});});},isOverviewExtended:function(){var u=U.fromQuery(window.location.search);var M=u.get("sap-ui-xx-app-variant-overview-extended");if(!M){return false;}return M.toLowerCase()==='true';},isManifestSupported:function(){var D=g();return A.getManifirstSupport(D["sap.app"].id).then(function(i){return i.response;}).catch(function(E){var i=A.buildErrorInfo("MSG_APP_VARIANT_FEATURE_FAILED",E);i.overviewDialog=true;return A.showRelevantDialog(i,false);});},isPlatFormEnabled:function(i,C,l){r=i;c=l;var D=g();if(D["sap.app"]&&D["sap.app"].id){if(F.getUshellContainer()&&!A.isStandAloneApp()&&C===L.CUSTOMER){var I;if(D["sap.app"].crossNavigation&&D["sap.app"].crossNavigation.inbounds){I=A.getInboundInfo(D["sap.app"].crossNavigation.inbounds);}else{I=A.getInboundInfo();}if(I){return true;}}}return false;},getAppVariantDescriptor:function(i){r=i;var D=g();if(D["sap.app"]&&D["sap.app"].id){return a.load({id:D["sap.app"].id});}return Promise.resolve(false);},_determineSelector:function(i,D){return i?r:{appId:D["sap.app"].id,appVersion:D["sap.app"].applicationVersion.version};},onSaveAs:function(i,C,j,k){var I;var l;var D=g();var n=true;if(k&&k["sap.app"].id===D["sap.app"].id){C=true;D=m({},k);k=null;}else if(k){n=false;D=m({},k);k=null;}var v=this._determineSelector(n,D);return new Promise(function(p){var P=function(){return b.processSaveAsDialog(D,i);};var q=function(J){B.show();return b.createAllInlineChanges(J,v);};var u=function(J){var K=J.slice();return A.addChangesToPersistence(K,v);};var w=function(){var J=A.getNewAppVariantId();return b.createAppVariant(J,v).catch(function(K){var M=K.messageKey;if(!M){M="MSG_SAVE_APP_VARIANT_FAILED";}return A.catchErrorDialog(K,M,J);});};var x=function(J){l=null;l=m({},J.response);return b.clearRTACommandStack(C);};var y=function(){var J=F.getUshellContainer();if(J&&C){J.setDirtyFlag(false);}};var z=function(J){y();I=A.isS4HanaCloud(J);var K=A.buildSuccessInfo(l.id,i,I);return b.showSuccessMessage(K);};var E=function(){var J=A.buildFinalSuccessInfoS4HANACloud();return b.showSuccessMessage(J);};var H=function(){B.show();if(I){var J;return f().then(function(){return t(l.id,l.reference);}).then(function(K){J=Object.assign({},K);B.hide();return d.call(this,i,null,j);}.bind(this)).then(function(){return e(J,l.id);}).then(function(){s();return E();}).then(function(){return i?p():d.call(this,i,I,j);}.bind(this));}B.hide();return d.call(this,i,I,j);};sap.ui.require(["sap/ui/rta/appVariant/AppVariantManager"],function(J){if(!b){b=new J({commandSerializer:c,layer:j});}return P().then(q).then(u).then(w).then(x).then(G).then(z).then(H.bind(this)).then(p).catch(function(K){if(!K){return false;}if(I){s();}return d.call(this,null,I,j).then(p);}.bind(this));}.bind(this));}.bind(this));},onDeleteFromOverviewDialog:function(i,C,j){var I;return new Promise(function(k){sap.ui.require(["sap/ui/rta/appVariant/AppVariantManager"],function(l){if(!b){b=new l({rootControl:r,commandSerializer:c,layer:j});}var D=function(){return b.deleteAppVariant(i).catch(function(E){if(E==='cancel'){return Promise.reject("cancel");}var M=E.messageKey;if(!M){M="MSG_DELETE_APP_VARIANT_FAILED";}return A.catchErrorDialog(E,M,i);});};var n=function(){A.closeOverviewDialog();var u=A.buildDeleteSuccessMessage(i,I);return b.showSuccessMessage(u);};var p=function(u){I=A.isS4HanaCloud(u);if(I){var v;return f(C).then(function(){return T(i);}).then(function(w){v=Object.assign({},w);return R.call(this,!C,j);}.bind(this)).then(function(){return h(v,i);});}B.show();return Promise.resolve();};var q=function(){if(I){s();}B.hide();return C?k():R.call(this,!I,I,j).then(k);};if(C){A.closeOverviewDialog();A.navigateToFLPHomepage();}return G().then(p.bind(this)).then(D).then(n).then(q.bind(this)).catch(function(E){if(E==='cancel'){return false;}if(I){s();}return R.call(this,null,I,j).then(k);}.bind(this));}.bind(this));}.bind(this));}};});

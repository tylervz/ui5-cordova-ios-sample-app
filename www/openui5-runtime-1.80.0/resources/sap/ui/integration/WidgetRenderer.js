/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var W={apiVersion:2};var r=sap.ui.getCore().getLibraryResourceBundle("sap.f");W.render=function(R,w){var c=w.getAggregation("_content");R.openStart("div",w);R.accessibilityState(w,{role:"region",roledescription:{value:r.getText("ARIA_ROLEDESCRIPTION_CARD"),append:true}});R.openEnd();if(c){R.renderControl(c);}R.close("div");};return W;});

/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/mdc/link/ILinkHandler'],function(I){"use strict";var L=I.extend("sap.ui.mdc.link.LinkHandler",{metadata:{library:"sap.ui.mdc"}});L.prototype.hasPotentialLinks=function(){if(!!this.getModifyItemsCallback()){return Promise.resolve(true);}return Promise.resolve(!!this.getItems().length);};L.prototype.determineItems=function(){if(this.getModifyItemsCallback()){return this.getModifyItemsCallback()(null,this).then(function(){return this.getItems();}.bind(this));}return Promise.resolve(this.getItems());};return L;});

/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/CustomData','sap/base/Log'],function(C,L){"use strict";var B=C.extend("sap.m.BadgeCustomData",{metadata:{properties:{key:{type:"string",group:"Data",defaultValue:"badge"}}}});B.prototype.init=function(){var p=this.getParent();if(p&&!p.isA("sap.m.IBadge")){L.warning("BadgeCustomData must be attached only to controls, which implement sap.m.IBadge");}};B.prototype.setValue=function(v){var p=this.getParent();C.prototype.setValue.call(this,v);if(p&&typeof v==="string"){p.updateBadge(v);}return this;};B.prototype.setKey=function(){return this;};return B;});

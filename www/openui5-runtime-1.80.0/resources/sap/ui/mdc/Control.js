/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/mdc/mixin/DelegateMixin"],function(C,D){"use strict";var a=C.extend("sap.ui.mdc.Control",{metadata:{library:"sap.ui.mdc",properties:{delegate:{type:"object",group:"Data"}}},renderer:C.renderer});D.call(a.prototype);return a;});

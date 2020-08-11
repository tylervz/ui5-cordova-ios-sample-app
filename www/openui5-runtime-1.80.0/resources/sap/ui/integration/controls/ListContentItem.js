/*!
* OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["./ListContentItemRenderer","sap/m/StandardListItem"],function(L,S){"use strict";var a=S.extend("sap.ui.integration.controls.ListContentItem",{metadata:{library:"sap.ui.integration",aggregations:{microchart:{type:"sap.ui.integration.controls.Microchart",multiple:false}}},renderer:L});return a;});

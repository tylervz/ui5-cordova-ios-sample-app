/*!
* OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/

sap.ui.define([
	"./ListContentItemRenderer",
	"sap/m/StandardListItem"
], function (
	ListContentItemRenderer,
	StandardListItem
) {
	"use strict";

	/**
	 * Constructor for a new ListContentItem.
	 * This is helper item which can visualize Microcharts.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 *
	 * @extends sap.m.StandardListItem
	 *
	 * @author SAP SE
	 * @version 1.80.0
	 *
	 * @constructor
	 * @private
	 * @alias sap.ui.integration.controls.ListContentItem
	 */
	var ListContentItem = StandardListItem.extend("sap.ui.integration.controls.ListContentItem", {
		metadata: {
			library: "sap.ui.integration",
			aggregations: {
				microchart: { type: "sap.ui.integration.controls.Microchart", multiple: false }
			}
		},
		renderer: ListContentItemRenderer
	});

	return ListContentItem;
});
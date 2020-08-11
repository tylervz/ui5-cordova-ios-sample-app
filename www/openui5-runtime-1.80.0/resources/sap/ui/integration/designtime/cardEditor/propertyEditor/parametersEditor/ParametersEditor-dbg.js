/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/integration/designtime/baseEditor/propertyEditor/BasePropertyEditor",
	"sap/ui/integration/designtime/baseEditor/propertyEditor/mapEditor/MapEditor",
	"sap/base/util/includes",
	"sap/base/util/restricted/_merge"
], function (
	BasePropertyEditor,
	MapEditor,
	includes,
	_merge
) {
	"use strict";

	/**
	* @class
	 * Constructor for a new <code>ParametersEditor</code> for editing key-value pairs with primitive values, labels and persisted type information.
	 *
	 * <h3>Configuration</h3>
	 *
	 * Configuration is inherited from {@link sap.ui.integration.designtime.baseEditor.propertyEditor.mapEditor.MapEditor}
	 *
	 * <table style="width:100%;">
	 * <tr style="text-align:left">
	 * 	<th>Option</th>
	 * 	<th>Type</th>
	 * 	<th>Default</th>
	 * 	<th>Description</th>
	 * </tr>
	 * <tr>
	 * 	<td><code>allowLabelChange</code></td>
	 *  <td><code>boolean</code></td>
	 * 	<td><code>true</code></td>
	 * 	<td>Whether to allow editing the label of parameters</td>
	 * </tr>
	 * </table>
	 *
	 * @extends sap.ui.integration.designtime.baseEditor.propertyEditor.mapEditor.MapEditor
	 * @alias sap.ui.integration.designtime.cardEditor.propertyEditor.parametersEditor.ParametersEditor
	 * @author SAP SE
	 * @since 1.70
	 * @version 1.80.0
	 *
	 * @private
	 * @experimental 1.70
	 * @ui5-restricted
	 */
	var ParametersEditor = MapEditor.extend("sap.ui.integration.designtime.cardEditor.propertyEditor.parametersEditor.ParametersEditor", {
		renderer: BasePropertyEditor.getMetadata().getRenderer().render
	});

	ParametersEditor.prototype.getConfigMetadata = function () {
		return Object.assign(
			{},
			MapEditor.prototype.getConfigMetadata.call(this),
			{
				allowLabelChange: {
					defaultValue: true
				}
			}
		);
	};

	ParametersEditor.prototype.formatItemConfig = function(oConfigValue) {
		var oMapItemConfig = MapEditor.prototype.formatItemConfig.apply(this, arguments);
		var sKey = oConfigValue.key;
		var sLabel = oConfigValue.value.label;

		oMapItemConfig.splice(1, 0, {
			label: this.getI18nProperty("CARD_EDITOR.PARAMETERS.LABEL"),
			path: "label",
			value: sLabel,
			placeholder: sLabel ? undefined : sKey,
			type: "string",
			enabled: this.getConfig().allowLabelChange,
			itemKey: sKey,
			allowBindings: false
		});

		return oMapItemConfig;
	};

	ParametersEditor.prototype.processInputValue = function(oValue) {
		return oValue;
	};

	ParametersEditor.prototype.processOutputValue = function(oValue) {
		return oValue;
	};

	ParametersEditor.prototype._configItemsFormatter = function(aItems) {
		return Array.isArray(aItems) ? aItems.map(function (oItem) {
			var oConfig = _merge({}, oItem.value);
			if (!oConfig.label) {
				oConfig.label = oItem.key;
			}
			oConfig.itemKey = oItem.key;
			oConfig.path = "value";
			return oConfig;
		}) : [];
	};

	ParametersEditor.prototype.onBeforeConfigChange = function(oConfig) {
		// Config scenario
		if (!oConfig.allowTypeChange && !oConfig.allowKeyChange) {
			this.setFragment("sap.ui.integration.designtime.cardEditor.propertyEditor.parametersEditor.ParametersConfigurationEditor", function () {
				return 1;
			});
		}
		return oConfig;
	};

	ParametersEditor.prototype._isValidItem = function(oItem, oOriginalItem) {
		// If invalid entries should be excluded, only keep items which have a type in the manifest or have a string value
		var sType = oOriginalItem.type;
		var vValue = oOriginalItem.value;
		var aAllowedTypes = this._getAllowedTypes();

		return (
			sType && includes(aAllowedTypes, sType) ||
			typeof vValue === "string" && includes(aAllowedTypes, "string")
		);
	};

	return ParametersEditor;
});
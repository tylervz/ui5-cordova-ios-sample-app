/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
	"sap/ui/fl/apply/_internal/DelegateMediator"
], function(
	DelegateMediator
) {
	"use strict";

	/**
	 * Provides an API to handle default delegates.
	 *
	 * @namespace sap.ui.fl.apply.api.DelegateMediatorAPI
	 * @experimental Since 1.80
	 * @since 1.80
	 * @private
	 * @ui5-restricted
	 */
	var DelegateMediatorAPI = /** @lends sap.ui.fl.apply.api.DelegateMediatorAPI */{
		/**
		 * Registers the default delegate by model type.
		 *
		 * @param {object} mPropertyBag - Property bag for default delegate
		 * @param {object} mPropertyBag.modelType - default delegate model type
		 * @param {object} mPropertyBag.delegate - path to default delegate
		 */
		registerDefaultDelegate: function (mPropertyBag) {
			DelegateMediator.registerDefaultDelegate(mPropertyBag);
		},


		/**
		 * Returns the delegate object for the requested control.
		 *
		 * @param {object} mPropertyBag - Property bag
		 * @param {sap.ui.core.Element|DomNode} mPropertyBag.control - Control for which the corresponding delegate should be returned
		 * @param {sap.ui.core.util.reflection.BaseTreeModifier} mPropertyBag.modifier - Control tree modifier
		 * @param {string} [mPropertyBag.modelType] - Model type; required in case you passed the <code>XmlTreeModifier</code>
		 * @param {boolean} [mPropertyBag.supportsDefault] - Include default delegate if no instance specific delegate is available
		 * @returns {Promise.<sap.ui.core.util.reflection.FlexDelegateInfo>} Delegate information including the lazy loaded instance of the delegate
		 */
		getDelegateForControl: function (mPropertyBag) {
			return DelegateMediator.getDelegateForControl(
				mPropertyBag.control,
				mPropertyBag.modifier,
				mPropertyBag.modelType,
				mPropertyBag.supportsDefault
			);
		}
	};

	return DelegateMediatorAPI;
},  /* bExport= */false);

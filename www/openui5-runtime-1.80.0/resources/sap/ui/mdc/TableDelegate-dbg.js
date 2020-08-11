/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the table/column and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define([
	"./table/Column", "sap/m/Text", 'sap/ui/core/Core', 'sap/ui/mdc/util/FilterUtil', 'sap/ui/mdc/condition/FilterConverter'
], function(Column, Text, Core, FilterUtil, FilterConverter) {
	"use strict";
	/**
	 * Delegate class for sap.ui.mdc.Table.<br>
	 * <b>Note:</b> The class is experimental and the API/behavior is not finalized and hence this should not be used for productive usage.
	 *
	 * @author SAP SE
	 * @private
	 * @experimental
	 * @since 1.60
	 * @alias sap.ui.mdc.TableDelegate
	 */
	var TableDelegate = {
		/**
		 * Fetches the relevant metadata for the table and returns an array of the property metadata.
		 *
		 * @param {Object} oTable Instance of the table
		 * @returns {Array} Array of property metadata
		 */
		fetchProperties: function(oTable) {
			return Promise.resolve([]);
		},

		/**
		 * Updates the binding info with the relevant path and model from the metadata.
		 *
		 * @param {Object} oMDCTable The MDC table instance
		 * @param {Object} oMetadataInfo The metadataInfo set on the table
		 * @param {Object} oBindingInfo The bindingInfo of the table
		 */
		updateBindingInfo: function(oMDCTable, oMetadataInfo, oBindingInfo) {

			if (!oMDCTable) {
				return;
			}

			if (oMetadataInfo && oBindingInfo) {
				oBindingInfo.path = oBindingInfo.path || oMetadataInfo.collectionPath || "/" + oMetadataInfo.collectionName;
				oBindingInfo.model = oBindingInfo.model || oMetadataInfo.model;
			}

			if (!oBindingInfo) {
				oBindingInfo = {};
			}

			var oFilter = Core.byId(oMDCTable.getFilter()),
				bFilterEnabled = oMDCTable._getFilterEnabled(),//TODO: use 'getP13nMode' once URL param has been removed
				mConditions;

			//TODO: consider a mechanism ('FilterMergeUtil' or enhance 'FilterUtil') to allow the connection between different filters)
			if (bFilterEnabled) {
				mConditions = oMDCTable.getConditions();
				//TODO: reuse 'FilterUtil' --> Table does not derive from sap.ui.mdc.Control as of now
				var aFilters = FilterConverter.getFilterInfo(mConditions);
				oBindingInfo.filters = aFilters;
			} else if (oFilter) {
				mConditions = oFilter.getConditions();
				var aPropertiesMetadata = oFilter.getPropertyInfoSet ? oFilter.getPropertyInfoSet() : null;

				if (mConditions) {
					var oFilterInfo = FilterUtil.getFilterInfo(oFilter, mConditions, aPropertiesMetadata);
					oBindingInfo.filters = oFilterInfo.filters;
				}
			}

		},

		/**
		 * Checks the binding of the table and rebinds it if required.
		 *
		 * @param {Object} oMDCTable The MDC table instance
		 * @param {Object} oRowBindingInfo The row binding info of the table
		 */
		rebindTable: function(oMDCTable, oRowBindingInfo) {

			if (oMDCTable && oMDCTable._oTable && oRowBindingInfo) {
				oMDCTable._oTable.bindRows(oRowBindingInfo);
			}
		},

		/**
		 * Creates the Column for the specified property info and table
		 *
		 * @param {String} sPropertyInfoName The property info name
		 * @param {Object} oTable Instance of the table
		 * @returns {Promise} Promise that resolves with the instance of mdc.table.Column
		 * @private
		 */
		_createColumn: function(sPropertyInfoName, oTable) {
			return this.fetchProperties(oTable).then(function(aProperties) {
				var oPropertyInfo = aProperties.find(function(oCurrentPropertyInfo) {
					return oCurrentPropertyInfo.name === sPropertyInfoName;
				});
				if (!oPropertyInfo) {
					return null;
				}
				return this._createColumnTemplate(oPropertyInfo).then(function(oTemplate) {
					var oColumnInfo = this._getColumnInfo(oPropertyInfo);
					// create column template
					oColumnInfo.template = oTemplate;
					return new Column(oTable.getId() + "--" + oPropertyInfo.name, oColumnInfo);
				}.bind(this));
			}.bind(this));
		},

		/**
		 * Set the <code>delegate</code> property for the inner <code>FilterBar</code>
		 * @param {Object} oPayload The payload configuration for the current Table instance
		 * @returns {Object} Object for the inner FilterBar <code>delegate</code> property
		 *
		 * @public
		 */
		getFilterDelegate: function(oPayload) {
			return {
				name: "sap/ui/mdc/FilterBarDelegate",
				payload: oPayload
			};
		},

		/**
		 * Can be used to create and returns the column (with a template) for the specified property info name.
		 *
		 * @param {Object} sPropertyInfoName The name of the property info object/json
		 * @param {Object} oTable Instance of the table
		 * @param {Object} mPropertyBag Instance of property bag from Flex change API
		 * @returns {Promise} Promise that resolves with an instance of mdc.table.Column
		 */
		beforeAddColumnFlex: function(sPropertyInfoName, oTable, mPropertyBag) {
			// TODO: Separate OData specific part to OData delegate
			if (oTable.getModel) {
				return this._createColumn(sPropertyInfoName, oTable);
			}
			return Promise.resolve(null);
		},

		/**
		 * Can be used to trigger any necessary follow-up steps on removal of column. The returned boolean value inside the Promise can be used to
		 * prevent default follow-up behaviour of Flex (which is to insert column to a dependent aggregation) *
		 *
		 * @param {Object} oMDCColumn The mdc.table.Column that was removed
		 * @param {Object} oTable Instance of the table
		 * @param {Object} mPropertyBag Instance of property bag from Flex change API
		 * @returns {Promise} Promise that resolves with true/false to allow/prevent default behaviour of the change
		 */
		afterRemoveColumnFlex: function(oMDCColumn, oTable, mPropertyBag) {
			// return true within the Promise for default behaviour (e.g. continue to destroy the column)
			return Promise.resolve(true);
		},

		/**
		 * Creates the Column for the specified property info and table
		 *
		 * @param {Object} oPropertyInfo - the property info object/json containing at least name and label properties
		 * @returns {Object} column info to be used in creation of the column/cell
		 * @private
		 */
		_getColumnInfo: function(oPropertyInfo) {
			return {
				header: oPropertyInfo.label || oPropertyInfo.name,
				dataProperties: [
					oPropertyInfo.name
				],
				hAlign: oPropertyInfo.align,
				width: oPropertyInfo.width
			};
		},

		/**
		 * Creates and returns the template info of the column for the specified property info
		 *
		 * @param {Object} oPropertyInfo - the property info object/json containing at least name and label properties
		 * @returns {Object} template info to be used in creationg of the column/cell
		 * @private
		 */
		_getColumnTemplateInfo: function(oPropertyInfo) {
			return {
				text: {
					path: oPropertyInfo.path || oPropertyInfo.name
				},
				textAlign: oPropertyInfo.align
			};
		},
		/**
		 * Creates and returns the template of the column for the specified info
		 *
		 * @param {Object} oPropertyInfo The property info object/json containing at least name and label properties
		 * @returns {Promise} Promise that resolves with the template to be used in the column/cell
		 * @private
		 */
		_createColumnTemplate: function(oPropertyInfo) {
			// TODO: use path instead of name? (path falls back to name for OData properties, but can contain a more complex path).
			// This may also needed to address duplicate property scenarios.
			return Promise.resolve(new Text(this._getColumnTemplateInfo(oPropertyInfo)));
		}
	};
	return TableDelegate;
});

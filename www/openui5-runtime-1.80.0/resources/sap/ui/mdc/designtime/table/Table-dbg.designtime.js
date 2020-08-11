/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/mdc/table/TableSettings"
], function (TableSettings) {
	"use strict";

	return {
		name: "{name}",
		description: "{description}",
		actions: {
			settings: function () {
				//RTA expects the settings to be returned as function
				return {
					handler: function (oControl, mPropertyBag) {
						return new Promise(function (resolve, reject) {

							var oAdaptationController = TableSettings._getAdaptationController(oControl);
							var fnRuntimeHandling = oAdaptationController.getAfterChangesCreated();

							var fnEnhanceDialog = function (oEvt) {
								var oContainer = oEvt.getParameter("container");
								oContainer.isPopupAdaptationAllowed = function () {
									return false;
								};
								oContainer.addStyleClass(mPropertyBag.styleClass);
							};
							oAdaptationController.attachEvent("beforeP13nContainerOpens", fnEnhanceDialog);

							oAdaptationController.setAfterChangesCreated(function (oAC, aChanges) {
								//callback is only executed in "Ok" case
								resolve(aChanges);
							});

							var fnResolveAndCleanup = function (oEvt) {
								var sReason = oEvt.getParameter("reason");

								//resolve changes empty for "Cancel"
								if (sReason == "Cancel") {
									resolve([]);
								}

								//cleanup (detach events)
								oAdaptationController.setAfterChangesCreated(fnRuntimeHandling);
								oAdaptationController.detachEvent("beforeP13nContainerOpens", fnEnhanceDialog);
								oAdaptationController.detachEvent("afterP13nContainerCloses", fnResolveAndCleanup);
							};

							oAdaptationController.attachEvent("afterP13nContainerCloses", fnResolveAndCleanup);

							oAdaptationController.showP13n(oControl, "Item");
						});
					}
				};
			}
		}
	};

});

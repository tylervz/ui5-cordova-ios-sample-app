/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the Design Time Metadata for the sap.ui.mdc.field.FieldInfo
sap.ui.define([], function() {
	"use strict";

	return {
		aggregations: {
			contentHandler: {
				ignore: true
			}
		},
		tool: {
			start: function(oFieldInfo) {
				if (oFieldInfo.getContentHandler()) {
					oFieldInfo.getContentHandler().setEnablePersonalization(false);
				}
			},
			stop: function(oFieldInfo) {
				if (oFieldInfo.getContentHandler()) {
					oFieldInfo.getContentHandler().setEnablePersonalization(true);
				}
			}
		}
	};

});
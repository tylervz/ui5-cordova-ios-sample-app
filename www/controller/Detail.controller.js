sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"../model/formatter"
], function(MessageBox, MessageToast, Fragment, Controller, History, formatter) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.Detail", {

		formatter: formatter,

		onInit: function() {

		},

		backTriggered: function() {
			var oHistory, sPreviousHash, navTo = "home";
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = this.getOwnerComponent().getRouter();
				oRouter.navTo(navTo);
      		}
		},

		handleShowMessageButton: function() {
			var title = "Hello";
			var message = "You are on the detail page.";
			MessageBox.show(
				message, {
					title: title,
					actions: [MessageBox.Action.OK]
				}
			);
		},

		handleToastButton: function() {
			var message = "This is a toast!!!";
			MessageToast.show(message);
		},

		handleNavHomeButton: function(oEvent) {
			var route = "home";
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo(route);
		}
	});
});

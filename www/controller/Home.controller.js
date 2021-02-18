sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"../model/formatter"
], function(MessageBox, MessageToast, Fragment, Controller, formatter) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.Home", {

		formatter: formatter,

		onInit: function() {

		},

		handleShowMessageButton: function() {
			var title = "Hello";
			var message = "MessageBox is working fine.";
			MessageBox.show(
				message, {
					title: title,
					actions: [MessageBox.Action.OK]
				}
			);
		},

		handleOpenActionSheetButton: function(oEvent) {
			var oButton = oEvent.getSource();
			// Create action sheet only once
			if (!this.byId("homePageActions")) {
				var that = this;
				var oView = this.getView();
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "sap.ui.demo.basicTemplate.fragments.HomePageActions",
					controller: this
				}).then(function (oActionSheet) {
					oView.addDependent(oActionSheet);
					oActionSheet.openBy(oButton);
				});
			} else {
				var actionSheet = this.byId("homePageActions");
				actionSheet.openBy(oButton);
			}
		},

		handleNavDetailButton: function(oEvent) {
			var route = "detail";
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo(route);
		},

		openAlert: function() {
			var title = "Alert";
			var message = "MessageBox is still working fine.";
			MessageBox.show(
				message, {
					icon: MessageBox.Icon.ERROR,
					title: title,
					actions: [MessageBox.Action.OK]
				}
			);
		},

		openToast: function() {
			var message = "This is a toast :)";
			MessageToast.show(message);
		}
	});
});

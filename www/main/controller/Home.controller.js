sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"../model/formatter"
], function(MessageBox, MessageToast, DateFormat, Fragment, Controller, JSONModel, formatter) {
	"use strict";

	return Controller.extend("main.controller.Home", {

		formatter: formatter,
		searchModel: new JSONModel(),

		onInit: function() {
			var that = this;
			var oView = this.getView();

			oView.setModel(this.searchModel, "Search");

			oView.addDelegate({
				onBeforeShow: function(oEvent) {
					// yyyy-MM-dd HH:mm:ss.S
					var dateFormat = that.getMessage("CustomDateTimeFormat");
					var startDateFormatted = "2021-02-18 09:29:35.6";

					that.searchModel.setData({
						searchField: "",
						selectedTypeOfCatalog: "0",
						typesOfCatalogs: [
							{
								type: "0",
								text: that.getMessage("AllLabel")
							},
							{
								type: "1",
								text: that.getMessage("UnscheduledLabel")
							},
							{
								type: "2",
								text: that.getMessage("ScheduledLabel")
							}
						],
						startDate: startDateFormatted,
						endDate: "",
						selectedSort: "START_DATE_ASC",
						sortOptions: [
							{
								key: "START_DATE_ASC",
								text: that.getMessage("sortDateAscText")
							},
							{
								key: "START_DATE_DESC",
								text: that.getMessage("sortDateDescText")
							},
							{
								key: "A_Z",
								text: that.getMessage("sortNameAscText")
							},
							{
								key: "Z_A",
								text: that.getMessage("sortNameDescText")
							}
						]
					});
				}
			});
		},

		getMessage: function(code, args) {
			return this.getView().getModel("i18n").getResourceBundle().getText(code, args);
		},

		handleShowMessageButton: function() {
			var title = "Hello";
			var message = "MessageBox is working fine.";
			console.log(message);
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
					name: "main.fragments.HomePageActions",
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
			console.log(message);
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
		},

		/**
		 * Creates the Filter Dialog if it has not already been created,
		 * and then opens the dialog.
		 */
		createAndOpenFilter: function(oEvent) {
			// Save a deep copy of the data as it is now, in case the user cancels changes they make to the filter
			this.searchDataBeforeOpeningFilter = $.extend(true, {}, this.searchModel.getData());
			// create dialog only once
			if (!this.byId("filterDialog")) {
				var oView = this.getView();
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "main.fragments.Filter",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("filterDialog").open();
			}
		},

		//************************************************************************
		//* Save the user's search parameters                                    *
		//************************************************************************
		saveFilter: function(oEvent) {
			var searchParams = this.searchModel.getData();
			var scheduled = searchParams.selectedTypeOfCatalog === "2";
			if (scheduled && (new Date(searchParams.endDate) < new Date(searchParams.startDate)) ) {
				var message = this.getMessage("endDateBeforeStartDateValidationMessage");
				this.showErrorAlert(message);
				return;
			}

			this.byId("filterDialog").close();

			var message = "Start date is " + searchParams.startDate +
					". End date is " + searchParams.endDate;
			MessageToast.show(message);
		},

		cancelFilter: function(oEvent) {
			this.byId("filterDialog").close();
			// Set the search model's data back to what it was before opening the filter dialog
			this.searchModel.setData(this.searchDataBeforeOpeningFilter);
		},

		showTodaysDate: function() {
			console.log("beginning showTodaysDate");
			var today = new Date();
			// This line of code is causing an error on iOS 12.
			var oDateFormat = DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd HH:mm:ss.S"
			});
			console.log("Got a DateFormat instance");
			var message = oDateFormat.format(today);
			MessageToast.show(message);
		},

		showErrorAlert: function(message) {
			MessageBox.show(
				message, {
					icon: MessageBox.Icon.ERROR,
					title: this.getMessage("errorMessageBoxTitle"),
					actions: [MessageBox.Action.OK]
				}
			);
		}
	});
});

sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/unified/DateTypeRange",
	"../model/formatter"
], function(MessageBox, MessageToast, Fragment, Controller, History, DateTypeRange, formatter) {
	"use strict";

	return Controller.extend("main.controller.Detail", {

		formatter: formatter,
		// Specifies which color the dates show up as on the calendar
		DATE_TYPE: "Type09",

		onInit: function() {
			var that = this;

			this.getView().addDelegate({
				onBeforeShow: function() {
					that._setCalendarDates();
				}
			});
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
		},

		_setCalendarDates: function() {
			var oView = this.getView();
			oView.byId("calendar").removeAllSelectedDates();
			oView.byId("calendar").removeAllSpecialDates();

			var startDate = new Date();
			var endDate = new Date();
			endDate.setMonth(endDate.getMonth() + 1);

			// call addSpecialDate for every date in between start date and end date
			while (startDate.getTime() <= endDate.getTime()) {
				var dateTypeRange = new DateTypeRange({
					startDate: new Date(startDate),
					type: this.DATE_TYPE
				});

				oView.byId("calendar").addSpecialDate(dateTypeRange);
				// Set startDate one day ahead
				var nextDate = startDate.getDate() + 1;
				startDate.setDate(nextDate);
			}
    	},

		handleCalendarSelect: function(oEvent) {
			var that = this;
			var calendar = that.getView().byId("calendar");
			var selectedDates = calendar.getSelectedDates();
			if (selectedDates.length > 0) {
				// Show the earliest date selected
				var selectedStartDate = selectedDates[0].getStartDate();
				MessageToast.show(selectedStartDate.getTime());
			} else {
				MessageToast.show("No date was selected");
			}
		}
	});
});

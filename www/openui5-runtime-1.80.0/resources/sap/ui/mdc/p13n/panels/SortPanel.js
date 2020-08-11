/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BasePanel","sap/m/ColumnListItem","sap/m/Label","sap/m/Select","sap/ui/core/Item","sap/m/HBox","sap/m/VBox","sap/ui/model/Filter"],function(B,C,L,S,I,H,V,F){"use strict";var a=B.extend("sap.ui.mdc.p13n.panels.SortPanel",{library:"sap.ui.mdc",metadata:{},init:function(){B.prototype.init.apply(this,arguments);var s=new C({selected:"{isSorted}",cells:[new V({items:[new L({design:{path:"groupLabel",formatter:function(g){return g?"Bold":"Standard";}},wrapping:true,tooltip:"{tooltip}",text:"{label}"}),new L({visible:{path:"groupLabel",formatter:function(g){return g?true:false;}},wrapping:true,tooltip:"{tooltip}",text:"{groupLabel}"})]}),new S("IDsortOrderSelect",{width:"100%",selectedKey:"{descending}",change:[this.onChangeOfSortOrder,this],enabled:"{isSorted}",items:[new I({key:false,text:this.getResourceText("sort.PERSONALIZATION_DIALOG_OPTION_ASCENDING")}),new I({key:true,text:this.getResourceText("sort.PERSONALIZATION_DIALOG_OPTION_DESCENDING")})]})]});this.setTemplate(s);this.setPanelColumns([this.getResourceText("sort.PERSONALIZATION_DIALOG_COLUMN_DESCRIPTION"),this.getResourceText("sort.PERSONALIZATION_DIALOG_COLUMN_SORTORDER")]);},renderer:{}});a.prototype._filterBySelected=function(s){this._oMTable.getBinding("items").filter(s?new F("isSorted","EQ",true):[]);};a.prototype._updateModelItems=function(){var f=this.getModel().getProperty("/items");var s=[],o=[];f.forEach(function(b){if(b.isSorted){s.push(b);}else{o.push(b);}});this.getModel().setProperty("/items",s.concat(o));};a.prototype.onChangeOfSortOrder=function(e){var s=e.getParameter("selectedItem");if(s){this.fireChange();}};a.prototype._onSearchFieldLiveChange=function(e){var f=new F([new F("label","Contains",e.getSource().getValue()),new F("groupLabel","Contains",e.getSource().getValue())]);this._oMTable.getBinding("items").filter(f,false);};a.prototype._onPressToggleMode=function(e){var p=this.getPanelMode()?[this.getResourceText("sort.PERSONALIZATION_DIALOG_COLUMN_DESCRIPTION"),this.getResourceText("sort.PERSONALIZATION_DIALOG_COLUMN_SORTORDER")]:this.getResourceText("sort.PERSONALIZATION_DIALOG_COLUMN_DESCRIPTION");this.setPanelColumns(p);this._togglePanelMode();};return a;});

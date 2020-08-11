/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/m/Column','sap/m/Text','sap/ui/model/Filter',"sap/m/Table","sap/m/OverflowToolbar","sap/m/SearchField","sap/m/ToolbarSpacer","sap/m/OverflowToolbarButton","sap/m/OverflowToolbarLayoutData","sap/m/Button","sap/ui/core/dnd/DragDropInfo"],function(C,a,T,F,b,O,S,c,d,e,B,D){"use strict";var f=C.extend("sap.ui.mdc.p13n.panels.BasePanel",{library:"sap.ui.mdc",metadata:{library:"sap.ui.mdc",associations:{},defaultAggregation:"items",aggregations:{_content:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"},template:{type:"sap.ui.core.Control",multiple:false}},events:{change:{}}},init:function(){this._oMTable=this._createInnerTable();this._oMTable.bPreventMassSelection=true;this.setAggregation("_content",this._oMTable);},renderer:{apiVersion:2,render:function(r,o){r.openStart("div",o);r.openEnd();r.renderControl(o.getAggregation("_content"));r.close("div");}}});f.prototype._createInnerTable=function(){this._moveTopButton=new d("IDButtonMoveToTop",{type:"Transparent",tooltip:this.getResourceText("p13nDialog.MOVE_TO_TOP"),icon:"sap-icon://collapse-group",press:[this._onPressButtonMoveToTop,this],visible:false,layoutData:new e({moveToOverflow:true,priority:"Low",group:2})});this._moveUpButton=new d("IDButtonMoveUp",{type:"Transparent",tooltip:this.getResourceText("p13nDialog.MOVE_UP"),icon:"sap-icon://slim-arrow-up",press:[this._onPressButtonMoveUp,this],visible:false,layoutData:new e({moveToOverflow:true,priority:"High",group:1})});this._moveDownButton=new d("IDButtonMoveDown",{type:"Transparent",tooltip:this.getResourceText("p13nDialog.MOVE_DOWN"),icon:"sap-icon://slim-arrow-down",press:[this._onPressButtonMoveDown,this],visible:false,layoutData:new e({moveToOverflow:true,priority:"High",group:1})});this._moveBottomButton=new d("IDButtonMoveToBottom",{type:"Transparent",tooltip:this.getResourceText("p13nDialog.MOVE_TO_BOTTOM"),icon:"sap-icon://expand-group",press:[this._onPressButtonMoveToBottom,this],visible:false,layoutData:new e({moveToOverflow:true,priority:"Low",group:2})});this._oSearchField=new S("IDSearchField",{liveChange:[this._onSearchFieldLiveChange,this],width:"100%",layoutData:new e({shrinkable:true,moveToOverflow:true,priority:"High",maxWidth:"16rem"})});this._oDragDropInfo=new D({enabled:false,sourceAggregation:"items",targetAggregation:"items",dropPosition:"Between",drop:[this._onRearrange,this]});var r=new B("IDshowSelectedBtn",{text:{path:"/reorderMode",formatter:function(R){return R?this.getResourceText("p13nDialog.SELECT"):this.getResourceText("p13nDialog.REORDER");}.bind(this)},press:[this._onPressToggleMode,this]});var o=new b("idBasePanelTable",{mode:"MultiSelect",rememberSelections:false,itemPress:[this._onItemPressed,this],selectionChange:[this._onSelectionChange,this],sticky:["HeaderToolbar","ColumnHeaders"],headerToolbar:new O({content:[this._oSearchField,new c(),this._moveTopButton,this._moveUpButton,this._moveDownButton,this._moveBottomButton,r]}),dragDropConfig:this._oDragDropInfo});return o;};f.prototype.setTemplate=function(t){this.setAggregation("template",t);if(t){this._oSelectionBindingInfo=t.getBindingInfo("selected");if(this._oSelectionBindingInfo&&this._oSelectionBindingInfo.parts){this._oSelectionBindingInfo={parts:this._oSelectionBindingInfo.parts};}}this._bindListItems();return this;};f.prototype.setPanelColumns=function(t){var g;if(t instanceof Array){g=t;}else{g=[t];}this._addTableColumns(g);};f.prototype.setP13nModel=function(p){this.setModel(p);this.setPanelMode(false);};f.prototype.getResourceText=function(t){this.oResourceBundle=this.oResourceBundle?this.oResourceBundle:sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");return t?this.oResourceBundle.getText(t):this.oResourceBundle;};f.prototype._addTableColumns=function(t){this._oMTable.removeAllColumns();t.forEach(function(s){this._oMTable.addColumn(new a({header:new T({text:s})}));},this);};f.prototype._bindListItems=function(m){var t=this.getTemplate();if(t){t.bindProperty("type",{path:"/reorderMode",formatter:function(r){return r?"Active":"Inactive";}});this._oMTable.bindItems(Object.assign({path:"/items",key:"name",templateShareable:false,template:this.getTemplate().clone()},m));}};f.prototype._onSelectionChange=function(E){var l=E.getParameter("listItems");var s=E.getParameter("selectAll");var g=!s&&l.length>1;l.forEach(function(t){this._selectTableItem(t,s||g);},this);if(s||g){this.fireChange();}if(g){this._moveTopButton.setEnabled(false);this._moveUpButton.setEnabled(false);this._moveDownButton.setEnabled(false);this._moveBottomButton.setEnabled(false);}};f.prototype._onItemPressed=function(E){var t=E.getParameter('listItem');this._oSelectedItem=t;this._updateEnableOfMoveButtons(t);};f.prototype._onSearchFieldLiveChange=function(E){this._oMTable.getBinding("items").filter(new F("label","Contains",E.getSource().getValue()));};f.prototype._onPressButtonMoveToTop=function(){this._moveSelectedItem(0);};f.prototype._onPressButtonMoveUp=function(){this._moveSelectedItem("Up");};f.prototype._onPressButtonMoveDown=function(){this._moveSelectedItem("Down");};f.prototype._onPressButtonMoveToBottom=function(){var i=this._oMTable.getItems().length-1;this._moveSelectedItem(i);};f.prototype._onPressToggleMode=function(E){this._togglePanelMode();};f.prototype.getPanelMode=function(){return this.getModel().getProperty("/reorderMode");};f.prototype.setPanelMode=function(r){return this.getModel().setProperty("/reorderMode",r);};f.prototype._togglePanelMode=function(){var r=!this.getPanelMode();this.setPanelMode(r);if(r){this._updateModelItems();}this.switchListMode(r?"None":"MultiSelect");this._filterBySelected(r);this._oSearchField.setVisible(!r);this._oSearchField.setValue("");this._moveTopButton.setVisible(r);this._moveUpButton.setVisible(r);this._moveDownButton.setVisible(r);this._moveBottomButton.setVisible(r);this._moveTopButton.setEnabled(false);this._moveUpButton.setEnabled(false);this._moveDownButton.setEnabled(false);this._moveBottomButton.setEnabled(false);this._oDragDropInfo.setEnabled(r);};f.prototype._updateModelItems=function(){var g=this.getModel().getProperty("/items");var s=[],o=[];g.forEach(function(h){if(h.selected){s.push(h);}else{o.push(h);}});this.getModel().setProperty("/items",s.concat(o));};f.prototype._filterBySelected=function(s){this._oMTable.getBinding("items").filter(s?new F("selected","EQ",true):[]);};f.prototype.switchListMode=function(m){if(this._oSelectionBindingInfo){if(m==="None"){this.getTemplate().unbindProperty("selected");}else{this.getTemplate().bindProperty("selected",this._oSelectionBindingInfo);}this._oMTable.unbindAggregation("items");}this._oMTable.setMode(m);if(this._oSelectionBindingInfo){this._bindListItems();}};f.prototype._selectTableItem=function(t,s){this._updateEnableOfMoveButtons(t);this._oSelectedItem=t;if(!s){this.fireChange();}};f.prototype._moveSelectedItem=function(n){var s=this._oSelectedItem;var i=this._oMTable.indexOfItem(s);if(i<0){return;}var N=(typeof n=="number")?n:i+(n=="Up"?-1:1);this._moveTableItem(s,N);};f.prototype._moveTableItem=function(i,n){var I=this._oMTable.getItems();var g=this._oMTable.getModel().getProperty("/items");var o=g.indexOf(i.getBindingContext().getObject());n=(n<=0)?0:Math.min(n,I.length-1);n=g.indexOf(I[n].getBindingContext().getObject());if(n==o){return;}g.splice(n,0,g.splice(o,1)[0]);this._oMTable.getModel().setProperty("/items",g);this._oSelectedItem=I[n];this._updateEnableOfMoveButtons(this._oSelectedItem);this.fireChange();};f.prototype._onRearrange=function(E){var o=E.getParameter("draggedControl");var g=E.getParameter("droppedControl");var s=E.getParameter("dropPosition");var i=this._oMTable.indexOfItem(o);var h=this._oMTable.indexOfItem(g);var A=h+(s=="Before"?0:1)+(i<h?-1:0);this._moveTableItem(o,A);};f.prototype._updateEnableOfMoveButtons=function(t){var i=this._oMTable.getItems().indexOf(t);var u=true,g=true;if(i==0){u=false;}if(i==this._oMTable.getItems().length-1){g=false;}this._moveTopButton.setEnabled(u);this._moveUpButton.setEnabled(u);this._moveDownButton.setEnabled(g);this._moveBottomButton.setEnabled(g);t.focus();};f.prototype.exit=function(){this._oSelectionBindingInfo=null;this._oSelectedItem=null;this._oMTable=null;this._moveTopButton=null;this._moveUpButton=null;this._moveDownButton=null;this._moveBottomButton=null;this._oSearchField=null;};return f;});
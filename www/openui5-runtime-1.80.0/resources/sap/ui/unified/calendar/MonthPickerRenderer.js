/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/unified/calendar/CalendarDate",'sap/ui/core/InvisibleText'],function(C,I){"use strict";var M={apiVersion:2};M.render=function(r,m){var a=m.getMonth(),b=m.getMonths(),s=0,c=m.getColumns(),t=m.getTooltip_AsString(),l=m._getLocaleData(),d=m.getId(),w="",e=[],f=[],g=m.getPrimaryCalendarType(),i,A,h;if(m._bLongMonth||!m._bNamesLengthChecked){e=l.getMonthsStandAlone("wide",g);}else{e=l.getMonthsStandAlone("abbreviated",g);f=l.getMonthsStandAlone("wide",g);}r.openStart("div",m);r.class("sapUiCalMonthPicker");if(t){r.attr("tooltip",t);}r.accessibilityState(m,{role:"grid",readonly:"true",multiselectable:m.getIntervalSelection(),label:sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified").getText("MONTH_PICKER"),describedby:m._bCalendar?I.getStaticId("sap.ui.unified","CALENDAR_YEAR_PICKER_OPEN_HINT"):""});r.openEnd();var j;if(b>12){b=12;}else if(b<12){s=Math.floor(a/b)*b;if(s+b>12){s=12-b;}}if(c>0){w=(100/c)+"%";}else{w=(100/b)+"%";}for(i=0;i<b;i++){var k=i+s,o=C.fromLocalJSDate(new Date(),m.getPrimaryCalendarType());o.setMonth(k,1);m._iYear&&o.setYear(m._iYear);j={role:"gridcell"};if(!m._bLongMonth&&m._bNamesLengthChecked){j["label"]=f[k];}if(c>0&&i%c==0){r.openStart("div");r.accessibilityState(null,{role:"row"});r.openEnd();}r.openStart("div",d+"-m"+(k));r.class("sapUiCalItem");A=m._fnShouldApplySelection(o);h=m._fnShouldApplySelectionBetween(o);if(A){r.class("sapUiCalItemSel");j["selected"]=true;}if(h){r.class("sapUiCalItemSelBetween");j["selected"]=true;}if(!A&&!h){j["selected"]=false;}if(k<m._iMinMonth||k>m._iMaxMonth){r.class("sapUiCalItemDsbl");j["disabled"]=true;}r.attr("tabindex","-1");r.style("width",w);r.accessibilityState(null,j);r.openEnd();r.text(e[k]);r.close("div");if(c>0&&((i+1)%c==0)){r.close("div");}}r.close("div");};return M;},true);

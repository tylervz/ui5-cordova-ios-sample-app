/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Renderer"],function(R){"use strict";var B=R.extend("sap.ui.integration.cards.BaseContentRenderer",{apiVersion:2});B.DEFAULT_MIN_HEIGHT="5rem";B.render=function(r,c){var C="sapFCard",l=c.getMetadata().getLibraryName(),n=c.getMetadata().getName(),t=n.slice(l.length+1,n.length),o=c.getParent(),i=o&&o.isA("sap.f.ICard");C+=t;r.openStart("div",c).class(C).class("sapFCardBaseContent");if(c.hasListeners("press")){r.class("sapFCardClickable");}if(i&&o.getHeight()==="auto"){var h=this.getMinHeight(c.getConfiguration(),c);r.style("min-height",h);}r.openEnd();if(t!=="AdaptiveContent"&&i&&c.isLoading()){r.renderControl(c._oLoadingPlaceholder);if(t!=="AnalyticalContent"&&t!=="TimelineContent"){this.hideContent(c);}}this.renderContent(r,c);r.close("div");};B.renderContent=function(r,c){r.renderControl(c.getAggregation("_content"));};B.hideContent=function(c){c.getAggregation("_content").addStyleClass("sapFCardContentHidden");};B.getMinHeight=function(c,C){return this.DEFAULT_MIN_HEIGHT;};B.isCompact=function(c){var r=c,p=c.getParent();if(!c.getDomRef()&&p&&p.isA("sap.f.ICard")){r=p;}return r.$().closest(".sapUiSizeCompact").hasClass("sapUiSizeCompact");};return B;});

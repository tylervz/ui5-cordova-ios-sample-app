/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/util/merge"],function(m){"use strict";var C={mergeCardDelta:function(M,c){var i=m({},M),s=i["sap.card"]?"sap.card":"sap.widget";c.forEach(function(o){m(i[s],o.content);});return i;}};return C;});

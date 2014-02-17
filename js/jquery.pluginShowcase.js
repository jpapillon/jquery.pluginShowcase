/* http://github.com/jpapillon/jsCodeShowcase */
/* global jQuery, $ */
(function ($) {
  'use strict';

  // Plugin defaults
  var defaultOptions = {
    cssSelector: "#pluginDiv",
    pluginName: "myPlugin",
    showNumbers: false, // Whether to show the numbers on the left or not
    attributes: { // Attributes to display & render dynamically
      /*
      attr1: {
        type: "boolean",
        defaultValue: "true"
      },
      attr2: {
        type: "number",
        defaultValue: "42",
        validate: function(value) {
          return true;
        }
      },
      attr3: {
        type: "text",
        defaultValue: "textOption"
      }
      */
    },
    onChange: function(options) {
      /* Define what you want to do with the option changes */
    }
  };

  function PluginShowcase(elem, options) {
    var self = this;
    this.$container = elem;
    this.options = options;

    var content = "";
    var lineNumber = 1;
    content += this._getLineNumber(lineNumber++);
    content += '<span class="dollar-sign">$</span>(<span class="css-selector">"' + this.options.cssSelector + '"</span>).' + this.options.pluginName + "({<br />";

    var i = 0;
    var nbAttributes = Object.keys(options.attributes).length;
    for (var attrName in options.attributes) {
      content += this._getLineNumber(lineNumber++);
      content += '<span class="tab">&nbsp;&nbsp;</span><span class="attr-name">' + attrName + '</span>: ';

      var type = options.attributes[attrName].type;
      content += '<span class="value" data-type="' + type + '" data-name="' + attrName + '">';

      var valueContainer = '<span class="value-container">' + options.attributes[attrName].defaultValue + '</span>';
      if (type === "text") {
        content += '"' + valueContainer + '"';
      } else {
        content += valueContainer;
      }
      content += "</span>";

      if (++i < nbAttributes) {
        // Add a comma since there's another attribute to come
        content += ",";
      }

      // Add a comment if it was set
      if (options.attributes[attrName].comment && options.attributes[attrName].comment !== "") {
        content += '<span class="value-comment"> // ' + options.attributes[attrName].comment + '</span>';
      }

      content += "<br />";
    }

    content += this._getLineNumber(lineNumber++);
    content += "});";
    this.$container.html('<div class="plugin-showcase">' + content + "</div>");

    this._hookEvents();
  };

  PluginShowcase.prototype = {
    constructor: PluginShowcase,
    _getLineNumber: function(lineNumber) {
      return (this.options.showNumbers) ? '<span class="line-nb">' + (lineNumber++) + ":</span>" : "";
    },
    _hookEvents: function() {
      var self = this;
      this.$container.on("click", ".value-container", function() {
        // Display input text field
        var elem = $(this);
        var parent = elem.parents(".value").first();

        var type = parent.data("type");
        var value = elem.text();
        switch (type) {
          case "text":
            parent.html('<span class="value-modifier">"<input type="text" value="' + value + '" />"</span>');
            // Little IE hack, to keep focus on the input
            setTimeout(function(e) {
              parent.find("input[type=text]").focus();
            }, 0);
          break;
          case "number":
            parent.html('<span class="value-modifier"><input type="text" value="' + value + '" /></span>');
            // Little IE hack, to keep focus on the input
            setTimeout(function(e) {
              parent.find("input[type=text]").focus();
            }, 0);
          break;
          case "boolean":
            elem.text((value === "true") ? "false": "true");
            self._triggerChange();
          break;
        }
      });

      this.$container.on("blur", ".value[data-type=text] input, .value[data-type=number] input", function() {
        // Display he changed value if it is valid
        if (self._isValidValue($(this))) {
          self._triggerChangeInputText($(this));
        }
      });

      this.$container.on("keypress", ".value[data-type=text] input, .value[data-type=number] input", function(e) {
        if (e.keyCode === 13) { // Enter
          $(this).blur();
        }
      });
    },
    getAttributes: function() {
      var attributes = {};
      this.$container.find(".value").each(function() {
        var elem = $(this);
        var value = elem.find(".value-container").text();
        switch (elem.data("type")) {
          case "text":
            // Don't do anything
          break;
          case "number":
            value = Number(value);
          break;
          case "boolean":
            value = (value === "true");
          break;
        }
        attributes[elem.data("name")] = value;
      });

      return attributes;
    },

    _triggerChange: function() {
      this.options.onChange(this.getAttributes());
    },

    _triggerChangeInputText: function(input) {
      var elem = input.parents(".value-modifier");
      var parent = elem.parents(".value").first();
      var value = elem.find("input[type=text]").val();

      var type = parent.data("type");
      switch (type) {
        case "text":
          parent.html('"<span class="value-container">' + value + '</span>"');
        break;
        case "number":
          parent.html('<span class="value-container">' + value + '</span>');
        break;
      }

      this._triggerChange();
    },

    _isValidValue: function(input) {
      var elem = input.parents(".value-modifier");
      var parent = elem.parents(".value").first();
      var value = elem.find("input[type=text]").val();

      var type = parent.data("type");
      var validateFn = this.options.attributes[parent.data("name")].validate;
      if (validateFn) {
        return validateFn(value);
      } else {
        // Default validation
        switch (type) {
          case "number":
            return !isNaN(value);
          break;
        }
      }
      return true;
    }
  };

  $.fn.pluginShowcase = function(arg1, arg2) {
    var self = this;
    var pluginShowcase = $(this).data("pluginShowcase");
    if (!pluginShowcase) {
      var options = $.extend({}, defaultOptions, arg1);
      return this.each(function() {
        $(this).data("pluginShowcase", new PluginShowcase($(this), options));
      });
    } else {
      if (pluginShowcase[arg1]) {
        return pluginShowcase[arg1](arg2);
      }
    }
  };
}(window.jQuery));
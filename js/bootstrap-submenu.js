/**
 * $.inArray: friends with IE8. Use Array.prototype.indexOf in future.
 * $.proxy: friends with IE8. Use Function.prototype.bind in future.
 */

'use strict';

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module
    define(['jquery'], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
})(function($) {
  function Item(element) {
    this.element = element;
    this.$menu = $(this.element.closest('.dropdown-menu'));
    this.$main = this.$menu.parent();
    this.$items = this.$menu.children('.dropdown-submenu');

    this.init();
  }

  Item.prototype = {
    init: function() {
      this.element.addEventListener('keydown', this.keydown.bind(this));
    },
    close: function() {
      this.$menu.removeClass('show');
      //this.$items.trigger('hide.bs.submenu');
    },
    keydown: function(event) {
      // 27: Esc
      if (event.keyCode !== 27) {
        return;
      }

      this.close();
      this.$main.children('.dropdown-item').trigger('focus');
    }
  };

  function SubmenuItem(element) {
    this.element = element;
    this.$main = $(this.element.parentNode);
    this.$menu = this.$main.children('.dropdown-menu');
    this.$subs = this.$main.siblings('.dropdown-submenu');
    this.$items = this.$menu.children('.dropdown-submenu');

    this.init();
  }

  SubmenuItem.prototype = {
    init: function() {
      this.element.addEventListener('click', this.click.bind(this));
      this.element.addEventListener('keydown', this.keydown.bind(this));

      //this.$main.on('hide.bs.submenu', $.proxy(this, 'hide'));
    },
    click: function(event) {
      event.stopPropagation();

      this.toggle();
    },
    hide: function(event) {
      // NOTE: Stop event bubbling
      event.stopPropagation();

      this.close();
    },
    open: function() {
      this.$menu.addClass('show');
      //this.$subs.trigger('hide.bs.submenu');
    },
    close: function() {
      this.$menu.removeClass('show');
      //this.$items.trigger('hide.bs.submenu');
    },
    toggle: function() {
      if (this.$menu.hasClass('show')) {
        this.close();
      } else {
        this.open();
      }
    },
    keydown: function(event) {
      // 13: Return, 32: Spacebar

      if (event.keyCode === 32) {
        // NOTE: Off vertical scrolling
        event.preventDefault();
      }

      if ([13, 32].includes(event.keyCode)) {
        this.toggle();
      }
    }
  };

  function Submenupicker(element) {
    this.element = element;
    this.$main = $(this.element.parentNode);
    this.$menu = this.$main.children('.dropdown-menu');
    this.$items = this.$menu.children('.dropdown-submenu');

    this.init();
  }

  Submenupicker.prototype = {
    init: function() {
      this.$menu.off('keydown.bs.dropdown.data-api');
      this.$menu.on('keydown', this.itemKeydown.bind(this));

      this.$menu.on('keydown', '.dropdown-item', this.handleKeydownDropdownItem.bind(this));
      this.$menu.on('keydown', '.dropdown-submenu > .dropdown-item', this.handleKeydownSubmenuDropdownItem.bind(this));

      //this.$main.on('hidden.bs.dropdown', $.proxy(this, 'hidden'));
    },

    hidden: function() {
      //this.$items.trigger('hide.bs.submenu');
    },

    handleKeydownDropdownItem: function(event) {
      // 27: Esc
      if (event.keyCode !== 27) {
        return;
      }

      console.log('keydown simple item');
      //this.close();
      //this.$main.children('.dropdown-item').trigger('focus');
    },

    handleKeydownSubmenuDropdownItem: function(event) {
      // 13: Return, 32: Spacebar

      if (event.keyCode === 32) {
        // NOTE: Off vertical scrolling
        event.preventDefault();
      }

      if ([13, 32].includes(event.keyCode)) {
        this.toggle(event.target);
      }

      console.log('keydown hard item');
    },

    itemKeydown: function(event) {
      // 38: Arrow up, 40: Arrow down

      if (![38, 40].includes(event.keyCode)) {
        return;
      }

      // NOTE: Off vertical scrolling
      event.preventDefault();

      event.stopPropagation();

      var $items = this.$menu.find('.dropdown-item:not(:disabled):not(.disabled):visible');
      var index = $items.index(event.target);

      if (event.keyCode === 38 && index !== 0) {
        index--;
      } else if (event.keyCode === 40 && index !== $items.length - 1) {
        index++;
      } else {
        return;
      }

      $items.eq(index).trigger('focus');
    }
  };

  var old = $.fn.submenupicker;

  // For AMD/Node/CommonJS used elements (optional)
  // http://learn.jquery.com/jquery-ui/environments/amd/
  $.fn.submenupicker = function(elements) {
    var $elements = this instanceof $ ? this : $(elements);

    return $elements.each(function() {
      var data = $.data(this, 'bs.submenu');

      if (!data) {
        data = new Submenupicker(this);

        $.data(this, 'bs.submenu', data);
      }
    });
  };

  $.fn.submenupicker.Constructor = Submenupicker;
  $.fn.submenupicker.noConflict = function() {
    $.fn.submenupicker = old;
    return this;
  };

  return $.fn.submenupicker;
});

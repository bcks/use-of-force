(function ($) {

  $.fn.stickyHeader = function (options) {

    var $window = $(window);

    var settings = $.extend({}, $.fn.stickyHeader.defaults, options);

    return $(this).each(function () {
      var $table = $(this),
        $thead = $table.children('thead'),
        $navbar = $(settings.navbar),
        $fixed = $('<table></table>').appendTo($thead).append($thead.clone()).addClass('fixed').css({position: 'fixed'}),
        headLeftPos,
        headWidth,
        navbarHeight,
        offsetTop,
        isFixed;

      var calcSizes = function () {
        headLeftPos = $table.offset().left;
        headWidth = $table.width();
        navbarHeight = $navbar.height();
        offsetTop = $thead.offset().top;
        if (isFixed) {
          setSizes();
        }
      };

      var setSizes = function () {
        $fixed.css($.extend(settings.getStyle(isFixed, navbarHeight), {left: headLeftPos, top: navbarHeight, width: headWidth}));
      };

      $window.resize(calcSizes);

      calcSizes();
      setSizes();
      $fixed.appendTo($thead);

      $(window).scroll(function () {
        var scrollTop = $window.scrollTop(),
          shouldBeFixed = scrollTop > offsetTop - navbarHeight;
        if (shouldBeFixed !== isFixed) {
          $fixed.css(settings.getStyle(shouldBeFixed, navbarHeight));
          isFixed = shouldBeFixed;
        }
      });

      return this;
    });

  };

  $.fn.stickyHeader.defaults = {
    navbar: 'header',
    getStyle: function (fixed, navbarHeight) {
      return {transform: 'translate3d(0, ' + (fixed ? 0 : -navbarHeight) + 'px, 0)', opacity: fixed ? 1 : 0, zIndex: 1};
    }
  };

})(jQuery);
(function() {
  'use strict';

  function hasClass(el, className) {
    if (el.classList)
      return el.classList.contains(className)
    else
      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
  }

  function my_addClass(el, className) {
    console.log(el, className);
    if (el.classList)
      el.classList.add(className)
    else if (!hasClass(el, className)) el.className += " " + className
  }

  function my_removeClass(el, className) {
    console.log(el, className);
    if (el.classList)
      el.classList.remove(className)
    else if (hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
      el.className=el.className.replace(reg, ' ')
    }
  }

  function each(o, cb, s){
    var n;
    if (!o){
      return 0;
    }
    s = !s ? o : s;
    if (o instanceof Array){
      // Indexed arrays, needed for Safari
      for (n=0; n<o.length; n++) {
        if (cb.call(s, o[n], n, o) === false){
          return 0;
        }
      }
    } else {
      // Hashtables
      for (n in o){
        if (o.hasOwnProperty(n)) {
          if (cb.call(s, o[n], n, o) === false){
            return 0;
          }
        }
      }
    }
    return 1;
  };

  $(document).ready(function() {
    var
      scrollElements,
      inValidRange,
      setVisibility,
      setVisibilityAll,
      resetScroll;

    // scrollElements = $('[data-scroll-element]');
    scrollElements = document.querySelectorAll('[data-scroll-element]');


    inValidRange = function(offset, limit) {
      return offset >= 0 && offset < limit;
    };

    setVisibility = function(element, nextOffset, limit) {
      if(inValidRange(nextOffset, limit)) {
        // element.removeClass('disabled');
        my_removeClass(element, 'disabled');
      } else {
        // element.addClass('disabled');
        my_addClass(element, 'disabled');
      }
    };

    setVisibilityAll = function(elements, newOffset) {
      var
        $this,
        increment,
        nextOffset,
        limit;

      elements.each(function() {
        $this      = $(this);
        increment  = $this.data('scroll-increment');
        nextOffset = newOffset + increment;
        limit      = $this.data('scroll-limit');

        setVisibility($this, nextOffset, limit);
      });
    };

    resetScroll = function(element) {
      element[0].scrollTop = 0;
      element.data('scroll-offset', 0);
    };

    $('[data-clipboard-target]').each(function() {
      var
          clipboard,
          notification;

      clipboard = new Clipboard(this);

      var notify = function(clipboardNotification, notificationText) {
          notification = $($(clipboardNotification));
          notification.text(notificationText);
          notification.addClass('in').delay(1400).queue(function() {
              notification.removeClass('in');
              $(this).dequeue();
          })
      };

      var notifySuccess = function(e) {
          notify(e.trigger.dataset.clipboardNotification, "Copied!");
      };

      var notifyFailure = function(e) {
          //if the copy function failed the text should still be selected, so just ask the user to hit ctrl+c
          notify(e.trigger.dataset.clipboardNotification, "Press Ctrl+C to copy");
      };

      clipboard.on('success', notifySuccess);
      clipboard.on('error', notifyFailure);
    });

    each(scrollElements, function() {
      var
        $this,
        element,
        increment,
        limit,
        offset,
        nextOffset,
        newOffset;

      $this     = $(this);
      element   = $($this.data('scroll-element'));
      increment = $this.data('scroll-increment');
      limit     = element.data('scroll-limit');
      offset    = element.data('scroll-offset');

      $this.data('scroll-limit', limit);

      nextOffset = offset + increment;
      setVisibility($this, nextOffset, limit);

      // Force IE to forget previous scroll top value
      resetScroll(element);

      $this.on('click', function() {
        offset = element.data('scroll-offset');

        newOffset = offset + increment;
        if (inValidRange(newOffset, limit)) {
          element.animate({
              scrollTop: $('#' + newOffset).position().top
          }, 400);
          element.data('scroll-offset', newOffset);

          setVisibilityAll(scrollElements, newOffset);
        }
      });
    })
    // scrollElements.each();

    $('[data-open-panel]').each(function() {
      var
        $this,
        element;

      $this   = $(this);
      element = $($this.data('open-panel'));

      $this.on('click', function() {
        element.addClass('open');
      });
    });

    $('[data-close-panel]').each(function() {
      var
        $this,
        element;

      $this   = $(this);
      element = $($this.data('close-panel'));

      $this.on('click', function() {
        element
          .one('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function() {
            $this.trigger('panel:closed');
          }).removeClass('open');
      });
    });

    $('[data-scroll-reset]').each(function() {
      var
        $this,
        element;

      $this   = $(this);
      element = $($this.data('scroll-reset'));

      $this.on('click', function() {
        $this.one('panel:closed', function() {
          resetScroll(element);
          setVisibilityAll(scrollElements, 0);
        });
      });
    });

    $('[data-moment]').each(function() {
      var $this;

      $this = $(this);

      var time = moment(parseInt($this.text()));
      $this.text(time.fromNow());
    });
  });

  var setContainerHeight = function(containerEl) {
    // TODO: Refactor this to make simpler
    var
      bodyEl,
      bodyHeight,
      bodyHeightWithoutTitle,
      titleEl,
      panelEl,
      referralsEl,
      referralsTitleEl,
      panelHeight,
      css,
      stylesheet;

    bodyEl           = $('.squatch-body');
    titleEl          = bodyEl.find('.squatch-title');
    panelEl          = $('#squatch-panel');
    referralsEl      = $('.squatch-referrals');
    referralsTitleEl = $('.squatch-referrals-title');

    bodyHeight = bodyEl.outerHeight();
    bodyHeightWithoutTitle = bodyHeight - titleEl.outerHeight(true) - titleEl.position().top;
    panelHeight = panelEl.outerHeight();

    if (referralsEl.is(':visible')) {
      panelHeight -= referralsEl.outerHeight();
    }

    if (referralsTitleEl.is(':visible')) {
      panelHeight -= referralsTitleEl.outerHeight();
    }

    containerEl.css('height', bodyHeight + panelHeight);

    stylesheet = document.createElement('style');
    stylesheet.type = 'text/css';

    css = '#squatch-panel.open {' +
      '-webkit-transform: translate(0, -' + bodyHeightWithoutTitle + 'px);' +
      '-ms-transform: translate(0, -' + bodyHeightWithoutTitle + 'px);' +
      '-o-transform: translate(0, -' + bodyHeightWithoutTitle + 'px);' +
      'transform: translate(0, -' + bodyHeightWithoutTitle + 'px);' +
      '}' +
      'html.lt-ie9 #squatch-panel.open {' +
      'top: -' + bodyHeightWithoutTitle + 'px;' +
      '}';

    if (stylesheet.styleSheet){
      // IE
      stylesheet.styleSheet.cssText = css;
    } else {
      // W3C Standard
      stylesheet.appendChild(document.createTextNode(css));
    }

    document.querySelector('head').appendChild(stylesheet);
  };

  var containerEl = $('.squatch-container-popup');
  if (containerEl.length) {
    var setContainerHeightForPopup = setContainerHeight.bind(undefined, containerEl);
    var windowEl = $(window);

    // Workaround for popup height being incorrectly set during iframe resizing.
    // This is due to the popup being displayed inconsistently - with responsive styles activated, sometimes the mobile view will be displayed, even on a desktop monitor with more than 500 pixels width. The solution may be to set the iframe width to the full browser width, rather than the width of the widget theme.
    // There is another hack in _popup.less as well
    // TODO: Find a solution for this and enable responsive styles again.
    windowEl.on('load', function () {
      var setContainerHeightIfWideEnough = function () {
        var width = windowEl.width();

        if (width === 500) {
          setContainerHeightForPopup();
        } else {
          setTimeout(function() {
            setContainerHeightIfWideEnough();
          }, 50);
        }
      };

      setContainerHeightIfWideEnough();
    });

    // The content has a different height in mobile
    // TODO: Find a a solution for responsive in popups and re-enable this
    // var mql = window.matchMedia('(max-width: 500px)');
    // mql.addListener(setContainerHeightForPopup);
  }
})();

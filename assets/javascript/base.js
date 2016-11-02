

  // gracefully handle mailto between chrome/outlook type systems/no mail client
  // (i.e. - don't leave the page on blank tab)
  var mailTo = function(url) {
    // I have often experienced Firefox errors with protocol handlers
    // so better be on the safe side.
    try {
      var mailer = window.open(url, 'Mailer');
    } catch(e) {
      console.warn('There was an error opening a mail composer.', e);
    }

    setTimeout(function() {
      // This needs to be in a try/catch block because a Security
      // error is thrown if the protocols doesn't match
      try {
        // At least in Firefox the location is changed to about:blank
        if(mailer.location.href === url || mailer.location.href.substr(0, 6) === 'about:') {
          mailer.close();
        }
      } catch(e) {
        console.warn('There was an error opening a mail composer.', e);
      }
    }, 500);
  }

  function emailFormHandler() {
    var sendEmailBtn = document.getElementById('squatch-send-email');
    var emailInput = document.getElementById('squatch-user-email');

    handleClicks(sendEmailBtn, function() {
      if (!isValidEmail(emailInput.value)) {
        my_addClass(emailInput, 'invalid');
        emailInput.onkeypress = function() {
          if (isValidEmail(this.value)) {
            my_removeClass(this, 'invalid');
            my_addClass(this, 'valid');
          }
        }
      } else {
        my_removeClass(emailInput, 'invalid');
        var registerForm = document.getElementsByClassName('squatch-register')[0];
        registerForm.style.paddingTop = '30px';
        registerForm.innerHTML = '<p><strong>' + emailInput.value + '</strong><br>Has been successfully registered</p>';

        if (window.parent.squatch && window.parent.squatch.eventBus) {
          window.parent.squatch.eventBus.dispatch('email_submitted', this, emailInput.value /*, JWT*/);
        }
      }
    });
  }

  function facebookHandler() {
    var facebookBtn = document.getElementsByClassName('fbShare')[0];

    if (!facebookBtn) return;

    var pictureString = (squatch.user.facebook.shareImage == "" || squatch.user.facebook.shareImage === null) ? "" : "&picture="+squatch.user.facebook.shareImage;
    var fbUrl = "https://www.facebook.com/dialog/feed?app_id=" + squatch.user.facebook.appId + "&link=" + squatch.user.facebook.link + "&name=" + squatch.user.facebook.title + "&description=" + squatch.user.facebook.summary + pictureString+ "&redirect_uri=" + squatch.user.facebook.redirectUrl;
    facebookBtn.href = fbUrl;

    handleClicks(facebookBtn, function(e) {
      // If it's not mobile, don't use href link
      if (e.type != 'touchstart') {
        e.preventDefault();

        var url = fbUrl + "&display=popup";
        window.open(url, 'fb', 'status=0,width=620,height=400');
      }

      if (window.parent.squatch && window.parent.squatch.eventBus) {
        window.parent.squatch.eventBus.dispatch('fb_btn_clicked', this, window.squatch /*,params*/ /*, JWT*/);
      }
    });
  }

  function twitterHandler() {
    var twitterBtn = document.getElementsByClassName('twShare')[0];
    var twUrl = "https://twitter.com/intent/tweet?source=webclient&text=" + squatch.user.twitter.message;

    if (!twitterBtn) return;
    twitterBtn.href = twUrl;

    handleClicks(twitterBtn, function(e) {
      if (e.type != 'touchstart') {
        e.preventDefault();
        window.open(twUrl, 'twitter', 'status=1,width=575,height=400');
      }

      if (window.parent.squatch && window.parent.squatch.eventBus) {
        window.parent.squatch.eventBus.dispatch('tw_btn_clicked', this, window.squatch /*,params*/ /*, JWT*/);
      }
    });
  }

  function emailHandler() {
    var emailBtn = document.getElementsByClassName('emailShare')[0];
    var emailUrl = squatch.user.email.share.mailToLink;

    handleClicks(emailBtn, function(e) {
      if (e.type != 'touchstart') {
        e.preventDefault();

        var mailurl = emailUrl;
        mailTo(mailurl);
      }

      if (window.parent.squatch && window.parent.squatch.eventBus) {
        window.parent.squatch.eventBus.dispatch('email_btn_clicked', this, window.squatch);
      }
    });
  }

  function listenToClick(element, name, fn) {
    if (document.addEventListener) {
      element.addEventListener(name, fn, false);
    } else {
      element.attachEvent((name === 'click') ? 'onclick' : name, fn);
    }
  }

  function handleClicks(elem, fn) {
    if (!elem) return;

    if (document.addEventListener) {
      // For all major browsers, except IE 8 and earlier
      elem.addEventListener("click", fn, false);
      elem.addEventListener("touchstart", fn, false);
    } else if (document.attachEvent) {
      // For IE 8 and earlier versions
      elem.attachEvent("onclick", fn, false);
      elem.attachEvent("touchstart", fn, false);
    }
  }

  function hasClass(el, className) {
    if (el.classList)
      return el.classList.contains(className)
    else
      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
  }

  function my_addClass(el, className) {
    if (el.classList)
      el.classList.add(className)
    else if (!hasClass(el, className)) el.className += " " + className
  }

  function my_removeClass(el, className) {
    if (el.classList)
      el.classList.remove(className)
    else if (hasClass(el, className)) {
      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
      el.className=el.className.replace(reg, ' ')
    }
  }

  function scrollTop(element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;

    var animateScroll = function(){
      currentTime += increment;
      var val = Math.easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if(currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };
    animateScroll();
  }

  //t = current time
  //b = start value
  //c = change in value
  //d = duration
  Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
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
  }

  var isValidEmail = function(email) {
    return /^.+@.+\..+$/.test(email);
  }

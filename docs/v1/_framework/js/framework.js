$(document).ready(function () {
  var _base = this;
  var _htmlPath = "html/";
  var _htmlExtension = ".html";
  var _cssPath = "css/";
  var _cssExtension = ".css";
  var _jsPath = "js/";
  var _jsExtension = ".js";
  var _mainIndexPath = "./_framework/index" + _htmlExtension;
  var _defaultConfig = {
    defaultHash: "overview",
  };
  var _openModals = [];
  var _ajaxContentRequest;
  var _ajaxContentRequestTimeoutId;
  var _dataAttrNavigation = "data-navigation";
  var _dataAttrTabKey = "data-tab-key";
  var _dataAttrTabValue = "data-tab-value";
  var _dataAttrExpanderKey = "data-expander-key";
  var _dataAttrExpanderValue = "data-expander-value";
  var _dataAttrRadio = "data-radio";
  var _dataAttrModal = "data-modal";
  var _dataAttrInputNumeric = "data-input-numeric";
  var _expanderExpandDuration = 230;
  var _tabsFadeDuration = 230;
  var _strActive = "active";
  var _finalConfig;
  var _defaultHash;
  var _hasherPrepareHash = "!";
  var _hasherSeparator = "/";
  var _navigationContentNavigation;
  var _navButton;
  var _navBackdrop;
  var _nav;
  var _body;
  var _window;
  var _header;
  var _content;
  var _footer;
  var _loading;
  var _loadingTimeoutId;
  var _contentNavigationScrollTimeout;
  var _mainNavigationItems;
  var _debug = {};
  var _debugModal;
  var _debugModalContent;
  var _fourZeroFourPath = "./_framework/html/404" + _htmlExtension;
  var _fourZeroFourFaces = [
    " ಠ_ಠ ",
    "(＃｀д´)ﾉ",
    "ლ(ಠ_ಠლ)",
    "(；￣Д￣）",
    "¯\\_(ツ)_/¯",
    "ᕕ( ͡° ͜ʖ ͡° )ᕗ",
    "(☞ﾟヮﾟ)☞    ☜(ﾟヮﾟ☜)",
    "͡° ͜ʖ ͡°",
    "ヽ( ಠ益ಠ )ﾉ",
    " (╯°□°）╯︵ ┻━┻",
    "(ಠ_ಠ)",
    "(`･Д･)ノ=☆",
    "★≡≡＼（`△´＼）",
    "（◞‸◟）",
    "(／‵Д′)／~ ╧╧",
    "┻━┻ ︵﻿ ¯\\_༼ᴼل͜ᴼ༽_/¯ ︵ ┻━┻",
    "¯\\_(⊙_ʖ⊙)_/¯",
    "┐(´～｀)┌",
    "乁( ⁰͡  Ĺ̯ ⁰͡ ) ㄏ",
    "(；・∀・)",
    "(^◇^；)",
  ];
  var _mainScrollElement = $("body")
    .overlayScrollbars({
      nativeScrollbarsOverlaid: {
        initialize: false,
      },
    })
    .overlayScrollbars();

  function showLoading() {
    if (_mainScrollElement) _mainScrollElement.sleep(); //put to sleep
    _loading.addClass(_strActive);
    _content.css("opacity", 0);
  }

  function hideLoading() {
    if (_mainScrollElement) _mainScrollElement.update(); //wakeup from sleeping
    if (_nav.overlayScrollbars()) {
      _nav.overlayScrollbars().options("overflowBehavior.x", "scroll");
      _nav.overlayScrollbars().update(true); //FF fix for fixed elements.
    }
    if (!_header.hasClass("shrinked") && _nav.overlayScrollbars()) {
      _nav.overlayScrollbars().options("overflowBehavior.x", "hidden");
    }
    _loading.removeClass(_strActive);
    _content.css("opacity", 1);
  }

  function setBodyScrollbars() {
    if (_mainScrollElement) {
      _mainScrollElement.options({
        callbacks: {
          onScroll: function () {
            updateContentNavigation();
          },
          onHostSizeChanged: function () {
            updateContentNavigation();
          },
          onContentSizeChanged: function () {
            updateContentNavigation();
          },
        },
      });
    } else {
      _window
        .off("scroll", updateContentNavigation)
        .on("scroll", updateContentNavigation);
      _window
        .off("resize", updateContentNavigation)
        .on("resize", updateContentNavigation);
    }
  }

  function onHashChange(newHash, oldHash) {
    if (_ajaxContentRequest) _ajaxContentRequest.abort();
    if (_ajaxContentRequestTimeoutId)
      clearTimeout(_ajaxContentRequestTimeoutId);

    newHash = newHash.toLowerCase();
    oldHash = oldHash !== undefined ? oldHash.toLowerCase() : oldHash;
    var oldMainHash =
      oldHash === undefined ? "" : oldHash.split(_hasherSeparator)[0];
    var newMainHash = newHash.split(_hasherSeparator)[0];
    if (oldMainHash !== newMainHash) {
      _content.off();
      try {
        window._framework.onPagePathChange = undefined;
        window._framework.defaultPagePath = undefined;
        delete window._framework.onPagePathChange;
        delete window._framework.defaultPagePath;
      } catch (ex) {}

      showLoading();
      _ajaxContentRequest = $.get(
        _htmlPath + newMainHash + _htmlExtension,
        function (response) {
          _body.trigger("contentDestruct");
          $.each(
            $("#content *").overlayScrollbars("!"),
            function (index, instance) {
              instance.destroy();
            }
          ); //destroy all OS instances
          _content[0].innerHTML = ""; //empty content

          _ajaxContentRequestTimeoutId = setTimeout(function () {
            _ajaxContentRequestTimeoutId = undefined;

            //load correct content:
            (function (HTML, callback) {
              var temp = document.createElement("div"),
                frag = document.createDocumentFragment();
              temp.innerHTML = HTML;
              var action = function () {
                if (temp.firstChild) {
                  frag.appendChild(temp.firstChild);
                  setTimeout(action, 0);
                } else callback(frag);
              };
              action();
            })(response, function (fragment) {
              _content[0].appendChild(fragment); // myTarget should be an element node.

              contentLoad(newMainHash);

              $.getScript(_jsPath + newMainHash + _jsExtension)
                .always(function () {
                  pagePathChange(newHash, oldHash);
                  hideLoading();
                })
                .fail(function () {
                  if (arguments[0].readyState == 0) {
                    //script failed to load
                  } else {
                    //script loaded but failed to parse
                    console.error(arguments);
                  }
                });
            });

            /*
					_content[0].innerHTML = response;
					contentLoad(newMainHash);
					$.getScript(_jsPath + newMainHash + _jsExtension).always(function() {
						pagePathChange(newHash, oldHash);
						hideLoading();
					});	
					*/
          }, 400);
        },
        "html"
      )
        .fail(function () {
          //404
          $.get(
            _fourZeroFourPath,
            function (response) {
              _content.html(response);
              $("#four-zero-four-face").html(
                _fourZeroFourFaces[
                  Math.floor(
                    Math.random() * (_fourZeroFourFaces.length - 1) + 0
                  )
                ]
              );
            },
            "html"
          );

          pagePathChange(newHash, oldHash);
          hideLoading();
        })
        .always(function () {
          _ajaxContentRequest = undefined;

          //refresh navigation:
          _mainNavigationItems.removeClass(_strActive);
          $.each(_mainNavigationItems, function () {
            var item = $(this);
            if (item.attr(_dataAttrNavigation) === newMainHash) {
              item.addClass(_strActive);
            }
          });
          if (newMainHash === _defaultHash) {
            _header.removeClass("shrinked");
          } else {
            _header.addClass("shrinked");
            if (_nav.overlayScrollbars()) _nav.overlayScrollbars().update();
          }

          //scroll To top:
          if (_mainScrollElement) _mainScrollElement.scroll({ y: 0 });
          else _window.scrollTop(0);
        });
    } else pagePathChange(newHash, oldHash);
  }

  function pagePathChange(newHash, oldHash) {
    var openLinkInSameTab = function (e) {
      var ee = e.originalEvent || e;

      //on normal mouse click or triggered event
      if (
        ((ee.which === 1 || ee.buttons === 1 || ee.button === 1) &&
          ee.ctrlKey !== true) ||
        e.originalEvent === undefined
      ) {
        var navigationValue = $(e.currentTarget)
          .closest("[" + _dataAttrNavigation + "]")
          .attr(_dataAttrNavigation);
        if (navigationValue) {
          var newHashArray = generateHashArray(navigationValue);
          var newHashArrayParamString = "";
          for (var i = 0; i < newHashArray.length; i++)
            newHashArrayParamString += '"' + newHashArray[i] + '", ';
          newHashArrayParamString = newHashArrayParamString.substring(
            0,
            newHashArrayParamString.length - 2
          );

          window.eval("hasher.setHash(" + newHashArrayParamString + ");");
        }
      }
    };
    var openLinkInNewTab = function (e) {
      var ee = e.originalEvent || e;
      //on strg + left mouse button OR middle mouse button
      if (
        ee.ctrlKey !== undefined &&
        ee.ctrlKey === true &&
        (ee.which === 1 ||
          ee.buttons === 1 ||
          ee.buttons === 4 ||
          ee.which === 2)
      ) {
        var navigationValue = $(e.currentTarget)
          .closest("[" + _dataAttrNavigation + "]")
          .attr(_dataAttrNavigation);
        if (navigationValue) {
          var newHashArray = generateHashArray(navigationValue);
          var newHashArrayParamString = "#" + _hasherPrepareHash;
          for (var i = 0; i < newHashArray.length; i++)
            newHashArrayParamString +=
              (i == 0 ? "" : _hasherSeparator) + newHashArray[i] + "";
          window.open(hasher.getBaseURL() + newHashArrayParamString, "_blank");

          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
      }
      if (e.originalEvent === undefined) {
        openLinkInSameTab(e);

        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };
    //Generate correct hash after data-navigation element was klicked
    $("[" + _dataAttrNavigation + "]:not(option)").on(
      "click",
      openLinkInNewTab
    );
    $("[" + _dataAttrNavigation + "]:not(option)").on(
      "mousedown",
      openLinkInSameTab
    );

    /*
		$('[' + _dataAttrNavigation + ']:not(option)').on('mousedown', function(e) {
			var ee = e.originalEvent || e;
			//on middle mouse button
			if((ee.buttons === 4 || ee.which === 2)) {
				var navigationValue = $(this).closest('[' + _dataAttrNavigation + ']').attr(_dataAttrNavigation);
				var newHashArray = generateHashArray(navigationValue);
				var newHashArrayParamString = '#' + _hasherPrepareHash;
				for(var i = 0; i < newHashArray.length; i++)
					newHashArrayParamString += (i == 0 ? "" : _hasherSeparator) + newHashArray[i] + "";
				window.open(hasher.getBaseURL() + newHashArrayParamString, '_blank');
				
				e.stopPropagation();
				e.stopImmediatePropagation();
				return false;
			}
		});
		*/

    var oldMainHash =
      oldHash === undefined ? "" : oldHash.split(_hasherSeparator)[0];
    var newMainHash = newHash.split(_hasherSeparator)[0];
    var newHashArray = newHash.split(_hasherSeparator);
    var oldHashArray =
      oldHash === undefined ? [] : oldHash.split(_hasherSeparator);
    var offsetChange = -1;
    var path = [];
    if (newHashArray.length > oldHashArray.length) {
      $.each(newHashArray, function (i) {
        if (newHashArray[i] !== oldHashArray[i]) {
          offsetChange = i;
          return false;
        }
      });
    } else {
      $.each(oldHashArray, function (i) {
        if (oldHashArray[i] !== newHashArray[i]) {
          offsetChange = i;
          return false;
        }
      });
    }
    if (oldMainHash === newMainHash) offsetChange -= 1;

    for (var i = 0; i < newHashArray.length; i++) {
      if (i === 0) continue;
      var curr = newHashArray[i];
      var name = curr;
      path.push(name);
    }

    if ($.type(window._framework.onPagePathChange) === "function") {
      window._framework.onPagePathChange({
        isEmpty: newHashArray.length <= 1,
        changedAt: offsetChange,
        path: path,
      });
    }

    //if a default tab shall be selected
    if (
      newHashArray.length === 1 &&
      offsetChange === 0 &&
      window._framework.defaultPagePath
    )
      hasher.replaceHash(newHashArray[0], window._framework.defaultPagePath);

    //Main tabcontrol hashchange functionality
    if (newHashArray.length > 1 && offsetChange === 0) {
      var possibleTabItems = $("#content-navigation").find(
        ".content-navigation-item-clickable[data-navigation]"
      );
      var osInstance = $("#content-navigation").overlayScrollbars();
      clearTimeout(_contentNavigationScrollTimeout);
      $.each(possibleTabItems, function () {
        var item = $(this);
        var itemNavAttr = item.attr("data-navigation").toLowerCase();
        if (itemNavAttr !== undefined)
          itemNavAttr = itemNavAttr.replace(/[0-9]/, "").replace(/[[]]/g, "");

        if (itemNavAttr === path[offsetChange]) {
          item.trigger("click");
          _contentNavigationScrollTimeout = setTimeout(function () {
            if (osInstance) {
              try {
                updateContentNavigation();
                osInstance.scrollStop();
                osInstance.scroll(
                  {
                    el: item,
                    margin: { top: 5, bottom: 40 },
                    block: "nearest",
                    scroll: { y: "ifneeded" },
                  },
                  300
                );
              } catch (ex) {}
            }
          }, 400);
          var tabKeyAttr = item.attr(_dataAttrTabKey);
          if (tabKeyAttr !== undefined && tabKeyAttr !== null) {
            var tabContent = $(
              "[" + _dataAttrTabValue + '="' + tabKeyAttr + '"]'
            );
            tabContent.find("code:not(.hljs)").each(function (i, element) {
              hljs(element);
            });

            //custom scrollbar on code
            $.each(tabContent.find("pre > code.hljs"), function () {
              var elem = $(this);
              var hideY = !elem.hasClass("expandable");
              if (
                !elem.hasClass("code-noscroll") &&
                elem.overlayScrollbars() === undefined
              ) {
                elem.overlayScrollbars({
                  paddingAbsolute: true,
                  overflowBehavior: {
                    y: hideY ? "hidden" : "scroll",
                  },
                });
              }
            });
            //manage code mirrors
            setTimeout(function () {
              $(".CodeMirror").each(function (i, el) {
                if (el.offsetHeight > 0) el.CodeMirror.refresh();
              });
            }, 300);
          }
        }
      });
    }

    var contentNavigation = $("#content-navigation");
    if (contentNavigation.length > 0) {
      var activeTab = contentNavigation
        .children()
        .find(".active")
        .first()
        .attr(_dataAttrTabKey);
      _navigationContentNavigation.val(
        _navigationContentNavigation
          .find("[" + _dataAttrTabKey + '="' + activeTab + '"]')
          .text()
      );
    }
  }

  function contentLoad(currentMainHash) {
    updateContentNavigation();
    _navigationContentNavigation.empty();

    var contentNavigation = $("#content-navigation");
    if (contentNavigation.length > 0) {
      //build also a select with optgroups:
      var items = contentNavigation.children();
      var group;
      for (var i = 0; i < items.length; i++) {
        var text = items.eq(i).find("span").first().text();
        if (items.eq(i).hasClass("content-navigation-item-clickable")) {
          var appendTo = group ? group : _navigationContentNavigation;
          var option = $('<option value="' + text + '">' + text + "</option>");
          option.attr(_dataAttrTabKey, items.eq(i).attr(_dataAttrTabKey));
          option.attr(
            _dataAttrNavigation,
            items.eq(i).attr(_dataAttrNavigation)
          );
          appendTo.append(option);
        } else {
          group = $('<optgroup label="' + text + '" />');
          _navigationContentNavigation.append(group);
        }
      }

      //custom scrollbar on content menu (sidebar menu)
      contentNavigation.overlayScrollbars({
        scrollbars: {
          autoHide: "leave",
        },
        overflowBehavior: {
          x: "hidden",
        },
      });
    }

    //modal
    $(".modal .modal-window-header-close").on("click", function (e) {
      var clickedElement = $(e.target);
      var modal = clickedElement.closest(".modal").first();
      hideModal(modal);
    });
    $(".modal").on("mousedown", function (e) {
      var clickedElement = $(e.target);
      var modal = clickedElement.closest(".modal").first();
      var condition =
        modal.length > 0
          ? modal.overlayScrollbars() instanceof OverlayScrollbars
            ? clickedElement[0] === modal[0] ||
              clickedElement[0] ===
                modal.overlayScrollbars().getElements().content ||
              clickedElement[0] ===
                modal.overlayScrollbars().getElements().viewport
            : clickedElement[0] === modal[0]
          : false;

      if (
        condition &&
        modal.hasClass("modal-backdrop-closeable") &&
        e.which === 1
      ) {
        modal.one("mouseup", function (e) {
          var clickedElement = $(e.target);
          var modal = clickedElement.closest(".modal").first();
          var condition =
            modal.length > 0
              ? modal.overlayScrollbars() instanceof OverlayScrollbars
                ? clickedElement[0] === modal[0] ||
                  clickedElement[0] ===
                    modal.overlayScrollbars().getElements().content ||
                  clickedElement[0] ===
                    modal.overlayScrollbars().getElements().viewport
                : clickedElement[0] === modal[0]
              : false;

          if (condition) hideModal(modal);
        });
      }
    });
    $("[" + _dataAttrModal + "]").on("click", function (e) {
      var target = $(e.target);
      var attr = target.attr(_dataAttrModal);
      var closestAttrTarget = target
        .closest("[" + _dataAttrModal + "]")
        .first();
      if (!closestAttrTarget.hasClass("modal"))
        showModal($(".modal[" + _dataAttrModal + '="' + attr + '"]').first());
    });
    if (_mainScrollElement) {
      var modalInstances = $(".modal")
        .overlayScrollbars({ sizeAutoCapable: false })
        .overlayScrollbars();
      for (var i = 0; i < modalInstances.length; i++) modalInstances[i].sleep();
    }

    //input-numeric
    (function () {
      $(".input-numeric").each(function () {
        var mainElem = $(this);
        var parseFunc = window.parseFloat;
        var toFixedNum = 8;

        var min = parseFunc(mainElem.attr(_dataAttrInputNumeric + "-min"));
        var max = parseFunc(mainElem.attr(_dataAttrInputNumeric + "-max"));
        var step = parseFunc(mainElem.attr(_dataAttrInputNumeric + "-step"));
        var value = parseFunc(
          mainElem.find(".input-numeric-input > input").val()
        );

        var decreaseBtn = mainElem
          .find(".input-numeric-button-decrease")
          .first();
        var increaseBtn = mainElem
          .find(".input-numeric-button-increase")
          .first();
        var input = mainElem.find(".input-numeric-input > input");

        var updateValue = function () {
          var adjusted = false;
          if (value < min) {
            value = min;
            adjusted = true;
          }
          if (value > max) {
            value = max;
            adjusted = true;
          }
          input.val(value);
          mainElem.trigger("valuechanged", [value]);
          return adjusted;
        };

        var buttonPressedTimeout;
        var buttonPressed = function (action) {
          action();
          buttonPressedTimeout = setTimeout(function () {
            buttonPressed(action);
          }, 125);
        };

        min = isNaN(min) ? 0 : min;
        max = isNaN(max) ? 0 : max;
        step = isNaN(step) ? 0 : step;

        if (min > max) min = max;
        if (max < min) max = min;
        if (value < min) value = min;
        if (value > max) value = max;

        decreaseBtn.on("mousedown", function (e) {
          clearTimeout(buttonPressedTimeout);
          buttonPressed(function () {
            value -= step;
            value = parseFunc(value.toFixed(toFixedNum));
            updateValue();
          });
          $(document).one("mouseup", function (e) {
            clearTimeout(buttonPressedTimeout);
          });
        });
        increaseBtn.on("mousedown", function (e) {
          clearTimeout(buttonPressedTimeout);
          buttonPressed(function () {
            value += step;
            value = parseFunc(value.toFixed(toFixedNum));
            updateValue();
          });
          $(document).one("mouseup", function (e) {
            clearTimeout(buttonPressedTimeout);
          });
        });

        input.on("keydown", function (e) {
          // Allow: backspace, delete, tab, escape, enter and .
          if (
            $.inArray(
              e.keyCode,
              [46, 8, 9, 27, 13, 110].concat(floaty ? [190] : [])
            ) !== -1 ||
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) || // Allow: Ctrl/cmd+A
            (e.keyCode == 67 && (e.ctrlKey === true || e.metaKey === true)) || // Allow: Ctrl/cmd+C
            (e.keyCode == 86 && (e.ctrlKey === true || e.metaKey === true)) || // Allow: Ctrl/cmd+V
            (e.keyCode == 88 && (e.ctrlKey === true || e.metaKey === true)) || // Allow: Ctrl/cmd+X
            (e.keyCode >= 35 && e.keyCode <= 39)
          ) {
            // Allow: home, end, left, right
            return;
          }
          // Ensure that it is a number and stop the keypress
          if (
            (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
            (e.keyCode < 96 || e.keyCode > 105)
          ) {
            e.preventDefault();
          }
        });
        input.on("input", function (e) {
          var inputVal = input.val();
          if (inputVal === "") value = min;
          else {
            value = parseFunc(inputVal);
            value = isNaN(value) ? min : value;
          }
          updateValue();
        });
        /*
				input.on('focus', function(e) { 
					input.select();
				});
				*/
        updateValue();

        mainElem.find(".input-numeric-input > input").val(value);
      });
    })();

    //dropdown
    $(".dropdown").on("click", function (e) {
      var dropdown = $(this).closest(".dropdown");
      var isActive = false;
      if (dropdown.hasClass(_strActive)) isActive = true;

      $(".dropdown.active").removeClass(_strActive);

      if (isActive) dropdown.removeClass(_strActive);
      else dropdown.addClass(_strActive);

      if (dropdown.hasClass(_strActive)) {
        _body.one("click", function () {
          dropdown.removeClass(_strActive);
        });
      }
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    });
    $(".dropdown-list > div").on("click", function (e) {
      var dropdown = $(this).closest(".dropdown");
      var dropdownValue = dropdown.find(".dropdown-value");
      dropdownValue.text($(this).text());
      dropdown.removeClass(_strActive);
      dropdown.trigger("dropdownvaluechanged", [dropdownValue.text()]);
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    });

    //radio buttons
    $("[" + _dataAttrRadio + "]").on("click", function (e) {
      var target = $(e.target);
      var attr = target.attr(_dataAttrRadio);

      if (target.hasClass(_strActive)) return;

      $("[" + _dataAttrRadio + '="' + attr + '"]')
        .removeClass(_strActive)
        .trigger("radiooff");
      target.addClass(_strActive).trigger("radioon");
    });

    //expander
    $("[" + _dataAttrExpanderKey + "]").on("click", function (e) {
      //var closestOS = $(this).closest('.os-host');
      var currElem = $(this).closest("[" + _dataAttrExpanderKey + "]");
      var target = $(
        "[" +
          _dataAttrExpanderValue +
          '="' +
          currElem.attr(_dataAttrExpanderKey) +
          '"]'
      );
      if (target.hasClass(_strActive)) {
        target.stop().slideUp(_expanderExpandDuration);
        currElem.removeClass(_strActive);
        target.removeClass(_strActive);
      } else {
        target.stop().slideDown(_expanderExpandDuration);
        currElem.addClass(_strActive);
        target.addClass(_strActive);
      }
    });

    //tabs
    $("[" + _dataAttrTabValue + "]:not(." + _strActive + ")").hide();
    $("[" + _dataAttrTabKey + "]:not(option)").on("click", function (e) {
      var currElem = $(this).closest("[" + _dataAttrTabKey + "]");
      if (currElem.hasClass(_strActive)) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
      var ee = e.originalEvent || e;
      if (
        ee.ctrlKey !== undefined &&
        ee.ctrlKey === true &&
        (ee.which === 1 || ee.buttons === 1)
      ) {
        return false;
      }

      var target = $(
        "[" + _dataAttrTabValue + '="' + currElem.attr(_dataAttrTabKey) + '"]'
      );
      var parent = target.parent();
      var currActive = parent
        .children("." + _strActive)
        .first()
        .removeClass(_strActive);
      var doScroll =
        currElem.attr(_dataAttrNavigation) !== undefined &&
        currElem.attr(_dataAttrNavigation) !== null;
      var action = function () {
        target.stop().fadeIn(_tabsFadeDuration).addClass(_strActive);
        if (doScroll) {
          if (_mainScrollElement) _mainScrollElement.scroll({ y: 0 });
          else _window.scrollTop(0);
        }
      };
      if (currActive.length === 0) action();
      else currActive.stop().fadeOut(_tabsFadeDuration, action);

      $("[" + _dataAttrTabKey + '="' + currElem.attr(_dataAttrTabKey) + '"]')
        .each(function () {
          $(this)
            .parent()
            .find("[" + _dataAttrTabKey + "]")
            .removeClass(_strActive);
        })
        .addClass(_strActive);
    });

    //options table expand on click
    $(".options-table > tbody > tr:nth-child(2n+1)").on("click", function (e) {
      var current = $(e.target).closest("tr");
      var target = current.next().find("div").first();
      target.stop().slideToggle(300, "easeOutCirc");
      if (current.hasClass(_strActive)) current.removeClass(_strActive);
      else current.addClass(_strActive);
    });
    $(".options-table > tbody > tr:nth-child(2n+1) code").on(
      "click",
      function (e) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    );

    $("#content-navigation-button").on("click", function () {
      $("#content-navigation-button").toggleClass(_strActive);
    });

    if ($("#content-navigation-main").length > 0) {
      //code highlight js on default visible tab element
      $("#content-navigation-main > div:visible")
        .find("code")
        .each(function (i, element) {
          hljs(element);
        });

      //custom scrollbar on code on default visible tab element
      $.each(
        $("#content-navigation-main > div:visible").find("pre > code.hljs"),
        function () {
          var elem = $(this);
          var hideY = !elem.hasClass("expandable");
          if (
            !elem.hasClass("code-noscroll") &&
            elem.overlayScrollbars() === undefined
          ) {
            elem.overlayScrollbars({
              paddingAbsolute: true,
              overflowBehavior: {
                y: hideY ? "hidden" : "scroll",
              },
            });
          }
        }
      );
    } else {
      //code highlight js on default visible tab element
      $("code").each(function (i, element) {
        hljs(element);
      });

      //custom scrollbar on code on default visible tab element
      $.each($("pre > code.hljs"), function () {
        var elem = $(this);
        if (
          !elem.hasClass("code-noscroll") &&
          elem.overlayScrollbars() === undefined
        ) {
          elem.overlayScrollbars({
            paddingAbsolute: true,
            overflowBehavior: {
              y: "hidden",
            },
          });
        }
      });
    }
    //code in modals
    $(".modal")
      .find("code")
      .each(function (i, element) {
        hljs(element);
      });

    //code expand and shrink
    $("code.expandable").each(function (i, element) {
      var strExpanded = "expanded";
      var strExpandContent = 'Expand<i class="mdi mdi-chevron-down"></i>';
      var strShrinkContent = 'Shrink<i class="mdi mdi-chevron-up"></i>';
      var appendElement = $(
        '<span class="expandable-button">' + strExpandContent + "</span>"
      );
      appendElement.on("click", function () {
        var codeElement = $(this).parent();
        if ($(codeElement).hasClass(strExpanded)) {
          $(this).html(strExpandContent);
          codeElement.removeClass(strExpanded);
        } else {
          $(this).html(strShrinkContent);
          codeElement.addClass(strExpanded);
        }
      });
      $(element).append(appendElement);
    });

    //tippy
    $("[data-tooltip]").each(function () {
      try {
        var el = this;
        var tt = $(this).find(".tooltip").first();
        tippy(this, { html: tt[0], arrow: true });
        $(this).append(tt.clone());
      } catch (ex) {}
    });
  }

  function updateContentNavigation() {
    var contentNav = $("#content-navigation");
    var viewportHeight = $(window).height();
    var contentNavHeight = contentNav.height();
    var contentNavWrapperHeight = _content.height();
    var scrollTop = _mainScrollElement
      ? _mainScrollElement.scroll().position.y
      : _window.scrollTop();
    var scrollLeft = _mainScrollElement
      ? _mainScrollElement.scroll().position.x
      : _window.scrollLeft();
    var navHeight = _nav.height();
    var maxHeight = Math.min(
      viewportHeight - navHeight,
      contentNavWrapperHeight - scrollTop
    );

    if (OverlayScrollbars.globals().supportTransform) {
      translateElement(contentNav, -scrollLeft, 0);
    } else {
      contentNav.css("left", -scrollLeft);
    }

    contentNav.css("max-height", maxHeight);

    if (_nav.overlayScrollbars())
      _nav.overlayScrollbars().scroll([scrollLeft, 0]);
    else _nav.scrollLeft(scrollLeft);
  }

  function generateHashArray(navigationValue) {
    navigationValue = navigationValue.replace(/\s/g, "");
    var currHashArray = hasher.getHashAsArray();
    var newHashArray = [];
    var indexOfOffsetBracketOpen = navigationValue.indexOf("[");
    var indexOfOffsetBracketClose = navigationValue.indexOf("]");
    var offset = 0;
    if (
      indexOfOffsetBracketOpen === 0 &&
      (indexOfOffsetBracketClose === 2 ||
        indexOfOffsetBracketClose === 3 ||
        indexOfOffsetBracketClose === 4)
    ) {
      offset = parseInt(
        navigationValue.split("]")[0].substring(1, indexOfOffsetBracketClose)
      );
      if (isNaN(offset)) throw "Invalid navigation offset value!";
    }

    var navigationValueSplit = navigationValue.split("]");
    if (navigationValueSplit.length === 1) navigationValue = navigationValue;
    else navigationValue = navigationValueSplit[1];

    for (var i = 0; i < offset + 1; i++) newHashArray[i] = currHashArray[i];

    newHashArray[offset] = navigationValue;
    if (navigationValue === "") newHashArray.splice(offset, 1);

    for (var i = 0; i < newHashArray.length; i++)
      newHashArray[i] = newHashArray[i].toLowerCase();

    return newHashArray;
  }

  function hljs(element) {
    if (window.hljs !== undefined) {
      window.hljs.highlightBlock(element);
    }
  }

  function translateElement(element, x, y) {
    var vendors = ["", "-webkit-", "-moz-", "-o-", "-ms-"];
    for (var i = 0; i < vendors.length; i++)
      element.css(
        "transform",
        vendors[i] + "translate(" + x + "px, " + y + "px)"
      );
  }

  function showModal(modal) {
    if (!modal.hasClass("modal-open") && !modal.hasClass("modal-animating")) {
      var osInstance = modal.overlayScrollbars();
      var hasOS = osInstance instanceof OverlayScrollbars;

      modal
        .addClass("modal-animating")
        .stop()
        .fadeIn(300, function () {
          if (hasOS && osInstance.getState().sleeping)
            modal.overlayScrollbars().update();
          modal.removeClass("modal-animating");
        })
        .addClass("modal-open")
        .css("z-index", parseInt(modal.css("z-index")) + _openModals.length + 1)
        .focus();
      if (hasOS) modal.overlayScrollbars().scroll(0, 1);
      else modal.scrollTop(0).scrollLeft(0);
      if (_openModals.length === 0) {
        _body.on("keydown", modalEsc);
        if (_mainScrollElement)
          _mainScrollElement.options({
            overflowBehavior: { x: "hidden", y: "hidden" },
          });
        else _body.css("overflow", "hidden");
      }
      _openModals.push(modal[0]);
    }
  }

  function hideModal(modal) {
    if (modal.hasClass("modal-open") && !modal.hasClass("modal-animating")) {
      if (modal.overlayScrollbars() instanceof OverlayScrollbars)
        modal.overlayScrollbars().sleep();
      modal
        .addClass("modal-animating")
        .stop()
        .removeClass("modal-open")
        .fadeOut(300, function () {
          modal.removeClass("modal-animating");
          modal.css("z-index", "");
        });
      var index = $.inArray(modal[0], _openModals);
      if (index > -1) {
        _openModals.splice(index, 1);
        if (_openModals.length === 0) {
          _body.off("keydown", modalEsc);
          if (_mainScrollElement)
            _mainScrollElement.options({
              overflowBehavior: { x: "scroll", y: "scroll" },
            });
          else _body.css("overflow", "");
        }
      }
    }
  }

  function modalEsc(event) {
    var keyCode = event.keyCode || event.originalEvent.keyCode;
    if (keyCode === 27) hideModal($(_openModals[_openModals.length - 1]));
  }

  function css3FilterFeatureDetect(enableWebkit) {
    enableWebkit = enableWebkit === undefined ? false : enableWebkit;
    el = document.createElement("div");
    el.style.cssText = (enableWebkit ? "-webkit-" : "") + "filter: blur(2px)";
    return (
      el.style.length != 0 &&
      (document.documentMode === undefined || document.documentMode > 9)
    );
  }

  _base.buildPage = function (config, callback) {
    _finalConfig = $.extend(true, {}, _defaultConfig, config);
    _defaultHash = _finalConfig.defaultHash;
    _mainNavigationItems = $("[" + _dataAttrNavigation + "]");
    _window = $(window);
    _body = $("body");
    _header = $("#header");
    _nav = $("#navigation");
    _navButton = $("#navigation-button");
    _navBackdrop = $("#navigation-backdrop");
    _content = $("#content");
    _footer = $("#footer");
    _loading = $("#loading");
    _debugModal = $("#modal-debug");
    _debugModalContent = $("#modal-debug-content");
    _navigationContentNavigation = $("#navigation-content-navigation");

    //setup hasher
    hasher.prependHash = _hasherPrepareHash;
    hasher.separator = _hasherSeparator;
    if (
      hasher.getURL() === hasher.getBaseURL() ||
      hasher.getURL() === hasher.getBaseURL() + "#" ||
      hasher.getURL() === hasher.getBaseURL() + "#" + _hasherPrepareHash
    )
      hasher.replaceHash(_defaultHash);
    hasher.initialized.add(onHashChange); //parse initial hash
    hasher.changed.add(onHashChange); //parse hash changes
    hasher.init(); //start listening for hash changes

    setTimeout(function () {
      _body.addClass("ready");
      if (_debug.cssFilterSupport) _body.addClass("filter-support");
    }, 100);

    $("#navigation-logo").on("click", function () {
      hasher.setHash(_defaultHash);
    });
    //navigation scrollbar
    $("#navigation-menu").overlayScrollbars({
      className: "os-theme-light",
      paddingAbsolute: true,
      overflowBehavior: { y: "s", x: "h" },
    });
    //navigation toggle
    _navButton.on("click", function (e) {
      _nav.toggleClass(_strActive);
    });
    _navBackdrop.on("click", function (e) {
      _nav.removeClass(_strActive);
    });

    //set scrollbars
    setBodyScrollbars();

    //navigation select:
    _navigationContentNavigation.on("change", function () {
      var selectedValue = _navigationContentNavigation.val();
      var selectedElm = _navigationContentNavigation
        .find("option")
        .filter(function () {
          return $(this).text() === selectedValue;
        });
      $("#content-navigation")
        .find(
          "[" +
            _dataAttrTabKey +
            '="' +
            selectedElm.attr(_dataAttrTabKey) +
            '"]'
        )
        .trigger("click");
    });

    //debug
    _debugModalContent.html(JSON.stringify(_debug, null, 2));

    try {
      var triggerDebugTimeoutId;
      var keydownSequence = [68, 69, 66, 85, 71, 13]; //debug[enter]
      var keydownKeyCodes = [];
      var touches = 0;
      function arraysEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (var i = arr1.length; i--; ) {
          if (arr1[i] !== arr2[i]) return false;
        }

        return true;
      }

      _body.on("keydown", function (e) {
        clearTimeout(triggerDebugTimeoutId);
        triggerDebugTimeoutId = setTimeout(function () {
          keydownKeyCodes = [];
        }, 250);
        var keyCode = e.keyCode || e.originalEvent.keyCode;
        keydownKeyCodes.push(keyCode);
        if (arraysEqual(keydownKeyCodes, keydownSequence))
          showModal(_debugModal);
      });

      _body[0].addEventListener(
        "touchstart",
        function () {
          clearTimeout(triggerDebugTimeoutId);
          triggerDebugTimeoutId = setTimeout(function () {
            touches = 0;
          }, 250);
          touches++;
          if (touches > 20) showModal(_debugModal);
        },
        { passive: true }
      );
    } catch (ex) {}
  };

  _debug.viewportIntervention =
    typeof window.innerHeight === "number"
      ? $("html")[0].clientHeight !== window.innerHeight
      : false;
  _debug.cssFilterSupport = false; //css3FilterFeatureDetect(true);
  if (_debug.viewportIntervention) viewportUnitsBuggyfill.init({ force: true });

  window._framework = _base;
});

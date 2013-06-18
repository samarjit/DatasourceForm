module = { _orig: window.module, _define: window.define };
module['jquery'] = jQuery;
module['can/util'] = can;
define = function(id, deps, value) {
	module[id] = value();
};
define.amd = { jQuery: true };
// ## jquerypp/dom/styles/styles.js

module['jquerypp/dom/styles/styles.js'] = (function( $ ) {
	var getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
		// The following variables are used to convert camelcased attribute names
		// into dashed names, e.g. borderWidth to border-width
		rupper = /([A-Z])/g,
		rdashAlpha = /-([a-z])/ig,
		fcamelCase = function( all, letter ) {
			return letter.toUpperCase();
		},
		// Returns the computed style for an elementn
		getStyle = function( elem ) {
			if ( getComputedStyle ) {
				return getComputedStyle(elem, null);
			}
			else if ( elem.currentStyle ) {
				return elem.currentStyle;
			}
		},
		// Checks for float px and numeric values
		rfloat = /float/i,
		rnumpx = /^-?\d+(?:px)?$/i,
		rnum = /^-?\d/;

	// Returns a list of styles for a given element
	$.styles = function( el, styles ) {
		if (!el ) {
			return null;
		}
		var  currentS = getStyle(el),
			oldName, val, style = el.style,
			results = {},
			i = 0,
			left, rsLeft, camelCase, name;

		// Go through each style
		for (; i < styles.length; i++ ) {
			name = styles[i];
			oldName = name.replace(rdashAlpha, fcamelCase);

			if ( rfloat.test(name) ) {
				name = $.support.cssFloat ? "float" : "styleFloat";
				oldName = "cssFloat";
			}

			// If we have getComputedStyle available
			if ( getComputedStyle ) {
				// convert camelcased property names to dashed name
				name = name.replace(rupper, "-$1").toLowerCase();
				// use getPropertyValue of the current style object
				val = currentS.getPropertyValue(name);
				// default opacity is 1
				if ( name === "opacity" && val === "" ) {
					val = "1";
				}
				results[oldName] = val;
			} else {
				// Without getComputedStyles
				camelCase = name.replace(rdashAlpha, fcamelCase);
				results[oldName] = currentS[name] || currentS[camelCase];

				// convert to px
				if (!rnumpx.test(results[oldName]) && rnum.test(results[oldName]) ) {
					// Remember the original values
					left = style.left;
					rsLeft = el.runtimeStyle.left;

					// Put in the new values to get a computed value out
					el.runtimeStyle.left = el.currentStyle.left;
					style.left = camelCase === "fontSize" ? "1em" : (results[oldName] || 0);
					results[oldName] = style.pixelLeft + "px";

					// Revert the changed values
					style.left = left;
					el.runtimeStyle.left = rsLeft;
				}

			}
		}

		return results;
	};

	/**
	 * @function jQuery.fn.styles
	 * @parent jQuery.styles
	 * @plugin jQuery.styles
	 *
	 * Returns a set of computed styles. Pass the names of the styles you want to
	 * retrieve as arguments:
	 *
	 *      $("div").styles('float','display')
	 *      // -> { cssFloat: "left", display: "block" }
	 *
	 * @param {String} style pass the names of the styles to retrieve as the argument list
	 * @return {Object} an object of `style` : `value` pairs
	 */
	$.fn.styles = function() {
		// Pass the arguments as an array to $.styles
		return $.styles(this[0], $.makeArray(arguments));
	};

	return $;
})(module["jquery"]);// ## jquerypp/dom/dimensions/dimensions.js

module['jquerypp/dom/dimensions/dimensions.js'] = (function($) {

var
	//margin is inside border
	weird = /button|select/i,
	getBoxes = {},
    checks = {
        width: ["Left", "Right"],
        height: ['Top', 'Bottom'],
        oldOuterHeight: $.fn.outerHeight,
        oldOuterWidth: $.fn.outerWidth,
        oldInnerWidth: $.fn.innerWidth,
        oldInnerHeight: $.fn.innerHeight
    },
	supportsSetter = $.fn.jquery >= '1.8.0';

$.each({ 

/**
 * @function jQuery.fn.outerWidth
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.outerWidth([value], [includeMargins])` lets you set
 * the outer width of an object where:
 *
 *      outerWidth = width + padding + border + (margin)
 *
 * And can be used like:
 *
 *      $("#foo").outerWidth(100); //sets outer width
 *      $("#foo").outerWidth(100, true); // uses margins
 *      $("#foo").outerWidth(); //returns outer width
 *      $("#foo").outerWidth(true); //returns outer width + margins
 *
 * When setting the outerWidth, it adjusts the width of the element.
 * If *includeMargin* is set to `true` margins will also be included.
 * It is also possible to animate the outer width:
 * 
 *      $('#foo').animate({ outerWidth: 200 });
 *
 * @param {Number} [width] The width to set
 * @param {Boolean} [includeMargin=false] Makes setting the outerWidth adjust
 * for margins.
 * @return {jQuery|Number} Returns the outer width or the jQuery wrapped elements
 * if you are setting the outer width.
 */
width: 
/**
 * @function jQuery.fn.innerWidth
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.innerWidth([value])` lets you set the inner width of an element where
 * 
 *      innerWidth = width + padding
 *      
 * Use it like:
 *
 *      $("#foo").innerWidth(100); //sets inner width
 *      $("#foo").outerWidth(); // returns inner width
 *      
 * Or in an animation like:
 * 
 *      $('#foo').animate({ innerWidth : 200 });
 *
 * Setting inner width adjusts the width of the element.
 *
 * @param {Number} [width] The inner width to set
 * @return {jQuery|Number} Returns the inner width or the jQuery wrapped elements
 * if you are setting the inner width.
 */
"Width", 
/**
 * @function jQuery.fn.outerHeight
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.outerHeight([value], [includeMargins])` lets
 * you set the outer height of an object where:
 *
 *      outerHeight = height + padding + border + (margin)
 *
 * And can be used like:
 *
 *      $("#foo").outerHeight(100); //sets outer height
 *      $("#foo").outerHeight(100, true); // uses margins
 *      $("#foo").outerHeight(); //returns outer height
 *      $("#foo").outerHeight(true); //returns outer height + margins
 *
 * When setting the outerHeight, it adjusts the height of the element.
 * If *includeMargin* is set to `true` margins will also be included.
 * It is also possible to animate the outer heihgt:
 *
 *      $('#foo').animate({ outerHeight : 200 });
 *
 * @param {Number} [height] The height to set
 * @param {Boolean} [includeMargin=false] Makes setting the outerHeight adjust
 * for margins.
 * @return {jQuery|Number} Returns the outer height or the jQuery wrapped elements
 * if you are setting the outer height.
 */
height: 
/**
 * @function jQuery.fn.innerHeight
 * @parent jQuery.dimensions
 *
 * `jQuery.fn.innerHeight([value])` lets you set the inner height of an element where
 *
 *      innerHeight = height + padding
 *
 * Use it like:
 *
 *      $("#foo").innerHeight(100); //sets inner height
 *      $("#foo").outerHeight(); // returns inner height
 *
 * Or in an animation like:
 *
 *      $('#foo').animate({ innerHeight : 200 });
 *
 * Setting inner height adjusts the height of the element.
 *
 * @param {Number} [height] The inner height to set
 * @return {jQuery|Number} Returns the inner height or the jQuery wrapped elements
 * if you are setting the inner height.
 */
// for each 'height' and 'width'
"Height" }, function(lower, Upper) {

    //used to get the padding and border for an element in a given direction
    getBoxes[lower] = function(el, boxes) {
        var val = 0;
        if (!weird.test(el.nodeName)) {
            //make what to check for ....
            var myChecks = [];
            $.each(checks[lower], function() {
                var direction = this;
                $.each(boxes, function(name, val) {
                    if (val)
                        myChecks.push(name + direction+ (name == 'border' ? "Width" : "") );
                })
            })
            $.each($.styles(el, myChecks), function(name, value) {
                val += (parseFloat(value) || 0);
            })
        }
        return val;
    }

    //getter / setter
	if(!supportsSetter) {
	    $.fn["outer" + Upper] = function(v, margin) {
	        var first = this[0];
			if (typeof v == 'number') {
				// Setting the value
	            first && this[lower](v - getBoxes[lower](first, {padding: true, border: true, margin: margin}))
	            return this;
	        } else {
				// Return the old value
	            return first ? checks["oldOuter" + Upper].apply(this, arguments) : null;
	        }
	    }
	    $.fn["inner" + Upper] = function(v) {
	        var first = this[0];
			if (typeof v == 'number') {
				// Setting the value
	            first&& this[lower](v - getBoxes[lower](first, { padding: true }))
	            return this;
	        } else {
				// Return the old value
	            return first ? checks["oldInner" + Upper].apply(this, arguments) : null;
	        }
	    }
	}

    //provides animations
	var animate = function(boxes){
		// Return the animation function
		return function(fx){
			if (fx[supportsSetter ? 'pos' : 'state'] == 0) {
	            fx.start = $(fx.elem)[lower]();
	            fx.end = fx.end - getBoxes[lower](fx.elem,boxes);
	        }
	        fx.elem.style[lower] = (fx.pos * (fx.end - fx.start) + fx.start) + "px"
		}
	}
    $.fx.step["outer" + Upper] = animate({padding: true, border: true})
	$.fx.step["outer" + Upper+"Margin"] =  animate({padding: true, border: true, margin: true})
	$.fx.step["inner" + Upper] = animate({padding: true})

})

return $;
})(module["jquery"], module["jquerypp/dom/styles/styles.js"]);// ## jquerypp/event/reverse/reverse.js

module['jquerypp/event/reverse/reverse.js'] = (function($) {
	$.event.reverse = function(name, attributes) {
		var bound = $(),
			count = 0,
			dispatch =  $.event.handle || $.event.dispatch;

		$.event.special[name] = {
			setup: function() {
				// add and sort the resizers array
				// don't add window because it can't be compared easily
				if ( this !== window ) {
					bound.push(this);
					$.unique(bound);
				}
				// returns false if the window
				return this !== window;
			},
			teardown: function() {
				// we shouldn't have to sort
				bound = bound.not(this);
				// returns false if the window
				return this !== window;
			},
			add: function( handleObj ) {
				var origHandler = handleObj.handler;
				handleObj.origHandler = origHandler;

				handleObj.handler = function( ev, data ) {
					var isWindow = this === window;
					if(attributes && attributes.handler) {
						var result = attributes.handler.apply(this, arguments);
						if(result === true) {
							return;
						}
					}

					// if this is the first handler for this event ...
					if ( count === 0 ) {
						// prevent others from doing what we are about to do
						count++;
						var where = data === false ? ev.target : this

						// trigger all this element's handlers
						dispatch.call(where, ev, data);
						if ( ev.isPropagationStopped() ) {
							count--;
							return;
						}

						// get all other elements within this element that listen to move
						// and trigger their resize events
						var index = bound.index(this),
							length = bound.length,
							child, sub;

						// if index == -1 it's the window
						while (++index < length && (child = bound[index]) && (isWindow || $.contains(where, child)) ) {

							// call the event
							dispatch.call(child, ev, data);

							if ( ev.isPropagationStopped() ) {
								// move index until the item is not in the current child
								while (++index < length && (sub = bound[index]) ) {
									if (!$.contains(child, sub) ) {
										// set index back one
										index--;
										break
									}
								}
							}
						}

						// prevent others from responding
						ev.stopImmediatePropagation();
						count--;
					} else {
						handleObj.origHandler.call(this, ev, data);
					}
				}
			}
		};

		// automatically bind on these
		$([document, window]).bind(name, function() {});

		return $.event.special[name];
	}

	return $;
})(module["jquery"]);// ## jquerypp/event/resize/resize.js

module['jquerypp/event/resize/resize.js'] = (function($) {
	var
		// bind on the window window resizes to happen
		win = $(window),
		windowWidth = 0,
		windowHeight = 0,
		timer;

	$(function() {
		windowWidth = win.width();
		windowHeight = win.height();
	});

	$.event.reverse('resize', {
		handler : function(ev, data) {
			var isWindow = this === window;

			// if we are the window and a real resize has happened
			// then we check if the dimensions actually changed
			// if they did, we will wait a brief timeout and
			// trigger resize on the window
			// this is for IE, to prevent window resize 'infinate' loop issues
			if ( isWindow && ev.originalEvent ) {
				var width = win.width(),
					height = win.height();


				if ((width != windowWidth || height != windowHeight)) {
					//update the new dimensions
					windowWidth = width;
					windowHeight = height;
					clearTimeout(timer)
					timer = setTimeout(function() {
						win.trigger("resize");
					}, 1);

				}
				return true;
			}
		}
	});

	return $;
})(module["jquerypp/event/reverse/reverse.js"]);// ## canui/fills/fills.js

module['canui/fills/fills.js'] = (function( $ ) {
	
	
	//evil things we should ignore
	var matches = /script|td/,

		// if we are trying to fill the page
		isThePage = function( el ) {
			return el === document || el === document.documentElement || el === window || el === document.body
		},
		//if something lets margins bleed through
		bleeder = function( el ) {
			if ( el[0] == window ) {
				return false;
			}
			var styles = el.styles('borderBottomWidth', 'paddingBottom')
			return !parseInt(styles.borderBottomWidth) && !parseInt(styles.paddingBottom)
		},
		//gets the bottom of this element
		bottom = function( el, offset ) {
			//where offsetTop starts
			return el.outerHeight() + offset(el);
		}
		pageOffset = function( el ) {
			return el.offset().top
		},
		offsetTop = function( el ) {
			return el[0].offsetTop;
		},
		inFloat = function( el, parent ) {
			while ( el && el != parent ) {
				var flt = $(el).css('float')
				if ( flt == 'left' || flt == 'right' ) {
					return flt;
				}
				el = el.parentNode
			}
		},
		/**
		 * @function jQuery.fn.fills
		 * @parent jQuery.fills
		 * @test jquery/dom/fills/funcunit.html
		 * @plugin jquery/dom/fills
		 *
		 * Fills a parent element's height with the current element.
		 * This is extremely useful for complex layout, especially when you want to account for line-wrapping.
		 *
		 * ## Basic Example
		 *
		 * If you have the following html:
		 *
		 *     <div id='box'>
		 * 	    <p>I am a long heading.</p>
		 * 	    <div id='child'>I'm a child.</div>
		 *     </div>
		 *
		 * The follow makes `#child` fill up `#box`:
		 *
		 *     $('#child').can_ui_layout_fill("#box")
		 *
		 * ## Limitations
		 *
		 * Fill currently does not well with:
		 *
		 *   - Bleeding margins - Where margins leak through parent elements
		 *     because the parent elements do not have a padding or border.
		 *
		 *   - Tables - You shouldn't be using tables to do layout anyway.
		 *
		 *   - Floated Elements - the child element has `float: left` or `float: right`
		 *
		 *
		 * @param {HTMLElement|selector|Object} [parent] the parent element
		 * to fill, defaults to the element's parent.
		 *
		 * The following fills the parent to `#child`:
		 *
		 *     $('#child').fills()
		 *
		 * A selector can also be pased.  This selector is passed to jQuery's
		 * closet method.  The following matches the first `#parent` element that
		 * is a parentNode of `#child`:
		 *
		 *     $('#child').fills("#parent")
		 *
		 * An element or window can also be passed.  The following will make
		 * `#child` big enough so the entire window is filled:
		 *
		 *      $('#child').fills(window)
		 *
		 * If you pass an object, the following options are available:
		 *
		 * - __parent__ - The parent element selector or jQuery object
		 * - __className__ - A class name to add to the element that fills
		 * - __all__ - Reset the parents height when resizing
		 *
		 * @return {jQuery} the original jQuery collection for chaining.
		 */
		filler = $.fn.fills = function( parent ) {
			var options = parent;
			options || (options = {});
			if(typeof options == 'string'){
				options = this.closest(options)
			}
			if ( options.jquery || options.nodeName ) {
				options = {parent: options };
			}
			// Set the parent
			options.parent || (options.parent = window);
			options.parent = $(options.parent)

			// setup stuff on every element
			if(options.className) {
				this.addClass(options.className)
			}

			var thePage = isThePage(options.parent[0]);
			
			if ( thePage ) {
				options.parent = $(window)
			}

			this.each(function(){
				var evData = {
					filler: $(this),
					inFloat: inFloat(this, thePage ? document.body : options.parent[0]),
					options: options
				},
				cb = function() {
					filler.parentResize.apply(this, arguments)
				}
				// Attach to the `resize` event
				$(options.parent).bind('resize', evData, cb);

				$(this).bind('destroyed', evData, function( ev ) {
					if(options.className) {
						$(ev.target).removeClass(options.className)
					}
					$(options.parent).unbind('resize', cb)
				});
				
			});

			// resize to get things going
			var func = function() {
				options.parent.resize();
			}

			if ( $.isReady ) {
				func();
			} else {
				$(func)
			}
			return this;
		};


	$.extend(filler, {
		parentResize : function( ev ) {
			if (ev.data.filler.is(':hidden')) {
				return;
			}
			
			var parent = $(this),
				isWindow = this == window,
				container = (isWindow ? $(document.body) : parent),

				//if the parent bleeds margins, we don't care what the last element's margin is
				isBleeder = bleeder(parent),
				children = container.children().filter(function() {
					if ( matches.test(this.nodeName.toLowerCase()) ) {
						return false;
					}

					var get = $.styles(this, ['position', 'display']);
					return get.position !== "absolute" && get.position !== "fixed"
						&& get.display !== "none" && !jQuery.expr.filters.hidden(this)
				}),
				last = children.eq(-1),
				first,
				parentHeight = parent.height() - (isWindow ? parseInt(container.css('marginBottom'), 10) || 0 : 0),
				currentSize;
			var div = '<div style="height: 0px; line-height:0px;overflow:hidden;' + (ev.data.inFloat ? 'clear: both' : '') + ';"/>'

			if ( isBleeder ) {
				//temporarily add a small div to use to figure out the 'bleed-through' margin
				//of the last element
				last = $(div).appendTo(container);
				
			}

			//for performance, we want to figure out the currently used height of the parent element
			// as quick as possible
			// we can use either offsetTop or offset depending ...
			if ( last && last.length > 0 ) {
				if ( last.offsetParent()[0] === container[0] ) {

					currentSize = last[0].offsetTop + last.outerHeight();
				} else if (last.offsetParent()[0] === container.offsetParent()[0]) {
					// add pos abs for IE7 but
					// might need to adjust for the addition of first's hheight
					var curLast =last[0].offsetTop;
					first = $(div).prependTo(container);
					
					currentSize = ( curLast + last.outerHeight() ) - first[0].offsetTop;
					
					first.remove();
				} else {
					// add first so we know where to start from .. do not bleed in this case
					first = $(div).prependTo(container);

					currentSize = ( last.offset().top + last.outerHeight() ) - first.offset().top;
					first.remove();
				}
			}

			// what the difference between the parent height and what we are going to take up is
			var delta = parentHeight - currentSize,
				// the current height of the object
				fillerHeight = ev.data.filler.height();

			//adjust the height
			if ( ev.data.options.all ) {
				// we don't care about anything else, we are likely absolutely positioned
				// we need to fill the parent width
				// temporarily collapse, then expand
				ev.data.filler.height(0).width(0);
				var parentWidth = parent.width(),
					parentHeight = parent.height();

				ev.data.filler.outerHeight(parentHeight);
				ev.data.filler.outerWidth(parentWidth);
			} else {
				ev.data.filler.height(fillerHeight + delta)
			}

			//remove the temporary element
			if ( isBleeder ) {
				last.remove();
			}
		}
	});
})(module["jquery"], module["jquerypp/dom/dimensions/dimensions.js"], module["jquerypp/event/resize/resize.js"]);// ## canui/util/scrollbar_width.js

module['canui/util/scrollbar_width.js'] = (function () {
	window.can || (window.can = {});
	window.can.ui || (window.can.ui = {});

	var cached = null;
	window.can.ui.scrollbarWidth = function() {
		if(cached === null) {
			var div = $('<div id="out"><div style="height:200px;"></div></div>').css({
					position : "absolute",
					top : "0px",
					left : "0px",
					visibility : "hidden",
					width : "100px",
					height : "100px",
					overflow : "hidden"
				}).appendTo(document.body),
				inner = $(div[0].childNodes[0]),
				w1 = inner[0].offsetWidth,
				w2;

			div.css("overflow", "scroll");
			var w2 = inner[0].offsetWidth;
			if (w2 == w1) {
				inner.css("width", "100%"); //have to set this here for chrome
				w2 = inner[0].offsetWidth;
			}
			div.remove();
			cached = w1- w2;
		}

		/**
		 * @parent canui
		 * @attribute can.ui.scrollbarWidth
		 * @type {Number}
		 *
		 * Stores the width of the browsers scrollbars in can.ui.scrollbarWidth.
		 *
		 *      $('#element').width($('#element').width()
		 *          - can.ui.scrollbarWidth);
		 */
		return cached;
	}
	return window.can.ui.scrollbarWidth;
})(module["jquery"]);// ## canui/table_scroll/table_scroll.js

module['canui/table_scroll/table_scroll.js'] = (function ($) {

	// helpers
	var setWidths = function (cells, firstWidths) {
			var length = cells.length - 1;
			for (var i = 0; i < length; i++) {
				cells.eq(i).outerWidth(firstWidths[i]);
			}
		},
		TableFill = can.Control({
			setup : function (el, options) {
				//remove the header and put in another table
				el = $(el);
				if (el[0].nodeName.toLowerCase() == 'table') {
					this.$ = {
						table : el
					}
					can.Control.prototype.setup.call(this, this.$.table.wrap("<div></div>").parent(),
						options)
				} else {
					this.$ = {
						table : el.find('table:first')
					}
					can.Control.prototype.setup.call(this, el, options);
				}

			},
			init : function () {
				this.element.fills(this.options.parent).css('overflow', 'auto');

			},
			// listen on resize b/c we want to do this right away
			// in case anyone else cares about the table's
			// dimensions (like table scroll)
			resize : function (el, ev) {
				var table = this.$.table,
					el = this.element[0];
				//let the table flow naturally
				table.css("width", "");
				// is it scrolling vertically
				if (el.offsetHeight < el.scrollHeight) {
					table.outerWidth(this.element.width() - can.ui.scrollbarWidth())
				} else {
					table.outerWidth(this.element.width())
				}
			}
		});

	can.Control("can.ui.TableScroll", {
		defaults : {
			fill : true
		},
		pluginName : 'tableScroll'
	},
	/**
	 * @prototype
	 */
	{
		setup : function (el, options) {
			// a cache of elements.
			this.$ = {
				table : $(el)
			}

			// the area that scrolls
			this.$.scrollBody = this.$.table.wrap('<div><div ><div></div></div></div>').parent();
			// a div that houses the scrollable area.  IE < 8 needs this.  It acts
			// as a buffer for the scroll bar
			this.$.body = this.$.scrollBody.parent();

			can.Control.prototype.setup.call(this, this.$.body.parent()[0], options);
			// this.$.container = this.$.table.parents('.' + this.constructor.pluginName);
			// We have to add the control to the original table element as well
			(arr = can.data(this.$.table,"controls")) || can.data(this.$.table,"controls",arr = []);
			arr.push(this);
		},

		init : function () {
			// body acts as a buffer for the scroll bar
			this.$.body.css("width", "100%");

			// get the thead, and tfoot into their own table.
			$.each(['thead', 'tfoot'], can.proxy(this._wrapWithTable, this));


			// get the tbody
			this.$.tbody = this.$.table.children('tbody')

			// if one doesn't exist ... make it
			if (!this.$.tbody.length) {
				this.$.tbody = $('<tbody/>')
				this.$.table.append(this.$.tbody)
			}

			// add thead
			if (this.$.theadTable) {
				this.$.head = $("<div class='header'></div>").css({
					"visibility" : "hidden",
					overflow : "hidden"
				}).prependTo(this.element).append(this.$.theadTable);
				this._addSpacer('thead');
			}
			if (this.$.tfootTable) {
				this.$.foot = $("<div class='footer'></div>").css({
					"visibility" : "hidden",
					overflow : "hidden"
				}).appendTo(this.element).append(this.$.tfootTable);
				this._addSpacer('tfoot');
			}

			// fill up the parent
			// make the scroll body fill up all other space
			if (this.options.fill) {
				new TableFill(this.$.scrollBody, {
					parent : this.element.parent()
				});
			}

			// add representations of the header cells to the bottom of the table
			var scrolls = $(this.$.head).add(this.$.foot);
			this.on(this.$.scrollBody, 'scroll', function (ev) {
				scrolls.scrollLeft($(ev.target).scrollLeft());
			});
			this.on(this.$.table, 'resize', 'resize');

			this.update();
		},

		update : function(options) {
			if (this.$.foot) {
				this._addSpacer('tfoot');
			}
			if (this.$.head) {
				this._addSpacer('thead');
			}

			// Triggering the resize event needs a slight delay
			// TODO figure how this would work without
			setTimeout(can.proxy(function() {
				this.element.trigger('resize');
			}, this), 10);
		},

		_wrapWithTable : function (i, tag) {
			// save it
			var el = this.$[tag] = this.$.table.children(tag);
			if (el.length && el.find('td, th').length) {
				var table = $('<table>'), parent = el.parent();
				// We want to keep classes and styles
				table.attr('class', parent.attr('class'));
				table.attr('style', parent.attr('style'));

				// remove it (w/o removing any widgets on it)
				// el[0].parentNode.removeChild(el);

				//wrap it with a table and save the table
				this.$[tag + "Table"] = el.wrap(table).parent();
			}
		},

		/**
		 * @parent can.ui.TableScroll
		 * @function elements
		 *
		 * Returns useful elements of the table
		 * the thead, tbody, tfoot, and scrollBody of the modified table:
		 *
		 * If you need to change the content of the table, you can
		 * use elements for access.  If you change the content, make sure
		 * you call `update()`.
		 *
		 * @return {Object} an object like:
		 *
		 *     {
		 *         body : HTMLTableSelectionElement,
		 *         footer : HTMLTableSelectionElement,
		 *         header : HTMLTableSelectionElement,
		 *         scrollBody : HTMLDivElement
		 *     }
		 */
		elements : function () {
			return {
				header : this.$.thead,
				footer : this.$.tfoot,
				body : this.$.body,
				scrollBody : this.$.scrollBody,
				container : this.element
			};
		},

		/**
		 * @function rows
		 * @parent can.ui.TableScroll
		 *
		 * Returns all actual rows (excluding any spacers).
		 *
		 * @param {Collection} [replaceRows] If passed, all rows will be replaced with the given rows.
		 * @return {can.$) The content elements of the table body without any spacers.
		 */
		rows : function(replaceRows) {
			if(replaceRows) {
				this.rows().remove();
				this.$.tbody.prepend(replaceRows);
			}
			return this.$.tbody.children(":not([data-spacer])");
		},

		/**
		 * @hide
		 * Adds a spacer on the bottom of the table that mimicks the dimensions
		 * of the table header elements.  This keeps the body columns for being
		 * smaller than the header widths.
		 *
		 * This ONLY works when the table is visible.
		 */
		_addSpacer : function (tag) {
			if (!this.$[tag].is(":visible")) {
				return;
			}
			//check last element ...
			var last = this.$.tbody.children('[data-spacer="' + tag + '"]');
			if (last.length) {
				last.remove();
			}

			var spacer = this.$[tag].children(0).clone().attr('data-spacer', tag);

			// wrap contents with a spacing
			spacer.children("th, td").each(function () {
				var td = $(this);
				td.html("<div style='float: left;'>" + td.html() + "</div>")
			});

			spacer.appendTo(this.$.tbody);

			//now set spacing, and make minimal height
			spacer.children("th, td").each(function () {
				var $td = $(this),
					$spacer = $td.children(':first'),
					width = $spacer.outerWidth();

				$td.css({
					"padding-top" : 0,
					"padding-bottom" : 0,
					"border-top" : 'none',
					"border-bottom" : 'none',
					margin : 0,
					width : ''
				}) // If padding is removed from the cell sides, layout might break!
				$spacer.outerWidth(width + 2).css({
					"float" : "none",
					"visibility" : "hidden",
					height : "1px"
				}).html("");
			})
			this.$.spacer = spacer;
		},

		/**
		 * This is either triggered by the `resize` event or should be called manually when
		 * the table content or dimensions change.
		 */
		resize : function (el, ev) {
			var body = this.$.body,
				children = body.find("tr:first:not([data-spacer])").children(),
				// getting the outer widths is the most expensive thing
				firstWidths = children.map(function () {
					return $(this).outerWidth()
				}),

				padding = this.$.table.height() >= body.height() ? can.ui.scrollbarWidth() : 0,
				tableWidth = this.$.table.width();

			if (tableWidth) {
				if (this.$.foot) {
					var cells = this.$.tfootTable.find("th, td")
					if (cells.length == firstWidths.length) {
						setWidths(cells, firstWidths);
					}
					this.$.foot.css('visibility', 'visible')
					this.$.tfootTable.width(tableWidth + padding)
				}

				if (this.$.head) {
					var cells = this.$.theadTable.find("th, td")
					if (cells.length == firstWidths.length) {
						setWidths(cells, firstWidths);
					}
					this.$.head.css('visibility', 'visible')
					this.$.theadTable.width(tableWidth + padding)
				}
			}
		},

		destroy : function () {
			var controls = can.data(this.$.table,"controls");
			controls.splice(can.inArray(this, controls),1);
			delete this.$;
			can.Control.prototype.destroy.call(this);
		}
	})
})(module["jquery"], module["can/control/control.js"], module["can/control/plugin/plugin.js"], module["canui/fills/fills.js"], module["canui/util/scrollbar_width.js"], module["jquerypp/event/resize/resize.js"]);// ## jquerypp/event/key/key.js

module['jquerypp/event/key/key.js'] = (function($){
	
	// copied from jQuery 1.8.3
	var uaMatch = function( ua ) {
		ua = ua.toLowerCase();

		var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			[];

		return {
			browser: match[ 1 ] || "",
			version: match[ 2 ] || "0"
		};
	}
	
	var keymap = {},
		reverseKeyMap = {},
		currentBrowser = uaMatch(navigator.userAgent).browser;
		
	/**
	 * @hide
	 * @parent jQuery.Event.prototype.key
	 * 
	 * Allows you to set alternate key maps or overwrite existing key codes.
	 * For example::
	 * 
	 *     $.event.key({"~" : 177});
	 * 
	 * @param {Object} map A map of character - keycode pairs.
	 */
	$.event.key = function(browser, map){
		if(browser === undefined) {
			return keymap;
		}

		if(map === undefined) {
			map = browser;
			browser = currentBrowser;
		}

		// extend the keymap
		if(!keymap[browser]) {
			keymap[browser] = {};
		}
		$.extend(keymap[browser], map);
		// and also update the reverse keymap
		if(!reverseKeyMap[browser]) {
			reverseKeyMap[browser] = {};
		}
		for(var name in map){
			reverseKeyMap[browser][map[name]] = name;
		}
	};
	
	$.event.key({
		// backspace
		'\b':'8',
		
		// tab
		'\t':'9',
		
		// enter
		'\r':'13',
		
		// special
		'shift':'16','ctrl':'17','alt':'18',
		
		// others
		'pause-break':'19',
		'caps':'20',
		'escape':'27',
		'num-lock':'144',
		'scroll-lock':'145',
		'print' : '44',
		
		// navigation
		'page-up':'33','page-down':'34','end':'35','home':'36',
		'left':'37','up':'38','right':'39','down':'40','insert':'45','delete':'46',
		
		// normal characters
		' ':'32',
		'0':'48','1':'49','2':'50','3':'51','4':'52','5':'53','6':'54','7':'55','8':'56','9':'57',
		'a':'65','b':'66','c':'67','d':'68','e':'69','f':'70','g':'71','h':'72','i':'73','j':'74','k':'75','l':'76','m':'77',
		'n':'78','o':'79','p':'80','q':'81','r':'82','s':'83','t':'84','u':'85','v':'86','w':'87','x':'88','y':'89','z':'90',
		// normal-characters, numpad
		'num0':'96','num1':'97','num2':'98','num3':'99','num4':'100','num5':'101','num6':'102','num7':'103','num8':'104','num9':'105',
		'*':'106','+':'107','-':'109','.':'110',
		// normal-characters, others
		'/':'111',
		';':'186',
		'=':'187',
		',':'188',
		'-':'189',
		'.':'190',
		'/':'191',
		'`':'192',
		'[':'219',
		'\\':'220',
		']':'221',
		"'":'222',
		
		// ignore these, you shouldn't use them
		'left window key':'91','right window key':'92','select key':'93',
		
		
		'f1':'112','f2':'113','f3':'114','f4':'115','f5':'116','f6':'117',
		'f7':'118','f8':'119','f9':'120','f10':'121','f11':'122','f12':'123'
	});
	
	/**
	 * @parent jQuery.event.key
	 * @plugin jquerypp/event/key
	 * @function jQuery.Event.prototype.keyName
	 *
	 * Returns a string representation of the key pressed:
	 *
	 *      $("input").on('keypress', function(ev){
	 *          if(ev.keyName() == 'ctrl') {
	 *              $(this).addClass('highlight');
	 *          }
	 *      });
	 *
	 * The key names mapped by default can be found in the [jQuery.event.key jQuery.event.key overview].
	 *
	 * @return {String} The string representation of of the key pressed.
	 */
	$.Event.prototype.keyName  = function(){
		var event = this,
			test = /\w/,
			// It can be either keyCode or charCode.
			// Look both cases up in the reverse key map and converted to a string
			key_Key =  reverseKeyMap[currentBrowser][(event.keyCode || event.which)+""],
			char_Key =  String.fromCharCode(event.keyCode || event.which),
			key_Char =  event.charCode && reverseKeyMap[currentBrowser][event.charCode+""],
			char_Char = event.charCode && String.fromCharCode(event.charCode);
		
		if( char_Char && test.test(char_Char) ) {
			// string representation of event.charCode
			return char_Char.toLowerCase()
		}
		if( key_Char && test.test(key_Char) ) {
			// reverseKeyMap representation of event.charCode
			return char_Char.toLowerCase()
		}
		if( char_Key && test.test(char_Key) ) {
			// string representation of event.keyCode
			return char_Key.toLowerCase()
		}
		if( key_Key && test.test(key_Key) ) {
			// reverseKeyMap representation of event.keyCode
			return key_Key.toLowerCase()
		}

		if (event.type == 'keypress'){
			// keypress doesn't capture everything
			return event.keyCode ? String.fromCharCode(event.keyCode) : String.fromCharCode(event.which)
		}

		if (!event.keyCode && event.which) {
			// event.which
			return String.fromCharCode(event.which)
		}

		// default
		return reverseKeyMap[currentBrowser][event.keyCode+""]
	}
	
return $;
})(module["jquery"]);// ## canui/selectable/selectable.js

module['canui/selectable/selectable.js'] = (function($) {

//we have to clear out activate
$.event.special.activate = {
	setup : function(){return true},
	teardown : function(){return true}
}

/**
 * @class can.ui.Selectable
 * @test canui/nav/selectable/funcunit.html
 * @parent canui
 * 
 * Selectable provides keyboard and mouse selection to a group of 
 * items. Instead of listening to click and key events, 
 * add selectable and listen to activate and select events. It also 
 * provides multi-selection and activation with the shift and ctrl key.
 * 
 * ## Basic Example
 * 
 * If you have HTML like:
 * 
 *     <div id='menu'>
 *       <li tabindex="0">JavaScriptMVC</li>
 *       <li tabindex="0">StealJS</li>
 *       <li tabindex="0">FuncUnit</li>
 *     </div>
 * 
 * And styles like:
 * 
 *     li          { background-color: #ddddee; }
 *     li.selected { background-color: #efefff; }
 *     li.activated{ background-color: #dddddd; }
 * 
 * Make this selectable like:
 * 
 *     new can.ui.Selectable($('#menu'));
 * 
 * You can listen for `activate` and `select` events (also `deactivate` and `deselect`) like:
 * 
 *     $('#menu').delegate('li', 'activate', function(ev, items){
 *        console.log(this, 'has been activated')
 *     }).delegate('li', 'select', function(ev){
 *        console.log(this, 'has been activated')
 *     })
 * 
 * ## Demo
 * 
 * Use the keyboard and mouse to navigate.  Use the __SHIFT__ and __CTRL__ keys too!
 * 
 * @demo canui/nav/selectable/demo.html
 * 
 * ## Listening to events
 * 
 * Instead of listening to clicks and keypresses and having to provide navigation
 * for each, selectable allows you to listen to either `activate` or `select` events.
 * 
 * __select__ events happen when an element is moused over or navigated to with the keyboard.
 * 
 * __activate__ events happen when an element (or elements) are click 
 *   or the _enter_ key is pressed.
 * 
 * When an activate event happens, it comes back with the second argument 
 * the elements (or models) that are activated.  For example, if __SHIFT__
 * or __CTRL__ was used to select multiple elements, `activated`
 * would be a jQuery-wrapped collection of the activated elements:
 * 
 *     $('#menu').delegate('li', 'activate', function(ev, activated){
 *        console.log(activated, 'has been activated')
 *     })
 * 
 * However, if [jQuery.fninstance] is used to add model data to those elements, 
 * then activated will be the model instances.
 * 
 * @param {HTMLElement} element an HTMLElement or jQuery-wrapped element.
 * @param {Object} options options to set on the selectable, with the 
 * following __names__,  `default values`, and meanings:
 * 
 *   - __selectOn__ `"[tabindex]"` - The selector used to identify 
 *     something that is selectable.
 *     
 *   - __selectedClassName__ `"selected"` - The className that 
 *     gets added to things selected.
 *     
 *   - __activateClassName__ `"activated"` - The className 
 *     that gets added to activated elements.
 *     
 *   - __multiActivate__ `true` - True for multi-selection, 
 *     false if only a single item can be activated at a time.
 *     
 *   - __outsideDeactivate__ `true` - Deactivate selected when a click or
 *     keypress happens outside the selectable. 
 *     
 * Use them like:
 * 
 *     new can.ui.Selectable($('#menu'), {
 *       selectOn : "tr",
 *       selectedClassName : "ui-hover",
 *       activateClassName: "ui-active",
 *       multiActivate: false,
 *       outsideDeactivate: false
 *     })
 */
can.Control('can.ui.Selectable',{
	pluginName : 'selectable',
    defaults : {
        // what can be selected
		selectOn: "[tabindex]",
		// what class is selected
        selectedClassName : "selected",
		// 
        activatedClassName : "activated",
		multiActivate: true,
		outsideDeactivate: true,
		deactivateParent: document
    }
},
{
	/**
	 * @prototype
	 */
    //initializing does nothings
	init: function() {
		this.lastSelected = null;
		this.lastMouse ={};
    },
	
	"{deactivateParent} click":function(el,ev)
	{
		if(this.options.outsideDeactivate && 
			!$.contains(this.element[0],ev.target)  ){
				
			// if there's a click, keypress, or activate event 
			// outside of us ... deactivate
			var active = this.element.find("." + this.options.activatedClassName);
			if(active.length){
				active.trigger('deactivate');
				this.element.trigger('outsideDeactivate', [ $(ev.target) ]);
			}
		}
	},
	// if we mouse out, and don't have focus -> deselect
	// if we lose focus, but have moused out -> deselect
	"mouseenter" : function(){
		this.mousein = true;
	},
	"mouseleave" : function(){
		this.mousein = false;
		
		if(!this._focused){
			this.deselect();
		} else {
			// re-select what is focused ...
			this.selected(this._focused)
		}
	},
	
	_getSelected : function(){
		return this._selected && this._selected.hasClass(this.options.selectedClassName) ?
			this._selected :
			(this._selected = this.element.find("."+this.options.selectedClassName) )
	},
	/**
	 * Gets or sets the selected element.
	 * 
	 * Set the current selected element:
	 *
	 *     var selectable = new can.ui.Selectable($('#selectable'));
	 *     selectable.selected($('.selectable:eq(1)'));
	 *
	 * Get the current selected element:
	 *
	 *     selectable.selected()
	 *
	 * @param {jQuery} el - the element to select.
	 * @param {Boolean} [autoFocus=false] should the selected element be
	 * focused.  It's focused if the user is using keyboard navigation.
	 */
	selected : function(el, autoFocus){
		// get old selected
		// if getter
		if(!el){
			return this._getSelected();
		}else{
			//we are setting ...
			el = $(el);
			
			// don't need to deselect, this will be done by select event
			
			// set new selected, don't set class, done by trigger
			this._selected = el;
			
			// if we should focus
			if(autoFocus === true){
				el[0].focus()
			}
			
			//add select event
			el.trigger("select", el);
		}
	},
	// deselects the selected
	deselect : function(){
		this._getSelected().trigger("deselect");
	},
	/**
	 * Activates an element.
	 * 
	 *     var selectable = new can.ui.Selectable('#selectable');
	 *     selectable.activated($('.selectable:eq(1)'));
	 * 
	 * @param {jQuery} el the jQuery-wrapped element to select
	 * @param {Event} [ev] an event used to test if ctrlKey or shiftKey was held.
	 */
	activated : function(el, ev){
		if(!el) {
			return this.element.find("."+this.options.activatedClassName);
		}

		ev = ev || {};
		// if we should only select one element ...
		if(!this.options.multiActivate || (!ev.shiftKey && !ev.ctrlKey && !ev.metaKey && ev !== true)){
			// remove the old activated ...
			this.element
				.find("." + this.options.activatedClassName)
				.trigger('deactivate');
			
			// activate the new one
			
			el.trigger("activate", el.instances ? [el.instances()] : [el]);
			
		}else if(ev.ctrlKey || ev.metaKey || ev === true){ // if we add to the 'activated' list
			
			// Toggle
			if(el.hasClass(this.options.activatedClassName)){
				el.trigger("deactivate");
			}else{
				var activated = this.element.find("."+this.options.activatedClassName);
				if(el.instances){
					el.trigger("activate", [ activated.add(el).instances() ]);
				}else{
					el.trigger("activate", [ activated.add(el) ]);
				}
				
			}
		}else if(ev.shiftKey){
			
			// Find everything between and activate
			var selectable = this.element.find( this.options.selectOn+":visible"),
				found = false,
				lastSelected= this.lastSelected,
				activated = $().add(el).add(lastSelected);
				
			if(lastSelected && lastSelected.length && lastSelected[0] != el[0]){
				for(var i =0; i < selectable.length;i++){
					var select = selectable[i];
					if( select ===  lastSelected[0] || select == el[0] ){
						if(!found){
							found = true;
						}else{
							break;
						}
					}else if(found){
						activated.push(select)
					}
				}
			}
			activated.addClass(this.options.activatedClassName);
			el.trigger("activate", [activated]);
		}
	},

	deactivate : function() {
		this.activated().trigger('deactivate');
	},

	// determines if the mouse event was 
	ifKeying : function(ev){
		return this.keying;
	},
    "{selectOn} mouseenter": function(el, ev){
        
		if(! this.ifKeying(ev) ){
			this.selected(el, false);
		}
    },
	
	"{selectOn} mouseleave" : function(el, ev){
		if(! this.ifKeying(ev) ) {
			
			// deselect if we haven't focused, or we are 
			// leaving something not the focused element
			if(!this._focused ){ //make sure it's deselected
				this.deselect();
			}
			
		}
	},
    "{selectOn} click": function(el, ev){
		this.activated(el, ev);
		
    },
    "{selectOn} focusin": function(el, ev){
		this.times = !this.times ? 1 : this.times + 1;
        
		this.selected(el, false);
		this._focused = el;
    },
	"{selectOn} focusout": function(el, ev){
		this._focused = null;
		// we are not in the element, and we are not focused on anything
		if(!this.mousein){
			this.deselect();
		}
    },
    "{selectOn} activate": function(el, ev, keys){
        // if event is synthetic (not IE native activate event)
		el.addClass(this.options.activatedClassName);
		this.lastSelected = el;
		
    },
    "{selectOn} deactivate": function(el, ev){
        // if event is synthetic (not IE native deactivate event)
        if (!ev.originalEvent) {
			el.removeClass(this.options.activatedClassName);
		}
    },
    "{selectOn} select" : function(el, ev){
		var selected = this.element.find( "."+this.options.selectedClassName ).not(el);
        if (selected.length) {
            selected.trigger('deselect');
        }
        el.addClass( this.options.selectedClassName );
    },
    "{selectOn} deselect": function(el, ev){
        el.removeClass( this.options.selectedClassName );
    },
    "{selectOn} keydown": function(el, ev){
		// we are keying, this means we dont
		// accept mouse select events w/o a move

		// set keying for a brief time.
		// this is to support when keying scrolls.
		var key = ev.keyName()
		if(/down|up|right|left/.test(key)){
			var nextEl = this.moveTo(el, key);
			
			this.selected(nextEl, true);
			ev.preventDefault();
			this.keying = true;
			setTimeout(this.proxy(function(){
				this.keying = false;
			}),100)
		} else  if(key == "\r") {
			this.activated(el, ev);
			this.keying = true;
			setTimeout(this.proxy(function(){
				this.keying = false;
			}),100)
		} 
    },
	cache : function(){
		this._cache = this.element.find(this.options.selectOn);
	},
	selectables : function(){
		return this._cache ?
				this._cache.filter(":visible") :
				this.element.find(this.options.selectOn+":visible")
	},
	moveTo : function(current, dir, selectables){
		// go forward and backwards ... if xtest or ytest
		// returns a function that returns the abs diff between 2 dimensions
		var abs = function(dir){
			return function(current, el){
				return Math.abs(current[dir] - el[dir])
			}
		};
		// returns the difference of a direction
		// way - true - current - el
		//     - false - el - current
		var diff = function(dir, way){
			return function(current, el){
				return way ?  current[dir] - el[dir] : el[dir] - current[dir];
			}
		}
		var dirtest, closetest, traverse;
		if(dir == "right"){
			dirtest = diff("left",false);
			closetest = abs("top");
			traverse = 1
		} else if(dir == "left"){
			dirtest = diff("left",true);
			closetest = abs("top");
			traverse = -1
		} else if(dir == "up"){
			closetest = abs("left");
			dirtest = diff("top",true);
			traverse = -1
		} else if(dir == 'down') {
			closetest = abs("left");
			dirtest = diff("top",false);
			traverse = 1
		}
		
		// now, go traverse direction.   
		// if dirtest > 0, keep that value, stop once it is again > new value
		// then get the lowest value of close test
		
		var currentOffset = current.offset(),
			el,
			elOffset,
			els = selectables || this.selectables(),
			index= els.index(current),
			i,
			min = Infinity,
			minEl,
			dist,
			close;
		
		
		
		for(i = index+traverse;i < els.length && i >= 0; i = i + traverse){
			
			var el = els.eq(i),
				elOffset = el.offset(),
				res = dirtest( currentOffset, elOffset );
			// if we havent set dist, and res is > 5 set it to dist
			// 5 is basically a threshold for weirdness
			if(!dist && res > 5){
				dist = res;
			}
			// if we are on the 2nd level
			if(dist && Math.abs(res - dist) > 5){
				break;
			}
			if(dist){
				close = closetest(currentOffset,elOffset )
				if(close < min){
					min = close;
					minEl = el;
				}
			}
		}
		if(minEl){
			return minEl;
		}
		
		// we don't have a min el ... now we need to wrap?
		if(traverse == 1){ // going down or right, pick the next element or the first
			if(index >= els.length -1){
				// no one to the right
				return els.eq(0)
			} else {
				return els.eq(index+1)
			}
		} else {
			if(index == 0){
				return els.eq(els.length-1)
			} else {
				return els.eq(index-1)
			}
		}
		
		
		// now select
	}
});

})(module["jquery"], module["can/control/control.js"], module["can/construct/proxy/proxy.js"], module["can/control/plugin/plugin.js"], module["jquerypp/event/key/key.js"]);// ## jquerypp/lang/vector/vector.js

module['jquerypp/lang/vector/vector.js'] = (function($){
	var getSetZero = function(v){ return v !== undefined ? (this.array[0] = v) : this.array[0] },
		getSetOne = function(v){ return v !== undefined ? (this.array[1] = v) : this.array[1]};

/**
 * @class jQuery.Vector
 * @parent jquerypp
 *
 * `jQuery.Vector` represents a multi dimensional vector with shorthand methods for
 * working with two dimensions.
 *
 * It is mainly used in [jQuery.event.drag drag] & [jQuery.event.drop drop] events.
 *
 * @constructor creates a new vector instance from the arguments.  Example:
 *
 *      new jQuery.Vector(1,2)
 */
	$.Vector = function(arr) {
		var array = $.isArray(arr) ? arr : $.makeArray(arguments);
		this.update(array);
	};
	$.Vector.prototype =
	/* @Prototype*/
	{
		/**
		 * Applys the function to every item in the vector and returns a new vector.
		 *
		 * @param {Function} f The function to apply
		 * @return {jQuery.Vector} A new $.Vector instance
		 */
		app: function( f ) {
			var i, newArr = [];

			for ( i = 0; i < this.array.length; i++ ) {
				newArr.push(f(this.array[i], i));
			}
			return new $.Vector(newArr);
		},
		/**
		 * Adds two vectors together and returns a new instance. Example:
		 *
		 *      new $.Vector(1,2).plus(2,3) //-> (3, 5)
		 *      new $.Vector(3,5).plus(new Vector(4,5)) //-> (7, 10)
		 *
		 * @return {$.Vector}
		 */
		plus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) + args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Subtract one vector from another and returns a new instance. Example:
		 *
		 *      new $.Vector(4, 5).minus(2, 1) //-> (2, 4)
		 *
		 * @return {jQuery.Vector}
		 */
		minus: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				arr[i] = (arr[i] ? arr[i] : 0) - args[i];
			}
			return vec.update(arr);
		},
		/**
		 * Returns the current vector if it is equal to the vector passed in.
		 *
		 * `null` if otherwise.
		 *
		 * @return {jQuery.Vector}
		 */
		equals: function() {
			var i, args = arguments[0] instanceof $.Vector ? arguments[0].array : $.makeArray(arguments),
				arr = this.array.slice(0),
				vec = new $.Vector();
			for ( i = 0; i < args.length; i++ ) {
				if ( arr[i] != args[i] ) {
					return null;
				}
			}
			return vec.update(arr);
		},
		/**
		 * Returns the first value of the vector.
		 * You can also access the same value through the following aliases the
		 * [jQuery.Vector.prototype.left vector.left()] and [jQuery.Vector.prototype.left vector.width()]
		 * aliases.
		 *
		 * For example:
		 *
		 *      var v = new $.Vector(2, 5);
		 *      v.x() //-> 2
		 *      v.left() //-> 2
		 *      v.width() //-> 2
		 *
		 * @return {Number} The first value of the vector
		 */
		x: getSetZero,
		/**
		 * @hide
		 * Alias for [jQuery.Vector.prototype.x].
		 *
		 * @return {Number}
		 */
		left: getSetZero,
		/**
		 * @hide
		 * Alias for [jQuery.Vector.prototype.x].
		 *
		 * @return {Number}
		 */
		width: getSetZero,
		/**
		 * Returns the second value of the vector.
		 * You can also access the same value through the [jQuery.Vector.prototype.top vector.top()]
		 * and [jQuery.Vector.prototype.height vector.height()] aliases.
		 *
		 * For example:
		 *
		 *      var v = new $.Vector(2, 5);
		 *      v.y() //-> 5
		 *      v.top() //-> 5
		 *      v.height() //-> 5
		 *
		 * @return {Number} The first value of the vector
		 */
		y: getSetOne,
		/**
		 * @hide
		 * Alias for [jQuery.Vector.prototype.y].
		 *
		 * @return {Number}
		 */
		top: getSetOne,
		/**
		 * @hide
		 * Alias for [jQuery.Vector.prototype.y].
		 *
		 * @return {Number}
		 */
		height: getSetOne,
		/**
		 * Returns a string representation of the vector in the form of (x,y,...)
		 *
		 *      var v = new $.Vector(4, 6, 1, 3);
		 *      v.toString() //-> (4, 6, 1, 3)
		 *
		 * @return {String}
		 */
		toString: function() {
			return "(" + this.array.join(', ') + ")";
		},
		/**
		 * Replaces the vectors contents
		 *
		 *      var v = new $.Vector(2, 3);
		 *
		 * @param {Object} array
		 */
		update: function( array ) {
			var i;
			if ( this.array ) {
				for ( i = 0; i < this.array.length; i++ ) {
					delete this.array[i];
				}
			}
			this.array = array;
			for ( i = 0; i < array.length; i++ ) {
				this[i] = this.array[i];
			}
			return this;
		}
	};

	$.Event.prototype.vector = function() {
		// Get the first touch element for touch events
		var touches = "ontouchend" in document && this.originalEvent.touches && this.originalEvent.touches.length
				? this.originalEvent.changedTouches[0] : this;
		if ( this.originalEvent.synthetic ) {
			var doc = document.documentElement,
				body = document.body;
			return new $.Vector(touches.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0),
				touches.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0));
		} else {
			return new $.Vector(touches.pageX, touches.pageY);
		}
	};

	$.fn.offsetv = function() {
		if ( this[0] == window ) {
			return new $.Vector(window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft, window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop);
		} else {
			var offset = this.offset() || {};
			return new $.Vector(offset.left, offset.top);
		}
	};

	$.fn.dimensionsv = function( which ) {
		if ( this[0] == window || !which ) {
			return new $.Vector(this.width(), this.height());
		}
		else {
			return new $.Vector(this[which + "Width"](), this[which + "Height"]());
		}
	};

	return $;
})(module["jquery"]);// ## jquerypp/event/livehack/livehack.js

module['jquerypp/event/livehack/livehack.js'] = (function($) {

	var event = $.event,

		//helper that finds handlers by type and calls back a function, this is basically handle
		// events - the events object
		// types - an array of event types to look for
		// callback(type, handlerFunc, selector) - a callback
		// selector - an optional selector to filter with, if there, matches by selector
		//     if null, matches anything, otherwise, matches with no selector
		findHelper = function( events, types, callback, selector ) {
			var t, type, typeHandlers, all, h, handle, 
				namespaces, namespace,
				match;
			for ( t = 0; t < types.length; t++ ) {
				type = types[t];
				all = type.indexOf(".") < 0;
				if (!all ) {
					namespaces = type.split(".");
					type = namespaces.shift();
					namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
				}
				typeHandlers = (events[type] || []).slice(0);

				for ( h = 0; h < typeHandlers.length; h++ ) {
					handle = typeHandlers[h];
					
					match = (all || namespace.test(handle.namespace));
					
					if(match){
						if(selector){
							if (handle.selector === selector  ) {
								callback(type, handle.origHandler || handle.handler);
							}
						} else if (selector === null){
							callback(type, handle.origHandler || handle.handler, handle.selector);
						}
						else if (!handle.selector ) {
							callback(type, handle.origHandler || handle.handler);
							
						} 
					}
					
					
				}
			}
		};

	/**
	 * Finds event handlers of a given type on an element.
	 * @param {HTMLElement} el
	 * @param {Array} types an array of event names
	 * @param {String} [selector] optional selector
	 * @return {Array} an array of event handlers
	 */
	event.find = function( el, types, selector ) {
		var events = ( $._data(el) || {} ).events,
			handlers = [],
			t, liver, live;

		if (!events ) {
			return handlers;
		}
		findHelper(events, types, function( type, handler ) {
			handlers.push(handler);
		}, selector);
		return handlers;
	};
	/**
	 * Finds all events.  Group by selector.
	 * @param {HTMLElement} el the element
	 * @param {Array} types event types
	 */
	event.findBySelector = function( el, types ) {
		var events = $._data(el).events,
			selectors = {},
			//adds a handler for a given selector and event
			add = function( selector, event, handler ) {
				var select = selectors[selector] || (selectors[selector] = {}),
					events = select[event] || (select[event] = []);
				events.push(handler);
			};

		if (!events ) {
			return selectors;
		}
		//first check live:
		/*$.each(events.live || [], function( i, live ) {
			if ( $.inArray(live.origType, types) !== -1 ) {
				add(live.selector, live.origType, live.origHandler || live.handler);
			}
		});*/
		//then check straight binds
		findHelper(events, types, function( type, handler, selector ) {
			add(selector || "", type, handler);
		}, null);

		return selectors;
	};
	event.supportTouch = "ontouchend" in document;
	
	$.fn.respondsTo = function( events ) {
		if (!this.length ) {
			return false;
		} else {
			//add default ?
			return event.find(this[0], $.isArray(events) ? events : [events]).length > 0;
		}
	};
	$.fn.triggerHandled = function( event, data ) {
		event = (typeof event == "string" ? $.Event(event) : event);
		this.trigger(event, data);
		return event.handled;
	};
	/**
	 * Only attaches one event handler for all types ...
	 * @param {Array} types llist of types that will delegate here
	 * @param {Object} startingEvent the first event to start listening to
	 * @param {Object} onFirst a function to call 
	 */
	event.setupHelper = function( types, startingEvent, onFirst ) {
		if (!onFirst ) {
			onFirst = startingEvent;
			startingEvent = null;
		}
		var add = function( handleObj ) {
			var bySelector, 
                            selector = handleObj.selector || "",
                            namespace  = handleObj.namespace ? '.'+handleObj.namespace : '';
                            
			if ( selector ) {
				bySelector = event.find(this, types, selector);
				if (!bySelector.length ) {
					$(this).delegate(selector, startingEvent + namespace, onFirst);
				}
			}
			else {
				//var bySelector = event.find(this, types, selector);
				if (!event.find(this, types, selector).length ) {
					event.add(this, startingEvent + namespace, onFirst, {
						selector: selector,
						delegate: this
					});
				}

			}

		},
			remove = function( handleObj ) {
				var bySelector, selector = handleObj.selector || "";
				if ( selector ) {
					bySelector = event.find(this, types, selector);
					if (!bySelector.length ) {
						$(this).undelegate(selector, startingEvent, onFirst);
					}
				}
				else {
					if (!event.find(this, types, selector).length ) {
						event.remove(this, startingEvent, onFirst, {
							selector: selector,
							delegate: this
						});
					}
				}
			};
		$.each(types, function() {
			event.special[this] = {
				add: add,
				remove: remove,
				setup: function() {},
				teardown: function() {}
			};
		});
	};

	return $;
})(module["jquery"]);// ## jquerypp/event/drag/core/core.js

module['jquerypp/event/drag/core/core.js'] = (function( $ ) {

	if(!$.event.special.move) {
		$.event.reverse('move');
	}

	//modify live
	//steal the live handler ....
	var bind = function( object, method ) {
			var args = Array.prototype.slice.call(arguments, 2);
			return function() {
				var args2 = [this].concat(args, $.makeArray(arguments));
				return method.apply(object, args2);
			};
		},
		event = $.event,
	// function to clear the window selection if there is one
		clearSelection = window.getSelection ? function(){
			window.getSelection().removeAllRanges()
		} : function(){},

		supportTouch = "ontouchend" in document,
	// Use touch events or map it to mouse events
		startEvent = supportTouch ? "touchstart" : "mousedown",
		stopEvent = supportTouch ? "touchend" : "mouseup",
		moveEvent = supportTouch ? "touchmove" : "mousemove",
	// On touchmove events the default (scrolling) event has to be prevented
		preventTouchScroll = function(ev) {
			ev.preventDefault();
		};

	/**
	 * @class jQuery.Drag
	 * @parent jQuery.event.drag
	 * @plugin jquerypp/event/drag
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquerypp/event/drag/drag.js
	 * @test jquerypp/event/drag/qunit.html
	 *
	 * The `$.Drag` constructor is never called directly but an instance of `$.Drag` is passed as the second argument
	 * to the `dragdown`, `draginit`, `dragmove`, `dragend`, `dragover` and `dragout` event handlers:
	 *
	 *      $('#dragger').on('draginit', function(el, drag) {
	 *          // drag -> $.Drag
	 *      });
	 */
	$.Drag = function() {};

	/**
	 * @Static
	 */
	$.extend($.Drag, {
		lowerName: "drag",
		current: null,
		distance: 0,
		/**
		 * Called when someone mouses down on a draggable object.
		 * Gathers all callback functions and creates a new Draggable.
		 * @hide
		 */
		mousedown: function( ev, element ) {
			var isLeftButton = ev.button === 0 || ev.button == 1,
				doEvent = isLeftButton || supportTouch;

			if (!doEvent || this.current ) {
				return;
			}

			//create Drag
			var drag = new $.Drag(),
				delegate = ev.delegateTarget || element,
				selector = ev.handleObj.selector,
				self = this;
			this.current = drag;

			drag.setup({
				element: element,
				delegate: ev.delegateTarget || element,
				selector: ev.handleObj.selector,
				moved: false,
				_distance: this.distance,
				callbacks: {
					dragdown: event.find(delegate, ["dragdown"], selector),
					draginit: event.find(delegate, ["draginit"], selector),
					dragover: event.find(delegate, ["dragover"], selector),
					dragmove: event.find(delegate, ["dragmove"], selector),
					dragout: event.find(delegate, ["dragout"], selector),
					dragend: event.find(delegate, ["dragend"], selector),
					dragcleanup: event.find(delegate, ["dragcleanup"], selector)
				},
				destroyed: function() {
					self.current = null;
				}
			}, ev);
		}
	});

	/**
	 * @Prototype
	 */
	$.extend($.Drag.prototype, {
		setup: function( options, ev ) {
			$.extend(this, options);

			this.element = $(this.element);
			this.event = ev;
			this.moved = false;
			this.allowOtherDrags = false;
			var mousemove = bind(this, this.mousemove),
				mouseup = bind(this, this.mouseup);
			this._mousemove = mousemove;
			this._mouseup = mouseup;
			this._distance = options.distance ? options.distance : 0;

			//where the mouse is located
			this.mouseStartPosition = ev.vector();

			$(document).bind(moveEvent, mousemove);
			$(document).bind(stopEvent, mouseup);
			if(supportTouch) {
				// On touch devices we want to disable scrolling
				$(document).bind(moveEvent, preventTouchScroll);
			}

			if (!this.callEvents('down', this.element, ev) ) {
				this.noSelection(this.delegate);
				//this is for firefox
				clearSelection();
			}
		},
		/**
		 * @attribute element
		 * A reference to the element that is being dragged. For example:
		 *
		 *      $('.draggable').on('draginit', function(ev, drag) {
		 *          drag.element.html('I am the drag element');
		 *      });
		 */

		/**
		 * Unbinds listeners and allows other drags ...
		 * @hide
		 */
		destroy: function() {
			// Unbind the mouse handlers attached for dragging
			$(document).unbind(moveEvent, this._mousemove);
			$(document).unbind(stopEvent, this._mouseup);
			if(supportTouch) {
				// Enable scrolling again for touch devices when the drag is done
				$(document).unbind(moveEvent, preventTouchScroll);
			}

			if (!this.moved ) {
				this.event = this.element = null;
			}

			if(!supportTouch) {
				this.selection(this.delegate);
			}
			this.destroyed();
		},
		mousemove: function( docEl, ev ) {
			if (!this.moved ) {
				var dist = Math.sqrt( Math.pow( ev.pageX - this.event.pageX, 2 ) + Math.pow( ev.pageY - this.event.pageY, 2 ));
				// Don't initialize the drag if it hasn't been moved the minimum distance
				if(dist < this._distance){
					return false;
				}
				// Otherwise call init and indicate that the drag has moved
				this.init(this.element, ev);
				this.moved = true;
			}

			this.element.trigger('move', this);
			var pointer = ev.vector();
			if ( this._start_position && this._start_position.equals(pointer) ) {
				return;
			}
			this.draw(pointer, ev);
		},

		mouseup: function( docEl, event ) {
			//if there is a current, we should call its dragstop
			if ( this.moved ) {
				this.end(event);
			}
			this.destroy();
		},

		/**
		 * The `drag.noSelection(element)` method turns off text selection during a drag event.
		 * This method is called by default unless a event is listening to the 'dragdown' event.
		 *
		 * ## Example
		 *
		 *      $('div.drag').bind('dragdown', function(elm,event,drag){
		 *          drag.noSelection();
		 *      });
		 *
		 * @param [elm] an element to prevent selection on.  Defaults to the dragable element.
		 */
		noSelection: function(elm) {
			elm = elm || this.delegate
			document.documentElement.onselectstart = function() {
				// Disables selection
				return false;
			};
			document.documentElement.unselectable = "on";
			this.selectionDisabled = (this.selectionDisabled ? this.selectionDisabled.add(elm) : $(elm));
			this.selectionDisabled.css('-moz-user-select', '-moz-none');
		},

		/**
		 * @hide
		 * `drag.selection()` method turns on text selection that was previously turned off during the drag event.
		 * This method is always called.
		 *
		 * ## Example
		 *
		 *     $('div.drag').bind('dragdown', function(elm,event,drag){
		 *       drag.selection();
		 *     });
		 */
		selection: function() {
			if(this.selectionDisabled) {
				document.documentElement.onselectstart = function() {};
				document.documentElement.unselectable = "off";
				this.selectionDisabled.css('-moz-user-select', '');
			}
		},

		init: function( element, event ) {
			element = $(element);
			//the element that has been clicked on
			var startElement = (this.movingElement = (this.element = $(element)));
			//if a mousemove has come after the click
			//if the drag has been cancelled
			this._cancelled = false;
			this.event = event;

			/**
			 * @attribute mouseElementPosition
			 * The position of start of the cursor on the element
			 */
			this.mouseElementPosition = this.mouseStartPosition.minus(this.element.offsetv()); //where the mouse is on the Element
			this.callEvents('init', element, event);

			// Check what they have set and respond accordingly if they canceled
			if ( this._cancelled === true ) {
				return;
			}
			// if they set something else as the element
			this.startPosition = startElement != this.movingElement ? this.movingElement.offsetv() : this.currentDelta();

			this.makePositioned(this.movingElement);
			// Adjust the drag elements z-index to a high value
			this.oldZIndex = this.movingElement.css('zIndex');
			this.movingElement.css('zIndex', 1000);
			if (!this._only && this.constructor.responder ) {
				// calls $.Drop.prototype.compile if there is a drop element
				this.constructor.responder.compile(event, this);
			}
		},
		makePositioned: function( that ) {
			var style, pos = that.css('position');

			// Position properly, set top and left to 0px for Opera
			if (!pos || pos == 'static' ) {
				style = {
					position: 'relative'
				};

				if ( window.opera ) {
					style.top = '0px';
					style.left = '0px';
				}
				that.css(style);
			}
		},
		callEvents: function( type, element, event, drop ) {
			var i, cbs = this.callbacks[this.constructor.lowerName + type];
			for ( i = 0; i < cbs.length; i++ ) {
				cbs[i].call(element, event, this, drop);
			}
			return cbs.length;
		},
		/**
		 * Returns the position of the movingElement by taking its top and left.
		 * @hide
		 * @return {$.Vector}
		 */
		currentDelta: function() {
			return new $.Vector(parseInt(this.movingElement.css('left'), 10) || 0, parseInt(this.movingElement.css('top'), 10) || 0);
		},
		//draws the position of the dragmove object
		draw: function( pointer, event ) {
			// only drag if we haven't been cancelled;
			if ( this._cancelled ) {
				return;
			}
			clearSelection();
			/**
			 * @attribute location
			 * `drag.location` is a [jQuery.Vector] specifying where the element should be in the page.  This
			 * takes into account the start position of the cursor on the element.
			 *
			 * If the drag is going to be moved to an unacceptable location, you can call preventDefault in
			 * dragmove to prevent it from being moved there.
			 *
			 *     $('.mover').bind("dragmove", function(ev, drag){
			 *       if(drag.location.top() < 100){
			 *         ev.preventDefault()
			 *       }
			 *     });
			 *
			 * You can also set the location to where it should be on the page.
			 *
			 */
				// the offset between the mouse pointer and the representative that the user asked for
			this.location = pointer.minus(this.mouseElementPosition);

			// call move events
			this.move(event);
			if ( this._cancelled ) {
				return;
			}
			if (!event.isDefaultPrevented() ) {
				this.position(this.location);
			}

			// fill in
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.show(pointer, this, event);
			}
		},
		/**
		 * `drag.position( newOffsetVector )` sets the position of the movingElement.  This is overwritten by
		 * the [$.Drag::scrolls], [$.Drag::limit] and [$.Drag::step] plugins
		 * to make sure the moving element scrolls some element
		 * or stays within some boundary.  This function is exposed and documented so you could do the same.
		 *
		 * The following approximates how step does it:
		 *
		 *     var oldPosition = $.Drag.prototype.position;
		 *     $.Drag.prototype.position = function( offsetPositionv ) {
		 *       if(this._step){
		 *         // change offsetPositionv to be on the step value
		 *       }
		 *
		 *       oldPosition.call(this, offsetPosition)
		 *     }
		 *
		 * @param {jQuery.Vector} newOffsetv the new [$.Drag::location] of the element.
		 */
		position: function( newOffsetv ) { //should draw it on the page
			var style, dragged_element_css_offset = this.currentDelta(),
			//  the drag element's current left + top css attributes
			// the vector between the movingElement's page and css positions
			// this can be thought of as the original offset
				dragged_element_position_vector =   this.movingElement.offsetv().minus(dragged_element_css_offset);
			this.required_css_position = newOffsetv.minus(dragged_element_position_vector);

			this.offsetv = newOffsetv;
			style = this.movingElement[0].style;
			if (!this._cancelled && !this._horizontal ) {
				style.top = this.required_css_position.top() + "px";
			}
			if (!this._cancelled && !this._vertical ) {
				style.left = this.required_css_position.left() + "px";
			}
		},
		move: function( event ) {
			this.callEvents('move', this.element, event);
		},
		over: function( event, drop ) {
			this.callEvents('over', this.element, event, drop);
		},
		out: function( event, drop ) {
			this.callEvents('out', this.element, event, drop);
		},
		/**
		 * Called on drag up
		 * @hide
		 * @param {Event} event a mouseup event signalling drag/drop has completed
		 */
		end: function( event ) {
			// If canceled do nothing
			if ( this._cancelled ) {
				return;
			}
			// notify the responder - usually a $.Drop instance
			if (!this._only && this.constructor.responder ) {
				this.constructor.responder.end(event, this);
			}

			this.callEvents('end', this.element, event);

			if ( this._revert ) {
				var self = this;
				// animate moving back to original position
				this.movingElement.animate({
					top: this.startPosition.top() + "px",
					left: this.startPosition.left() + "px"
				}, function() {
					self.cleanup.apply(self, arguments);
				});
			}
			else {
				this.cleanup(event);
			}
			this.event = null;
		},
		/**
		 * Cleans up drag element after drag drop.
		 * @hide
		 */
		cleanup: function(event) {
			this.movingElement.css({
				zIndex: this.oldZIndex
			});
			if ( this.movingElement[0] !== this.element[0] &&
				!this.movingElement.has(this.element[0]).length &&
				!this.element.has(this.movingElement[0]).length ) {
				this.movingElement.css({
					display: 'none'
				});
			}
			if ( this._removeMovingElement ) {
				// Remove the element when using drag.ghost()
				this.movingElement.remove();
			}

			if(event) {
				this.callEvents('cleanup', this.element, event);
			}

			this.movingElement = this.element = this.event = null;
		},
		/**
		 * `drag.cancel()` stops a drag motion from from running.  This also stops any other events from firing, meaning
		 * that "dragend" will not be called.
		 *
		 *     $("#todos").on(".handle", "draginit", function( ev, drag ) {
		 *       if(drag.movingElement.hasClass("evil")){
		 *         drag.cancel();
		 *       }
		 *     })
		 *
		 */
		cancel: function() {
			this._cancelled = true;
			if (!this._only && this.constructor.responder ) {
				// clear the drops
				this.constructor.responder.clear(this.event.vector(), this, this.event);
			}
			this.destroy();

		},
		/**
		 * `drag.ghost( [parent] )` clones the element and uses it as the
		 * moving element, leaving the original dragged element in place.  The `parent` option can
		 * be used to specify where the ghost element should be temporarily added into the
		 * DOM.  This method should be called in "draginit".
		 *
		 *     $("#todos").on(".handle", "draginit", function( ev, drag ) {
		 *       drag.ghost();
		 *     })
		 *
		 * @param {HTMLElement} [parent] the parent element of the newly created ghost element. If not provided the
		 * ghost element is added after the moving element.
		 * @return {jQuery.fn} the ghost element to do whatever you want with it.
		 */
		ghost: function( parent ) {
			// create a ghost by cloning the source element and attach the clone to the dom after the source element
			var ghost = this.movingElement.clone().css('position', 'absolute');
			if( parent ) {
				$(parent).append(ghost);
			} else {
				$(this.movingElement).after(ghost)
			}
			ghost.width(this.movingElement.width()).height(this.movingElement.height());
			// put the ghost in the right location ...
			ghost.offset(this.movingElement.offset())

			// store the original element and make the ghost the dragged element
			this.movingElement = ghost;
			this.noSelection(ghost)
			this._removeMovingElement = true;
			return ghost;
		},
		/**
		 * `drag.representative( element, [offsetX], [offsetY])` tells the drag motion to use
		 * a different element than the one that began the drag motion.
		 *
		 * For example, instead of
		 * dragging an drag-icon of a todo element, you want to move some other representation of
		 * the todo element (or elements).  To do this you might:
		 *
		 *     $("#todos").on(".handle", "draginit", function( ev, drag ) {
		 *       // create what we'll drag
		 *       var rep = $('<div/>').text("todos")
		 *         .appendTo(document.body)
		 *       // indicate we want our mouse on the top-right of it
		 *       drag.representative(rep, rep.width(), 0);
		 *     })
		 *
		 * @param {HTMLElement} element the element you want to actually drag.  This should be
		 * already in the DOM.
		 * @param {Number} offsetX the x position where you want your mouse on the representative element (defaults to 0)
		 * @param {Number} offsetY the y position where you want your mouse on the representative element (defaults to 0)
		 * @return {drag} returns the drag object for chaining.
		 */
		representative: function( element, offsetX, offsetY ) {
			this._offsetX = offsetX || 0;
			this._offsetY = offsetY || 0;

			var p = this.mouseStartPosition;
			// Just set the representative as the drag element
			this.movingElement = $(element);
			this.movingElement.css({
				top: (p.y() - this._offsetY) + "px",
				left: (p.x() - this._offsetX) + "px",
				display: 'block',
				position: 'absolute'
			}).show();
			this.noSelection(this.movingElement)
			this.mouseElementPosition = new $.Vector(this._offsetX, this._offsetY);
			return this;
		},
		/**
		 * `drag.revert([val])` makes the [$.Drag::representative representative] element revert back to it
		 * original position after the drag motion has completed.  The revert is done with an animation.
		 *
		 *     $("#todos").on(".handle","dragend",function( ev, drag ) {
		 *       drag.revert();
		 *     })
		 *
		 * @param {Boolean} [val] optional, set to false if you don't want to revert.
		 * @return {drag} the drag object for chaining
		 */
		revert: function( val ) {
			this._revert = val === undefined ? true : val;
			return this;
		},
		/**
		 * `drag.vertical()` isolates the drag to vertical movement.  For example:
		 *
		 *     $("#images").on(".thumbnail","draginit", function(ev, drag){
		 *       drag.vertical();
		 *     });
		 *
		 * Call `vertical()` in "draginit" or "dragdown".
		 *
		 * @return {drag} the drag object for chaining.
		 */
		vertical: function() {
			this._vertical = true;
			return this;
		},
		/**
		 * `drag.horizontal()` isolates the drag to horizontal movement.  For example:
		 *
		 *     $("#images").on(".thumbnail","draginit", function(ev, drag){
		 *       drag.horizontal();
		 *     });
		 *
		 * Call `horizontal()` in "draginit" or "dragdown".
		 *
		 * @return {drag} the drag object for chaining.
		 */
		horizontal: function() {
			this._horizontal = true;
			return this;
		},
		/**
		 * `drag.only([only])` indicates if you __only__ want a drag motion and the drag should
		 * not notify drops.  The default value is `false`.  Call it with no arguments or pass it true
		 * to prevent drop events.
		 *
		 *     $("#images").on(".thumbnail","dragdown", function(ev, drag){
		 * 	     drag.only();
		 *     });
		 *
		 * @param {Boolean} [only] true if you want to prevent drops, false if otherwise.
		 * @return {Boolean} the current value of only.
		 */
		only: function( only ) {
			return (this._only = (only === undefined ? true : only));
		},

		/**
		 * `distance([val])` sets or reads the distance the mouse must move before a drag motion is started.  This should be set in
		 * "dragdown" and delays "draginit" being called until the distance is covered.  The distance
		 * is measured in pixels.  The default distance is 0 pixels meaning the drag motion starts on the first
		 * mousemove after a mousedown.
		 *
		 * Set this to make drag motion a little "stickier" to start.
		 *
		 *     $("#images").on(".thumbnail","dragdown", function(ev, drag){
		 *       drag.distance(10);
		 *     });
		 *
		 * @param {Number} [val] The number of pixels the mouse must move before "draginit" is called.
		 * @return {drag|Number} returns the drag instance for chaining if the drag value is being set or the
		 * distance value if the distance is being read.
		 */
		distance: function(val){
			if(val !== undefined){
				this._distance = val;
				return this;
			}else{
				return this._distance
			}
		}
	});
	/**
	 * @add jQuery.event.special
	 */
	event.setupHelper([
	/**
	 * @attribute dragdown
	 * @parent jQuery.event.drag
	 *
	 * `dragdown` is called when a drag movement has started on a mousedown.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter.  Listening to `dragdown` allows you to customize
	 * the behavior of a drag motion, especially when `draginit` should be called.
	 *
	 *     $(".handles").delegate("dragdown", function(ev, drag){
	 *       // call draginit only when the mouse has moved 20 px
	 *       drag.distance(20);
	 *     })
	 *
	 * Typically, when a drag motion is started, `event.preventDefault` is automatically
	 * called, preventing text selection.  However, if you listen to
	 * `dragdown`, this default behavior is not called. You are responsible for calling it
	 * if you want it (you probably do).
	 *
	 * ### Why might you not want to call `preventDefault`?
	 *
	 * You might want it if you want to allow text selection on element
	 * within the drag element.  Typically these are input elements.
	 *
	 *     $(".handles").delegate("dragdown", function(ev, drag){
	 *       if(ev.target.nodeName === "input"){
	 *         drag.cancel();
	 *       } else {
	 *         ev.preventDefault();
	 *       }
	 *     })
	 */
		'dragdown',
	/**
	 * @attribute draginit
	 * @parent jQuery.event.drag
	 *
	 * `draginit` is triggered when the drag motion starts. Use it to customize the drag behavior
	 * using the [jQuery.Drag] instance passed as the second parameter:
	 *
	 *     $(".draggable").on('draginit', function(ev, drag) {
	 *       // Only allow vertical drags
	 *       drag.vertical();
	 *       // Create a draggable copy of the element
	 *       drag.ghost();
	 *     });
	 */
		'draginit',
	/**
	 * @attribute dragover
	 * @parent jQuery.event.drag
	 *
	 * `dragover` is triggered when a drag is over a [jQuery.event.drop drop element].
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter and an instance of [jQuery.Drop] passed as the third argument:
	 *
	 *      $('.draggable').on('dragover', function(ev, drag, drop) {
	 *          // Add the drop-here class indicating that the drag
	 *          // can be dropped here
	 *          drag.element.addClass('drop-here');
	 *      });
	 */
		'dragover',
	/**
	 * @attribute dragmove
	 * @parent jQuery.event.drag
	 *
	 * `dragmove` is triggered when the drag element moves (similar to a mousemove).
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter.
	 * Use [jQuery.Drag::location] to determine the current position
	 * as a [jQuery.Vector vector].
	 *
	 * For example, `dragmove` can be used to create a draggable element to resize
	 * a container:
	 *
	 *      $('.resizer').on('dragmove', function(ev, drag) {
	 *          $('#container').width(drag.location.x())
	 *              .height(drag.location.y());
	 *      });
	 */
		'dragmove',
	/**
	 * @attribute dragout
	 * @parent jQuery.event.drag
	 *
	 * `dragout` is called when the drag leaves a drop point.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter.
	 *
	 *      $('.draggable').on('dragout', function(ev, drag) {
	 *      	 // Remove the drop-here class
	 *      	 // (e.g. crossing the drag element out indicating that it
	 *      	 // can't be dropped here
	 *          drag.element.removeClass('drop-here');
	 *      });
	 */
		'dragout',
	/**
	 * @attribute dragend
	 * @parent jQuery.event.drag
	 *
	 * `dragend` is called when the drag operation is completed.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter.
	 *
	 *     $('.draggable').on('dragend', function(ev, drag)
	 *       // Calculation on whether revert should be invoked, alterations based on position of the end event
	 *     });
	 */
		'dragend',
	/**
	 * @attribute dragcleanup
	 * @parent jQuery.event.drag
	 *
	 * `dragcleanup` is called after dragend and revert (if applied)
	 * The event handler gets an instance of [jQuery.Drag] passed as the second
	 * parameter.
	 *
	 *     $('.draggable').on('dragcleanup', function(ev, drag)
	 *         // cleanup
	 *     });
	 */
		'dragcleanup'], startEvent, function( e ) {
		$.Drag.mousedown.call($.Drag, e, this);
	});

	return $;
})(module["jquery"], module["jquerypp/lang/vector/vector.js"], module["jquerypp/event/livehack/livehack.js"], module["jquerypp/event/reverse/reverse.js"]);// ## jquerypp/event/drag/limit/limit.js

module['jquerypp/event/drag/limit/limit.js'] = (function( $ ) {


	$.Drag.prototype
	/**
	 * @function limit
	 * @plugin jquerypp/event/drag/limit
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquerypp/event/event/drag/limit/limit.js
	 * `drag.limit(container, [center])` limits a drag to a containing element.
	 * 
	 *     $("#todos").on(".todo","draginit", function( ev, drag ) {
	 *       drag.limit($("#todos").parent())
	 *     })
	 * 
	 * @param {jQuery} container the jQuery-wrapped container element you do not want the drag element to escape.
	 * @param {String} [center] can set the limit to the center of the object.  Can be 
	 *   'x', 'y' or 'both'.  By default it will keep the outer edges of the moving element within the
	 * container element.  If you provide x, it will keep the horizontal center of the moving element
	 * within the container element.  If you provide y, it will keep the vertical center of the moving
	 * element within the container element.  If you provide both, it will keep the center of the 
	 * moving element within the containing element.
	 * @return {drag} returns the drag for chaining.
	 */
	.limit = function( container, center ) {
		//on draws ... make sure this happens
		var styles = container.styles('borderTopWidth', 'paddingTop', 'borderLeftWidth', 'paddingLeft'),
			paddingBorder = new $.Vector(
			parseInt(styles.borderLeftWidth, 10) + parseInt(styles.paddingLeft, 10) || 0, parseInt(styles.borderTopWidth, 10) + parseInt(styles.paddingTop, 10) || 0);

		this._limit = {
			offset: container.offsetv().plus(paddingBorder),
			size: container.dimensionsv(),
			center : center === true ? 'both' : center
		};
		return this;
	};

	var oldPosition = $.Drag.prototype.position;
	$.Drag.prototype.position = function( offsetPositionv ) {
		//adjust required_css_position accordingly
		if ( this._limit ) {
			var limit = this._limit,
				center = limit.center && limit.center.toLowerCase(),
				movingSize = this.movingElement.dimensionsv('outer'),
				halfHeight = center && center != 'x' ? movingSize.height() / 2 : 0,
				halfWidth = center && center != 'y' ? movingSize.width() / 2 : 0,
				lot = limit.offset.top(),
				lof = limit.offset.left(),
				height = limit.size.height(),
				width = limit.size.width();

			//check if we are out of bounds ...
			//above
			if ( offsetPositionv.top()+halfHeight < lot ) {
				offsetPositionv.top(lot - halfHeight);
			}
			//below
			if ( offsetPositionv.top() + movingSize.height() - halfHeight > lot + height ) {
				offsetPositionv.top(lot + height - movingSize.height() + halfHeight);
			}
			//left
			if ( offsetPositionv.left()+halfWidth < lof ) {
				offsetPositionv.left(lof - halfWidth);
			}
			//right
			if ( offsetPositionv.left() + movingSize.width() -halfWidth > lof + width ) {
				offsetPositionv.left(lof + width - movingSize.left()+halfWidth);
			}
		}

		oldPosition.call(this, offsetPositionv);
	};

	return $;
})(module["jquery"], module["jquerypp/event/drag/core/core.js"], module["jquerypp/dom/styles/styles.js"]);// ## canui/split/split.js

module['canui/split/split.js'] = (function($) {

	/**
	 * @class can.ui.Split
	 * @parent canui
	 * @test canui/layout/split/funcunit.html
	 * 
	 * @description Makes a splitter widget.
	 * 
	 * The splitter widget manages a container whose content "panels" can be independently resized. It
	 * does this by inserting a "splitter bar" between each panel element, which can be dragged or
	 * optionally collapsed.
	 * 
	 * Panel elements can be added or removed from the container at any time using ordinary DOM manipulation.
	 * The spliter widget will automatically adjust the splitter bars anytime a `resize` event is triggered.
	 * 
	 * The splitter widget will try to auto-detect whether it should operate in `vertical` or `horizontal`
	 * mode by inspecting the positions of its first two elements. If the panels can wrap due to floating
	 * content, or the container does not have two elements at initialization time, this check may be
	 * unreliable, so just pass the direction in the options.
	 * 
	 * ## Basics
	 * 
	 * Suppose you have this HTML:
	 *
	 *     <div id="container">
	 *       <div class="panel">Content 1</div>
	 *       <div class="panel">Content 2</div>
	 *       <div class="panel">Content 3</div>
	 *     </div>
	 * 
	 * The following will create the splitter widget:
	 * 
	 *     new can.ui.Split($('#container'));
	 * 
	 * You can also provide the direction explicitly:
	 * 
	 *     new can.ui.Split($('#container'), { direction: 'vertical' });
	 * 
	 * The `direction` parameter refers to the splitter bar: `vertical` bars mean that the panels are arranged
	 * from left-to-right, and `horizontal` bars mean the panels are arranged from top-to-bottom.
	 * 
	 * To indicate that a panel should be collapsible, simply apply the <code>collapsible</code> CSS class
	 * to the panel.
	 * 
	 * ## Styling
	 * 
	 * The splitter widget uses a number of CSS classes that permit fine-grained control over the look
	 * and feel of various elements. The most commonly used are the following:
	 * 
	 *   - `.can_ui_layout_split`: the container itself
	 *     - `.splitter`: splitter bars
	 *     - `.vsplitter`: only vertical splitter bars
	 *     - `.hsplitter`: only horizontal splitter bars
	 *     - `.collapser`: collapser buttons
	 *     - `.left-collapse`: only left collapser buttons
	 *     - `.right-collapse`: only right collapser buttons
	 * 
	 * You can see the standard styles for the splitter widget
	 * [https://github.com/jupiterjs/canui/blob/master/layout/split/split.css here].
	 * 
	 * Additionally, the `panelClass` initialization option allows you to specify which subelements of
	 * the container should be interpreted as panel elements, and the `hover` option specifies a CSS class
	 * which will be applied to a splitter when the user hovers over it.
	 * 
	 * ## Events
	 * 
	 * The splitter widget responds to the [jQuery.event.special.resize resize] event by performing a quick
	 * check to see if any panel elements have been inserted or removed, and updating its internal
	 * state to reflect the changes. Simply add or remove whatever panel elements you wish from the DOM
	 * using any appropriate jQuery methods, and then trigger the `resize` event on it:
	 * 
	 *     var container = $('#container');
	 *     container.append($('<div class="panel">New Content</div>'));
	 *     container.find('.panel:first').remove();
	 *     container.resize();
	 * 
	 * ## Demo
	 * 
	 * @demo canui/layout/split/demo.html
	 * 
	 * ## More Examples
	 * 
	 * For some larger, more complex examples, see [//canui/layout/split/split.html here].
	 * 
	 * @param {HTMLElement} element an HTMLElement or jQuery-wrapped element.
	 * @param {Object} options options to set on the split:
	 * 
	 *   - __hover__ (def. `"split-hover"`) - CSS class to apply to a splitter when the mouse enters it
	 *   - __direction__ - whether the panel layout is `"vertical"` or `"horizontal"` (see above)
	 *   - __dragDistance__ (def. `5`) - maximum number of pixels away from the slider to initiate a drag
	 *   - __panelClass__ - CSS class that indicates a child element is a panel of this container
	 *      					(by default any child is considered a panel)
	 * @return {can.ui.Split}
	 */
	can.Control("can.ui.Split",
	/** 
	 * @static
	 */
	{
		pluginName : 'split',
		defaults: {
			active: "active",
			hover: "split-hover",
			splitter: "splitter",
			direction: null,
			dragDistance: 5,
			panelSelector: '',
			locale:{
				collaspe: "Click to collapse",
				expand: "Click to expand"
			}
		},
		directionMap: {
			vertical: {
				dim: "width",
				cap: "Width",
				outer: "outerWidth",
				pos: "left",
				dragDir: "horizontal"
			},
			horizontal: {
				dim: "height",
				cap: "Height",
				outer: "outerHeight",
				pos: "top",
				dragDir: "vertical"
			}
		}
	},
	/** 
	 * @prototype
	 */
	{
		/**
		 * @hide
		 * Init method called by CanJS base control.
		 */
		init: function() {
			var c = this.panels();

			//- Determine direction.  
			//- TODO: Figure out better way to measure this since if its floating the panels and the 
			//- width of the combined panels exceeds the parent container, it won't determine this correctly.
			if (!this.options.direction ) {
				this.options.direction = c.eq(0).position().top == c.eq(1).position().top ? "vertical" : "horizontal";
			}

			$.Drag.distance = this.options.dragDistance;
			this.dirs = this.constructor.directionMap[this.options.direction];
			this.usingAbsPos = c.eq(0).css('position') == "absolute";
			
			if(this.usingAbsPos){
				if(!/absolute|relative|fixed/.test(this.element.css('position'))){
					this.element.css('position','relative')
				}
			}
			
			this.element.css('overflow', 'hidden');
			this.initalSetup(c);
		},

		/**
		 * @hide
		 * Sizes the split bar and split elements initially.  This is 
		 * different from size in that fact
		 * that initial size retains the elements widths and resizes 
		 * what can't fit to be within the parent dims.
		 * @param {Object} c
		 */
		initalSetup: function( c ) {
			//- Insert the splitter bars
			for ( var i = 0; i < c.length - 1; i++ ) {
				var $c = $(c[i]),
					$cCollasible = $c.hasClass('collapsible'),
					$cCollapsed = $c.hasClass('collapsed'),
					$nxt = $(c[i + 1]),
					$nxtCollasible = $nxt.hasClass('collapsible'),
					$nxtCollapsed = $nxt.hasClass('collapsed'),
					dir, txt;
					
				if($cCollasible && !$cCollapsed){
					txt = this.options.locale.collaspe;
				} else {
					txt = this.options.locale.expand;
				}
					
				if(($cCollasible && !$cCollapsed) || ($nxtCollasible && $nxtCollapsed)){
					dir = "left";
					
				} else if(($nxtCollasible && !$nxtCollapsed) || ($cCollasible && $cCollapsed)){
					dir = "right";
				}
				
				$c.after(this.splitterEl(dir, txt));
			}

			var splitters = this.element.children(".splitter"),
				splitterDim = splitters[this.dirs.outer](),
				// why is this calculated and not used
				total = this.element[this.dirs.dim]() - splitterDim * (c.length - 1),
				pHeight = this.element.height();


			//- If its vertical, we need to set the height of the split bar
			if ( this.options.direction == "vertical" ) {
				splitters.height(pHeight);
			}

			//- Size the elements				  
			for ( var i = 0; i < c.length; i++ ) {
				var $c = $(c[i]);
				
				// store in data for faster lookup
				$c.data("split-min-" + this.dirs.dim, parseInt($c.css('min-' + this.dirs.dim)));
				$c.addClass("split");
			}

			this.size();
		},

		/**
		 * @hide
		 * Appends a split bar.
		 * @param {Object} dir
		 */
		splitterEl: function( dir,txt ) {
			var splitter = $("<div class='" + this.options.direction.substr(0, 1) + "splitter splitter' tabindex='0'>")
							.css("position", this.usingAbsPos ? "absolute" : "relative");

			if ( dir ) {
				splitter.append("<a title='" + txt + "' class='" + dir + "-collapse collapser' href='javascript://'></a>")
			}

			return splitter;
		},

		/**
		 * Returns all the panels managed by this controller.
		 * 
		 * Given a `container`, iterate over its panels and collect their content:
		 * 
		 *     var content = '';
		 *     var split = new can.ui.Split('#container');
		 *     split.panels().each(function(el){
		 *       content += el.text();
		 *     });
		 * 
		 * @return {jQuery} Returns a jQuery-wrapped nodelist of elements that are panels of this container.
		 */
		panels: function() {
			return this.element.children(this.options.panelSelector + ":not(.splitter)")
		},

		".splitter mouseenter": function( el, ev ) {
			if (!this.dragging ) {
				el.addClass(this.options.hover)
			}
		},

		".splitter mouseleave": function( el, ev ) {
			if (!this.dragging ) {
				el.removeClass(this.options.hover)
			}
		},

		".splitter keydown": function( el, ev ) {
			var offset = el.offset();
			switch ( ev.keyName() ) {
			case 'right':
				this.moveTo(el, offset.left + 1);
				break;
			case 'left':
				this.moveTo(el, offset.left - 1);
				break;
			case '\r':
				this.toggleCollapse(el);
				break;
			}
		},

		".splitter draginit": function( el, ev, drag ) {
			drag.noSelection();
			drag.limit(this.element);

			// limit motion to one direction
			drag[this.dirs.dragDir]();
			var hoverClass = this.options.hover;
			el.addClass("move").addClass(this.options.hover);
			this.moveCache = this._makeCache(el);
			
			if(this.moveCache.next.hasClass('collapsed') 
			|| this.moveCache.prev.hasClass('collapsed')){
				el.addClass('disabled');
				drag.cancel();
				
				setTimeout(function(){ el.removeClass('disabled')
										 .removeClass("move")
										 .removeClass(hoverClass); }, 800);
			} else {
				this.dragging = true;
			}
		},

		/**
		 * @hide
		 * Internal method for getting the cache info for an element
		 * @param {Object} el
		 */
		_makeCache: function( el ) {
			var next = el.next(),
				prev = el.prev();
			return {
				offset: el.offset()[this.dirs.pos],
				next: next,
				prev: prev,
				nextD: next[this.dirs.dim](),
				prevD: prev[this.dirs.dim]()
			};
		},

		/**
		 * @hide
		 * Moves a slider to a specific offset in the page
		 * @param {jQuery} el
		 * @param {Number} newOffset The location in the page in the direction the slider moves
		 * @param {Object} [cache] A cache of dimensions data to make things run faster (esp for drag/drop). It looks like
		 * 
		 *     {
		 *       offset: {top: 200, left: 200},
		 *       prev: 400, // width or height of the previous element
		 *       next: 200  // width or height of the next element
		 *     }
		 * @return {Boolean} false if unable to move
		 */
		moveTo: function( el, newOffset, cache ) {
			cache = cache || this._makeCache(el);

			var prevOffset = cache.offset,
				delta = newOffset - prevOffset || 0,
				prev = cache.prev,
				next = cache.next,
				prevD = cache.prevD,
				nextD = cache.nextD,
				prevMin = prev.data("split-min-" + this.dirs.dim),
				nextMin = next.data("split-min-" + this.dirs.dim);

			// we need to check the 'getting smaller' side
			if ( delta > 0 && (nextD - delta < nextMin) ) {
				return false;
			} else if ( delta < 0 && (prevD + delta < prevMin) ) {
				return false;
			}

			// make sure we can't go smaller than the right's min
			if ( delta > 0 ) {
				next[this.dirs.dim](nextD - delta);
				prev[this.dirs.dim](prevD + delta);
			} else {
				prev[this.dirs.dim](prevD + delta);
				next[this.dirs.dim](nextD - delta);
			}

			if ( this.usingAbsPos ) {
				//- Sets the split bar element's offset relative to parents
				var newOff = $(el).offset();
				newOff[this.dirs.pos] = newOffset;
				el.offset(newOff);
				
				//- Sets the next elements offset relative to parents
				var off = next.offset();
				off[this.dirs.pos] = newOffset + el[this.dirs.outer]();
				next.offset(off);
			}

			// this can / should be throttled
			clearTimeout(this._moveTimer);
			this._moveTimer = setTimeout(function() {
				prev.trigger("resize",[false]);
				next.trigger("resize",[false]);
			}, 1);
		},

		".splitter dragmove": function( el, ev, drag ) {
			var moved = this.moveTo(el, drag.location[this.dirs.pos](), this.moveCache)

			if ( moved === false ) {
				ev.preventDefault();
			}
		},

		".splitter dragend": function( el, ev, drag ) {
			this.dragging = false;
			el.removeClass(this.options.hover)
			drag.selection();
		},

		/**
		 * @hide
		 * Resizes the panels.
		 * @param {Object} el
		 * @param {Object} ev
		 * @param {Object} data
		 */
		resize: function( el, ev, data ) {
			if(!this.element.is(":visible")){
				return;
			}
			
			var changed = this.refresh(),
				refreshed = ( !! changed.inserted.length || changed.removed ),
				keepEl = data && data.keep;
			if ( ! keepEl && changed.inserted.length ){
				// if no keep element was provided, and at least one element was inserted,
				// keep the first inserted element's dimensions/position
				keepEl = $(changed.inserted.get(0));
			}
			
			// if not visible do nothing
			if (!this.element.is(":visible") ) {
				this.oldHeight = this.oldWidth = 0;
				return;
			}

			if (!(data && data.force === true) && !this.forceNext && !refreshed) {
				var h = this.element.height(),
					w = this.element.width();
				if ( this.oldHeight == h && this.oldWidth == w && !this.needsSize) {
					ev.stopPropagation();
					return;
				}
				this.oldHeight = h;
				this.oldWidth = w;
			}

			this.forceNext = false;
			this.size(null, null, keepEl, false);
		},

		/**
		 * @hide
		 * Refresh the state of the container by handling any panels that have been added or removed.
		 */
		refresh: function(){
			var changed = {
				inserted: this.insert(),
				removed: this.remove()
			};
			return changed;
		},

		/**
		 * @hide
		 * Handles the insertion of new panels into the container.
		 * @param {jQuery} panel
		 */
		insert: function(){
			var self = this,
				panels = this.panels().get(),
				inserted = [];
			
			$.each(panels, function(_, panel){
				panel = $(panel);
				
				if( !panel.hasClass('split') ){
					panel.before(self.splitterEl(panel.hasClass('collapsible') && 'right'))
						.addClass('split')
					
					inserted.push(panel);
					
					if ( self.options.direction == 'vertical' ) {
						var splitBar = panel.prev(),
							pHeight = self.element.height();

						splitBar.height(pHeight);
						panel.height(pHeight);
					}
				}
			});
			
			return $(inserted);
		},
		
		/**
		 * @hide
		 * Handles the removal of a panel from the container.
		 * @param {jQuery} panel
		 */
		remove: function(){
			var self = this,
				splitters = this.element.children('.splitter'),
				removed = [];
			
			$.each(splitters, function(_, splitter){
				splitter = $(splitter);
				
				var prev = $(splitter).prev(),
					next = $(splitter).next();
				
				if( !prev.length || !next.length || next.hasClass('splitter') ){
					removed.push( splitter[0] );
				}
			});
			
			if( removed.length ){
				$(removed).remove();
				return true;
			}
		},

		".collapser click": function( el, event ) {
			this.toggleCollapse(el.parent());
		},

		/**
		 * @hide
		 * Given a splitter bar element, collapses the appropriate panel.
		 * @param {Object} el
		 */
		toggleCollapse: function( splitBar ) {
			// check the next and prev element should be collapsed
			var prevElm = splitBar.prev(),
				nextElm = splitBar.next(),
				elmToTakeActionOn = (prevElm.hasClass('collapsible') && prevElm) || (nextElm.hasClass('collapsible') && nextElm);
				
			if (!elmToTakeActionOn ) {
				return;
			}

			if (!elmToTakeActionOn.is(':visible') ) {
				this.showPanel(elmToTakeActionOn);
				splitBar.find('a').attr('title', this.options.locale.collaspe);
			} else {
				this.hidePanel(elmToTakeActionOn, true);
				splitBar.find('a').attr('title', this.options.locale.expand);
			}
			
			splitBar.children().toggleClass('left-collapse').toggleClass('right-collapse');
		},

		/**
		 * Shows a panel that is currently hidden.
		 * 
		 * Given some `container`, cause its last panel to be shown:
		 * 
		 *     split.showPanel(container.find('.panel:last'));
		 *
		 * @param {Object} panel
		 * @param {Object} width
		 */
		showPanel: function( panel, width ) {
			if (!panel.is(':visible') ) {

				if ( width ) {
					panel.width(width);
				}

				panel.show();
				panel.removeClass('collapsed');
				panel.trigger('toggle', true)

				var prevElm = panel.prev();
				if ( prevElm.hasClass('splitter') ) {
					prevElm.show();
				} else {
					//- if it was hidden by start, it didn't get a 
					//- splitter added so we need to add one here
					panel.before(this.splitterEl(
					prevElm.hasClass('collapsible') ? "left" : (
					panel.hasClass('collapsible') ? "right" : undefined)));
				}

				this.size(null, false, panel);
			}
		},

		/**
		 * Hides a panel that is currently visible.
		 * 
		 * Given some `container`, cause its last panel to be hidden:
		 * 
		 *     split.hidePanel(container.find('.panel:last'));
		 *
		 * @param {Object} panel
		 * @param {Object} keepSplitter
		 */
		hidePanel: function( panel, keepSplitter ) {
			if ( panel.is(':visible') || panel.hasClass('collapsed') ) {
				panel.hide();
				panel.addClass('collapsed');
				panel.trigger('toggle', false)

				if (!keepSplitter ) {
					panel.prev().hide();
				}

				this.size();
			}
		},

		/**
		 * @hide
		 * Takes elements and animates them to the right size.
		 * @param {jQuery} [els] child elements
		 * @param {Boolean} [animate] animate the change
		 * @param {jQuery} [keep] keep this element's width / height the same
		 * @param {Boolean} [resizePanels] resize the panels or not.
		 */
		size: function( els, animate, keep, resizePanels ) {
			els = els || this.panels();
			resizePanels = resizePanels == undefined ? true : false;

			var space = this.element[this.dirs.dim](),
				splitters = this.element.children(".splitter:visible"),
				splitterDim = splitters[this.dirs.outer](),
				total = space - (splitterDim * splitters.length),
				// rounding remainder
				remainder = 0,
				dims = [],
				newDims = [],
				sum = 0,
				i, $c, dim, increase, keepSized = false,
				curLeft = 0,
				index, rawDim, newDim, pHeight = this.element.height(),
				pWidth = this.element.width(),
				length, 
				start,
				keepIndex = keep ? els.index(keep[0]) : -1;

			// if splitters are filling the entire width, it probably means the 
			// style has not loaded
			// this should be fixed by steal, but IE sucks
			if(splitterDim === space){
				this.needsSize = true;
				return;
			} else {
				this.needsSize = false;
			}

			// adjust total by the dimensions of the element whose size we want to keep
			if ( keep ) {
				total = total - $(keep)[this.dirs.outer]();
			}

			length = els.length;
			start = Math.floor(Math.random() * length);

			// round down b/c some browsers don't like fractional dimensions
			total = Math.floor(total);

			//calculate current percentage of height
			for ( i = 0; i < length; i++ ) {
				$c = $(els[i]);
				dim = $c.hasClass('collapsed') ? 0 : $c[this.dirs.outer](true);
				dims.push(dim);
				if( keepIndex !== i ) {
					sum += dim;
				}
			}

			increase = total / sum;

			// this randomly adjusts sizes so scaling is approximately equal
			for ( i = start; i < length + start; i++ ) {
				index = i >= length ? i - length : i;
				dim = dims[index];
				rawDim = (dim * increase) + remainder;
				newDim = (i == length + start - 1 ? total : Math.round(rawDim));
				
				if (keepIndex == i) {
					// if we're keeping this element's size, use the original dimensions
					newDims[index] = dim;
				} else {
					// use the adjusted dimensions
					newDims[index] = newDim;
					total = total - newDim;
				}
			}

			//resize splitters to new height if vertical (horizontal will automatically be the right width)
			if ( this.options.direction == "vertical" ) {
				splitters.height(pHeight);
			}

			// Adjust widths for each pane and account for rounding
			for ( i = 0; i < length; i++ ) {
				$c = $(els[i]);

				var minWidth = $c.data("split-min-width") || 0,
					minHeight = $c.data("split-min-height") || 0,
					dim = this.options.direction == "horizontal" ? {
						outerHeight: Math.max( newDims[i], minHeight ),
						outerWidth: Math.max( pWidth, minWidth )
					} : {
						outerWidth: Math.max( newDims[i], minWidth ),
						outerHeight: Math.max( pHeight, minHeight )
					};
					
				if($c.hasClass('collapsed')){
					if(this.options.direction == "horizontal"){
						dim.outerHeight = 0;
					} else {
						dim.outerWidth = 0;
					}
				}
				
				// Only resize panels that are actually visible, otherwise leave the dimensions of the panel alone 
				if ($c.is(':visible')) {
					if ( animate && !this.usingAbsPos ) {
						$c.animate(dim, "fast", function() {
							if ( resizePanels ) {
								$(this).trigger('resize', [false]);
							}

							if ( keep && !keepSized ) {
								keep.trigger('resize', [false])
								keepSized = true;
							}
						});
					}
					else {
						$c.outerHeight(dim.outerHeight).outerWidth(dim.outerWidth);

						if ( resizePanels ) {
							$c.trigger('resize', [false]);
						}
					}
				}

				// adjust positions if absolutely positioned
				if ( this.usingAbsPos ) {
					//set splitter in the right spot
					$c.css(this.dirs.pos, curLeft)
					splitters.eq(i).css(this.dirs.pos, curLeft + newDims[i])
				}
				// move the next location
				curLeft = curLeft + newDims[i] + splitterDim;
			}
		}
	})
})(module["jquery"], module["can/control/control.js"], module["can/control/plugin/plugin.js"], module["jquerypp/event/drag/limit/limit.js"], module["jquerypp/dom/dimensions/dimensions.js"], module["jquerypp/event/key/key.js"], module["jquerypp/event/resize/resize.js"]);// ## canui/list/list.js

module['canui/list/list.js'] = (function($) {
	can.Control('can.ui.List', {
		pluginName : 'list',
		defaults : {
			attribute : 'data-cid',
			cid : '_cid'
		}
	}, {
		init : function() {
			this._cidMap = {};
			this.update();
		},

		/**
		 * Updates the options and re-renders the list. Will also be called
		 * by subsequent calls to `$(element).list([options])`.
		 *
		 *      $('#list').list({ view : '<li><%= this.attr("name") %></li>' });
		 *      //
		 *      $('#list').list({ list : [{ name : 'Test' }] });
		 *
		 * @param {Object} [options] The options to update
		 */
		update : function(options) {
			can.Control.prototype.update.call(this, options);
			var list = this.options.list;
			if(list && list.isComputed) {
				list = list();
			}
			this._update(list);
		},

		/**
		 * Updates the data list and sets this.options.data. Converts Arrays
		 * and waits for Deferreds.
		 *
		 * @param {can.Deferred|can.Observe.List|Array} data The data to set
		 * @private
		 */
		_update : function(data) {
			data = data || [];
			if(can.isDeferred(data)) {
				this.element.html(this._content('loading'));
				data.done(can.proxy(this._update, this));
			} else {
				this._cidMap = {};
				this.options.data = data instanceof can.Observe.List ? data : new can.Observe.List(data);
				this.on();
				this._render(this._rows(this.options.data));
			}
		},

		/**
		 * Returns a can.$ wrapped list of rendered rows for the given observes.
		 *
		 * @param {Array|can.Observe.List} observes The observables to render
		 * @return {can.$} A can.$ wrapped list of rendered rows
		 * @private
		 */
		_rows : function(observes) {
			var self = this;
			observes = can.makeArray(observes);
			return can.$.map(observes, can.proxy(function(observe) {
				// Update the mapping from can.Observe unique id to Observe instance
				self._cidMap[observe[self.options.cid]] = observe;
				return this._content('view', observe);
			}, this));
		},

		_content : function(name, param) {
			if(!this.options[name]) {
				return '';
			}
			var op = this.options[name],
				rendered = can.isFunction(op) ?
					op.call(this, param) :
					can.EJS({ text : op })(param);
			return this._wrapWithTag(can.view.frag(rendered), param);
		},

		_wrapWithTag : function(content, observe) {
			if(!this.options.tag) {
				return content;
			}
			var tag = can.$(this.options.tag.indexOf(0) == '<' ? this.options.tag : '<' + this.options.tag + '>');
			if(observe instanceof can.Observe) {
				tag.attr(this.options.attribute, observe[this.options.cid]);
			}
			if(content) {
				tag.append(content);
			}
			// We need to return the raw DOM element
			return tag[0];
		},

		/**
		 * Renders the row element list. If the rows are empty or there
		 * are no rows, the content set in the `empty` option will be rendered.
		 *
		 * @param rows
		 * @private
		 */
		_render : function(rows) {
			var content = !rows || rows.length === 0 ? this._content('empty') : rows;
			this.element.html(content);
			this.element.trigger('rendered', this);
		},

		'{list} change' : function(target, ev, newVal) {
			if(target.isComputed) {
				this._update(newVal);
			}
		},

		'{data} length' : function(list, ev, length) {
			if(length === 0) {
				this._render();
			}
		},

		'{data} remove' : function(list, ev, observes) {
			if(list.length) { // We can't get rowElements from an empty list
				var self = this;
				// Remove the CID mapping
				can.each(observes, function(observe) {
					delete self._cidMap[observe[self.options.cid]];
				});
				this.rowElements(observes).remove();
				this.element.trigger('changed', this);
			}
		},

		'{data} add' : function(list, ev, observes) {
			var rowElements = this.rowElements(),
				newRows = this._rows(observes);
			if(rowElements.length) {
				// We either append after the last data row
				rowElements.last().after(newRows);
			} else {
				// Or set it as the content
				this.element.html(newRows);
			}
			this.element.trigger('changed', this);
		},

		/**
		 * Returns a jQuery collection of all rows or all rows for the given observables:
		 *
		 *      // Retrieves the row element for the first observe
		 *      $('#list').list('rowElements', people[0]);
		 *      // -> [<li data-cid="...">John</li>]
		 *
		 * @param arg
		 * @return {*}
		 */
		rowElements : function(arg) {
			if(!arg) {
				return this.element.find('[' + this.options.attribute + ']');
			}

			var elements = [],
				observes = can.isArray(arg) ? arg : can.makeArray(arguments);

			can.each(observes, can.proxy(function(current) {
				var row = this.element.find('[' + this.options.attribute + '="' + current[this.options.cid] + '"]')[0];
				elements.push(row || null);
			}, this));

			return can.$(elements);
		},

		/**
		 * Returns a `can.Observe.List` containing all observes (equivalent to `.list()`)
		 * or all observes representing the given rows.
		 *
		 * @param {jQuery} rows The collection of row elements
		 * @return {can.Observe.List}
		 */
		items : function(rows)
		{
			if(!rows) {
				return this.list();
			}

			var result = new can.Observe.List(),
				map = this._cidMap;

			can.each(can.makeArray(rows), function(row) {
				row = row[0] || row;
				// Either use getAttribute or the name itself as the index
				// that way you can pass a list of ids as well
				var id = row.getAttribute('data-cid');
				if(map[id]) {
					result.push(map[id]);
				}
			});

			return result;
		},

		/**
		 * Returns a `can.Observe.List` of the current list data.
		 *
		 * @param {can.Observe.List|Array|can.compute|can.Deferred} newlist The list to replace
		 * @return {can.Observe.List|can.Observe}
		 */
		list : function(newlist) {
			if(!newlist) {
				return this.options.data || new can.Observe.List();
			}
			this.update({
				list : newlist
			});
		}
	});
})(module["jquery"], module["can/control/control.js"], module["can/control/plugin/plugin.js"], module["can/view/view.js"], module["can/observe/observe.js"], module["can/view/ejs/ejs.js"]);// ## canui/grid/grid.js

module['canui/grid/grid.js'] = (function($) {
	var appendIf = function(el, tag) {
		if(el.is(tag) || !tag) {
			return el;
		}
		var res = el.find(tag);
		if(res && res.length) {
			return res;
		}
		return el.append(can.$('<' + tag + '>')).find(tag);
	};

	can.view.ejs('canui_grid_header', '<tr>' +
		'<% can.each(this, function(col) { %>' +
			'<th <%= (el) -> can.data(el, \'column\', col) %>>' +
			'<%= col.attr(\'header\') %>' +
			'</th>' +
		'<% }) %>' +
	'</tr>');

	can.view.ejs('canui_grid_row', '<% can.each(this, function(current) { %>' +
		'<td><%== current() %></td>' +
	'<% }); %>');

	can.Control('can.ui.Grid', {
		pluginName : 'grid',
		defaults : {
			view : function(observe) {
				var row = [], self = this;
				can.each(this.options.columns, function(col) {
					var content = can.isFunction(col.content) ?
						can.compute(function() {
							return col.content.call(self, observe, col);
						}) :
						can.compute(function() {
							return observe.attr(col.content);
						});
					row.push(content);
				});
				return this._rowView('row', false, row)();
			},
			row : can.view('canui_grid_row'),
			header : can.view('canui_grid_header'),
			empty : 'No data',
			loading : 'Loading...',
			scrollable : false,
			tag : 'tr'
		}
	}, {
		/**
		 * Set the grid up.
		 *
		 * @param {HTMLElement|jQuery|String} el The original element passed
		 * @param {Object} ops The original options
		 * @return {Array} Arguments to pass to `init`
		 */
		setup : function(el, ops) {
			var table = appendIf(can.$(el), 'table');

			this.el = {
				header : appendIf(table, 'thead'),
				body : appendIf(table, 'tbody'),
				footer : appendIf(table, 'tfoot')
			}

			if(!(ops.columns instanceof can.Observe.List)) {
				ops.columns = new can.Observe.List(ops.columns);
			}

			can.Control.prototype.setup.call(this, table, ops);
			return [table, ops];
		},

		init : function(el, ops) {
			this.el.header.append(this._rowView('header', false, this.options.columns));
			if(this.options.footer) {
				this.el.header.append(this._rowView('footer', false));
			}
			this.control = {};
			this.update();
		},

		_rowView : function(name, wrap, param) {
			var self = this;
			return function() {
				var current = self.options[name];
				if(!current) {
					return '';
				}
				current = can.isFunction(current) ?
					current.call(this, param) :
					can.EJS({ text : current })(param);

				current = can.view.frag(current);

				// TODO maybe make an option, what if it is not a TD?
				if(wrap && !can.$(current).is('td')) {
					current = can.$('<td colspan="' + self.options.columns.length
						+ '"></td>').html(current);
				}

				return current;
			}
		},

		/**
		 * Update the options and rerender
		 *
		 * @param {Object} options The options to update
		 */
		update : function(options) {
			can.Control.prototype.update.apply(this, arguments);
			var self = this;
			this.el.body.list({
				loading : this._rowView('loading', true),
				empty : this._rowView('empty', true),
				view : can.proxy(self.options.view, this),
				tag : this.options.tag,
				list : this.options.list
			});

			this.control.list = this.el.body.control(can.ui.List)
		},

		columns : function(cols) {
			if(!cols) {
				return this.options.columns;
			}
			this.update({ columns : cols });
		},

		'{columns} change' : function() {
			if(this.options.scrollable) {
				this.element.tableScroll();
			}
		},

		' rendered' : function() {
			if(this.options.scrollable) {
				this.element.tableScroll();
				this.control.tableScroll = this.element.control(can.ui.TableScroll);
			}
		},

		' changed' : function() {
			// Trigger resize to adjust the TableScroll
			if(this.options.scrollable) {
				this.element.trigger('resize');
			}
		},

		tableScroll : function() {
			return this.control.tableScroll;
		}
	});

	can.each(['items', 'list', 'rowElements'], function(name) {
		can.ui.Grid.prototype[name] = function() {
			return this.control.list[name].apply(this.control.list, arguments);
		}
	});
})(module["jquery"], module["can/control/control.js"], module["canui/list/list.js"], module["can/view/ejs/ejs.js"], module["canui/table_scroll/table_scroll.js"]);// ## canui/positionable/position.js

module['canui/positionable/position.js'] = (function( $, undefined ) {

	$.ui = $.ui || {};

	var rhorizontal = /left|center|right/,
		rvertical = /top|center|bottom/,
		roffset = /[+-]\d+%?/,
		rposition = /^\w+/,
		rpercent = /%$/,
		center = "center",
		_position = $.fn.position;

	$.position = {
		getScrollInfo: function(within) {
			var notWindow = within[0] !== window,
				overflowX = notWindow ? within.css( "overflow-x" ) : "",
				overflowY = notWindow ? within.css( "overflow-y" ) : "",
				scrollbarWidth = overflowX === "auto" || overflowX === "scroll" ? can.ui.scrollbarWidth() : 0,
				scrollbarHeight = overflowY === "auto" || overflowY === "scroll" ? can.ui.scrollbarWidth() : 0;

			return {
				height: within.height() < within[0].scrollHeight ? scrollbarHeight : 0,
				width: within.width() < within[0].scrollWidth ? scrollbarWidth : 0
			};
		}
	};

	$.fn.position = function( options ) {
		if ( !options || !options.of ) {
			return _position.apply( this, arguments );
		}

		// make a copy, we don't want to modify arguments
		options = $.extend( {}, options );

		var target = $( options.of ),
			within  = $( options.within || window ),
			targetElem = target[0],
			collision = ( options.collision || "flip" ).split( " " ),
			offsets = {},
			atOffset,
			targetWidth,
			targetHeight,
			basePosition;

		if ( targetElem.nodeType === 9 ) {
			targetWidth = target.width();
			targetHeight = target.height();
			basePosition = { top: 0, left: 0 };
		} else if ( $.isWindow( targetElem ) ) {
			targetWidth = target.width();
			targetHeight = target.height();
			basePosition = { top: target.scrollTop(), left: target.scrollLeft() };
		} else if ( targetElem.preventDefault ) {
			// force left top to allow flipping
			options.at = "left top";
			targetWidth = targetHeight = 0;
			basePosition = { top: options.of.pageY, left: options.of.pageX };
		} else {
			targetWidth = target.outerWidth();
			targetHeight = target.outerHeight();
			basePosition = target.offset();
		}

		// force my and at to have valid horizontal and vertical positions
		// if a value is missing or invalid, it will be converted to center
		$.each( [ "my", "at" ], function() {
			var pos = ( options[ this ] || "" ).split( " " ),
				horizontalOffset,
				verticalOffset;

			if ( pos.length === 1) {
				pos = rhorizontal.test( pos[ 0 ] ) ?
					pos.concat( [ center ] ) :
					rvertical.test( pos[ 0 ] ) ?
						[ center ].concat( pos ) :
						[ center, center ];
			}
			pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : center;
			pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : center;

			// calculate offsets
			horizontalOffset = roffset.exec( pos[ 0 ] );
			verticalOffset = roffset.exec( pos[ 1 ] );
			offsets[ this ] = [
				horizontalOffset ? horizontalOffset[ 0 ] : 0,
				verticalOffset ? verticalOffset[ 0 ] : 0
			];

			// reduce to just the positions without the offsets
			options[ this ] = [
				rposition.exec( pos[ 0 ] )[ 0 ],
				rposition.exec( pos[ 1 ] )[ 0 ]
			];
		});

		// normalize collision option
		if ( collision.length === 1 ) {
			collision[ 1 ] = collision[ 0 ];
		}

		if ( options.at[ 0 ] === "right" ) {
			basePosition.left += targetWidth;
		} else if ( options.at[ 0 ] === center ) {
			basePosition.left += targetWidth / 2;
		}

		if ( options.at[ 1 ] === "bottom" ) {
			basePosition.top += targetHeight;
		} else if ( options.at[ 1 ] === center ) {
			basePosition.top += targetHeight / 2;
		}

		atOffset = [
			parseInt( offsets.at[ 0 ], 10 ) *
				( rpercent.test( offsets.at[ 0 ] ) ? targetWidth / 100 : 1 ),
			parseInt( offsets.at[ 1 ], 10 ) *
				( rpercent.test( offsets.at[ 1 ] ) ? targetHeight / 100 : 1 )
		];
		basePosition.left += atOffset[ 0 ];
		basePosition.top += atOffset[ 1 ];

		return this.each(function() {
			var elem = $( this ),
				elemWidth = elem.outerWidth(),
				elemHeight = elem.outerHeight(),
				marginLeft = parseInt( $.css( this, "marginLeft", true ) ) || 0,
				marginTop = parseInt( $.css( this, "marginTop", true ) ) || 0,
				scrollInfo = $.position.getScrollInfo( within ),
				collisionWidth = elemWidth + marginLeft +
					( parseInt( $.css( this, "marginRight", true ) ) || 0 ) + scrollInfo.width,
				collisionHeight = elemHeight + marginTop +
					( parseInt( $.css( this, "marginBottom", true ) ) || 0 ) + scrollInfo.height,
				position = $.extend( {}, basePosition ),
				myOffset = [
					parseInt( offsets.my[ 0 ], 10 ) *
						( rpercent.test( offsets.my[ 0 ] ) ? elem.outerWidth() / 100 : 1 ),
					parseInt( offsets.my[ 1 ], 10 ) *
						( rpercent.test( offsets.my[ 1 ] ) ? elem.outerHeight() / 100 : 1 )
				],
				collisionPosition;

			if ( options.my[ 0 ] === "right" ) {
				position.left -= elemWidth;
			} else if ( options.my[ 0 ] === center ) {
				position.left -= elemWidth / 2;
			}

			if ( options.my[ 1 ] === "bottom" ) {
				position.top -= elemHeight;
			} else if ( options.my[ 1 ] === center ) {
				position.top -= elemHeight / 2;
			}

			position.left += myOffset[ 0 ];
			position.top += myOffset[ 1 ];

			collisionPosition = {
				marginLeft: marginLeft,
				marginTop: marginTop
			};

			$.each( [ "left", "top" ], function( i, dir ) {
				if ( $.ui.position[ collision[ i ] ] ) {
					$.ui.position[ collision[ i ] ][ dir ]( position, {
						targetWidth: targetWidth,
						targetHeight: targetHeight,
						elemWidth: elemWidth,
						elemHeight: elemHeight,
						collisionPosition: collisionPosition,
						collisionWidth: collisionWidth,
						collisionHeight: collisionHeight,
						offset: [ atOffset[ 0 ] + myOffset[ 0 ], atOffset [ 1 ] + myOffset[ 1 ] ],
						my: options.my,
						at: options.at,
						within: within,
						elem : elem
					});
				}
			});

			if ( $.fn.bgiframe ) {
				elem.bgiframe();
			}
			elem.offset( $.extend( position, { using: options.using } ) );
		});
	};

	$.ui.position = {
		fit: {
			left: function( position, data ) {
				var within = data.within,
					win = $( window ),
					isWindow = $.isWindow( data.within[0] ),
					withinOffset = isWindow ? win.scrollLeft() : within.offset().left,
					outerWidth = isWindow ? win.width() : within.outerWidth(),
					collisionPosLeft = position.left - data.collisionPosition.marginLeft,
					overLeft = withinOffset - collisionPosLeft,
					overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
					newOverRight,
					newOverLeft;

				// element is wider than within
				if ( data.collisionWidth > outerWidth ) {
					// element is initially over the left side of within
					if ( overLeft > 0 && overRight <= 0 ) {
						newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
						position.left += overLeft - newOverRight;
						// element is initially over right side of within
					} else if ( overRight > 0 && overLeft <= 0 ) {
						position.left = withinOffset;
						// element is initially over both left and right sides of within
					} else {
						if ( overLeft > overRight ) {
							position.left = withinOffset + outerWidth - data.collisionWidth;
						} else {
							position.left = withinOffset;
						}
					}
					// too far left -> align with left edge
				} else if ( overLeft > 0 ) {
					position.left += overLeft;
					// too far right -> align with right edge
				} else if ( overRight > 0 ) {
					position.left -= overRight;
					// adjust based on position and margin
				} else {
					position.left = Math.max( position.left - collisionPosLeft, position.left );
				}
			},
			top: function( position, data ) {
				var within = data.within,
					win = $( window ),
					isWindow = $.isWindow( data.within[0] ),
					withinOffset = isWindow ? win.scrollTop() : within.offset().top,
					outerHeight = isWindow ? win.height() : within.outerHeight(),
					collisionPosTop = position.top - data.collisionPosition.marginTop,
					overTop = withinOffset - collisionPosTop,
					overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
					newOverTop,
					newOverBottom;

				// element is taller than within
				if ( data.collisionHeight > outerHeight ) {
					// element is initially over the top of within
					if ( overTop > 0 && overBottom <= 0 ) {
						newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
						position.top += overTop - newOverBottom;
						// element is initially over bottom of within
					} else if ( overBottom > 0 && overTop <= 0 ) {
						position.top = withinOffset;
						// element is initially over both top and bottom of within
					} else {
						if ( overTop > overBottom ) {
							position.top = withinOffset + outerHeight - data.collisionHeight;
						} else {
							position.top = withinOffset;
						}
					}
					// too far up -> align with top
				} else if ( overTop > 0 ) {
					position.top += overTop;
					// too far down -> align with bottom edge
				} else if ( overBottom > 0 ) {
					position.top -= overBottom;
					// adjust based on position and margin
				} else {
					position.top = Math.max( position.top - collisionPosTop, position.top );
				}
			}
		},
		flip: {
			left: function( position, data ) {
				if ( data.at[ 0 ] === center ) {
					return;
				}

				data.elem
					.removeClass( "ui-flipped-left ui-flipped-right" );

				var within = data.within,
					win = $( window ),
					isWindow = $.isWindow( data.within[0] ),
					withinOffset = ( isWindow ? 0 : within.offset().left ) + within.scrollLeft(),
					outerWidth = isWindow ? within.width() : within.outerWidth(),
					collisionPosLeft = position.left - data.collisionPosition.marginLeft,
					overLeft = collisionPosLeft - withinOffset,
					overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
					left = data.my[ 0 ] === "left",
					myOffset = data.my[ 0 ] === "left" ?
						-data.elemWidth :
						data.my[ 0 ] === "right" ?
							data.elemWidth :
							0,
					atOffset = data.at[ 0 ] === "left" ?
						data.targetWidth :
						-data.targetWidth,
					offset = -2 * data.offset[ 0 ],
					newOverRight,
					newOverLeft;

				if ( overLeft < 0 ) {
					newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
					if ( newOverRight < 0 || newOverRight < Math.abs( overLeft ) ) {
						data.elem
							.addClass( "ui-flipped-right" );

						position.left += myOffset + atOffset + offset;
					}
				}
				else if ( overRight > 0 ) {
					newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - withinOffset;
					if ( newOverLeft > 0 || Math.abs( newOverLeft ) < overRight ) {
						data.elem
							.addClass( "ui-flipped-left" );

						position.left += myOffset + atOffset + offset;
					}
				}
			},
			top: function( position, data ) {
				if ( data.at[ 1 ] === center ) {
					return;
				}

				data.elem
					.removeClass( "ui-flipped-top ui-flipped-bottom" );

				var within = data.within,
					win = $( window ),
					isWindow = $.isWindow( data.within[0] ),
					withinOffset = ( isWindow ? 0 : within.offset().top ) + within.scrollTop(),
					outerHeight = isWindow ? within.height() : within.outerHeight(),
					collisionPosTop = position.top - data.collisionPosition.marginTop,
					overTop = collisionPosTop - withinOffset,
					overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
					top = data.my[ 1 ] === "top",
					myOffset = top ?
						-data.elemHeight :
						data.my[ 1 ] === "bottom" ?
							data.elemHeight :
							0,
					atOffset = data.at[ 1 ] === "top" ?
						data.targetHeight :
						-data.targetHeight,
					offset = -2 * data.offset[ 1 ],
					newOverTop,
					newOverBottom;
				if ( overTop < 0 ) {
					newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
					if ( newOverBottom < 0 || newOverBottom < Math.abs( overTop ) ) {
						data.elem
							.addClass( "ui-flipped-bottom" );

						position.top += myOffset + atOffset + offset;
					}
				}
				else if ( overBottom > 0 ) {
					newOverTop = position.top -  data.collisionPosition.marginTop + myOffset + atOffset + offset - withinOffset;
					if ( newOverTop > 0 || Math.abs( newOverTop ) < overBottom ) {
						data.elem
							.addClass( "ui-flipped-top" );

						position.top += myOffset + atOffset + offset;
					}
				}
			}
		},
		flipfit: {
			left: function() {
				$.ui.position.flip.left.apply( this, arguments );
				$.ui.position.fit.left.apply( this, arguments );
			},
			top: function() {
				$.ui.position.flip.top.apply( this, arguments );
				$.ui.position.fit.top.apply( this, arguments );
			}
		}
	};

})(module["jquery"]);// ## canui/positionable/positionable.js

module['canui/positionable/positionable.js'] = (function($){

	if(!$.event.special.move) {
		$.event.reverse('move');
	}

	/**
	 * @class can.ui.layout.Positionable
	 * @parent canui
	 *
	 * @description Allows you to position an element relative to another element.
	 *
	 * The positionable plugin allows you to position an element relative to
	 * another. It abstracts all of the calculating you might have to do when
	 * implementing UI widgets, such as tooltips and autocompletes.
	 *
	 * # Basic Example
	 *
	 * Given the following markup:
	 *
	 *		<a id="target" href="http://jupiterjs.com/">Bitovi!</a>
	 *		<div id="tooltip">Bitovi</div>
	 *
	 * To position the tooltip element above the anchor link, you would use the
	 * following code:
	 *
	 *		// Initialize the positionable plugin
	 *		 new can.ui.Positionable($("#tooltip"), {
	 *			my: "bottom",
	 *			at: "top",
	 *			of: $("#target")
	 *		});
	 *
	 *		// Trigger the move event on the tooltip to move it's position
	 *		$("#tooltip").trigger("move");
	 *
	 * In the options passed to the positionable plugin, we're telling the plugin
	 * to align the bottom of the `#tooltip` element to the top of the
	 * `#target` element.
	 *
	 * # Autocomplete Example
	 *
	 * Given the following markup:
	 *
	 *		<form>
	 *			<label>
	 *				Search
	 *				<input type="text" name="search" />
	 *			</label>
	 *		</form>
	 *		<ul id="autocomplete">
	 *		</ul>
	 *
	 * You could easily implement an autocompleting search input using the
	 * following code:
	 *
	 *		// Position the autocomplete list below the search input
	 *		new can.ui.Positionable($("#autocomplete"), {
	 *			my: "left top",
	 * 			at: "left bottom",
	 *			of: $("#search")
	 *		});
	 *		
	 *		// Autocomplete controller
	 *		var Autocomplete = can.Control({
	 *			"keyup" : function( el, ev ) {
	 *				this.options.list.show();
	 *				$.ajax({
	 *					url : "/search.php",
	 *					data : el.val(),
	 *					success : this.proxy("updateResults")
	 *				});
	 *			},
	 *			"blur" : function() {
	 *				this.options.list.hide();
	 *			},
	 *			"updateResults" : function( json ) {
	 *				this.options.list.html( "views/autocomplete-list.ejs", json );
	 *			},
	 *			"{list} li click" : function( el, ev ) {
	 *				this.blur();
	 *				this.element.val( el.text() );
	 *			}
	 *		});
	 *		
	 *		// Initialize the autocomplete controller on the search element
	 *		new Autocomplete($("#search"), {
	 *			list: $("#autocomplete")
	 *		});
	 *
	 *
	 * ## Demo
	 * @demo canui/positionable/positionable.html
	 *
	 * @param {Object} options Object literal describing how to position the
	 * current element against another.
	 *
	 *	- `my` {String} - String containing the edge of the positionable element to be
	 *	used in positioning. Possible values are:
	 *	- `at` {String} - String containing the edge of the target element to be
	 *	used in positioning.
	 *	- Possible values for both the `my` and `at` options include:
	 *		- `"top"`
	 *		- `"center"`
	 *		- `"bottom"`
	 *		- `"left"`
	 *		- `"right"`
	 *		- Horizontal and vertical values can be used in conjunction with
	 *		eachother, separated by a space. For example, `"bottom left"`.
	 *	- `of` {jQuery} - The target DOM element.
	 *	- `collision` {String} - Collision strategy to be used in case the positionable
	 *	element does not fit in the window. Possible values include
	 *		- `fit` - Attempts to position the element as close as possible to
	 *		the target without clipping the positionable.
	 *		- `flip` - Flips the element to the opposite side of the target.
	 *		- `none` - Don't use any collision strategey.
	 *	- `using` {Function} - function that recieves the calculated position
	 *	in the format of `{ top: x, left: y }` to handle the positioning. If a
	 *	`using` parameter is passed, the element won't be positioned
	 *	automatically, but must be positioned by hand in the `using` callback.
	 * - `hideWhenInvisible` - `{Boolean}` - hide element when `of` element is
	 * not visible because of scrolling. If you set this to `true` make sure that
	 * `of` element's parent that is scrollable has `position` set to `relative` or
	 *`absolute`
	 *
	 * This plugin is built on top of the [jQuery UI Position Plugin](http://docs.jquery.com/UI/Position),
	 * so you may refer to their documentation for more advanced usage.
	 */
	can.Control("can.ui.Positionable",
	 {
		pluginName : 'positionable',
	 	rhorizontal : /left|center|right/,
		rvertical : /top|center|bottom/,
		hdefault : "center",
		vdefault : "center",
	 	defaults : {
			iframe: false,
			of: window,
			keep : false, //keeps it where it belongs,
			hideWhenInvisible : false
	 	},
		
		getScrollInfo: function(within) {
			var notWindow = within[0] !== window,
				overflowX = notWindow ? within.css( "overflow-x" ) : "",
				overflowY = notWindow ? within.css( "overflow-y" ) : "",
				scrollbarWidth = overflowX === "auto" || overflowX === "scroll" ? can.ui.scrollbarWidth() : 0,
				scrollbarHeight = overflowY === "auto" || overflowY === "scroll" ? can.ui.scrollbarWidth() : 0;
	
			return {
				height: within.height() < within[0].scrollHeight ? scrollbarHeight : 0,
				width: within.width() < within[0].scrollWidth ? scrollbarWidth : 0
			};
		}
	 },
	/** 
	 * @prototype
	 */
	 {
	 	setup : function(element, options){
	 		var controls = $(element).data('controls'),
	 			pluginName = this.constructor._shortName;

	 		if(controls && controls.length > 0){
	 			for(var i = 0; i < controls.length; i++){
	 				if(controls[i].constructor._shortName === pluginName){
	 					controls[i].destroy();
	 				}
	 			}
	 		}

	 		this._super(element, options);
	 	},

		init : function(element, options) {
			this.element.css("position","absolute");
			if(!this.options.keep){
				// Remove element from it's parent only if this element _has_ parent.
				// This allows us to call positionable like `new can.ui.layout.Positionable($('<div/>'))
				if(this.element[0].parentNode){
					this.element[0].parentNode.removeChild(this.element[0])
				}

				document.body.appendChild(this.element[0]);				
			}
		},

		show : function(el, ev, position){
			this.move.apply(this, arguments)
		},

		move : function( el, ev, positionFrom ) {
			// When combined with 'drag', this can fire
			// causing errors when its goes to try to call
			// methods on the Drag class rather than what its expecting
			if($.Drag && positionFrom instanceof $.Drag) {
				return false;
			}
			
			var position = this.position.apply(this, arguments),
				elem     = this.element,
				options  = this.options;
	
			// if elem is hidden, show it before setting offset
			var visible = elem.is(":visible")
			if ( ! visible ) {
				elem.css("opacity", 0).show()
			}

			elem.offset( $.extend( position, { using: options.using } ) );

			if ( ! visible ) {
				elem.css("opacity", 1).hide();
			}

			if(this.options.hideWhenInvisible){
				this.element.toggle(this.isOfVisible());
			}
		},

		isOfVisible : function(){
			var of = this.options.of,
				pos = of.position();

			if(pos.top < 0 ||
				pos.top > of.offsetParent().height() ||
				pos.left < 0 ||
				pos.left + of.width() > of.offsetParent().width()) {
					return false;
			} 

			return true;
		},

		/**
		 * Calculate the position of the element.
		 */
		position : function(el, ev, positionFrom){
			var options  = $.extend({},this.options);
				 options.of= positionFrom || options.of;

			if(!options.of)	return;

			var target = $( options.of ),
				collision = ( options.collision || "flip" ).split( " " ),
				offset = options.offset ? options.offset.split( " " ) : [ 0, 0 ],
				targetWidth,
				targetHeight,
				basePosition;

			if ( options.of.nodeType === 9 ) {
				targetWidth = target.width();
				targetHeight = target.height();
				basePosition = { top: 0, left: 0 };
			} else if ( options.of.scrollTo && options.of.document ) {
				targetWidth = target.width();
				targetHeight = target.height();
				basePosition = { top: target.scrollTop(), left: target.scrollLeft() };
			} else if ( options.of.preventDefault ) {
				// force left top to allow flipping
				options.at = "left top";
				targetWidth = targetHeight = 0;
				basePosition = { top: options.of.pageY, left: options.of.pageX };
			} else if (options.of.top){
				options.at = "left top";
				targetWidth = targetHeight = 0;
				basePosition = { top: options.of.top, left: options.of.left };	
			} else if(target.is('path') || target.is('rect')) { 
				//SVG elements have .width() and .height() of 0, so we have to use getBBox()
				targetWidth = target[0].getBBox().width;
				targetHeight = target[0].getBBox().height;
				basePosition = target.offset();	
			} else {
				targetWidth = target.outerWidth();
				targetHeight = target.outerHeight();

				if(false){
					var to = target.offset(),
						eo =this.element.parent().children(":first").offset();
					
					basePosition = {
						left: to.left - eo.left,
						top: to.top -eo.top
					}
				}else{
					basePosition = target.offset();
				}			
			}
		
			// force my and at to have valid horizontal and veritcal positions
			// if a value is missing or invalid, it will be converted to center 
			$.each( [ "my", "at" ], this.proxy( function( i, val ) {
				var pos = ( options[val] || "" ).split( " " );

				if ( pos.length === 1) {
					pos = this.constructor.rhorizontal.test( pos[0] ) ?
						pos.concat( [this.constructor.vdefault] ) :
						this.constructor.rvertical.test( pos[0] ) ?
							[ this.constructor.hdefault ].concat( pos ) :
							[ this.constructor.hdefault, this.constructor.vdefault ];
				}

				pos[ 0 ] = this.constructor.rhorizontal.test( pos[0] ) ? pos[ 0 ] : this.constructor.hdefault;
				pos[ 1 ] = this.constructor.rvertical.test( pos[1] ) ? pos[ 1 ] : this.constructor.vdefault;
				options[ val ] = pos;
			}));
		
			// normalize collision option
			if ( collision.length === 1 ) {
				collision[ 1 ] = collision[ 0 ];
			}
		
			// normalize offset option
			offset[ 0 ] = parseInt( offset[0], 10 ) || 0;
			if ( offset.length === 1 ) {
				offset[ 1 ] = offset[ 0 ];
			}

			offset[ 1 ] = parseInt( offset[1], 10 ) || 0;
		
			if ( options.at[0] === "right" ) {
				basePosition.left += targetWidth;
			} else if (options.at[0] === this.constructor.hdefault ) {
				basePosition.left += targetWidth / 2;
			}
		
			if ( options.at[1] === "bottom" ) {
				basePosition.top += targetHeight;
			} else if ( options.at[1] === this.constructor.vdefault ) {
				basePosition.top += targetHeight / 2;
			}
		
			basePosition.left += offset[ 0 ];
			basePosition.top += offset[ 1 ];
			
			var elem = this.element,
				elemWidth = elem.outerWidth(),
				elemHeight = elem.outerHeight(),
				position = $.extend( {}, basePosition ),
				getScrollInfo = this.constructor.getScrollInfo;

			if ( options.my[0] === "right" ) {
				position.left -= elemWidth;
			} else if ( options.my[0] === this.constructor.hdefault ) {
				position.left -= elemWidth / 2;
			}
	
			if ( options.my[1] === "bottom" ) {
				position.top -= elemHeight;
			} else if ( options.my[1] === this.constructor.vdefault ) {
				position.top -= elemHeight / 2;
			}

			$.each( [ "left", "top" ], function( i, dir ) {
				if ( $.ui.position[ collision[i] ] ) {
					var isEvent = ((options.of && options.of.preventDefault) != null),
						within = $(isEvent || !options.of ? window : options.of),
						marginLeft = parseInt( $.css( elem[0], "marginLeft", true ) ) || 0,
						marginTop = parseInt( $.css( elem[0], "marginTop", true ) ) || 0;
						
					var scrollInfo = getScrollInfo(within);
					$.ui.position[ collision[i] ][ dir ]( position, {
						targetWidth: targetWidth,
						targetHeight: targetHeight,
						elem: elem,
						within : within,
						collisionPosition : {
							marginLeft: parseInt( $.css( elem[0], "marginLeft", true ) ) || 0,
							marginTop: parseInt( $.css( elem[0], "marginTop", true ) ) || 0
						},
						collisionWidth: elemWidth + marginLeft +
							( parseInt( $.css( elem[0], "marginRight", true ) ) || 0 ) + scrollInfo.width,
						collisionHeight: elemHeight + marginTop +
						( parseInt( $.css( elem[0], "marginBottom", true ) ) || 0 ) + scrollInfo.height,
						elemWidth: elemWidth,
						elemHeight: elemHeight,
						offset: offset,
						my: options.my,
						at: options.at
					});
				}
			});

			return position;
		},

		/**
		 * Move element when the `of` element is moving
		 */
		"{of} move" : function(el, ev){
			clearTimeout(this._finalMove);
			this.move(this.element, ev, el);
			this._finalMove = setTimeout(this.proxy(function(){
				this.move(this.element, ev, el);
			}), 1)
		}
	});
})(module["jquery"], module["can/control/control.js"], module["can/construct/proxy/proxy.js"], module["can/construct/super/super.js"], module["jquerypp/event/reverse/reverse.js"], module["can/control/plugin/plugin.js"], module["canui/util/scrollbar_width.js"], module["canui/positionable/position.js"]);// ## jquerypp/event/drag/step/step.js

module['jquerypp/event/drag/step/step.js'] = (function( $ ) {
	var round = function( x, m ) {
		return Math.round(x / m) * m;
	}

	$.Drag.prototype.
	/**
	 * @function step
	 * @plugin jquerypp/event/drag/step
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquerypp/event/drag/step/step.js
	 * makes the drag move in steps of amount pixels.
	 * 
	 *     drag.step({x: 5}, $('foo'), "xy")
	 * 
	 * ## Demo
	 * 
	 * @demo jquerypp/event/drag/step/step.html
	 * 
	 * @param {number|Object} amount make the drag move the amount in pixels from the top-left of container.
	 * 
	 * If the amount is a `number`, the drag will move step-wise that number pixels in both 
	 * dimensions.  If it's an object like `{x: 20, y: 10}` the drag will move in steps 20px from
	 * left to right and 10px up and down.
	 * 
	 * @param {jQuery} [container] the container to move in reference to.  If not provided, the document is used.
	 * @param {String} [center] Indicates how to position the drag element in relationship to the container.
	 * 
	 *   -  If nothing is provided, places the top left corner of the drag element at
	 *      'amount' intervals from the top left corner of the container.  
	 *   -  If 'x' is provided, it centers the element horizontally on the top-left corner.
	 *   -  If 'y' is provided, it centers the element vertically on the top-left corner of the container.
	 *   -  If 'xy' is provided, it centers the element on the top-left corner of the container.
	 *   
	 * @return {jQuery.Drag} the drag object for chaining.
	 */
	step = function( amount, container, center ) {
		//on draws ... make sure this happens
		if ( typeof amount == 'number' ) {
			amount = {
				x: amount,
				y: amount
			}
		}
		container = container || $(document.body);
		this._step = amount;

		var styles = container.styles("borderTopWidth", "paddingTop", "borderLeftWidth", "paddingLeft");
		var top = parseInt(styles.borderTopWidth) + parseInt(styles.paddingTop),
			left = parseInt(styles.borderLeftWidth) + parseInt(styles.paddingLeft);

		this._step.offset = container.offsetv().plus(left, top);
		this._step.center = center;
		return this;
	};

	(function() {
		var oldPosition = $.Drag.prototype.position;
		$.Drag.prototype.position = function( offsetPositionv ) {
			//adjust required_css_position accordingly
			if ( this._step ) {
				var step = this._step,
					center = step.center && step.center.toLowerCase(),
					movingSize = this.movingElement.dimensionsv('outer'),
					lot = step.offset.top()- (center && center != 'x' ? movingSize.height() / 2 : 0),
					lof = step.offset.left() - (center && center != 'y' ? movingSize.width() / 2 : 0);

				if ( this._step.x ) {
					offsetPositionv.left(Math.round(lof + round(offsetPositionv.left() - lof, this._step.x)))
				}
				if ( this._step.y ) {
					offsetPositionv.top(Math.round(lot + round(offsetPositionv.top() - lot, this._step.y)))
				}
			}

			oldPosition.call(this, offsetPositionv)
		}
	})();

	return $;
})(module["jquery"], module["jquerypp/event/drag/core/core.js"], module["jquerypp/dom/styles/styles.js"]);// ## jquerypp/dom/within/within.js

module['jquerypp/dom/within/within.js'] = (function($) {
	// Checks if x and y coordinates are within a box with left, top, width and height
   var withinBox = function(x, y, left, top, width, height ){
        return (y >= top &&
                y <  top + height &&
                x >= left &&
                x <  left + width);
    } 
/**
 * @function jQuery.fn.within
 * @parent jQuery.within
 * @plugin jquerypp/dom/within
 * 
 * Returns all elements matching the selector that touch a given point:
 * 
 *     // get all elements that touch 200x200.
 *     $('*').within(200, 200);
 * 
 * @param {Number} left the position from the left of the page 
 * @param {Number} top the position from the top of the page
 * @param {Boolean} [useOffsetCache=false] cache the dimensions and offset of the elements.
 * @return {jQuery} a jQuery collection of elements whos area
 * overlaps the element position.
 */
$.fn.within= function(left, top, useOffsetCache) {
    var ret = []
    this.each(function(){
        var q = jQuery(this);

        if (this == document.documentElement) {
			return ret.push(this);
		}

	    // uses either the cached offset or .offset()
        var offset = useOffsetCache ? 
						$.data(this,"offsetCache") || $.data(this,"offsetCache", q.offset()) :
						q.offset();

        // Check if the given coordinates are within the area of the current element
	    var res =  withinBox(left, top,  offset.left, offset.top,
                                    this.offsetWidth, this.offsetHeight );

        if (res) {
	        // Add it to the results
			ret.push(this);
		}
    });
    
    return this.pushStack( $.unique( ret ), "within", left+","+top );
}


/**
 * @function jQuery.fn.withinBox
 * @parent jQuery.within
 *
 * Returns all elements matching the selector that have a given area in common:
 *
 *      $('*').withinBox(200, 200, 100, 100)
 *
 * @param {Number} left the position from the left of the page
 * @param {Number} top the position from the top of the page
 * @param {Number} width the width of the area
 * @param {Number} height the height of the area
 * @param {Boolean} [useOffsetCache=false] cache the dimensions and offset of the elements.
 * @return {jQuery} a jQuery collection of elements whos area
 * overlaps the element position.
 */
$.fn.withinBox = function(left, top, width, height, useOffsetCache){
	var ret = []
    this.each(function(){
        var q = jQuery(this);

        if(this == document.documentElement) return  ret.push(this);

	    // use cached offset or .offset()
        var offset = useOffsetCache ? 
			$.data(this,"offset") ||
			$.data(this,"offset", q.offset()) :
			q.offset();


        var ew = q.width(), eh = q.height(),
	        // Checks if the element offset is within the given box
	        res =  !( (offset.top > top+height) || (offset.top +eh < top) || (offset.left > left+width ) || (offset.left+ew < left));

        if(res)
            ret.push(this);
    });
    return this.pushStack( $.unique( ret ), "withinBox", $.makeArray(arguments).join(",") );
}

return $;
})(module["jquery"]);// ## jquerypp/dom/compare/compare.js

module['jquerypp/dom/compare/compare.js'] = (function($) {

/**
 * @function jQuery.fn.compare
 * @parent jQuery.compare
 *
 * Compare two elements and return a bitmask as a number representing the following conditions:
 *
 * - `000000` -> __0__: Elements are identical
 * - `000001` -> __1__: The nodes are in different documents (or one is outside of a document)
 * - `000010` -> __2__: #bar precedes #foo
 * - `000100` -> __4__: #foo precedes #bar
 * - `001000` -> __8__: #bar contains #foo
 * - `010000` -> __16__: #foo contains #bar
 *
 * You can check for any of these conditions using a bitwise AND:
 *
 *     if( $('#foo').compare($('#bar')) & 2 ) {
 *       console.log("#bar precedes #foo")
 *     }
 *
 * @param {HTMLElement|jQuery} element an element or jQuery collection to compare against.
 * @return {Number} A number representing a bitmask deatiling how the elements are positioned from each other.
 */

// See http://ejohn.org/blog/comparing-document-position/
$.fn.compare = function(element){ //usually
	try{
		// Firefox 3 throws an error with XUL - we can't use compare then
		element = element.jquery ? element[0] : element;
	}catch(e){
		return null;
	}

	// make sure we aren't coming from XUL element
	if (window.HTMLElement) {
		var s = HTMLElement.prototype.toString.call(element)
		if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]' || s === '[object Window]') {
			return null;
		}
	}

	if(this[0].compareDocumentPosition){
		// For browsers that support it, use compareDocumentPosition
		// https://developer.mozilla.org/en/DOM/Node.compareDocumentPosition
		return this[0].compareDocumentPosition(element);
	}

	// this[0] contains element
	if(this[0] == document && element != document) return 8;

	var number =
			// this[0] contains element
			(this[0] !== element && this[0].contains(element) && 16) +
			// element contains this[0]
			(this[0] != element && element.contains(this[0]) && 8),
		docEl = document.documentElement;

	// Use the sourceIndex
	if(this[0].sourceIndex){
		// this[0] precedes element
		number += (this[0].sourceIndex < element.sourceIndex && 4)
		// element precedes foo[0]
		number += (this[0].sourceIndex > element.sourceIndex && 2)
		// The nodes are in different documents
		number += (this[0].ownerDocument !== element.ownerDocument ||
			(this[0] != docEl && this[0].sourceIndex <= 0 ) ||
			(element != docEl && element.sourceIndex <= 0 )) && 1
	}

	return number;
}

return $;
})(module["jquery"]);// ## jquerypp/event/drop/drop.js

module['jquerypp/event/drop/drop.js'] = (function($){
	var event = $.event;
	/**
	 * @add jQuery.event.special
	 */
	var eventNames = [
	/**
	 * @attribute dropover
	 * @parent jQuery.event.drop
	 * 
	 * `dropover` is triggered when a [jQuery.event.drag drag] is first moved onto this
	 * drop element.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second and a
	 * [jQuery.Drop] as the third parameter.
	 * This event can be used to highlight the element when a drag is moved over it:
	 *
	 *      $('.droparea').on('dropover', function(ev, drop, drag) {
	 *          $(this).addClass('highlight');
	 *      });
	 */
	"dropover",
	/**
	 * @attribute dropon
	 * @parent jQuery.event.drop
	 * 
	 * `dropon` is triggered when a drag is dropped on a drop element.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second and a
	 * [jQuery.Drop] as the third parameter.
	 *
	 *      $('.droparea').on('dropon', function(ev, drop, drag) {
	 *          $(this).html('Dropped: ' + drag.element.text());
	 *      });
	 */
	"dropon",
	/**
	 * @attribute dropout
	 * @parent jQuery.event.drop
	 * 
	 * `dropout` is called when a drag is moved out of this drop element.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second and a
	 * [jQuery.Drop] as the third parameter.
	 *
	 *      $('.droparea').on('dropover', function(ev, drop, drag) {
	 *          // Remove the drop element highlight
	 *          $(this).removeClass('highlight');
	 *      });
	 */
	"dropout",
	/**
	 * @attribute dropinit
	 * @parent jQuery.event.drop
	 * 
	 * `dropinit` is called when a drag motion starts and the drop elements are initialized.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second and a
	 * [jQuery.Drop] as the third parameter.
	 * Calling [jQuery.Drop.prototype.cancel drop.cancel()] prevents the element from
	 * being dropped on:
	 *
	 *      $('.droparea').on('dropover', function(ev, drop, drag) {
	 *          if(drag.element.hasClass('not-me')) {
	 *            drop.cancel();
	 *          }
	 *      });
	 */
	"dropinit",
	/**
	 * @attribute dropmove
	 * @parent jQuery.event.drop
	 * 
	 * `dropmove` is triggered repeatedly when a drag is moved over a drop
	 * (similar to a mousemove).
	 * The event handler gets an instance of [jQuery.Drag] passed as the second and a
	 * [jQuery.Drop] as the third parameter.
	 *
	 *      $('.droparea').on('dropmove', function(ev, drop, drag) {
	 *          $(this).html(drag.location.x() + '/' + drag.location.y());
	 *      });
	 */
	"dropmove",
	/**
	 * @attribute dropend
	 * @parent jQuery.event.drop
	 * 
	 * `dropend` is called when the drag motion is done for this drop element.
	 * The event handler gets an instance of [jQuery.Drag] passed as the second and a
	 * [jQuery.Drop] as the third parameter.
	 *
	 *
	 *      $('.droparea').on('dropend', function(ev, drop, drag) {
	 *          // Remove the drop element highlight
	 *          $(this).removeClass('highlight');
	 *      });
	 */
	"dropend"];
	
	/**
	 * @class jQuery.Drop
	 * @parent jQuery.event.drop
	 * @plugin jquerypp/event/drop
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquerypp/event/drop/drop.js
	 * @test jquerypp/event/drag/qunit.html
	 *
	 * The `jQuery.Drop` constructor is never called directly but an instance is passed to the
	 * to the `dropinit`, `dropover`, `dropmove`, `dropon`, and `dropend` event handlers as the
	 * third argument (the second will be the [jQuery.Drag]):
	 *
	 *      $('#dropper').on('dropover', function(el, drop, drag) {
	 *          // drop -> $.Drop
	 *          // drag -> $.Drag
	 *      });
	 */
	$.Drop = function(callbacks, element){
		$.extend(this,callbacks);
		this.element = $(element);
	}
	// add the elements ...
	$.each(eventNames, function(){
			event.special[this] = {
				add: function( handleObj ) {
					//add this element to the compiles list
					var el = $(this), current = (el.data("dropEventCount") || 0);
					el.data("dropEventCount",  current+1   )
					if(current==0){
						$.Drop.addElement(this);
					}
				},
				remove: function() {
					var el = $(this), current = (el.data("dropEventCount") || 0);
					el.data("dropEventCount",  current-1   )
					if(current<=1){
						$.Drop.removeElement(this);
					}
				}
			}
	});
	
	$.extend($.Drop,{
		/**
		 * @static
		 */
		lowerName: "drop",
		_rootElements: [], //elements that are listening for drops
		_elements: $(),    //elements that can be dropped on
		last_active: [],
		endName: "dropon",
		// adds an element as a 'root' element
		// this element might have events that we need to respond to
		addElement: function( el ) {
			// check other elements
			for(var i =0; i < this._rootElements.length ; i++  ){
				if(el ==this._rootElements[i]) return;
			}
			this._rootElements.push(el);
		},
		removeElement: function( el ) {
			 for(var i =0; i < this._rootElements.length ; i++  ){
				if(el == this._rootElements[i]){
					this._rootElements.splice(i,1)
					return;
				}
			}
		},
		/**
		* @hide
		* For a list of affected drops, sorts them by which is deepest in the DOM first.
		*/ 
		sortByDeepestChild: function( a, b ) {
			// Use jQuery.compare to compare two elements
			var compare = a.element.compare(b.element);
			if(compare & 16 || compare & 4) return 1;
			if(compare & 8 || compare & 2) return -1;
			return 0;
		},
		/**
		 * @hide
		 * Tests if a drop is within the point.
		 */
		isAffected: function( point, moveable, responder ) {
			return ((responder.element != moveable.element) && (responder.element.within(point[0], point[1], responder._cache).length == 1));
		},
		/**
		 * @hide
		 * Calls dropout and sets last active to null
		 * @param {Object} drop
		 * @param {Object} drag
		 * @param {Object} event
		 */
		deactivate: function( responder, mover, event ) {
			mover.out(event, responder)
			responder.callHandlers(this.lowerName+'out',responder.element[0], event, mover)
		}, 
		/**
		 * @hide
		 * Calls dropover
		 * @param {Object} drop
		 * @param {Object} drag
		 * @param {Object} event
		 */
		activate: function( responder, mover, event ) { //this is where we should call over
			mover.over(event, responder)
			responder.callHandlers(this.lowerName+'over',responder.element[0], event, mover);
		},
		move: function( responder, mover, event ) {
			responder.callHandlers(this.lowerName+'move',responder.element[0], event, mover)
		},
		/**
		 * `$.Drop.compile()` gets all elements that are droppable and adds them to a list.
		 * 
		 * This should be called if and when new drops are added to the page
		 * during the motion of a single drag.
		 * 
		 * This is called by default when a drag motion starts.
		 * 
		 * ## Use
		 * 
		 * After adding an element or drop, call compile.
		 * 
		 *      $("#midpoint").bind("dropover",function(){
		 * 		    // when a drop hovers over midpoint,
		 *          // make drop a drop.
		 * 		    $("#drop").bind("dropover", function(){
		 * 			
		 * 		    });
		 * 		    $.Drop.compile();
		 * 	    });
		 */
		compile: function( event, drag ) {
			// if we called compile w/o a current drag
			if(!this.dragging && !drag){
				return;
			}else if(!this.dragging){
				this.dragging = drag;
				this.last_active = [];
			}
			var el, 
				drops, 
				selector, 
				dropResponders, 
				newEls = [],
				dragging = this.dragging;
			
			// go to each root element and look for drop elements
			for(var i=0; i < this._rootElements.length; i++){ //for each element
				el = this._rootElements[i]
				
				// gets something like {"": ["dropinit"], ".foo" : ["dropover","dropmove"] }
				var drops = $.event.findBySelector(el, eventNames)

				// get drop elements by selector
				for(selector in drops){ 
					dropResponders = selector ? jQuery(selector, el) : [el];
					
					// for each drop element
					for(var e= 0; e < dropResponders.length; e++){ 
						
						// add the callbacks to the element's Data
						// there already might be data, so we merge it
						if( this.addCallbacks(dropResponders[e], drops[selector], dragging) ){
							newEls.push(dropResponders[e])
						};
					}
				}
			}
			// once all callbacks are added, call init on everything ...
			this.add(newEls, event, dragging)
		},

		// adds the drag callbacks object to the element or merges other callbacks ...
		// returns true or false if the element is new ...
		// onlyNew lets only new elements add themselves
		addCallbacks : function(el, callbacks, onlyNew){
			var origData = $.data(el,"_dropData");
			if(!origData){
				$.data(el,"_dropData", new $.Drop(callbacks, el));
				return true;
			}else if(!onlyNew){
				var origCbs = origData;
				// merge data
				for(var eventName in callbacks){
					origCbs[eventName] = origCbs[eventName] ?
							origCbs[eventName].concat(callbacks[eventName]) :
							callbacks[eventName];
				}
				return false;
			}
		},
		// calls init on each element's drags. 
		// if its cancelled it's removed
		// adds to the current elements ...
		add: function( newEls, event, drag , dragging) {
			var i = 0,
				drop;
			
			while(i < newEls.length){
				drop = $.data(newEls[i],"_dropData");
				drop.callHandlers(this.lowerName+'init', newEls[i], event, drag)
				if(drop._canceled){
					newEls.splice(i,1)
				}else{
					i++;
				}
			}
			this._elements.push.apply(this._elements, newEls)
		},
		show: function( point, moveable, event ) {
			var element = moveable.element;
			if(!this._elements.length) return;
			
			var respondable, 
				affected = [], 
				propagate = true, 
				i = 0, 
				j, 
				la, 
				toBeActivated, 
				aff, 
				oldLastActive = this.last_active,
				responders = [],
				self = this,
				drag;
				
			// what's still affected ... we can also move element out here
			while( i < this._elements.length){
				drag = $.data(this._elements[i],"_dropData");
				
				if (!drag) {
					this._elements.splice(i, 1)
				}
				else {
					i++;
					if (self.isAffected(point, moveable, drag)) {
						affected.push(drag);
					}
				}
			}

			// we should only trigger on lowest children
			affected.sort(this.sortByDeepestChild);
			event.stopRespondPropagate = function(){
				propagate = false;
			}
			
			toBeActivated = affected.slice();

			// all these will be active
			this.last_active = affected;
			
			// deactivate everything in last_active that isn't active
			for (j = 0; j < oldLastActive.length; j++) {
				la = oldLastActive[j];
				i = 0;
				while((aff = toBeActivated[i])){
					if(la == aff){
						toBeActivated.splice(i,1);break;
					}else{
						i++;
					}
				}
				if(!aff){
					this.deactivate(la, moveable, event);
				}
				if(!propagate) return;
			}
			for(var i =0; i < toBeActivated.length; i++){
				this.activate(toBeActivated[i], moveable, event);
				if(!propagate) return;
			}

			// activate everything in affected that isn't in last_active
			for (i = 0; i < affected.length; i++) {
				this.move(affected[i], moveable, event);
				
				if(!propagate) return;
			}
		},
		end: function( event, moveable ) {
			var la, 
			    endName = this.lowerName+'end',
                            onEvent = $.Event(this.endName, event),
			    dropData;
			
			// call dropon
			// go through the actives ... if you are over one, call dropped on it
			for(var i = 0; i < this.last_active.length; i++){
				la = this.last_active[i]
				if( this.isAffected(event.vector(), moveable, la)  && la[this.endName]){
					la.callHandlers(this.endName, null, onEvent, moveable);
				}
                                
                                if (onEvent.isPropagationStopped()) {
                                    break;
                                }
			}
			// call dropend
			for(var r =0; r<this._elements.length; r++){
				dropData = $.data(this._elements[r],"_dropData");
				dropData && dropData.callHandlers(endName, null, event, moveable);
			}

			this.clear();
		},
		/**
		 * Called after dragging has stopped.
		 * @hide
		 */
		clear: function() {
		  this._elements.each(function(){
			 // remove temporary drop data
		  	$.removeData(this,"_dropData")
		  })
		  this._elements = $();
		  delete this.dragging;
		}
	})
	$.Drag.responder = $.Drop;
	
	$.extend($.Drop.prototype,{
		/**
		 * @prototype
		 */
		callHandlers: function( method, el, ev, drag ) {
			var length = this[method] ? this[method].length : 0
			for(var i =0; i < length; i++){
				this[method][i].call(el || this.element[0], ev, this, drag)
			}
		},
		/**
		 * `drop.cache(value)` sets the drop to cache positions of draggable elements.
		 * This should be called on `dropinit`. For example:
		 *
		 *      $('#dropable').on('dropinit', function( el, ev, drop ) {
		 *          drop.cache();
		 *      });
		 *
		 * @param {Boolean} [value=true] Whether to cache drop elements or not.
		 */
		cache: function( value ) {
			this._cache = value != null ? value : true;
		},
		/**
		 * `drop.cancel()` prevents this drop from being dropped on.
		 *
		 *      $('.droparea').on('dropover', function(ev, drop, drag) {
		 *          if(drag.element.hasClass('not-me')) {
		 *            drop.cancel();
		 *          }
		 *      });
		 */
		cancel: function() {
			this._canceled = true;
		}
	});

	return $;
})(module["jquery"], module["jquerypp/event/drag/core/core.js"], module["jquerypp/dom/within/within.js"], module["jquerypp/dom/compare/compare.js"]);// ## jquerypp/event/drag/scroll/scroll.js

module['jquerypp/event/drag/scroll/scroll.js'] = (function($) { //needs drop to determine if respondable

/**
 * @add jQuery.Drag.prototype
 */
$.Drag.prototype.
	/**
	 * @plugin jquerypp/event/drag/scroll
	 * @download  http://jmvcsite.heroku.com/pluginify?plugins[]=jquerypp/event/drag/scroll/scroll.js
	 * 
	 * `drag.scrolls(elements, [options])` scroll elements with 
	 * a scroll bar as the drag moves to borders.
	 * 
	 * The following sets up the drag motions to scroll `#todos` and the window.  Scrolling will
	 * start 50px away from a boundary and the speed will increase to 50px of scroll every 15ms.
	 * 
	 *     $('#todos').on(".todo","draginit", function(ev, drag){
	 *       drag.scrolls($('#todos').add(window), {
	 *         distance : 50,
	 *         delta : function(diff) { return (50 - diff) / 2},
	 *         direction : "y"
	 *       })
	 *     })
	 * 
	 * @param {jQuery} elements an array of elements to scroll.  The window can be in this array.
	 * @param {Object} [options] changes the default settings.
	 * 
	 *   - `distance` {number} 30 - how many pixels away from a boundry where we start scrolling
	 *   - `delta(diff)` {Function} - returns how far we should scroll.  It is passed how many pixels the cursor is
	 *     from the boundry.
	 *   - `direction` {String} - direction scrolling should happen.  "xy" is the default.
	 */
	scrolls = function(elements, options){
		var elements = $(elements);
		
		for(var i = 0 ; i < elements.length; i++){
			this.constructor.responder._elements.push( elements.eq(i).data("_dropData", new $.Scrollable(elements[i], options) )[0] )
		}
	},
	
$.Scrollable = function(element, options){
	this.element = jQuery(element);
	this.options = $.extend({
		// when  we should start scrolling
		distance : 30,
		// how far we should move
		delta : function(diff, distance){
			return (distance - diff) / 2;
		},
		direction: "xy"
	}, options);
	this.x = this.options.direction.indexOf("x") != -1;
	this.y = this.options.direction.indexOf("y") != -1;
}
$.extend($.Scrollable.prototype,{
	init: function( element ) {
		this.element = jQuery(element);
	},
	callHandlers: function( method, el, ev, drag ) {
		this[method](el || this.element[0], ev, this, drag)
	},
	dropover: function() {
		
	},
	dropon: function() {
		this.clear_timeout();
	}, 
	dropout: function() {
		this.clear_timeout();
	},
	dropinit: function() {
		
	},
	dropend: function() {},
	clear_timeout: function() {
		if(this.interval){
			clearTimeout(this.interval)
			this.interval = null;
		}
	},
	distance: function( diff ) {
		return (30 - diff) / 2;
	},
	dropmove: function( el, ev, drop, drag ) {
		
		//if we were about to call a move, clear it.
		this.clear_timeout();
		
		//position of the mouse
		var mouse = ev.vector(),
		
		//get the object we are going to get the boundries of
			location_object = $(el == document.documentElement ? window : el),
		
		//get the dimension and location of that object
			dimensions = location_object.dimensionsv('outer'),
			position = location_object.offsetv(),
		
		//how close our mouse is to the boundries
			bottom = position.y()+dimensions.y() - mouse.y(),
			top = mouse.y() - position.y(),
			right = position.x()+dimensions.x() - mouse.x(),
			left = mouse.x() - position.x(),
		
		//how far we should scroll
			dx =0, dy =0,
			distance =  this.options.distance;

		//check if we should scroll
		if(bottom < distance && this.y) {
			dy = this.options.delta(bottom,distance);
		} else if(top < distance && this.y) {
			dy = -this.options.delta(top,distance);
		}

		if(right < distance && this.options && this.x) {
			dx = this.options.delta(right,distance);
		} else if(left < distance && this.x) {
			dx = -this.options.delta(left,distance);
		}
		
		//if we should scroll
		if(dx || dy){
			//set a timeout that will create a mousemove on that object
			var self = this;
			this.interval =  setTimeout( function(){
				self.move($(el), drag.movingElement, dx, dy, ev, ev.clientX, ev.clientY, ev.screenX, ev.screenY)
			},15)
		}
	},
	/**
	 * Scrolls an element then calls mouse a mousemove in the same location.
	 * @hide
	 */
	move: function( scroll_element, drag_element, dx, dy, ev/*, x,y,sx, sy*/ ) {
		scroll_element.scrollTop( scroll_element.scrollTop() + dy);
		scroll_element.scrollLeft(scroll_element.scrollLeft() + dx);
		
		drag_element.trigger(
			$.event.fix({type: "mousemove", 
					 clientX: ev.clientX, 
					 clientY: ev.clientY, 
					 screenX: ev.screenX, 
					 screenY: ev.screenY,
					 pageX:   ev.pageX,
					 pageY:   ev.pageY}))
		//drag_element.synthetic('mousemove',{clientX: x, clientY: y, screenX: sx, screenY: sy})
	}
})

return $;
})(module["jquery"], module["jquerypp/event/drop/drop.js"]);// ## jquerypp/event/drag/drag.js

module['jquerypp/event/drag/drag.js'] = (function( $ ) {
		return $;
})(module["jquery"], module["jquerypp/event/drag/core/core.js"], module["jquerypp/event/drag/step/step.js"], module["jquerypp/event/drag/limit/limit.js"], module["jquerypp/event/drag/scroll/scroll.js"]);// ## canui/resizable/resizable.js

module['canui/resizable/resizable.js'] = (function ($) {
	$.support.correctOverflow = false;

	$(function () {
		var container = $('<div style="height: 18px; padding: 0; margin: 0">' +
			'<div style="height: 20px; padding: 0; margin: 0"></div></div>')
			.appendTo(document.body)
		$.support.correctOverflow = container.height() == 18;
		container.remove();
		container = null;
	});

	/**
	 * @class can.ui.Resize
	 * @parent canui
	 * @test canui/resize/funcunit.html
	 *
	 * @description A lightweight resize widget
	 *
	 * A lightweight resize widget
	 *
	 * ## Use
	 *
	 * Create a new resizable control instance:
	 *
	 *     new can.ui.Resize($('#resize'));
	 *
	 * This will take the jQuery object and allow you to
	 * resize it on the bottom, right, and bottom right
	 * of the element. If you want to choose which side
	 * you can resize it from, use the handles option:
	 *
	 *     new can.ui.Resize($('#resize'), {
	 *       handles: ['s']
	 *     });
	 *
	 * This will allow your content to be resizable only
	 * by dragging the bottom of the element. You can use any
	 * combination, and each direction corresponds to a side
	 * of the element:
	 *
	 * - s: bottom of the element
	 * - e: right side of the element
	 * - se: bottom right corner of the element
	 *
	 * You can also constrain how big or how small you want to
	 * allow the content to be with the min/max height/width
	 * options:
	 *
	 *     new can.ui.Resize($('#resize'), {
	 *       maxWidth: 300,
	 *       maxHeight: 300,
	 *       minWidth: 100,
	 *       minHeight: 200,
	 *     });
	 *
	 * This will limit the height of the resizable widget to between
	 * 200px and 300px and the width of the widget to between 100px
	 * and 300px.
	 *
	 * Similarly, it is also possible to keep the proportion of the height and width
	 * equal as you resize the element, this is done with the aspectRatio
	 * option:
	 *
	 *     new can.ui.Resize($('#resize'), {
	 *       aspectRatio: 16 / 9
	 *     });
	 *
	 * This will keep the size of your resizable widget with the aspect ratio
	 * of standard HD videos. This could come in handly if you are resizing
	 * a video element. This is also helpful if your widget resizes an image
	 * and you wish to keep the proportions of the image the same while resizing.
	 *
	 * You can contrain when resizing will take place on your widget. This is
	 * useful when a user might inadvertently start resizing the element. There are
	 * two ways to go about this:
	 *
	 *     new can.ui.Resize($('#resize'), {
	 *       delay: 2000,
	 *       distance: 10
	 *     });
	 *
	 * With the delay and distance options set, resizing cannot happen until
	 * two seconds have passed and you drag at least 10 pixels away from where you
	 * moused down at. Resizing will not occure until both conditions are met.
	 *
	 * It is possible to both style and hide the handles of the resizable widget
	 * You can choose to either style the default handle class, ui-resizable-handle
	 * which has the following styles applied to it be default:
	 *
	 *     .ui-resizable-handle {
	 *       display:block;
	 *       font-size:0.1px;
	 *       position:absolute;
	 *       z-index: 1000;
	 *     }
	 *
	 * You can also style specific handles with the ui-resizable-{direction name}
	 * classes. By default these are:
	 *     .ui-resizable-s {
	 *       bottom:-3px;
	 *       cursor:s-resize;
	 *       height:7px;
	 *       left:0;
	 *       width:100%;
	 *     }
	 *
	 *     .ui-resizable-e {
	 *       cursor:e-resize;
	 *       height:100%;
	 *       right:-3px;
	 *       top:0;
	 *       width:7px;
	 *     }
	 *
	 *     .ui-resizable-se {
	 *       bottom:0px;
	 *       cursor:se-resize;
	 *       height:12px;
	 *       right:0px;
	 *       width:12px;
	 *       background-color: #ddddff;
	 *     }
	 *
	 * Finally, you can choose to not have these handles appear until you
	 * move your mouse into the widget, this is done as:
	 *
	 *     new can.ui.Resize($('#resize'), {
	 *       autoHide: true
	 *     });
	 *
	 * With autoHide set to true, the handles will not appear on the screen until
	 * your mouse enters your widget, and will disappear as soon as your mouse
	 * leaves the widget.
	 *
	 * ## Demo
	 * @demo canui/resize/resize.html
	 *
	 * @param {Object} [options] Values to configure the behavior of resize:
	 *
	 * - `aspectRatio` - `{Number}` - The proportional relationship between the widget's width and its height
	 * - `autoHide` - `{Boolean}` - If `true`, the resize handles will not appear unless the
	 * mouse is inside the widget
	 * - `delay`  - `{Number}` - How long, in milliseconds, to wait until resizing starts
	 * - `distance` - `{Number}` - How far, in pixels, to wait until resizing starts
	 * - `handles` - `{Array}` - Where the handles should be in relation to the widget itself
	 * - `maxHeight` - `{Number}` - The maxiumum height the widget can be
	 * - `maxWidth` - `{Number}` - The maxiumum width the widget can be
	 * - `minHeight` - `{Number}` - The minimum height the widget can be
	 * - `minWidth` - `{Number}` - The minimum width the widget can be
	 * - `handleClassName` - `{String}` - A class name to use for the resizing handles.
	 *
	 * @return {can.ui.Resize}
	 */
	can.Control('can.ui.Resizable', {
		pluginName : 'resizable',
		defaults : {
			aspectRatio : false,
			autoHide : false,
			delay : 0,
			distance : 0,
			handles : ['e', 's', 'se'],
			maxHeight : null,
			maxWidth : null,
			minHeight : 10,
			minWidth : 10,
			handleClassName : 'ui-resizable-handle'
		}
	}, {
		directionInfo : {
			's' : {
				limit : 'vertical',
				dim : 'height'
			},
			'e' : {
				limit : 'horizontal',
				dim : 'width'
			},
			'se' : {

			}
		},

		setup : function (el, options) {
			var diff = this._wrap($(el))[0];
			can.Control.prototype.setup.call(this, diff, options)

			this.original = $(el);
			if (diff != $(el)[0]) {
				this.original = $(el).fills({all : true}); //set to fill
			}
		},

		init : function (el, options) {
			this.element.prepend($.map(this.options.handles, can.proxy(function (dir) {
				return '<div class="ui-resizable-' + [dir, this.options.handleClassName].join(' ') + '"/>';
			}, this)).join(''));


			this.options.autoHide && this.element.find('.ui-resizable-se').hide();
		},

		_wrap : function (el) {
			var ret = [];
			el.each(function () {
				if (this.nodeName.match(/canvas|textarea|input|select|button|img/i)) {
					var $el = $(this),
						$org = $el
					//Opera fix for relative positioning
					if (/relative/.test($el.css('position')) && $.browser.opera)
						$el.css({ position : 'relative', top : 'auto', left : 'auto' });

					//Create a wrapper element and set the wrapper to the new current internal element
					var position = $el.css('position')
					$el.wrap(
						$('<div class="ui-wrapper"></div>').css({
							position : position == 'static' ? "relative" : position,
							width : $el.outerWidth(),
							height : $el.outerHeight(),
							top : $el.css('top'),
							left : $el.css('left')
						})
					);

					//Overwrite the original $el
					$el = $el.parent()

					$elIsWrapper = true;

					//Move margins to the wrapper
					$el.css({
						marginLeft : $org.css("marginLeft"),
						marginTop : $org.css("marginTop"),
						marginRight : $org.css("marginRight"),
						marginBottom : $org.css("marginBottom")
					});

					$org.css({
						marginLeft : "0px",
						marginTop : "0px",
						marginRight : "0px",
						marginBottom : "0px"
					});

					ret.push($el)
				} else {
					ret.push(this)
				}
			});

			return $(ret);
		},

		_getDirection : function (el) {
			return el[0].className.match(/ui-resizable-(se|s|e)/)[1]
		},

		'.{handleClassName} dragdown' : function (el, ev, drag) {
			drag.distance(this.options.distance);
			this.delayMet = !this.options.delay;

			if (!this.delayMet) {
				this.dragTimeout = setTimeout(can.proxy(function () {
					this.delayMet = true;
				}, this), this.options.delay);
			}
		},

		mouseenter : function () {
			this.options.autoHide && this.element.find('.ui-resizable-se').show();
		},

		mouseleave : function () {
			this.options.autoHide && this.element.find('.ui-resizable-se').hide();
		},

		'.{handleClassName} draginit' : function (el, ev, drag) {
			this.margin = this.element.offsetv().plus(this.element.dimensionsv('outer')).minus(el.offsetv());
			this.overflow = $.css(this.element[0], 'overflow');

			if (!$.support.correctOverflow && this.overflow == 'visible') {
				this.element.css('overflow', 'hidden');
			}

			var direction = this._getDirection(el);

			ev.stopPropagation();

			if (this.directionInfo[direction].limit) {
				drag[this.directionInfo[direction].limit]()
			}
			this.original.trigger('resizestart', arguments);
		},

		'.{handleClassName} dragmove' : function (el, ev, drag) {
			ev.preventDefault();
			if (this.delayMet) {
				this._move(el, ev, drag);
				this.original.trigger('resize', arguments);
			}
		},

		_move : function (el, ev, drag) {
			var direction = this._getDirection(el);

			if (direction.indexOf('s') > -1) {
				this._smallerMove(drag.location.y(),
					this.element.offset().top,
					this.options.minHeight,
					this.options.maxHeight,
					'outerHeight',
					this.options.minWidth,
					this.options.maxWidth,
					'outerWidth',
					this.margin.y(),
					this.options.aspectRatio)
			}

			if (direction.indexOf('e') > -1) {
				this._smallerMove(drag.location.x(),
					this.element.offset().left,
					this.options.minWidth,
					this.options.maxWidth,
					'outerWidth',
					this.options.minHeight,
					this.options.maxHeight,
					'outerHeight',
					this.margin.x(),
					1 / this.options.aspectRatio)
			}

			this.element.resize();
		},

		_smallerMove : function (end, start, min, max, outerFunc, oMin, oMax, oOuterFunc, margin, aspectRatio) {
			var outer = end - start;
			outer = Math.max(outer, min);

			if (max) {
				outer = Math.min(outer, max);
			}

			this.element[outerFunc](outer + margin);

			if (aspectRatio) {
				var otherOuter = outer * aspectRatio;
				otherOuter = Math.max(otherOuter, oMin);

				if (oMax) {
					otherOuter = Math.min(otherOuter, oMax);
				}
				this.element[oOuterFunc](otherOuter);
			}
		},

		'.{handleClassName} dragend' : function (el, ev, drag) {
			if (!$.support.correctOverflow && this.overflow == 'visible') {
				this.element.css('overflow', 'visible')
			}
			this.original.trigger('resizestop', arguments)
		},

		destroy : function () {
			this.element.find('.' + this.options.handleClassName).remove();
			can.Control.prototype.destroy.apply(this, arguments);
		}
	})
})(module["jquery"], module["can/control/control.js"], module["jquerypp/event/drag/drag.js"], module["jquerypp/dom/dimensions/dimensions.js"], module["canui/fills/fills.js"], module["can/control/plugin/plugin.js"]);

window.define = module._define;

window.module = module._orig;
(function($) {
	$.fn.transfer = function(options) {
		var EVENT_NAME = "transferChange";

		var defaults = {
			to : '',// selector of second multiple select box
			searchId : '',// id of search text, provide only if you want to
							// enable searching
			dblClick : false,// true or false, activates double click
								// transfer
			searchText : 'Displaying {count} of matching {keyword}',
			searchTextId : '',// id to show search message, ex- matching 2
								// records
			addId : '',// add buttong id
			removeId : '', // remove button id
			addAllId : '', // add all button id
			removeAllId : '',// remove all button id
			tClass : 'added'// class to be added when option tranfered to
							// another select.
		};

		var o = $.extend(defaults, options);

		return this.each(function() {
			o = $.extend({}, o, {
				obj : $(this)
			});

			if (o.to !== '') {
				if (o.addId != '') {
					var cTransfer = function() {

						var getSelected = $('option:selected:not(".' + o.tClass + '")', o.obj);
						getSelected.addClass(o.tClass).attr({
							'selected' : ''
						}).clone().appendTo(o.to);
						if (o.dblClick === true) {
							$('option', o.to).dblclick(function() {
								cRemove();
							})
						}
						
						
					};
					var cRemove = function() {
						var getSelected2 = $('' + o.to + ' option:selected')

						getSelected2.each(function() {
							$("option[value='" + $(this).attr('value') + "']", o.obj).removeClass(o.tClass);
						});
						getSelected2.remove();
						$(this).trigger(EVENT_NAME);
					}
					var addAll = function(o) {
						var getAll = $('option:not(".hidden,.' + o.tClass + '")', o.obj);
						getAll.addClass(o.tClass).attr({
							'selected' : ''
						}).clone().appendTo(o.to, o.obj);
					}
					$(o.addId).click(function() {
						cTransfer();
						o.obj.trigger(EVENT_NAME);
						
					});
				}
				if (o.removeId != '') {
					$(o.removeId).click(function() {
						cRemove();
						o.obj.trigger(EVENT_NAME);
					});
				}
				if (o.dblClick === true) {
					$('option', o.obj).dblclick(function() {
						cTransfer();
						
						o.obj.trigger(EVENT_NAME);
						
					})
				}
				if (o.addAllId != '') {

					$(o.addAllId).click(function() {
						addAll(o);
						
						o.obj.trigger(EVENT_NAME);
					});
				}
				if (o.removeAllId != '') {
					$(o.removeAllId).click(function() {
						var getAll2 = $('option', o.to);
						var getAll = $('option', o.obj);
						getAll.removeClass(o.tClass);
						getAll2.remove();
						
						o.obj.trigger(EVENT_NAME);
					});
				}
				if (o.searchId != '') {
					$(o.searchId).keyup(function() {
						var text = $(this).val();

						$('option', o.obj).each(function() {

							if ($(this).text().search(new RegExp(text, "i")) < 0) {
								$(this).addClass("hidden");
							} else {
								$(this).removeClass("hidden");
							}
						})
						if (o.searchText != '') {
							var searchText = o.searchText.replace('{count}', $('option:not(".hidden")', o.obj).length).replace('{keyword}', '"' + text + '"');
							;
							if (text == '') {
								$(o.searchTextId).text('');
							} else {

								$(o.searchTextId).text(searchText);
							}
						}

					});

				}

			}
			return this;
		});
	};
})(jQuery);
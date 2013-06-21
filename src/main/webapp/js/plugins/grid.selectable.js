/*
 * Grid Selectable
 *
 * Depends on:
 *  jquery.ui.widget.js
 *  jquery.ui.selectable.js
 */
(function( $ ) {

	$.widget("ui.gridSelectable", {
		options: {
			selected: [],
			selectedIndex : [], //contains visible content's index in result set after applying filter and sorting
			onSelectRow: null
		},
		_create: function() {
			var that = this,
				selected = this.options.selected;
			var grid = this.grid = this.element.data("ui-grid");
			this.source = grid.options.source;
			
			this.element.selectable({
				filter: "tbody > tr",
				start: function( event, ui ) {
					if ( !event.metaKey ) {
						$.observable( selected ).remove( 0, selected.length );
						that.options.selectedIndex.splice(0, that.options.selectedIndex.length);
					}
				},
				selecting: function( event, ui ) {
					var item = $( ui.selecting ).data( "grid-item" );
					if ( $.inArray( item, selected ) === -1 ) {
						$.observable( selected ).insert(0, item );
						
						
						if(that._contains(item) != -1)
						that.options.selectedIndex.push(that._contains(item));
						
						that.source.option("selectedIndex", (that.options.selectedIndex )?that.options.selectedIndex.sort():[] );
						
						
						if(typeof that.options.onSelectRow == 'function'){
							that.options.onSelectRow();
						} 
						
					}
				},
				unselecting: function( event, ui ) {
					var item = $( ui.unselecting ).data( "grid-item" );
					if ( $.inArray( item, selected ) !== -1 ) {
						$.observable( selected ).remove( $.inArray( item, selected ) );
						
						if(that._contains(item) != -1){
							that.options.selectedIndex.splice(that._contains(item),1);
							that.source.option("selectedIndex", (that.options.selectedIndex )?that.options.selectedIndex.sort():[] );
						}
					}
					
				}
			});
			this.element.bind( "gridrefresh", function() {
				that.element.find( "tbody > tr" ).each(function() {
					if ( $.inArray($(this).data("grid-item"), selected) !== -1 ) {
						$( this ).addClass( "ui-selected" );
					}
				});
			});
		},
		_contains: function (inputObj){
			var found = true;
			for(i in this.source.result  ){
				found = true;
				var v = this.source.result[i];
				for(i2 in inputObj){
					if(found && v[i2] != inputObj[i2]){
						found = false;
						break;
					}
				};
				
				if(found ){
				 
					return parseInt(i);
				}
			};
			return -1;
		},
		destroy: function() {
			this.element.selectable( "destroy" );
		}
	});

}( jQuery ));

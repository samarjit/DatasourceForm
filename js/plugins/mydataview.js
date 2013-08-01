$.widget ( "ui.MyDataview", $.ui.dataview, {
				// all dataview implementations share a common event prefix
				widgetEventPrefix: "dataview",
				options: {
					screenName: 'NoScreenConfigured',
					paging: {
						limit: 10
					},
					resource: "../rest/common/page2",
					source: function( request, response ) {
						$.ajax({
							url: request.resource,
							dataType: "json",
							jsonpCallback: "jsonFlickrApi",
							data: {
								format: "json",
								screenName: request.screenName,
								bulkcmd: "gridonload",
								submitdata: JSON.stringify({}),
								method: "flickr.photos.search",
								tags: JSON.stringify(request.filter),
								sort: request.sort[0],
								per_page: request.paging.limit,
								page: request.page
							},
							success: function( data ) {
								var result = $.map( data.data.formpagination, function( photo ) {
									return photo/* {
										src: format("http://farm${farm}.static.flickr.com/${server}/${id}_${secret}_m.jpg", photo),
										href: format("http://www.flickr.com/photos/${owner}/${id}/", photo)
									}*/;
								});
								response( result, data.pagination.formpagination.totalrec );
							}
						});
					}
				}
			});	
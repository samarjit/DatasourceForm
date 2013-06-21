	ArrayReader = function (fields) {
		
		if ($.isFunction(window["wijmoASPNetParseOptions"])) {
			wijmoASPNetParseOptions(fields);
		}

		if ($.isArray(fields)) {
			this.fields = fields;
		}
	};
	window.ArrayReader = ArrayReader;

	$.extend(ArrayReader.prototype, {
		read: function (datasource) {
			if ($.isArray(datasource.data)) {
				datasource.items = this._map(datasource.data);
			}
			else {
				datasource.items = [];
			}
		},

		_map: function (data) {
			var self = this, arr = [];
			if (self.fields === undefined || self.fields.length === 0) {
				$.extend(true, arr, data);
				return arr;
			}
			else {
				$.each(data, function (index, value) {
					var i = {};
					$.each(self.fields, function (index, field) {
						// mapping property is a function,
						// the return value will be used as value.
						
						//handle the juice
						if($.type(field) == "string" ) {
							var tmp = field;
							field = {name: tmp, mapping: tmp};
						}
						if (field.mapping && typeof field.mapping && window[field.mapping]) {
							field.mapping = window[field.mapping];
						}

						if ($.isFunction(field.mapping)) {
							i[field.name] = field.mapping(value);
							return true;
						}
						// use string field mapping or number index mapping.
						var mapping = field.mapping !== undefined ?
											field.mapping : field.name,
						v = value[mapping];
						if (v === undefined) {
							if (field.defaultValue !== undefined) {
								v = field.defaultValue;
							}
							else {
								v = value;
							}
						}
						i[field.name] = v;
					});
					arr.push(i);
				});
			}
			return arr;
		}
	});
	
	//class
	function schemaReader (newoptions) {
			this.options = {
				rootList: "data",
				meta: "",
				datatype: "json",
				items: [],
				resultFields: null//[{name: "name",  mapping: "name" /*can be xpath,json path or javascript function*/}, {name: "email"}]
			};
			
			$.extend(this.options, newoptions);
			
			this.read = function(obj){
				//debugger; 
				var temp = jsonPath(obj,"$."+ this.options.rootList)[0];
				//return $.map(temp[0], function(o) {   if(o.name) return {name: "samar"}; })
				var datasource = {data: temp} ;
				 new ArrayReader(this.options.resultFields).read(datasource);
				return datasource.items;
			}
	}; 
	
	/**
	* Never set offset in while reading datasource, this is internal state maintained by datasource, only fetch items
	* that.options.paging.offset - this is global offset
	* this.result - will always contain current visible result set after paging and filtering and sorting. Not the original data values.
	* selected index is 0 for limit =1 
	*/
	$.widget("uix.datasource",$.ui.dataviewlocal,  {
				widgetEventPrefix: "dataview",
				result: [],
				options:{
					model: null,
					reader: new schemaReader(),
					//source: function (){ _super(); },
					url:"",
					editurl: "",
					cellediturl: "",
					filter: [],
					sort: [],
					i18n: {},
					validation: {},
					selectedIndex: [],
					paging :{ 
						offset: 0,
						limit: 2
					},
					dataLocation: "local",
					pagingtype: "remote",
					filterType: "remote"
				},
				_init: function(){
					this.option(this.options);
					this.result = [];
					this._fetch();
					var that = this;
					
					/*this.options.source = function (request,response){
							console.log("data ==== "+data);
						//that._super();
					};*/
				},
				_fetch: function(){
					if(this.options.dataLocation == "local"){
						if(this.options.loadOnce == undefined){
							this.options.reader.options.resultFields = this.options.model;
							this.options.input = this.options.reader.read(this.options.rawdata);
							this.options.loadOnce = "loaded";
						}
					}else if(this.options.dataLocation == "remote"){
						
					}
				},
				refresh: function(){
				   this._fetch();
				   this._super();
				},
				get: function (prop){
					/*if(this.options.paging.offset > this.result.length - 1){
						console.log("ERROR: datasource: trying to get offset=["+this.options.paging.offset +"] more than result set length=["+this.result.length+"], selecting last object in result array");
						this.options.paging.offset = this.result.length -1;
					}*/
					//selected index
					var selectedIdx = 0;
					if(this.options.selectedIndex != null && this.options.selectedIndex.length > 0){
						selectedIdx = this.options.selectedIndex[0];
					}
					if(this.result[selectedIdx] == null){
						return "";
					}
					return this.result[selectedIdx][prop];
					 
				},
				save: function(){
					//retrieve data
					var that = this;
					 $.each(datasource.options.model, function(i,field){
						// var field = $.grep(datasource.options.model, function (i){ if(i.name == fld) return i; });
						var fieldWidgets = $("[data-spine-prop='"+field.name+"']");
						/*
						if(fieldWidgets.data("spine-type") == "datepicker"){
							that.result[that.options.paging.offset][field.name] = widgetHelper.getValue(fieldWidgets); 
						}else if(fieldWidgets.data("spine-type") == "slider"){
							that.result[that.options.paging.offset][field.name] =fieldWidgets.slider("value"  );
						}else if(fieldWidgets.data("spine-type") == "spinner"){
							that.result[that.options.paging.offset][field.name] =fieldWidgets.spinner("value"  );
						}else {
							that.result[that.options.paging.offset][field.name] = fieldWidgets.val();
						}
						*/
						//selected index
						var selectedIdx = 0;
						if(this.options.selectedIndex != null && this.options.selectedIndex.length > 0){
							selectedIdx = this.options.selectedIndex[0];
						}
						that.result[selectedIdx][field.name] =  widgetHelper.getValue(fieldWidgets );
						
						//temp save
						//that.options.rawdata.data[0+that.options.paging.offset][field.name] =  widgetHelper.getValue(fieldWidgets );
					 });
					
					console.log("saving ... "+JSON.stringify(this.result));
				}
				
	});
	
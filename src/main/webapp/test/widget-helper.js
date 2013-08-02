//em px converter from filamentgroup
$.fn.toEm = function(settings){
	settings = jQuery.extend({
		scope: 'body'
	}, settings);
	var that = parseInt(this[0],10),
		scopeTest = jQuery('<div style="display: none; font-size: 1em; margin: 0; padding:0; height: auto; line-height: 1; border:0;">&nbsp;</div>').appendTo(settings.scope),
		scopeVal = scopeTest.height();
	scopeTest.remove();
	return (that / scopeVal).toFixed(8) + 'em';
};


$.fn.toPx = function(settings){
	settings = jQuery.extend({
		scope: 'body'
	}, settings);
	var that = parseFloat(this[0]),
		scopeTest = jQuery('<div style="display: none; font-size: 1em; margin: 0; padding:0; height: auto; line-height: 1; border:0;">&nbsp;</div>').appendTo(settings.scope),
		scopeVal = scopeTest.height();
	scopeTest.remove();
	return Math.round(that * scopeVal) + 'px';
};

$.fn.addCssRule = function (rule, id){
	var i = (id == null) ? $.guid : id;
	
	$("html>head").append("<style id='"+i+"' >"+rule+"</style>")
};
	var spineDatepicker =  {
 		fromElm: null,
 		name: "datepicker",
 		render: function ($form, field,  mode  ){
 			var html =  $.templates("#tmpl_datepicker_"+mode).render(field); // can.view("#tmpl_datepicker_"+mode, field);
			$form.append(html);	
			var fieldWidgets = $("[data-spine-prop='"+field.name+"']", $form);
			var opts = {};
			if(field.widgetData != undefined && field.widgetData != ""){
				opts = $.parseJSON(field.widgetData);
			}
			
			fieldWidgets.datepicker(opts);
 		},
 		getValue: function($el){
 			return $el.val();
 		},
 		setValue: function($el, val){
 			$el.val(val);
 		},
 		showError: function($el){
 			
 		},
 		showTooltip: function($el){
 			
 		}
 	};
 	
	var spineSpinner =  {
 		fromElm: null,
 		name: "spinner",
 		render: function ($form, field,  mode  ){
 			var html =  $.templates("#tmpl_spinner_"+mode).render(field); // can.view("#tmpl_datepicker_"+mode, field);
			$form.append(html);	
			var fieldWidgets = $("[data-spine-prop='"+field.name+"']", $form);
			 
			var fontSize = $(.9).toPx();
			var opts = {};
			if(field.widgetData != undefined && field.widgetData != ""){
				opts = $.parseJSON(field.widgetData);
			}
			fieldWidgets.spinner(opts);
		 	//fieldWidgets.height(20);
		 	//fieldWidgets.parent().height(20)
			fieldWidgets.outerHeight(fieldWidgets.parent().height());
			fieldWidgets.outerWidth(150-24);

			
			fieldWidgets.parent().css("font-size","0px");
			fieldWidgets.parent().css("width","150px");
			fieldWidgets.css("font-size",".8em");
			fieldWidgets.css("font-size",fontSize);
			/*
			//another way to position correctly
			//fieldWidgets.css("position","absolute");
			//fieldWidgets.css("top","0");
			
			*/
			//fieldWidgets.css("line-height",".8em"); //not required
			
			fieldWidgets.css("margin-top","0px");
			fieldWidgets.css("margin-bottom","0px");
			fieldWidgets.css("margin-left","2px");
			
			fieldWidgets.css("vertical-align","top");
			
			
		 
 		},
 		getValue: function($el){
 			return $el.val();
 		},
 		setValue: function($el, val){
 			$el.val(val);
 		},
 		showError: function($el){
 			
 		},
 		showTooltip: function($el){
 			
 		}
 	};
 	
	var spineSlider =  {
 		fromElm: null,
 		name: "slider",
 		render: function ($form, field,  mode  ){
 			var html =  $.templates("#tmpl_slider_"+mode).render(field); // can.view("#tmpl_datepicker_"+mode, field);
			$form.append(html);	
			var fieldWidgets = $("[data-spine-prop='disp_"+field.name+"']", $form);
			var opts = (field.widgetData!=null)?$.parseJSON(field.widgetData)||{}:{};
			
			fieldWidgets.slider(opts);
			var fieldWidgetsElm = $("[data-spine-prop='"+field.name+"']", $form);
			var that = this;
			fieldWidgets.on("slidechange",function(e,v){
				fieldWidgetsElm.val( $(this).slider("value"));
			});
			
			fieldWidgetsElm.on("change", function(e,v){
				$(this).parent().find("[data-spine-prop='disp_"+$(this).data("spine-prop")+"']").data('ui-slider').value(this.value);
			});
			
			fieldWidgets.trigger("slidechange");
 		},
 		getValue: function($el){
 			return $el.val();//$el.data('ui-slider').value();;
 		},
 		setValue: function($el, val){
 			if($.type(val) != "number"){
 				try{
 					val = parseInt(val);
 				}catch(e){
 					val = -1;
 				}
 			}
 				
 			$el.val(val);
 			//$el.data('ui-slider').value(val);
 			//$el.parent().find("[data-spine-prop='disp_"+$el.data("spine-prop")+"']").trigger("slidechange");
 			$el.trigger("change");
 		},
 		showError: function($el){
 			
 		},
 		showTooltip: function($el){
 			
 		}
 	};
 	
	var spineText =  {
 		fromElm: null,
 		name: "text",
 		render: function ($form, field,  mode  ){
 			var html =  $.templates("#tmpl_text_"+mode).render(field); // can.view("#tmpl_datepicker_"+mode, field);
			$form.append(html);	
			var fieldWidgets = $("[data-spine-prop='"+field.name+"']", $form);
			 
 		},
 		getValue: function($el){
 			return $el.val();
 		},
 		setValue: function($el, val){
 			$el.val(val);
 		},
 		showError: function($el){
 			
 		},
 		showTooltip: function($el){
 			
 		}
 	};
	
	var spineTextArea =  {
			fromElm: null,
			name: "textarea",
			render: function ($form, field,  mode  ){
				var html =  $.templates("#tmpl_textarea_"+mode).render(field); // can.view("#tmpl_datepicker_"+mode, field);
				$form.append(html);	
				var fieldWidgets = $("[data-spine-prop='"+field.name+"']", $form);
				 
				//fix line-height
				fieldWidgets.parent().find(">label").css("line-height",fieldWidgets.innerHeight()+"px");
			},
			getValue: function($el){
				return $el.val();
			},
			setValue: function($el, val){
				$el.val(val);
			},
			showError: function($el){
				
			},
			showTooltip: function($el){
				
			}
	};
	
	var spineDisplayText =  {
 		fromElm: null,
 		name: "displayText",
 		render: function ($form, field,  mode  ){
 			var html =  $.templates("#tmpl_text_view").render(field); // can.view("#tmpl_datepicker_"+mode, field);
			$form.append(html);	
			var fieldWidgets = $("[data-spine-prop='"+field.name+"']", $form);
			fieldWidgets.parent().on("change",":input", function(){
				$("#disp_"+this.id).text(this.value);
				});
 		},
 		getValue: function($el){
 			return $el.val();
 		},
 		setValue: function($el, val){
 			$el.val(val);
 			$el.trigger("change");
 		},
 		showError: function($el){
 			
 		},
 		showTooltip: function($el){
 			
 		}
 	};
	
	var spineLabel =  {
	 		fromElm: null,
	 		name: "label",
	 		render: function ($form, field,  mode  ){
	 			var html =  $.templates("#tmpl_label_view").render(field); // can.view("#tmpl_datepicker_"+mode, field);
				$form.append(html);	
				var fieldWidgets = $("[data-spine-prop='"+field.name+"']", $form);
				//fieldWidgets.on("change",":input", function(){ $("#disp_"+this.id).text(this.value); });
				 
	 		},
	 		getValue: function($el){
	 			return $el.text();
	 		},
	 		setValue: function($el, val){
	 			$el.text(val);
	 		},
	 		showError: function($el){
	 			
	 		},
	 		showTooltip: function($el){
	 			
	 		}
	 	};
	
	var spineCheckbox =  {
 		fromElm: null,
 		name: "checkbox",
 		render: function ($form, field,  mode  ){
 			var html =  $.templates("#tmpl_check_edit").render(field); // can.view("#tmpl_datepicker_"+mode, field);
			$form.append(html);	
			var fieldWidgetHid = $("[data-spine-prop='"+field.name+"']", $form);
			
			var fieldWidgets = $("[data-spine-prop='chk_"+field.name+"']", $form);
			fieldWidgets.css("margin","0px");
			
			var that = this;
			fieldWidgets.on("change", function(){
				if(this.checked == true){
					fieldWidgetHid.val( $(this).val());
	 			 }else{
	 				fieldWidgetHid.val("");
	 			 }
				
				//fieldWidgetHid.val( that.getValue(fieldWidgets));

				require([screenmeta.screenData.screenMeta.JS_FILE], function(screenJs){
					if(screenJs != undefined && field.eventOnchange != undefined && field.eventOnchange != "")
					screenJs[field.eventOnchange]();
				});
				
			});
			fieldWidgets.trigger("change");
 		},
 		getValue: function($el){
 			$el.val();
 			
 			
 		},
 		setValue: function($el, val){
 			$el.val(val);
 			console.log("check value ==== "+val)
 			var $chk = $el.parent().find("checkbox");
 			if(val == 'y' )$chk.checked = true;
 			if(val == 'Y' )$chk.checked = true;
 			if(/true/i.test(val) )$chk.checked = true;
 			if(val == 'Yes' )$chk.checked = true;
 			if(val == true )$chk.checked = true;
 			
 			if(val == 'n' )$chk.checked = false
 			if(val == 'N' )$chk.checked = false
 			if(/false/i.test(val) )$chk.checked = false
 			if(val == 'No' )$chk.checked = false
 			if(val == false )$chk.checked = false
 			
 			//$el.trigger("change");
 		},
 		showError: function($el){
 			
 		},
 		showTooltip: function($el){
 			
 		}
 	};
 	
	var spineRadio  = {
			fromElm: null,
	 		name: "radiogroup",
	 		render: function ($form, field,  mode  ){
	 			var radioList = [{val: 'Y', label: 'Yes'},{val: 'N', label:'No' }];
	 			field.radioList = radioList;
	 			var wigData = null;
	 			if(field.widgetData != null && field.widgetData != ""){
	 				try{
	 					 wigData = $.parseJSON(field.widgetData)
	 					var radList = wigData.radioList;
	 					var val = eval("'use strict'; var x = "+radList+";x")
	 					field.radioList =val;// $.parseJSON(radList);
	 				}catch(e){
	 					console.log("widgetData parsing failed for radiogroup");
	 				}
	 			}
	 			$.views.converters({
	 				toJson: function(value){
	 					try{
	 						console.log("inside converters:::"+ JSON.stringify(value));
	 					return JSON.stringify(value);
	 					}catch(e){
	 						console.log("inside converters error:::"+e+ "  "+$.type(value));
	 						console.log(value)
	 						return value;
	 					}
	 				}
	 			})
	 			var html =  $.templates("#tmpl_radiogroup_edit").render(field); // can.view("#tmpl_datepicker_"+mode, field);
				$form.append(html);	
				var fieldWidgetElm = $("[data-spine-prop='"+field.name+"']", $form);
				
				var fieldWidgets = $("[data-spine-prop='disp_"+field.name+"']", $form);
				fieldWidgets.css("margin","0px");
				
				if(wigData.floatLeftProp)fieldWidgets.find("li").css("float","left");
					
				var that = this;
				fieldWidgets.on("change","li", function(e, $el){
					
					fieldWidgetElm.val( that.getValue(fieldWidgets));
				});
				fieldWidgets.trigger("change");
				
				
				//mark default
				$.each(field.radioList, function(i,v){
					if(v.selected != null){
						that.setValue(fieldWidgets,v.val);
					}
				});
				//fix line-height
				fieldWidgets.parent().parent().find(">label").css("line-height",fieldWidgets.closest("div").innerHeight()+"px");
	 		},
	 		getValue: function($el){
	 			$rad = $el.parent().find(":input[type=radio]");
	 			for(i in $rad){
	 				 
	 				if($rad[i].checked == true){
	 					return $rad[i].value;
	 				}
	 			}
	 			return "";
	 		},
	 		setValue: function($el, val){
	 			$rad = $el.parent().find(":input[type=radio]");
	 			for(i in $rad){
	 				
	 				if($rad[i].value == val){
	 					$rad[i].checked = true;
	 					break;
	 				}
	 			}
	 			//$el.val(val);
	 			 
	 			$rad.trigger("change");
	 		},
	 		showError: function($el){
	 			
	 		},
	 		showTooltip: function($el){
	 			
	 		}	
	};
	
	
	var spineSelect  =  {
	 		fromElm: null,
	 		name: "selectbox",
	 		render: function ($form, field,  mode  ){
	 			var html =  $.templates("#tmpl_select_edit").render(field); // can.view("#tmpl_datepicker_"+mode, field);
				$form.append(html);
				var fieldWidgetHid = $("[data-spine-prop='hid_"+field.name+"']", $form);
				
				var fieldWidgets = $("[data-spine-prop='"+field.name+"']", $form);
				
				//widget data populate
				var strTmpl = "";
				var widgetData=  $.parseJSON(field.widgetData);
				 
			 	if(widgetData.datasource == "remote"){
			 		$.get(widgetData.remoteurl, function(data){ 
			 			try{
			 				//json path
			 				var input = $.parseJSON(data);
			 				//assume [{key:,value:},{key:,value:}] format
			 				if(input != null){
			 					var schemaReader = new SchemaReader({
			 				 		rootList: "formpagination.data",
			 				 		resultFields: [{name:'key', mapping: 'key'}, {name:'value', mapping:'value'},{name: 'selected',mapping:'selected'}] 	
			 				 	});
			 					var inputPart = schemaReader.read(input);
			 					$.each(inputPart, function(i,v){ //{key:,value:}
					 				if(fieldWidgets.find("option [value="+v.key+"]").length > -1){
					 					fieldWidgets.find("option [value="+v.key+"]").remove();
					 					v.selected = "selected";
					 				} 

			 						strTmpl += "<option value='"+v.key+"' ";
			 						if($.trim(v.selected)=="selected")
		 								strTmpl += "selected";
		 							strTmpl +=" >"+v.key+" - "+v.value+"</option>";			
			 					});
			 				}
			 				
			 				
			 			}catch(e){
			 				//assuming flat file
			 				//TODO: flat file reader
			 				var schemaReader = new SchemaReader({
				 				datatype:"csv",
		 				 		resultFields: [{name:'key', mapping: '0'}, {name:'value', mapping:'1'},{name:"selected", mapping:"2"}] 	
		 				 	});
				 			var inputPart = schemaReader.read(data);
		 					 
				 			$.each(inputPart, function(i,v){ //{key:,value:}
		 						//$.each(v, function( i2,v2){
				 				if(fieldWidgets.find("option [value="+v.key+"]").length > -1){
				 					fieldWidgets.find("option [value="+v.key+"]").remove();
				 					v.selected = "selected";
				 				} 
		 							strTmpl += "<option value='"+v.key+"' ";
		 							
		 							if($.trim(v.selected)=="selected")
		 								strTmpl += "selected";
		 							strTmpl +=" >"+v.key+" - "+v.value+"</option>";		
		 						//});	
		 					});
			 			}
			 			fieldWidgets.append(strTmpl);
			 			
			 			fieldWidgets.trigger("change");
			 			
			 		});
			 	}else if(widgetData.datasource == "local"){
			 		if($.type(widgetData.localdata ) == "array"){
				 		$.each(widgetData.localdata, function(io,vo){
					 		strTmpl += "<option value='"+vo[0]+"'>"+vo[1]+"</option>";
						});
			 		}else{
			 			//text csv
			 			console.log(widgetData.localdata);
			 			var schemaReader = new SchemaReader({
			 				datatype:"csv",
	 				 		resultFields: [{name:'key', mapping: '0'}, {name:'value', mapping:'1'},{name:"selected",mapping:"2"}] 	
	 				 	});
			 			var inputPart = schemaReader.read(widgetData.localdata);
	 					 
			 			$.each(inputPart, function(i,v){ //{key:,value:}
	 						//$.each(v, function( i2,v2){
	 							strTmpl += "<option value='"+v.key+"' ";
	 							if($.trim(v.selected)=="selected")
	 								strTmpl += "selected";
	 							strTmpl +=" >"+v.key+" - "+v.value+"</option>";		
	 						//});	
	 					});
			 			
			 		}
			 		fieldWidgets.append(strTmpl);
			 	}else{
			 		console.log("undefined datasource, this should be either local or remote");
			 	}
			 	
			 	//widget data populate end
				
				 
			 	fieldWidgets.css("width","200px");
			 	
				var that = this;
				fieldWidgets.on({
					"change": function(){
				
						fieldWidgetHid.val( that.getValue(fieldWidgets));
						
						require([screenmeta.screenData.screenMeta.JS_FILE], function(screenJs){
							if(screenJs != undefined && widgetData.onChangeFnName != undefined && widgetData.onChangeFnName != "")
							screenJs[widgetData.onChangeFnName]();
							
							if(screenJs != undefined && field.eventOnchange != undefined && field.eventOnchange != "")
							screenJs[field.eventOnchange]();
						});
						
						//hide/unhide
						var hideUnhideData = widgetData.unHidePanelData;
						
						if(hideUnhideData != undefined && hideUnhideData!=""){
							
							var hideUnhideObj = new SchemaReader({datatype:"csv"}).read(hideUnhideData);
							
							var selectedVal = that.getValue(fieldWidgets);
							for(i in hideUnhideObj){
								if(hideUnhideObj[i][0] !=  selectedVal){
									$("#"+hideUnhideObj[i][1]).hide();
									//console.log("hiding:"+selectedVal+"  "+hideUnhideObj[i][1]+" "+hideUnhideObj[i][0]);
								}else{
									$("#"+hideUnhideObj[i][1]).show();
									//console.log("showing:"+selectedVal+"  "+hideUnhideObj[i][1]+" "+hideUnhideObj[i][0]);
								}
							}
						}
					},
					"focus": function(){
						//console.log("focussing on select ");
						//console.log("screenmeta.screenData.screenMeta.JS_FILE- "+screenmeta.screenData.screenMeta.JS_FILE);
						
						//screenJs = require(screenmeta.screenData.screenMeta.JS_FILE);
						 
						require([screenmeta.screenData.screenMeta.JS_FILE] , function(screenJs){	
							//console.log("widgetData.onFocusFnName- "+widgetData.onFocusFnName+"   screenJs="+screenJs);
							if(screenJs != undefined && widgetData.onFocusFnName != undefined && widgetData.onFocusFnName != ""){
								screenJs[widgetData.onFocusFnName]();
							}
						});
						 
					}
				
				});
				fieldWidgets.trigger("change");
	 		},
	 		getValue: function($el){
	 			/* if($el.is(":checked")){
	 				return $el.val();
	 			 }else{
	 				 return "";
	 			 }*/
	 			return $el.val();
	 		},
	 		setValue: function($el, val){
	 			$el.val(val);
	 			var found = false;
	 			$("option",$el).each(function (i,v) {
	 				if(v.value == val){
	 					found = true;
	 				}
	 			});
	 			
	 			if(found == false){
	 				$el.append("<option value='"+val+"' selected> Defered </option>");
	 			}
	 				
	 			console.log("check value ==== "+val)
	 			
	 			/*if(val == 'y' )$el[0].checked = true;
	 			if(val == 'Y' )$el[0].checked = true;
	 			if(/true/i.test(val) )$el[0].checked = true;
	 			if(val == 'Yes' )$el[0].checked = true;
	 			if(val == true )$el[0].checked = true;
	 			
	 			if(val == 'n' )$el[0].checked = false
	 			if(val == 'N' )$el[0].checked = false
	 			if(/false/i.test(val) )$el[0].checked = false
	 			if(val == 'No' )$el[0].checked = false
	 			if(val == false )$el[0].checked = false*/
	 			
	 			$el.trigger("change");
	 		},
	 		showError: function($el){
	 			
	 		},
	 		showTooltip: function($el){
	 			
	 		}
	 	};
	 
	var spineTransferWidget =  {
	 		fromElm: null,
	 		name: "transferWidget",
	 		render: function ($form, field,  mode  ){
	 			var html =  $.templates("#tmpl_transferWidget_edit").render(field); // can.view("#tmpl_datepicker_"+mode, field);
				$form.append(html);
				var fieldWidgetHid = $("[data-spine-prop='"+field.name+"']", $form);
				
				var fieldWidget = $("[data-spine-prop='"+field.name+"']", $form);
				var fieldWidgetSelectFrom = $("[id='from_"+field.name+"']", $form);
				var fieldWidgetSelected = $("[id='selected_"+field.name+"']", $form);
				
				//widget data populate
				var strTmpl = "";
				var widgetData=  $.parseJSON(field.widgetData);
				var that = this;
				
				//widget data populate end
				var transferOpts= o  = {
				 		to: '#'+fieldWidgetSelected[0].id,//selector of second multiple select box
				 		dblClick:true,//true or false, activates double click transfer
				 		addId:'#btn'+field.name+'Add',//add buttong id
				 		removeId:'#btn'+field.name+'Remove', // remove button id
				 		addAllId:'#btn'+field.name+'AddAll', // add all button id
				 		removeAllId:'#btn'+field.name+'RemoveAll',// remove all button id
				 		tClass:'added'//class to be added when option tranfered to another select.
				};
				
				
			 	if(widgetData.datasource == "remote"){
			 		$.get(widgetData.remoteurl, function(data){ 
			 			try{
			 				//json path
			 				var input = $.parseJSON(data);
			 				//assume [{key:,value:},{key:,value:}] format
			 				if(input != null){
			 					var schemaReader = new SchemaReader({
			 				 		rootList: "formpagination.data",
			 				 		resultFields: [{name:'key', mapping: 'key'}, {name:'value', mapping:'value'},{name: 'selected',mapping:'selected'}] 	
			 				 	});
			 					var inputPart = schemaReader.read(input);
			 					$.each(inputPart, function(i,v){ //{key:,value:}
			 						strTmpl += "<option value='"+v.key+"' ";
			 						if($.trim(v.selected)=="selected")
		 								strTmpl += "selected";
		 							strTmpl +=" >"+v.key+" - "+v.value+"</option>";	
		 							
		 							
			 					});
			 				}
			 				
			 			
			 				
			 				
			 			}catch(e){
			 				//assuming flat file
			 				//TODO: flat file reader
			 				var schemaReader = new SchemaReader({
				 				datatype:"csv",
		 				 		resultFields: [{name:'key', mapping: '0'}, {name:'value', mapping:'1'},{name:"selected", mapping:"2"}] 	
		 				 	});
				 			var inputPart = schemaReader.read(data);
		 					 
				 			$.each(inputPart, function(i,v){ //{key:,value:}
		 						//$.each(v, function( i2,v2){
		 							strTmpl += "<option value='"+v.key+"' ";
		 							 
		 							if($.trim(v.selected)=="selected")
		 								strTmpl += "selected";
		 							strTmpl +=" >"+v.key+" - "+v.value+"</option>";		
		 							
		 							
		 							
		 						//});	
		 					});
			 			}
			 			fieldWidgetSelectFrom.append(strTmpl);
			 			
			 			//deferred load data sync
			 			o.obj = fieldWidgetSelectFrom;
			 			$("option",fieldWidgetSelectFrom).each(function (i,v) {
								if(fieldWidget.val() != null &&  fieldWidget.val().indexOf(v.value) > -1){
								var getSelected = $(v);//'option:selected:not(".' + o.tClass + '")', o.obj);
								getSelected.addClass(o.tClass).attr({
									'selected' : ''
								}).clone().appendTo(o.to);
								}
							});
							
			 			fieldWidgetSelectFrom.trigger("change");
			 			
			 		});
			 	}else if(widgetData.datasource == "local"){
			 		if($.type(widgetData.localdata ) == "array"){
				 		$.each(widgetData.localdata, function(io,vo){
					 		strTmpl += "<option value='"+vo[0]+"'>"+vo[1]+"</option>";
						});
			 		}else{
			 			//text csv
			 			console.log(widgetData.localdata);
			 			var schemaReader = new SchemaReader({
			 				datatype:"csv",
	 				 		resultFields: [{name:'key', mapping: '0'}, {name:'value', mapping:'1'},{name:"selected",mapping:"2"}] 	
	 				 	});
			 			var inputPart = schemaReader.read(widgetData.localdata);
	 					 
			 			$.each(inputPart, function(i,v){ //{key:,value:}
	 						//$.each(v, function( i2,v2){
	 							strTmpl += "<option value='"+v.key+"' ";
	 							if($.trim(v.selected)=="selected"){
	 								strTmpl += "selected";
	 								that.setValue(fieldWidget,v.key);
	 							}
	 							strTmpl +=" >"+v.key+" - "+v.value+"</option>";		
	 						//});	
	 					});
			 			
			 		}
			 		fieldWidgetSelectFrom.append(strTmpl);
			 	}else{
			 		console.log("undefined datasource, this should be either local or remote");
			 	}
			 	
				
				console.log("transfer Opts="+JSON.stringify(transferOpts));
								
			 	fieldWidgetSelectFrom.transfer(transferOpts);
 
			 	var totalPreSelected = fieldWidgetHid.val();
			 	if(totalPreSelected != null && totalPreSelected != ""){
			 		var tempAr = totalPreSelected.split(",");
			 		$.each(tempAr,function(i,v){
			 			fieldWidgetSelectFrom.val(v);
			 			$('#btn'+field.name+'Add').trigger("click"); //add to selected combobox
			 		});
			 	}
			 	
				
				fieldWidgetSelectFrom.on({
					"transferChange": function(){
						fieldWidgetHid.val("");
						var selectedAr = [];
						fieldWidgetSelected.find("option")
							.each(function(i,v){
								selectedAr.push(v.value);
								 
							});
						fieldWidgetHid.val(selectedAr.join(","));
					},
					"change": function(){
						
						//fieldWidgetHid.val( that.getValue( $(this) )  );
						
						require([screenmeta.screenData.screenMeta.JS_FILE], function(screenJs){
							if(screenJs != undefined && widgetData.onChangeFnName != undefined && widgetData.onChangeFnName != "")
							screenJs[widgetData.onChangeFnName]();
							
							if(screenJs != undefined && field.eventOnchange != undefined && field.eventOnchange != "")
							screenJs[field.eventOnchange]();
						});
						
						/*hide/unhide
						var hideUnhideData = widgetData.unHidePanelData;
						
						if(hideUnhideData != undefined && hideUnhideData!=""){
							
							var hideUnhideObj = new SchemaReader({datatype:"csv"}).read(hideUnhideData);
							
							var selectedVal = that.getValue(fieldWidgets);
							for(i in hideUnhideObj){
								if(hideUnhideObj[i][0] !=  selectedVal){
									$("#"+hideUnhideObj[i][1]).hide();
									//console.log("hiding:"+selectedVal+"  "+hideUnhideObj[i][1]+" "+hideUnhideObj[i][0]);
								}else{
									$("#"+hideUnhideObj[i][1]).show();
									//console.log("showing:"+selectedVal+"  "+hideUnhideObj[i][1]+" "+hideUnhideObj[i][0]);
								}
							}
						}*/
					},
					"focus": function(){
						 
						require([screenmeta.screenData.screenMeta.JS_FILE] , function(screenJs){	
							//console.log("widgetData.onFocusFnName- "+widgetData.onFocusFnName+"   screenJs="+screenJs);
							if(screenJs != undefined && widgetData.onFocusFnName != undefined && widgetData.onFocusFnName != ""){
								screenJs[widgetData.onFocusFnName]();
							}
						});
						 
					}
				
				});
				fieldWidgetSelected.trigger("change");
				$().addCssRule(".hidden {display: none} .added{color:grey}","multiselectCssRule");
	 		},
	 		getValue: function($el){
	 			/* if($el.is(":checked")){
	 				return $el.val();
	 			 }else{
	 				 return "";
	 			 }*/
	 			return $el.val();
	 		},
	 		setValue: function($el, val){
	 			var tempVal = val;
	 			var tmpAr = [];
	 			if(tempVal  != "")tmpAr = tempVal.split(","); 
	 			//tmpAr.push(val);
	 			var uniqueArray = [];
	 			for ( var i = 0; i < tmpAr.length; i++) {
	 				var v = tmpAr[i];
	 				if($.inArray(v, uniqueArray) == -1 && v != null && v != ""){
	 					uniqueArray.push(v);
	 				}
				}
	 			
	 			$el.val(uniqueArray.join(",") );
	 			console.log("multi select value ==== "+uniqueArray.join(",") )
	 			
	 			$fromSelect = $("[id='from_"+$el.data("spine-prop")+"']"); 
	 			$toSelect = $("[id='selected_"+$el.data("spine-prop")+"']");
	 		    
	 			var o={obj: $fromSelect, to: $toSelect, tClass: 'added'};
	 			
	 			//clean up old selected values
	 			$("option", $fromSelect).removeClass(o.tClass);
	 			$("option", $toSelect).remove();
	 			
	 			//select all in uniqueArray and add to right ride
	 			tempAr = uniqueArray;
	 			$("option",$fromSelect).each(function(i,v){
	 				if($.inArray(v.value ,uniqueArray ) > -1){
	 					v.selected = true;
	 				}else{
	 					v.selected = false;
	 				}
	 			});
	 				
	 				
	 				var getSelected = $('option:selected:not(".' + o.tClass + '")', o.obj);
					getSelected.addClass(o.tClass).attr({
						'selected' : ''
					}).clone().appendTo(o.to);
//	 			$.each(tempAr,function(i,v){
//		 			if($("option",$fromSelect).val() == v){
//		 				
//		 			}
//		 			var getSelected = $('option:selected:not(".' + o.tClass + '")', o.obj);
//					getSelected.addClass(o.tClass).attr({
//						'selected' : ''
//					}).clone().appendTo(o.to);
//					
//		 		});
		 		//$('#btn'+$el.data("spine-prop")+'Add').trigger("click"); //add to selected combobox
	 			
	 			//$el.trigger("change");
	 		},
	 		showError: function($el){
	 			
	 		},
	 		showTooltip: function($el){
	 			
	 		}
	 	};
	
	//MultiSelect Starts
	var spineMultiSelect =  {
		
	 		fromElm: null,
	 		name: "multiselect",
	 		render: function ($form, field,  mode  ){
	 			var html =  $.templates("#tmpl_multiselect_edit").render(field); // can.view("#tmpl_datepicker_"+mode, field);
				$form.append(html);
				var fieldWidgetHid = $("[data-spine-prop='"+field.name+"']", $form);
				
				var fieldWidget = $("[data-spine-prop='"+field.name+"']", $form);
				var fieldWidgetSelectFrom = $("[id='from_"+field.name+"']", $form);
				
				
				//widget data populate
				var strTmpl = "";
				var widgetData=  $.parseJSON(field.widgetData);
				var that = this;
				
			 	if(widgetData.datasource == "remote")
			 	{
			 		$.get(widgetData.remoteurl, function(data)
			 		{ 
			 			try
			 			{
			 				//json path
			 				var input = $.parseJSON(data);
			 				//assume [{key:,value:},{key:,value:}] format
			 				if(input != null)
			 				{
			 					var schemaReader = new SchemaReader
			 					({
			 				 		rootList: "formpagination.data",
			 				 		resultFields: [{name:'key', mapping: 'key'}, {name:'value', mapping:'value'},{name: 'selected',mapping:'selected'}] 	
			 				 	});
			 					var inputPart = schemaReader.read(input);
			 					$.each(inputPart, function(i,v)
			 					{ //{key:,value:}
			 						//deferred load data sync
			 						if(fieldWidgetHid.val() != null &&  fieldWidgetHid.val().indexOf(v.key) > -1)v.selected= "selected";
			 						
			 						strTmpl += "<option value='"+v.key+"' ";
			 						if($.trim(v.selected)=="selected")
		 							strTmpl += "selected";
		 							strTmpl +=" >"+v.key+" - "+v.value+"</option>";			
			 					});
			 				}
			 				
			 				
			 			 } catch(e)
			 			 {
			 				//assuming flat file
			 				//TODO: flat file reader
			 				var schemaReader = new SchemaReader
			 				({
				 				datatype:"csv",
		 				 		resultFields: [{name:'key', mapping: '0'}, {name:'value', mapping:'1'},{name:"selected", mapping:"2"}] 	
		 				 	});
				 			var inputPart = schemaReader.read(data);
		 					 
				 			$.each(inputPart, function(i,v)
				 		     {
				 		    	//deferred load data sync
		 						if(fieldWidgetHid.val() != null &&  fieldWidgetHid.val().indexOf(v.key) > -1)v.selected= "selected";
		 						
		 							strTmpl += "<option value='"+v.key+"' ";
		 							 
		 							if($.trim(v.selected)=="selected")
		 							strTmpl += "selected";
		 							strTmpl +=" >"+v.key+" - "+v.value+"</option>";		
		 						
		 					});
			 			}
			 			fieldWidgetSelectFrom.append(strTmpl);
			 			
			 			fieldWidgetSelectFrom.trigger("change");
			 			
			 		});
			 	}else if(widgetData.datasource == "local")
			 	{
			 		if($.type(widgetData.localdata ) == "array")
			 		{
				 		$.each(widgetData.localdata, function(io,vo)
				 		{
					 		strTmpl += "<option value='"+vo[0]+"'>"+vo[1]+"</option>";
						});
			 		}else
			 		{
			 			//text csv
			 			console.log(widgetData.localdata);
			 			var schemaReader = new SchemaReader
			 			({
			 				datatype:"csv",
	 				 		resultFields: [{name:'key', mapping: '0'}, {name:'value', mapping:'1'},{name:"selected",mapping:"2"}] 	
	 				 	});
			 			var inputPart = schemaReader.read(widgetData.localdata);
	 					 
			 			$.each(inputPart, function(i,v)
			 					{ //{key:,value:}
	 						
	 							strTmpl += "<option value='"+v.key+"' ";
	 							
	 							if($.trim(v.selected)=="selected")
	 							{
	 								strTmpl += "selected";
	 								that.setValue(fieldWidget,v.key);
	 							}
	 							strTmpl +=" >"+v.key+" - "+v.value+"</option>";		
	 						console.log("v.value value in SpineMultiSelect==== "+v.value);
	 					});
			 			
			 		}
			 		fieldWidgetSelectFrom.append(strTmpl);
			 	}else
			 	{
			 		console.log("undefined datasource, this should be either local or remote");
			 	}
			 	
			 
				fieldWidgetSelectFrom.on
				({
					
					"change": function()
					{
						
						fieldWidgetHid.val("");
						fieldWidgetSelectFrom.find("option")
							.each(function(i, v)
							  {
								if (v.selected == true)
								{
									that.setValue(fieldWidgetHid, v.value);
								}
			
							});
						
						require([screenmeta.screenData.screenMeta.JS_FILE], function(screenJs)
						{
							if(screenJs != undefined && widgetData.onChangeFnName != undefined && widgetData.onChangeFnName != "")
							screenJs[widgetData.onChangeFnName]();
							
							if(screenJs != undefined && field.eventOnchange != undefined && field.eventOnchange != "")
							screenJs[field.eventOnchange]();
						});
						
						
					},
					"focus": function()
					{
						 
						require([screenmeta.screenData.screenMeta.JS_FILE] , function(screenJs)
						{	
							
							if(screenJs != undefined && widgetData.onFocusFnName != undefined && widgetData.onFocusFnName != "")
							{
								screenJs[widgetData.onFocusFnName]();
							}
						});
						 
					 }
				
				});
				
				fieldWidgetSelectFrom.trigger("change");
				$().addCssRule(".hidden {display: none} .added{color:grey}","multiselectCssRule");
	 		},
	 		getValue: function($el){
	 			return $el.val();
	 		},
	 		setValue: function($el, val)
	 		{
	 			var tempVal = $el.val()+","+val;
	 			var tmpAr = [];
	 			if(tempVal  != "")tmpAr = tempVal.split(","); 
	 			
	 			var uniqueArray = [];
	 			for ( var i = 0; i < tmpAr.length; i++) 
	 			{
	 				var v = tmpAr[i];
	 				if($.inArray(v, uniqueArray) == -1 && v != "" )
	 				{
	 					uniqueArray.push(v);
	 					
	 				}
				}
 
	 			$el.parent().find("#from_"+$el.data("spine-prop")).find("option").each(function(i,v){
	 				 
	 				for ( var i = 0; i < uniqueArray.length; i++) {
	 					if(v.value == uniqueArray[i]){
	 						v.selected = true;
	 					}
					}
	 			});
	 			
	 			//deferred load data sync
	 			/*var tmpUnqAr = [];
	 			$el.parent().find("#from_"+$el.data("spine-prop")).find("option").each(function(i,v){
	 				if(v.selected == true){
	 					tmpUnqAr.push(v.value);
	 				} 
	 				 
	 			});*/
	 			$el.val(uniqueArray.join(",") );
	 			console.log("multi select value in SpineMultiSelect==== "+val);
	 			
	 		},
	 		showError: function($el){
	 			
	 		},
	 		showTooltip: function($el){
	 			
	 		}
	 	};
	
//MultiSelect Ends
	
	$.widgetList = {};
 	$.widgetList ["datepicker"] =  spineDatepicker;
 	$.widgetList ["spinner"] =  spineSpinner;
 	$.widgetList ["slider"] =  spineSlider;
 	$.widgetList ["text"] =  spineText;
 	$.widgetList ["textarea"] =  spineTextArea;
 	$.widgetList ["email"] =  spineText;
 	$.widgetList ["displayText"] =  spineDisplayText;
 	$.widgetList ["checkbox"] =  spineCheckbox;
 	$.widgetList ["select"] =  spineSelect;
 	$.widgetList ["transferWidget"] =  spineTransferWidget;
 	$.widgetList ["multiSelect"] =  spineMultiSelect;
 	$.widgetList ["radiogroup"] =  spineRadio;
 	$.widgetList ["label"] =  spineLabel;
 	
 	
 	var widgetHelper = {
		render: function ($form, field, mode  ){
			var wiz = null ;
			if(mode == 'edit'){
				if(field.capturetype == null || field.capturetype == ""){
					console.log('render: capturetype:'+ field.capturetype + " not found in model using text");
					field.capturetype = "text";
				}
				
				wiz = $.widgetList [field.capturetype];
				
				if(wiz == null || wiz == ""){
					console.log('render: capturetype:'+ field.capturetype + " is invalid using default text");
					wiz = $.widgetList ["text"];
				}
			}else{
				//view
				if(field.displaytype == null || field.displaytype == ""){
					console.log('render: displaytype:'+ field.capturetype + " not found in model using displayText");
					field.displaytype = "displayText";
				}
				
				wiz = $.widgetList [field.displaytype];
				
				if(wiz == null || wiz == ""){
					console.log('render: displaytype:'+ field.capturetype + " is invalid, using displayText");
					wiz = $.widgetList ["text"];
				}
			}
			
			if(wiz == null || wiz == ""){
				console.log('render: capturetype/displaytype:'+ field.capturetype + " not found in widget registry for mode="+mode);
			}else{
				wiz.render($form, field, mode)
			}
 		},
 		getValue: function($el){
 			var wizType = $el.data("spine-type");
 			if(wizType == null || wizType == ""){
				console.log('getValue: wizType: '+ wizType + " not found in data-spine-type");
			}else{
				var wiz = $.widgetList [wizType];
				if(wiz == null || wiz == ""){
					console.log('getValue: wizType: '+ wizType + " not found in widget registry");
				}else{
					console.log('getValue: wizType: '+ wizType );
					return wiz.getValue($el);
				}
			}
 			return null;
 		},
 		setValue: function($el, val){
 			var wizType = $el.data("spine-type");
 			if(wizType == null || wizType == ""){
				console.log('setValue: wizType: '+ wizType + " not found in data-spine-type");
			}else{
				var wiz = $.widgetList [wizType];
				if(wiz == null || wiz == ""){
					console.log('setValue: wizType: '+ wizType + " not found in widget registry");
				}else{
					wiz.setValue($el, val);
				}
				 
			}
 			
 		},
 		showError: function($el){
 			
 		},
 		showTooltip: function($el){
 			
 		}
 	};
 	
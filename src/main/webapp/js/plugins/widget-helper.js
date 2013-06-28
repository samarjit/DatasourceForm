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
	
	$("html>head").append("<style id='style_"+i+"' >"+rule+"</style>")
};
	var spineDatepicker =  {
 		fromElm: null,
 		name: "datepicker",
 		render: function ($form, field,  mode  ){
 			var html =  $.templates("#tmpl_datepicker_"+mode).render(field); // can.view("#tmpl_datepicker_"+mode, field);
			$form.append(html);	
			var fieldWidgets = $("[data-spine-prop='"+field.name+"']", $form);
			var opts = $.parseJSON(field.widgetData)||{};
			
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
			
			fieldWidgets.spinner();
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
			var opts = $.parseJSON(field.widgetData)||{};
			
			fieldWidgets.slider(opts);
			var fieldWidgetsElm = $("[data-spine-prop='"+field.name+"']", $form);
			var that = this;
			fieldWidgets.on("slidechange",function(e,v){
				fieldWidgetsElm.val(that.getValue(fieldWidgets));
			});
			fieldWidgets.trigger("slidechange");
 		},
 		getValue: function($el){
 			return $el.data('ui-slider').value();
 		},
 		setValue: function($el, val){
 			$el.data('ui-slider').value(val);
 			fieldWidgets.trigger("slidechange");
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
			fieldWidgets.on("change",":input", function(){ $("#disp_"+this.id).text(this.value); });
 		},
 		getValue: function($el){
 			return $el.text();
 		},
 		setValue: function($el, val){
 			$el.text(val);
 			fieldWidgets.trigger("change");
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
			var fieldWidgetHid = $("[data-spine-prop='hid_"+field.name+"']", $form);
			
			var fieldWidgets = $("[data-spine-prop='"+field.name+"']", $form);
			fieldWidgets.css("margin","0px");
			
			var that = this;
			fieldWidgets.on("change", function(){
				fieldWidgetHid.val( that.getValue(fieldWidgets));
			});
			fieldWidgets.trigger("change");
 		},
 		getValue: function($el){
 			 if($el.is(":checked")){
 				return $el.val();
 			 }else{
 				 return "";
 			 }
 		},
 		setValue: function($el, val){
 			$el.val(val);
 			console.log("check value ==== "+val)
 			
 			if(val == 'y' )$el[0].checked = true;
 			if(val == 'Y' )$el[0].checked = true;
 			if(/true/i.test(val) )$el[0].checked = true;
 			if(val == 'Yes' )$el[0].checked = true;
 			if(val == true )$el[0].checked = true;
 			
 			if(val == 'n' )$el[0].checked = false
 			if(val == 'N' )$el[0].checked = false
 			if(/false/i.test(val) )$el[0].checked = false
 			if(val == 'No' )$el[0].checked = false
 			if(val == false )$el[0].checked = false
 			
 			$el.trigger("change");
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
	 			if(field.widgetData != null && field.widgetData != ""){
	 				try{
	 					 
	 					var radList = $.parseJSON(field.widgetData).radioList;
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
				fieldWidgets.parent().parent().find(">label").css("line-height",fieldWidgets.innerHeight()+"px");
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
			 			fieldWidgets.append(strTmpl);
			 			
			 			fieldWidgets.trigger("change");
			 			
			 		});
			 	}else if(widgetData.datasource == "local"){
			 		if($.type(widgetData.localdata ) == "object"){
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
						});
						
						//hide/unhide
						var hideUnhideData = widgetData.unHidePanelData;
						if(hideUnhideData != undefined){
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
 	
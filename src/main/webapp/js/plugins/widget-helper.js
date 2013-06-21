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
			fieldWidgets.datepicker();
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
			var fieldWidgets = $("[data-spine-prop='"+field.name+"']", $form);
			fieldWidgets.slider();
			
 		},
 		getValue: function($el){
 			return $el.data('ui-slider').value();
 		},
 		setValue: function($el, val){
 			$el.data('ui-slider').value(val);
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
	
	var spineDisplayText =  {
 		fromElm: null,
 		name: "displayText",
 		render: function ($form, field,  mode  ){
 			var html =  $.templates("#tmpl_text_view").render(field); // can.view("#tmpl_datepicker_"+mode, field);
			$form.append(html);	
			var fieldWidgets = $("[data-spine-prop='"+field.name+"']", $form);
			 
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
			var fieldWidgets = $("[data-spine-prop='"+field.name+"']", $form);
			fieldWidgets.css("margin","0px");
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
 	$.widgetList ["email"] =  spineText;
 	$.widgetList ["displayText"] =  spineDisplayText;
 	$.widgetList ["checkbox"] =  spineCheckbox;
 	
 	
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
 	
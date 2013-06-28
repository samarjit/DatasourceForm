<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
	<META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
	<META HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE">
	<META HTTP-EQUIV="EXPIRES" CONTENT="0">
	
	<title>Test Screen</title>
<!-- <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.0/themes/base/jquery-ui.css" /> -->

<!-- <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js"> </script>
<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.js"> </script> -->
<script type="text/javascript"   src="../js/require.js"></script>
<script type="text/javascript" src="../js/requireconfig.js"></script>
<script type="text/javascript" src="../js/plugins/json2.js"></script>

 
<style type="text/css">
body {
    font-size: 80%;
    padding: 10px;
}
.ui-widget{
font-size: 90%!important;
}
.hideclass{
display: none;
}
br{
height: 5px;
}
label {
font-weight: bold;
}

/**display label float left**/
label.field-label{
width: 50%; /*300px*/
font-family: arial; 
display: inline-block;
box-sizing: border-box;
}
input,select{
/*width: 150px;*/
padding: 0;
box-sizing: border-box;
}
.even-odd-container{

}
.even-odd-container div{
box-sizing: border-box;
}

.fieldbox{
min-width: 450px;
float:left;
padding: 0px;
margin: 0px;
} 
.fieldbox label{
float: left;
display: inline-block;

}
/**display label float left end **/

</style>
<script type="text/javascript">
var overlay = {};
var screenId= "${param['scrId']}";
var theme = "${session.apptheme}";
var langCode="${session.LANG_PREF}"

console.log("langcode="+langCode);

require(['jqueryui',"app/cssloader",'layout','jqgridmain','jqueryvalidation','additionalvalidation', 'datasource', 'widgethelper','jsrender','jsonpath'], function(jx,cssloader){
	cssloader.loadCss(['jqueryui','idct','jqgrid'], theme , function(){ });
	
if(langCode == null || langCode ==""){	
langCode = "en";
}
	require(['../js/plugins/i18n/grid.locale-'+langCode,'../js/plugins/i18n/jquery.ui.datepicker-'+langCode,],function(){});
		
		 $.datepicker.setDefaults( $.datepicker.regional[ langCode ] );
		 $(document).ready(function(){
				globalAjaxErrorSetup();
				  overlay = $( "<div id='loading-overlay'> </div>" )
				.addClass( "ui-widget-overlay" )
				.hide()
				.appendTo( "body" );
				  
				 
				  
				$("#btnToggle").button().click(function (eve){
					$("#screenmetajson").toggleClass("hideclass");
				});
				searchScreen();
				$("#btnLoad").button();
				
				
		});
//		dependencyCalBack(jx,cssloader);
	});
 
	//require(['../js/plugins/jquery.validate.min'], function(jq){});

	
	
 


function globalAjaxErrorSetup(){
	   $( document).ajaxError(function(e, jqxhr, settings,exception) {
			 if(window.console){
				 console.log("Ajax ecxcetion:"+exception+" while loading "+settings.url);
				 console.log(exception);
				 }  
		 });
	}
	
var screenmeta = {};	


function searchScreen(){
	require(["app/fieldsubmit"],function (fs){
		overlay.show();
		var scrName, bulkcmd,scId;
		
		var spliScreenId =screenId.split("\.") ;
		//if(spliScreenId.length  == 3){
			
			if( spliScreenId[0])
				scId = spliScreenId[0];
			
			if( spliScreenId[1])
			scrName = spliScreenId[1];
			
			if(spliScreenId[2])
			bulkcmd = spliScreenId[2];
			
			
		//} 
		
		$.get("../rest/cdrcommon/openpage",{screenName: scrName,bulkcmd: bulkcmd,submitdata: JSON.stringify({screenId: scId})/* fs.getFieldObj("#searchform",["screenId"])*/},function (data){
			 var json = JSON.parse(data);
			 screenmeta  = json;
			 overlay.hide();
			 $("#screenmetajson").text(JSON.stringify(json,null,4));
			 if(screenmeta.actionErrors.length >0 ){
				 alert('error');
				 $("#screenmetajson").show();
			 }
			 buildScreen();
			 
			 
			 
		});
		  
	});
}	



function buildScreen(){
	var screenMetaData = $("#screenmetajson").text();
	var screenJson = JSON.parse(screenMetaData);
	var layoutHtml = screenJson.screenData.screenMeta.LAYOUT_TEMPLATE_NAME;
	
	$("#screen").load("../layout/"+layoutHtml, function (){
		var sjson = screenJson.screenData.panelMeta;
		 

		
		//create panels
		/*for(v in sjson){
			var parentDiv = sjson[v].parentId;
			 
			var proot = $("#"+sjson[v].panelId);
			//if(parentDiv == "screenRoot")parentDiv;
			
			
		}*/	
		fillRecursive(null, sjson ); //creates panels placeholders
		
		//create fields
		var fjson = screenJson.screenData.fieldMeta;
		for(i in fjson){
			field = fjson[i];
			
			field.name = field.fieldId;
			field.label = field.fieldLabel; 
			field.capturetype=field.fieldType;
			  
			var placeHolder = $("#"+field.panelId);
			//determine if field is to be placed inside a table.
			if(field.cellrow !=null && field.cellrow != "" && field.cellcol != null && field.cellcol != ""){
				var cellrow = parseInt(field.cellrow);
				var cellcol = parseInt(field.cellcol);
				var newplaceHolder = placeHolder.find("tr").eq(cellrow).find("td").eq(cellcol);
				if(newplaceHolder.is("td")){
					placeHolder = newplaceHolder;
				}else{
					showMessage("cell location not found in table "+placeHolder[0]+" assuming div");
				}
			}   
			if(field.fieldType == "textarea"){
				widgetHelper.render(placeHolder, field, "edit");
				/*
				var strTmpl = "<textarea id='"+field.fieldId+"' name='"+field.fieldId+"' value='"+field.fieldId+"' style='display:inline-block;box-sizing:border-box' >"+field.fieldId+"</textarea>";
				
				if(field.fieldLabel != ""){
					placeHolder.append("<div > <label for='"+field.fieldId+"' style='display:inline-block;width:50%;box-sizing:border-box'>"+field.fieldLabel+"</label>"+strTmpl+"</div>");
				}else{
					placeHolder.append(strTmpl);
				}
				*/
			}else if(field.fieldType == "label"){
				widgetHelper.render(placeHolder, field, "edit"); 
				/*if(field.fieldLabel != ""){
					placeHolder.append("<label for='"+field.fieldId+"' class= '"+field.cssclass+"'>"+field.fieldLabel+"</label>");
				}else{
					placeHolder.append("<label id='"+field.fieldId+"' class= '"+field.cssclass+"'>"+field.defaultValue+"</label>");
				}*/
			}else if(field.fieldType == "button"){
				//placeHolder.append("<button id='"+field.fieldId+"'>#"+field.fieldId+"-"+field.fieldLabel+"</button>");
				if(field.widgetData == "")field.widgetData = "{}"; 
				
				var buttonTemOb= $.parseJSON(field.widgetData);
								
				var function_list = {
						
						saveFun: function (bulkcmd){
							var fs = require("app/fieldsubmit");
							var obj ={};// $.parseJSON(fs.getFieldObjByName("#panel3",["personName","personCity"]));
							
							console.log("Beofore calling form valid");
							// To Impose the validations on the form -->
							if(!$("#formScreen").valid()){
								return false;
							}
							
							console.log("after calling form valid"+screenJson.screenData.requestCmds);
							
							$.each(screenJson.screenData.requestCmds, function(i,v){
								console.log("v.cmdName="+v.cmdName+"bulkcmd="+bulkcmd);
								if(bulkcmd == v.cmdName){
									obj.bulkcmd= v.cmdName;
									if(v.resultScrName != ""){ 
										obj.screenName = v.cmdResultScrName; 
									}else{
										obj.screenName = screenJson.screenData.screenMeta.SCREEN_ID;
									}
									
									var fieldlist = v.cmdInFieldList;
									if(/[\[{}]/.test(fieldlist)){
										var objFieldList = $.parseJSON(fieldlist);
										
										console.log("submitdata="+obj.submitdata);
										
										var submitdata = {};

										$.each(objFieldList, function (i2,v2){
											submitdata[i2] = [];
											var singleFormObj = {};
											$.each(v2, function(i3,fieldId){
												obj[fieldId] = $("#"+i2+" #"+fieldId).val();
												singleFormObj[fieldId] = $("#"+i2+" #"+fieldId).val();
											});
											
											submitdata[i2].push(singleFormObj);
										});
										obj.submitdata = JSON.stringify(submitdata);
										
									}else{
										
										alert("not implemented RegExp in fieldlist");
										
									}
									
									//obj.bulkcmd="addPersonDetails";
									//obj.screenName = "CDRTestData";
									
									
									$.post("simpleform.action", obj,function(data){
										console.log("data after returned="+data);
										
										var resJson = {};
										if(data != null && data != ""){
											resJson = $.parseJSON(data);
											if(resJson.fieldErrors != null && !$.isEmptyObject(resJson.fieldErrors)){
												console.log("here1");
												showError(resJson.fieldErrors);
											}else if(resJson.actionErrors != null && $.isArray(resJson.actionErrors) && resJson.actionErrors.length > 0){
												console.log("here2");
												showError(resJson.actionErrors);
											}else{
												console.log("here3");
												var resUrl = "sb.jsp?scrId="+v.cmdResultScrId;
												if(v.cmdResultScrName!= null || v.cmdResultScrName != ""){
													resUrl += "."+v.cmdResultScrName;
													if(v.cmdResultBulkcmd!= null || v.cmdResultBulkcmd != ""){
														resUrl += "."+v.cmdResultBulkcmd; //resultBulkCmd not required, use previous bulkcmd
													}else{
														//default onload
													}
													
													resUrl += "."+v.cmdName;
												}
												
													
												//alert ("redirecting to "+resUrl);
												window.location.href = resUrl;
											}
										}
									});
								
								
								}
								bulkcmd="";
							});
							
							
							
							 
							
						} ,
						cancelFun: function(){  alert('alert in sample cancelFun() Not implemented');  
						},
						saveToLocalGrid: function(extraparam, action){
							console.log ("extraparam"+extraparam +" action = "+action);
							var actionParts = extraparam.split(",");  //contains panel_Id, grid panel
							if(actionParts.length != 2){
								throw new Error("Two arguments expected for function saveToLocalGrid(); Please specify button action='panel_Id, grid panel'");
							}else{
								//get panel data
								var dataModel= [];
								dataModel[0] = {};
								$("#"+ $.trim(actionParts[0]) ).find(":input").each(function(i,v){
									console.log("i="+v.name+"  v="+ $(v).val() );
									dataModel[0][v.name] = $(v).val();
								});
								
								var id = $("#"+ $.trim(actionParts[0]) ).find(":input[name=id]").val();
								if(id == undefined)$("#"+ $.trim(actionParts[0]) ).append("<input type='text' name='id' />");
								
								if(id == undefined || id == ""){
									//mode = insert into grid
									var rowNum  = $("#panel11_grid").jqGrid("getGridParam","data");
									dataModel[0].id = rowNum.length+1;
								
									console.log("mode = insert #"+ $.trim(actionParts[1]) +"_grid" +"  data = "+JSON.stringify(dataModel));
									$("#"+ $.trim(actionParts[1]) +"_grid").jqGrid("addRowData",dataModel[0].id ,dataModel[0]);
									$("#"+ $.trim(actionParts[0]) ).find(":input").val("");
								}else{
									//mode = update
									console.log("mode = update #"+ $.trim(actionParts[1]) +"_grid" +"  data = "+JSON.stringify(dataModel));
									$("#"+ $.trim(actionParts[1]) +"_grid").jqGrid("setRowData",id,dataModel[0]);
									$("#"+ $.trim(actionParts[0]) ).find(":input").val("");
								}
							}
						},
						removeFromLocalGrid:  function(extraparam, action){
							var actionParts = extraparam.split(",");  //contains panel_Id, grid panel
							if(actionParts.length != 2){
								throw new Error("Two arguments expected for function saveToLocalGrid(); Please specify button action='panel_Id, grid panel'");
							}else{
								//get panel data
								var dataModel= [];
								dataModel[0] = {};
								$("#"+ $.trim(actionParts[0]) ).find(":input").each(function(i,v){
									console.log("i="+v.name+"  v="+ $(v).val() );
									dataModel[0][v.name] = $(v).val();
								});
								
								var id = $("#"+ $.trim(actionParts[0]) ).find(":input[name=id]").val();
								if(id == undefined)$("#"+ $.trim(actionParts[0]) ).append("<input type='text' name='id' />");
								
								if(id == undefined || id == ""){
									
								}else{
									//mode = update
									console.log("mode = delete #"+ $.trim(actionParts[1]) +"_grid" +"  data = "+JSON.stringify(dataModel));
									$("#"+ $.trim(actionParts[1]) +"_grid").jqGrid("delRowData",id,dataModel[0]);
									$("#"+ $.trim(actionParts[0]) ).find(":input").val("");
								}
							}
						},
						persistLocalGrid: function(extraparam, action){
							//extraparam must contain grid panel_id
							var rows = $("#"+ $.trim(extraparam) +"_grid").jqGrid("getRowData");
							console.log("submitting without validation ...using form ID="+extraparam+" rows = "+JSON.stringify(rows));
							var submitdataObj = {action: rows};
							debugger;
							bulkcmd = action;
							$.each(screenJson.screenData.requestCmds, function(i,v){
								if(bulkcmd == v.cmdName){
									var obj = {};
									obj.bulkcmd= v.cmdName;
									obj.submitdata= JSON.stringify(submitdataObj);
									obj.screenName = v.cmdResultScrName;
										$.post("simpleform.action", obj, function (data){
											console.log(" resut of grid submit ======= "+data);
										});
									}
									
								});
						},
						customJsFn: function(fnName){ 
							console.log("Loading screenJs="+screenmeta.screenData.screenMeta.JS_FILE);
							console.log("fnName="+fnName);
							require([screenmeta.screenData.screenMeta.JS_FILE], function(screenJs){
							
								screenJs[fnName]();
							});
							
						}	
				}
				console.log("Temp Button "+field.fieldId+"  funclist :"+buttonTemOb.func+" action:"+buttonTemOb.action);
				var tempElm = $("<button id='"+field.fieldId+"' type='button' class='"+field.cssclass+"' alt='"+buttonTemOb.action+"'  >"+field.fieldLabel+"</button>").button().appendTo(placeHolder);
				              $("#"+field.fieldId).on("click",buttonTemOb,function(e){ 
				            	  	console.log("buttonTemOb = "+e.data.func);
				            	  	
				            	  	
				            	  if(e.data.action != "" ){
				            		 function_list[e.data.func](e.data.action);  
				            	  }
				            	  else if(e.data.extraParam != ""){// this is for function call to Custom Java Script
					            		 function_list[e.data.func](e.data.extraParam);  
					            	  }				            	  
				            	  	
				            	  });
				
			}else if(field.fieldType == "select"){
			 	var strTmpl = "";   // "<select name='"+field.fieldId+"' id='"+field.fieldId+"' value='"+field.fieldId+"' class='"+field.cssclass+"'>";
			 	widgetHelper.render(placeHolder, field, "edit");
			 	
			 	/* var widgetData=  $.parseJSON(field.widgetData);
			 
			 	if(widgetData.datasource == "remote"){
			 		$.get(widgetData.remoteurl, function(data){ 
			 			try{
			 				//json path
			 				var input = $.parseJSON(data);
			 				//assume [{key:,value:},{key:,value:}] format
			 				if(input != null){
			 					var schemaReader = new SchemaReader({
			 				 		rootList: "formpagination.data",
			 				 		resultFields: [{name:'key', mapping: 'key'}, {name:'value', mapping:'value'}] 	
			 				 	});
			 					var inputPart = schemaReader.read(input);
			 					$.each(inputPart, function(i,v){ //{key:,value:}
			 						$.each(v, function( i2,v2){
			 							strTmpl += "<option value='"+v2[0]+"'>"+v2[1]+"</option>";		
			 						});	
			 					});
			 				}
			 				
			 				
			 			}catch(e){
			 				//assuming flat file
			 				//TODO: flat file reader
			 			}
			 		});
			 	}else if(widgetData.datasource == "local"){
			 		$.each(widgetData.localdata, function(io,vo){
				 		strTmpl += "<option value='"+vo[0]+"'>"+vo[1]+"</option>";
					});
			 	}else{
			 		console.log("undefined datasource, this should be either local or remote");
			 	} */
			
			 	//strTmpl += "</select>";
				
				//$("<select name='"+field.fieldId+"' id='"+field.fieldId+"' value='"+field.fieldId+"' ></select>").appendTo(placeHolder);
				/*if(field.fieldLabel != ""){
					$("<div > <label for='"+field.fieldId+"' style='display:inline-block;width:50%;box-sizing:border-box'>"+field.fieldLabel+"  "+((field.mandatoryDecorate && field.mandatoryDecorate =='Y') ?"<span style='color:red' ><strong>*</strong></span>":"" )+"</label>"+strTmpl+"</div>").appendTo(placeHolder);
				}else{
					strTmpl.appendTo(placeHolder);
				}*/
				
				//placeHolder.find("select").append(strTmpl);
			}else if(field.fieldType == "spinner"){
				widgetHelper.render(placeHolder, field, "edit");
			}else if(field.fieldType == "slider"){
				//$.parseJSON(field.widgetData)
			 	widgetHelper.render(placeHolder, field, "edit");
			 	/*if(field.fieldLabel != ""){
			 		var tempElmStr ="<div style='box-sizing: border-box'>"+
			 						"  <label for='"+field.fieldId+"' style='display:inline-block;width:50%;box-sizing:border-box'>"+field.fieldLabel+"</label>"+
			 						"  <div style='display:inline-block;width:49%;box-sizing:border-box'>"+
			 						"    <div name='"+field.fieldId+"' id='"+field.fieldId+"'   ></div>"+ //slider
			 						"  </div>"+
			 						"</div>";
			 		placeHolder.append(tempElmStr);
			 		$("div>div>div",placeHolder).slider($.parseJSON(field.widgetData));
				}else{
					$("<div name='"+field.fieldId+"' id='"+field.fieldId+"'   ></div>").appendTo(placeHolder).slider($.parseJSON(field.widgetData));
				}*/
			}else if(field.fieldType == "datepicker"){
				//$.parseJSON(field.widgetData)
				widgetHelper.render(placeHolder, field, "edit");
				
				/*var dtPkr =  $("<input type='text' name='"+field.fieldId+"' id='"+field.fieldId+"'  />").appendTo(placeHolder).wrap("<div class='my-datepicker-wrapper'>").datepicker($.parseJSON(field.widgetData)).addClass("field");
				
				if(field.fieldLabel != ""){
					dtPkr.parent(".my-datepicker-wrapper")
					.prepend("<label for='"+field.fieldId+"' style='display:inline-block;width:50%'>"+field.fieldLabel+"</label>");
				}
				*/
			}else if(field.fieldType == "displayfield"){
				//$.parseJSON(field.widgetData)
				field.capturetype= "displayText";
				 
				widgetHelper.render(placeHolder, field, "edit");
				/*
				var dispFld =  $("<input type='hidden' name='"+field.fieldId+"' id='"+field.fieldId+"'  /><span id='disp_"+field.fieldId+"' name='disp_"+field.fieldId+"' ></span>").appendTo(placeHolder).wrapAll("<div class='my-displayfield-wrapper'>");//.datepicker($.parseJSON(field.widgetData));
				
				dispFld.parent().on("change",":input", function(){ $("#disp_"+this.id).text(this.value); });
				if(field.fieldLabel != ""){
					
					$("<label for='"+field.fieldId+"' style='display:inline-block;width:50%'>"+field.fieldLabel+"</label>").prependTo(dispFld.parent(".my-displayfield-wrapper"));
				}
				*/
			}else if(field.fieldType == "checkbox"){
				widgetHelper.render(placeHolder, field, "edit");
				
			}else if(field.fieldType == "text"){
				widgetHelper.render(placeHolder, field, "edit");
			}else if(field.fieldType == "text"){
				var tempElm = $("<input type='text' name='"+field.fieldId+"' id='"+field.fieldId+"' class= '"+field.cssclass+"' size= '"+field.maxSize+"' />").appendTo(placeHolder);
				if(field.fieldLabel != ""){
				    tempElm.wrapAll("<div>");
				    tempElm.closest("div").prepend("<label for='"+field.fieldId+"' style='display:inline-block;width:50%'>"+field.fieldLabel+"  "+((field.mandatoryDecorate && field.mandatoryDecorate =='Y') ?"<span style='color:red' ><strong>*</strong></span>":"" )+" </label>");
				}
			}
			else{
				//text
				widgetHelper.render(placeHolder, field, "edit");
				
				/*var tempElm = $("<input type='text' name='"+field.fieldId+"' id='"+field.fieldId+"' class= '"+field.cssclass+"' />").appendTo(placeHolder);
				if(field.fieldLabel != ""){
				    tempElm.wrapAll("<div>");
				    tempElm.closest("div").prepend("<label for='"+field.fieldId+"' style='display:inline-block;width:50%'>"+field.fieldLabel+"  "+((field.mandatoryDecorate && field.mandatoryDecorate =='Y') ?"<span style='color:red' ><strong>*</strong></span>":"" )+" </label>");
				}*/
				
			}
			//div
			var wrapperDiv = placeHolder.find(">div");
			wrapperDiv.css("float","left");
			wrapperDiv.css("width","400px");
		}
		
		//$("button").button();
		//tables color
		$("table").width("95%");
		
		//$("table.btntable").find("td").css("text-align","center");
		
		//$("div.btntable").closest("button").prepend("&nbsp;");
		
		$("div.btnDiv").find("button").css("margin",5);
		$("div.button-panel").find("button").css("margin-right",5);
		$("div.button-panel").css("text-align","center");
		
		$("table.table").width("95%");
		$("table.table").css("border-collapse","collapse");
		//$("table.table").find("td").css("padding",5);
		$("table.table").find("td").css("padding","3px");
		//$("table.table").css("border-spacing",5);
		
		
		$("table.table tr:odd").find("td").addClass("odd");
		$("table.table tr:even").find("td").addClass("even");
		
		$(".head2").width("95%");
		$(".head1").width("95%");
		
		$("table.table1").width("95%");
		$("table.table1").css("border-collapse ","collapse");		
		$("table.table1 tr:odd").find("td").addClass("odd");
		$("table.table1 tr:even").find("td").addClass("even");
		
		// To assign the validation rules to the form Starts here-->
		var validationData = screenJson.screenData.validationData;		
		if(validationData!=null){
			 
			
			validationData.errorPlacement = function($label, $elm){
				 
				if($elm.closest(".fieldbox").find(".error-container").is("div")){
					$elm.closest(".fieldbox").find(".error-container").empty().append($label);
				}else{
					$label.insertAfter($elm);
				}
			}
			
			
			$("#formScreen").validate(validationData);
			$("#autogeneratedValidation").text(validationData);
			/* $("#formScreen").validate({ rules:validationData.rules, messages:validationData.messages,  errorPlacement: function(error, element) {
		        var container = $('<div />');
		        //container.addClass('Ntooltip');  // add a class to the wrapper
		        error.insertAfter(element);
		        error.wrap(container);
		      //  $("<div class='errorImage'></div>").insertAfter(error);
		       
		    }
			}) ; */
		}	
		// To assign the validation rules to the form Ends here-->
		
		//fill data from previous input
		if(screenmeta.prevInputData && screenmeta.prevInputData.form1 != null){
			var form1_0 = screenmeta.prevInputData.form1[0]
			$.each(form1_0, function (i_inp,v_inp){
				$("body").find("*[name='"+i_inp+"']").val(v_inp).change();
			});
		}
		//fill data from previous result data
		if(screenmeta.prevResultData  != null){
			
			var prevData = screenmeta.prevResultData.resultdata;
			
			if(prevData!=null){
				if($.type(prevData)=="array"){
					console.log("prev data is array");
					if(prevData.length==1){
						$.each(prevData[0], function (i_inp,v_inp){
							$("body").find("*[name='"+i_inp+"']").val(v_inp).change();
						});
					}else{
						console.log("need to handle as the prevdata is greater than 1");
					}
				}else{
					$.each(prevData, function (i_inp,v_inp){
						$("body").find("*[name='"+i_inp+"']").val(v_inp).change();
					});
				}
			}
		}
		
		 
		//load and run scren specific javascript
		if(screenmeta.screenData.screenMeta.JS_FILE != null && screenmeta.screenData.screenMeta.JS_FILE != ""){
			console.log("SCREENJS loading screen specific js files ... "+  screenmeta.screenData.screenMeta.JS_FILE );
			require([screenmeta.screenData.screenMeta.JS_FILE], function(){ console.log("SCREENJS loaded  " +screenmeta.screenData.screenMeta.JS_FILE); });
		}
	});
	
}

function fillRecursive(proot, panel){
	for (i in panel.subPanels){
		panelObj = panel.subPanels[i];
		var newroot = null;
	 
		if(panelObj.inlinestyle == null)panelObj.inlinestyle="";
		
		if(panelObj.parentId == "screenRoot"){
			//replace mode 
			var panelInTemplate = $("#"+panelObj.panelId);
			panelInTemplate[0].style.cssText = panelInTemplate[0].style.cssText +";"+panelObj.inlinestyle;
			panelInTemplate.addClass(panelObj.cssclass);
			panelInTemplate.addClass("ui-helper-clearfix");
			newroot = panelInTemplate;
		}else{
			
			if(proot == null){
				proot = $("body");
				
				var tmpProot = $("#"+panelObj.parentId);
				if(tmpProot != null ){
					proot = tmpProot;
				}
			}
		
			if(panelObj.panelType == "table"){ 
				console.log("panelObj.panelType="+panelObj.panelType+"proot="+proot+"panelObj.panelId="+panelObj.panelId);
					 newroot = $("<table border='0' id="+panelObj.panelId+" class="+panelObj.cssclass+"></table>").appendTo(proot);
				var tblStr = "";
				var numrows = panelObj.numrows;
				var numcols = panelObj.numcols;
				for(var x = 0;x < numrows; x++){
					tblStr += "<tr>";
					for(var y =0; y < numcols; y++){
						tblStr += "<td></td>";					
					}
					tblStr += "</tr>";
				}
				$(tblStr).appendTo(newroot);
			
				
			}else if(panelObj.panelType == "tableGrid"){
			 
					 newroot = $("<div style='padding:1px;border:0px red dotted;margin: 0px; display:none;"+panelObj.inlinestyle+"' id="+panelObj.panelId+" class='"+panelObj.cssclass+" ui-helper-clearfix'>"+
					 "<table id='"+panelObj.panelId+"_grid'></table><div id='"+panelObj.panelId+"_gridpager'></div></div>").appendTo(proot);
					 var jsonTableGrid = null;
					 if(panelObj.panelWidgetData != null && panelObj.panelWidgetData != ""){
						 jsonTableGrid = $.parseJSON(panelObj.panelWidgetData);
						 
						 jsonTableGrid.pager = '#'+panelObj.panelId+'_gridpager';
						
						 console.log("before creating mappign form");
						 
						 if(jsonTableGrid.additionalParam && jsonTableGrid.additionalParam != ""){
						    var additionalParamTemp;
							try{
								additionalParamTemp =  $.parseJSON(jsonTableGrid.additionalParam)
							 	$.extend(jsonTableGrid, additionalParamTemp);
							}catch(e){
								console.error('JSON parsing additional param error');
							};
						 }
						 console.log("jsonTableGrid.mappedForm=="+jsonTableGrid.mappedForm);
						 if(jsonTableGrid.mappedForm != null &&    jsonTableGrid.mappedForm != ""){
							 
							 (function(panelObj,jsonTableGrid){ //closure to have proper panel id and mappedForm values which will get cloned at the time of invocation
									 
								 jsonTableGrid.onSelectRow =  function(id){
									 console.log("creating mappign form onSelRow "+id+" to form "+'#'+jsonTableGrid.mappedForm +"  in grid "+"#"+panelObj.panelId+"_grid" );
										try{ $("#"+panelObj.panelId+"_grid").jqGrid('GridToForm',id,'#'+jsonTableGrid.mappedForm );
	 					    			 $(jsonTableGrid.mappedForm+" :input[name=bulkcmd]").val("frmnrmledit");
										}catch( e) { console.log(e); }
								 }
								 
							 })(panelObj,jsonTableGrid );
							  
						 }
						 
						 $("#"+panelObj.panelId+"_grid").jqGrid(jsonTableGrid);
						 $("#"+panelObj.panelId+"_grid").navGrid('#'+panelObj.panelId+'_gridpager',{edit:true,add:true,del:true},{},{},{},{multipleSearch:true, multipleGroup:true});
					 }
					 
			}else if(panelObj.panelType == "spacer"){		 
				 newroot = $("<br style='"+panelObj.inlinestyle+"' id='"+panelObj.panelId+"' class='"+panelObj.cssclass+ " ui-helper-clearfix' />").appendTo(proot);
			} else {
					 newroot = $("<div style='padding:1px;border:0px red dotted;margin: 0px;"+panelObj.inlinestyle+"' id='"+panelObj.panelId+"' class='"+panelObj.cssclass+ " ui-helper-clearfix'></div>").appendTo(proot);
			//proot.append("<div id="+panelObj.panelId+">"+panelObj.panelId+"</div>");
			}
		}
		fillRecursive(newroot,panelObj);
		proot=null;
	}	
}

function showMessage(msg){
	clearMessages();
	$("<li class='ui-state-highlight' />").appendTo($("#message ul")).append(msg);
}
function clearMessages(){
	$("#message ul").empty();
	$("#errormsg ul").empty();
}
function showError(msg){
	clearMessages();
	if($.isArray(msg)){
		for(m in msg)		
			$("<li class='error' />").appendTo($("#errormsg ul")).append(msg[m]);
	}else{
		//alert("in else="+msg);
		$.each(msg, function(key, value){
        console.log(key, value);
        $("<li class='error' />").appendTo($("#errormsg ul")).append(key+value);
    	});
		
	}
}

</script>




<script type="text/template" id="tmpl_datepicker_edit">
<div class="fieldbox">	
<div class='my-datepicker-wrapper'>
	<label for="{{:name}}" style='display:inline-block;width:50%' class="field-label">{{:label}} 
{{if mandatoryDecorate == 'Y'}}
<span style='color:red' ><strong>*</strong></span>
{{/if}}
</label>  <input type="text" data-spine-type="{{:capturetype}}" data-spine-prop="{{:name}}" name="{{:name}}" value="" style="position:relative;z-index:2" /></div>
	<div class="error-container"></div>
</div>	
</script>
 
<script type="text/template" id="tmpl_text_edit">
<div class="fieldbox">	
<label for="{{:name}}"  style='display:inline-block;width:50%' class="field-label">{{:label}} 
{{if mandatoryDecorate == 'Y'}}
<span style='color:red' ><strong>*</strong></span>
{{/if}}
</label> <input type="text" name="{{:name}}" id="{{:name}}" class="{{:cssclass}}" data-spine-prop="{{:name}}" data-spine-type="text" value="{{:defaultValue}}" />
	<div class="error-container"></div>
</div>
</script>



<script type="text/template" id="tmpl_text_view">
<div class="my-displayfield-wrapper">
	<div class="fieldbox">	<label for="caption" style='display:inline-block;width:50%' class="field-label">{{:label}} 
	</label><input type='hidden' data-spine-prop="{{:name}}" name='{{:name}}' id='{{:name}}' data-spine-type="displayText" value="{{:defaultValue}}" /> <span type="text" name="disp_{{:name}}"   >{{:defaultValue}}</span></div>
	<div class="error-container"></div>	
</div>
</script>

<script type="text/template" id="tmpl_label_view">
 <label for="{{:name}}"  data-spine-prop="{{:name}}" data-spine-type="label" style="line-height:25px" class="field-label" >
 	{{if defaultValue}}
 		{{:defaultValue}}
 	{{else}}
 		{{:label}}
 	{{/if}}</label>
 	<div class="error-container"></div>
</div>

</script>

<script type="text/template" id="tmpl_textarea_edit">
<div class="fieldbox">	<label for="{{:name}}" style='display:inline-block;width:50%' class="field-label">{{:label}} 
	{{if mandatoryDecorate == 'Y'}}
<span style='color:red' ><strong>*</strong></span>
{{/if}}
	</label><textarea type="text" name="{{:name}}" id='{{:name}}' data-spine-prop="{{:name}}"  data-spine-type="displayText"  >{{:defaultValue}}</textarea>
	<div class="error-container"></div>
</div>
</script>

<script type="text/template" id="tmpl_number_edit">
<div class="fieldbox">	<label for="caption" class="field-label">{{:label}}  </label> <input type="text" name="{{:name}}" data-spine-prop="{{:name}}"  value="Field Details" />
	<div class="error-container"></div>
</div>

</script>

<script type="text/template" id="tmpl_spinner_edit">
<div class="fieldbox">	
<label for="{{:name}}" class="field-label">
{{:label}}
{{if mandatoryDecorate == 'Y'}}
<span style='color:red' ><strong>*</strong></span>
{{/if}}
</label> <input type="text" name="{{:name}}" data-spine-prop="{{:name}}" data-spine-type="spinner"  value="" />
<div class="error-container"></div>
</div>
</script>
 
 
 
<script type="text/template" id="tmpl_slider_edit">
<div class="fieldbox">	
   <label for="{{:name}}" class="field-label">{{:label}}</label> 
   <div type="text" name="disp_{{:name}}" data-spine-prop="disp_{{:name}}" data-spine-type="slider" style="width:150px;display: inline-block"  value="Field Details" ></div>
   <input type="text"name="{{:name}}" data-spine-prop="{{:name}}" data-spine-type="slider" size="2" maxlength="10" />
   <div class="error-container"></div>
</div>
</script>

<script type="text/template" id="tmpl_check_edit">
<div class="fieldbox">	<label for="{{:name}}" class="field-label">{{:label}}  </label> <input type="checkbox" name="{{:name}}" data-spine-prop="{{:name}}" data-spine-type="checkbox"  value="Y" />
<input type="text"name="hid_{{:name}}" data-spine-prop="hid_{{:name}}" data-spine-type="checkbox" size="1" maxlength="10" />
	<div class="error-container"></div>
</div>
</script>

<script type="text/template" id="tmpl_radiogroup_edit">
<div class="fieldbox">	<label for="caption" class="field-label">{{:label}}  </label> 

<div style="float:left;width:200px" class="ui-helper-clearfix">
	<ul style="display:block; clear:both; list-style:none;padding:0px; margin: 0px" data-spine-prop="disp_{{:name}}" data-spine-type="disp_radiogroup">
	{{for  radioList }} 
	
	<li > <input type="radio" name="{{: ~root.name}}" id="{{: #index}}_{{: ~root.name}}"   value="{{:val}}" /> 
		<label for="{{: #index}}_{{: ~root.name}}" style="clear:both;float: none;">{{:label}}</label></li>
	
	{{/for}}
	</ul>
	<input type="text"name="{{:name}}" data-spine-prop="{{:name}}" data-spine-type="radiogroup" size="1" maxlength="10" style="float: left"/>
</div>
	<div class="error-container"></div>

</div>
</script>



<script type="text/template" id="tmpl_select_edit">
<div class="fieldbox">	
<label for="{{:name}}"  style='display:inline-block;width:50%' class="field-label">{{:label}} 
{{if mandatoryDecorate == 'Y'}}
<span style='color:red' ><strong>*</strong></span>
{{/if}}
</label> <select name="{{:name}}" id="{{:name}}" class="{{:cssclass}}" data-spine-prop="{{:name}}" data-spine-type="text" value="" ></select>
	<div class="error-container"></div>
</div>
</script>


<script type="text/template" id="tmpl_button_view">
<div class="fieldbox">	<label for="caption" class="field-label">{{:label}}  </label> <input type="checkbox" name="{{:name}}" data-spine-prop="{{:name}}" data-spine-type="button"  value="Field Details" ></span>
	<div class="error-container"></div>
</div>
</script>



</head>
<body>
<div id="message"><ul></ul></div>
<div id="errormsg"><ul></ul></div>

<%--
<div id="searchform">
Screen Name: <input placeholder="screen name" value="scr1" id="screenId" />
<button id="btnLoad" onclick="searchScreen();"  >Load</button> 
<button id="btnToggle">view source</button> --%>
<pre id="screenmetajson" class="hideclass"></pre>
</div>

<form id="formScreen" id="formScreen" action="" onsubmit="return false;">
<div id="screen">

</div>
</form>
  
 Validation: <div id="autogeneratedValidation"></div> 	
</body>
</html>
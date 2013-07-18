package com.bi.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
 
public class ResultDTO {

	private ArrayList<String> actionErrors;
	private ArrayList<String> actionMessages;
	private Map<String,ArrayList<String>> fieldErrors;
	private Map<String,Integer> pagination; //{currentpage:,totalpage:,totalrec:,pagesize:}  or stackid1={limit: , offset:, total:}
	private Map<String, String> sessionvars;
	private String result; //it will override the result described in command result type in screen xml
	
	private Map<String,Map<String,String>> errorCodes;
	
	//data={stackid1=[{},{}], stackid2=[{}] }
	private Map<String, ArrayList<Map<String, Object>>> data;
	
	public ArrayList<String> getActionErrors() {
		return actionErrors;
	}
	public void setActionErrors(ArrayList<String> actionErrors) {
		this.actionErrors = actionErrors;
	}
	public ArrayList<String> getActionMessages() {
		return actionMessages;
	}
	public void setActionMessages(ArrayList<String> actionMessages) {
		this.actionMessages = actionMessages;
	}
	public Map<String, ArrayList<String>> getFieldErrors() {
		return fieldErrors;
	}
	public void setFieldErrors(Map<String, ArrayList<String>> fieldErrors) {
		this.fieldErrors = fieldErrors;
	}
	public Map<String, ArrayList<Map<String, Object>>> getData() {
		return data;
	}
	public void setData(Map<String, ArrayList<Map<String, Object>>> data) {
		this.data = data;
	}
	 
	public Map<String, String> getSessionvars() {
		return sessionvars;
	}
	public void setSessionvars(Map<String, String> sessionvars) {
		this.sessionvars = sessionvars;
	}
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}
	public Map<String, Map<String, String>> getErrorCodes() {
		return errorCodes;
	}
	public void setErrorCodes(Map<String, Map<String, String>> errorCodes) {
		this.errorCodes = errorCodes;
	}
	public Map<String, Integer> getPagination() {
		return pagination;
	}
	public void setPagination(Map<String, Integer> pagination) {
		this.pagination = pagination;
	}

	@SuppressWarnings("unchecked")
	public void merge(ResultDTO tempDTO){
		

		Map<String, ArrayList<Map<String, Object>>> tempdata = tempDTO.getData();
		Map<String, Integer> temppagination = tempDTO.getPagination();
		Map<String, Map<String, String>> errCodes = tempDTO.getErrorCodes();
		for (String keyi : tempdata.keySet()) {
			Object val = tempdata.get(keyi);
			Object thisdataval = null;
			if(data.containsKey(keyi))
				thisdataval  = data.get(keyi);
			
			if(thisdataval!=null && val instanceof List<?> && thisdataval instanceof List<?> ){
				((List<Map<String,String>>)thisdataval).addAll((List<Map<String, String>>) val); 
			}else{
				data.putAll(tempDTO.getData());
			}
		}
		
		 
		for (String pageStackId : errCodes.keySet()) {
			Map<String, String> pageData = errCodes.get(pageStackId);
			errorCodes.put(pageStackId, pageData);
		}
		
		actionErrors.addAll(tempDTO.getActionErrors());
		actionMessages.addAll(tempDTO.getActionMessages());
		pagination.putAll(temppagination);
		
		result = tempDTO.getResult();
		
		if(tempDTO.getSessionvars()!=null){
			if(sessionvars == null)
				sessionvars = new HashMap<String, String>();
			sessionvars.putAll(tempDTO.getSessionvars());
		}
	}
	
}

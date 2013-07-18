package com.bi.dto;

import java.util.ArrayList;
import java.util.Map;


public class InputDTO {

	/**
	 * {
	 *  module: '', //required
	 *  cmd:'',     //required
	 * 	formData:{key1:value1, key2: value2},  //can be a complex object for REST protocol
	 *  limit: '',
	 *  offset: '',
	 *  sort:[{sid:, ord: 'asc/desc' }]
	 *  filter: {groupOp:'', rules:[{field: ,op: , data: }], groups:[{groupOp:'', rules: }] },
	 *  paging: {limit:, offset: total}
	 * }
	 */
	
	private Map<String, Object> formData;
	private int limit;
	private int offset;
	private ArrayList<Map<String,String>> sort;
	private String cmd;
	private String module;
	
}

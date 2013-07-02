##Javascript Datasource##
Javascript datasource is used to supply data to various data driven components.

Datasource is composed of two parts. 
* SchemaReader - used to convert any form of input data (CSV, JSON, ARRAY) to javascript array optionally
 capture some extra met data alsso.
* Datasource - Supports Pager, filter, sorter, save , update operations are supported on javascript array 
  provided or read by SchemaReader. This can also handle remote as well as local data using separate fetch url,
  update url, delete url. 
* Observable data - This is totally unrelated to datasource functionality of datasource, but this works well in 
 conjunction with existing components that use datasource so it can be updated on datasource refresh events.

###Additional Components###
There is a component where dynamic forms can be created only on the basis of model. 
Other data driven component which can accept datasource are autocomplete, grids, combobox.
This datasource is basically jquery dataview which is the still unreleased version of jquery-ui grid. Only
SchemaReader is is integrted to create a standalone component with rich features that can be used completely by 
json configuration without writing any javascritp code.

##SchemaReader##
This returns simple array or object based on configuration. 
This is similar to YUI schema reader.

The optiosn accepted are :

```Javascript
 options = {
  			rootList: "data",
				meta: "",
				datatype: "json",
				items: [],
				resultFields: null//[{name: "name",  mapping: "name" /*can be xpath,json path
				                  // or javascript function*/}, {name: "email"}]
				,
				csvFieldSep : ",",
				csvRecordSep: "\r\n",
				csvFieldDelimiter: '"'
			};
```

datatype - can be json,csv
resultFields - Data transformation is done based on this parameter for JSON. There is data property mapping as well as
data property filtering. 

###The following are two types for JSON reader.###

* Type 1. `[{name: "name",  mapping: "full_name" }, {name: "email", mapping: "email_id"}]`


```javascript
If the data input is 
[{
  full_name: "samarjit",
  email_id: "samarjit@email",
  extra: "extra value"
 },
 {
 full_name: "tutu",
 email_id: "tutu@email",
 extra: "extra value2"
 }
]

After data is read by SchemaReader it will be transformed to
[
  {
  name: "samarjit",
  email: "samarjit@email"
  },
  {
  name: "tutu",
  email: "tutu@email"
  }
]
```

* Type 2. `["name","email"]`. This will be internally treated as `[{name: "name",  mapping: "name" }, {name: "email", mapping: "email"}]`

```javascript
If the data input is 
[{
  name: "samarjit",
  email: "samarjit@email",
  extra: "extra value"
 },
 {
 name: "tutu",
 email: "tutu@email",
 extra: "extra value2"
 }
]

After data is read by SchemaReader it will be transformed to
[
  {
  name: "samarjit",
  email: "samarjit@email"
  },
  {
  name: "tutu",
  email: "tutu@email"
  }
]
```

###CSV reader###
The csv data can be specified as a combination of fields seperators and record separators.

The default comma seperated values with record separator 

``` 
csvFieldSep : ",",
csvRecordSep: "\r\n",  //it will handle line ending with either \r or ]n also
csvFieldDelimiter: '"'
```

Suppose input data is 

```json
120, samarjit, sam@email
121, tutu, tutu@email
```

And resultFields is `[{ name: "id", mapping: 0} , {name: "name", mapping: 1}, {name: "email", mapping: 2}]`

Then the result data would be like.

```javascript
[
  {
  id: 120,
  name: "samarjit",
  email: "samarjit@email"
  },
  {
  id: 121,
  name: "tutu",
  email: "tutu@email"
  }
]
```

TODO:
Although I have not yet written a wrapper for XML a similar wrapper can be written for XML also, where mappign will 
be xpath.

Another feature is meta tags for getting the paging, limit, offset, filter criterion, sort id and sort order
 of data apart form the Array data.
 

```javascript
 data = [{
			name: "sam",
			email: "sam@email"
	        }];
	 model = [ {name: "name", type: "string", capturetype: "text", displaytype: "displayText", label: "Name", searchable: true, isPartOfKey: true, convertToModel: null /*view to model*/, convertToView: null /*model to view*/ 	},
			   {name: "email", type: "string", capturetype: "email", displaytype: "displayText", label: "Email", searchable: true, isPartOfKey: true, convertToModel: null /*view to model*/, convertToView: null /*model to view*/ 	},
				];
		
		
	 var datasource = $.uix.datasource({reader: new SchemaReader(), model: model ,rawdata: data, paging:{limit: 1} });
	datasource.options.input ->  is data as defined above
	datasource.refresh(); //initialize datasource mechanism
	datasource.result -> internal object to be used by widgets that uses datasource	
```


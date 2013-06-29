##Javascript Datasource##
Javascript datasource is used to supply data to various data driven components. 

Datasource is composed of two parts. 
* Data Reader - used to convert any form of input data (CSV, JSON, ARRAY) to array, json.
* Datasource Pager, filter, sorter, save , update.
* Observable data so it can be linked with any widget that can read datasource events

###Additional Components###
There is a component where dynamic forms can be created only on the basis of model. 
Other data driven component which can accept datasource are autocomplete, grids, combobox.
The datasource is complete the still unreleased version of jquery-ui grid.

##Data Reader##
This returns simple array or object based on configuration. 
This is similar to YUI schema reader.

The optiosn accepted are :

```Javascript
 options = {
  			rootList: "data",
				meta: "",
				datatype: "json",
				items: [],
				resultFields: null//[{name: "name",  mapping: "name" /*can be xpath,json path or javascript function*/}, {name: "email"}]
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

After data is read by DataReader it will be transformed to
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

After data is read by DataReader it will be transformed to
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

```
120, samarjit, sam@email
121, tutu, tutu@email
```

And resultFields is `[{ name: "id", mapping: 0} , {name: "name", mapping: 1}, {name: "email", mapping: 2}]`

Then the result data would be like.
```
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

Although I have not yet writtn a wrapper for XML a similar wrapper can be written for XML also, where mappign will 
be xpath.

Another feature is meta tags for getting the paging, filtering , sorting data apart form the Array data.

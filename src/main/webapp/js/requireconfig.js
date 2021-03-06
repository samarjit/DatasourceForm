require.config({
    baseUrl: '../jsp',
    paths: {
        app: '../js/app',
        jquerygrid: 'http://view.jqueryui.com/grid',
        lib: '../js/lib',
        plugins: '../js/plugins',
        jquery: '../js/lib/jquery-1.9.1',
         jqueryui:   '../js/lib/jquery-ui-1.10.1',
       // jqueryui:   'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui',
        uigridmain: '../js/plugins/jquery.ui.grid',
        uigrid:'../js/plugins/mydataview',
        uigridselectable: '../js/plugins/grid.selectable',
        jqgrid: '../js/plugins/i18n/grid.locale-en',
        jqgridmain:'../js/plugins/jquery.jqGrid.src',
        jquerytmpl: 'http://view.jqueryui.com/grid/external/jquery.tmpl',
        datasource: '../js/plugins/jquery.uix.datasource',
        uidataview: '../js/plugins/jquery.ui.dataview',
        uidataviewlocal: '../js/plugins/jquery.ui.dataviewlocal',
       // uidataviewlocal: 'http://view.jqueryui.com/grid/ui/jquery.ui.dataviewlocal',
        uiobservable: 'http://view.jqueryui.com/grid/ui/jquery.ui.observable',
        rcanjsmain:  'http://canjs.com/release//1.1.6/can.jquery',
        rcanjs: 'http://canjs.com/release/latest/can.view.mustache',
        canjsmain:  '../js/lib/can.jquery',
        canjs: '../js/lib/can.view.mustache',
        jsrender: '../js/plugins/jsrender',
        jsrobservable: '../js/plugins/jquery.observable',
        jsviews: '../js/plugins/jquery.views',
        layout: '../js/plugins/jquery-layout.min',
        ace: '../js/plugins/ace',
        text: '../js/text',
        jqueryvalidation: '../js/plugins/jquery.validate',
        additionalvalidation: '../js/plugins/additional-validation',
        jquerypp: '../js/plugins/jquerypp.custom',
        canui: '../js/plugins/canui',
        screenjs:"../js/screenjs",
        jsonpath: "../js/plugins/jsonpath-0.8.0",
        gridpager: "../js/plugins/grid-pager",
        gridfilter: "../js/plugins/grid-filter",
        gridfilterform: "../js/plugins/grid-filter-form",
        gridnavigator: '../js/plugins/grid-navigator',
        gridsort: '../js/plugins/grid-sort',
        widgethelper: '../js/plugins/widget-helper',
        grideditor: '../js/plugins/grid-editor',
        grideditorinline: '../js/plugins/grid-editor-inline',
        menubar: '../js/plugins/jquery.ui.menubar',
       
    },
    shim: {
        jqueryui: {
           // exports: "$",
            deps: ['jquery']
        },
        widgethelper: ['jqueryui'],
        uidataview: ['jqueryui'],
        uidataviewlocal: ['jqueryui','uidataview'],
        datasource: ['uidataviewlocal'],
        uigrid:['uigridmain'],
        uigridmain: {
        	//exports: "$", 
        	deps:[
        	 'jqueryui',    
        	 'uidataview',
        	 'jsrobservable',
        	 'uidataviewlocal', 
        	 'uigridselectable',
        	 'gridpager',
        	 'gridnavigator',
        	// 'http://view.jqueryui.com/grid/grid-editing/localstore.js',
        	// 'http://view.jqueryui.com/grid/grid-editing/helpers.js',
        	 'jsrender',
        	 'gridfilter',
        	 'gridsort',
        	 'grideditor'
        	]
        },
        grideditor: ['grideditorinline','jqueryui','jsrobservable'],
        grideditorinline: ['jqueryui'],
        uigridselectable:['jqueryui'],
        gridpager:['jqueryui'],
        gridnavigator : ['jqueryui'],
        gridfilter: ['jqueryui'],
        gridsort: ['jqueryui'],
        rcanjsmain: {
        	//exports: "$", 
        	deps: ['jquery']
        },
        rcanjs: { 
        	
        	deps:['rcanjsmain']
        },
        canjsmain: {
        	//exports: "$", 
        	deps: ['jquery']
        },
        canjs: { 
        	
        	deps:['canjsmain']
        },
        jsrender:{
        	//exports: "$",
        	deps:['jquery']
        },
        jsrobservable:['jquery'],
        jsviews: {
        	//exports: "$",
        	deps:['jquery','jsrobservable','jsrender']
        },
        jqgrid: {
        	//exports: "$", 
        	deps:['jqueryui', 'jqgridmain']
        },
        jqgridmain:{
        	//exports: "$",
        	deps:['jqueryui']
        },
        layout:['jqueryui'],
        jquerytmpl: ['jquery'],
        jqueryvalidation:['jquery'],
        additionalvalidation: ['jqueryvalidation'],
        jquerypp: ['jquery'],
        canui: ['jquery','canjs','jquerypp'],
        gridpager: ['jqueryui'],
        gridfilter: ['jqueryui'],
        gridfilterform: ['jqueryui'],
        menubar: ['jqueryui'],
        
    }
});
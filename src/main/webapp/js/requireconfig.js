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
        uigridmain: 'http://view.jqueryui.com/grid/ui/jquery.ui.grid',
        uigrid:'../js/plugins/mydataview',
        jqgrid: '../js/plugins/grid.locale-en',
        jqgridmain:'../js/plugins/jquery.jqGrid.src',
        jquerytmpl: 'http://view.jqueryui.com/grid/external/jquery.tmpl',
        uidataview: '../js/plugins/jquery.ui.dataview',
        uidataviewlocal: '../js/plugins/jquery.ui.dataviewlocal',
       // uidataviewlocal: 'http://view.jqueryui.com/grid/ui/jquery.ui.dataviewlocal',
        uiobservable: 'http://view.jqueryui.com/grid/ui/jquery.ui.observable',
        rcanjsmain:  'http://canjs.com/release//1.1.6/can.jquery',
        rcanjs: 'http://canjs.com/release/latest/can.view.mustache',
        canjsmain:  '../js/lib/can.jquery',
        canjs: '../js/lib/can.view.mustache',
        jsrender: 'http://www.jsviews.com/download/jsrender',
        jsrobservable: '../js/plugins/jquery.observable',
        jsviews: '../js/plugins/jquery.views',
        layout: '../js/plugins/jquery-layout.min',
        ace: '../js/plugins/ace',
        text: '../js/text',
        jqueryvalidation: '../js/plugins/jquery.validate.min',
        additionalvalidation: '../js/plugins/additional-validation',
        jquerypp: '../js/plugins/jquerypp.custom',
        canui: '../js/plugins/canui',
        screenjs:"../js/screenjs",
        jsonpath: "../js/plugins/jsonpath-0.8.0",
        gridpager: "../js/plugins/grid-pager",
        gridfilter: "../js/plugins/grid-filter",
        gridfilterform: "../js/plugins/grid-filter-form"
    },
    shim: {
        jqueryui: {
           // exports: "$",
            deps: ['jquery']
        },
        uidataview: ['jqueryui'],
        uidataviewlocal: ['jqueryui','uidataview'],
        uigrid: {
        	//exports: "$", 
        	deps:[
        	 'jqueryui',    
        	 'uidataview',
        	 'uigridmain',
        	 'uiobservable',
        	 'uidataviewlocal',
        	 'http://view.jqueryui.com/grid/grid-spf/pager.js',
        	 'http://view.jqueryui.com/grid/grid-editing/grid.selectable.js',
        	 'http://view.jqueryui.com/grid/grid-editing/navigator.js',
        	 'http://view.jqueryui.com/grid/grid-editing/localstore.js',
        	 'http://view.jqueryui.com/grid/grid-editing/helpers.js',
        	 'jquerytmpl',
        	 'http://view.jqueryui.com/grid/grid-spf/grid-filter.js',
        	 'http://view.jqueryui.com/grid/grid-spf/grid-sort.js'
        	]
        },
        uigridmain: ['jqueryui'],
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
        gridfilterform: ['jqueryui']
    }
});
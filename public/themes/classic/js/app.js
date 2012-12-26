require(
    ["lib/jquery", 
     "/js/amd/aop.js", 
     "webadmin", 
     "neo4j/webadmin/modules/baseui/BaseUI"
     ], 

    function(jq, aop, webadmin, baseui) {
        webadmin.boot.inject({
            init: function(appState) {
                console.log("well hello there, Neo")
            }
        });

        // use aop to inject a function call after
        jQuery.aop.after( {target: baseui, method: 'render'}, 
          function() { 
            jQuery('#logo').wrap('<a href="http://neo4j.org" />');
          }
        );
    }
);


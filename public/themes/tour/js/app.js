require(
    ["lib/jquery", 
     "/js/amd/aop.js", 
     "webadmin", 
     "neo4j/webadmin/modules/baseui/BaseUI"
     ], 

    function(jq, aop, webadmin, baseui, deck) {    
        // use aop to inject a function call after
        jQuery.aop.after( {target: baseui, method: 'render'}, 
          function() { 
            jQuery('body').append('<div id="tour"/>');
            jQuery('#tour').append('<div class="deck-container" />');
            jQuery('.deck-container').load('/themes/tour/welcome.html', function() {
              $.getScript('/themes/tour/js/deck.core.js', function() {
                $.getScript('/themes/tour/js/deck.navigation.js', function() {
                  $.deck('.slide');
                });
              });
            });
        });
    }
);


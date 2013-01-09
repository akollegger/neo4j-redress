require(
    ["lib/jquery", 
     "/js/amd/aop.js", 
     "webadmin", 
     "neo4j/webadmin/modules/baseui/BaseUI",
     "neo4j/webadmin/modules/dashboard/views/DashboardView"
     ], 

    function(jq, aop, webadmin, baseui, dashboard) {
        // this only works for a modified webadmin which defines a module
        if (undefined != webadmin) {
          webadmin.boot.inject({
              init: function(appState) {
                  console.log("well hello there, Neo")
              }
          });
        }
        
        // use aop to inject a function call after the rendering
        jQuery.aop.after( {target: baseui, method: 'render'}, 
          function() { 
            jQuery('p.copyright').replaceWith('<p class="copyright diff">Copyright (c) 2002-'+new Date().getFullYear()+' <a href="http://neotechnology.com">Neo Technology</a>. License: <a href="http://www.gnu.org/licenses/gpl.html">GNU General Public License</a> version 3 or greater. Icons by <a href="http://glyphish.com/">Glyphish</a> &amp; <a href="http://tango.freedesktop.org/Tango_Icon_Library">Tango</a>.</p>');
          }
        );
        jQuery.aop.after( {target: dashboard, method: 'render'}, 
          function() { 
            jQuery('h1.pad:contains("Neo4j web administration")').replaceWith('<h1 class="pad diff">&not;</h1>');
          }
        );
        
    }
);



/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , webadmin = require('./routes/webadmin')
  , http = require('http')
  , path = require('path')
  , cons = require('consolidate')
  , httpProxy = require('http-proxy');

var app = express();

var proxy = new httpProxy.RoutingProxy();

/* Proxy Neo4j REST calls */
function wantsJson(req) {
  return !(req.headers.accept.indexOf('application/json') < 0)
}

function neo4jProxy(pattern, host, port) {
  return function (req, res, next) {
    if (req.url.match(pattern) || wantsJson(req) ) {
      proxy.proxyRequest(req,res, {
        target: {
          host: host,
          port: port
        },
        enable: {
          xforward: true
        }
      });  
    } else {
      return next();
    }
  };
};

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(neo4jProxy(/\/webadmin\/.+/, 'localhost', 7474));
  app.use(neo4jProxy(/\/db\/data\/.*/, 'localhost', 7474));
  app.use(neo4jProxy(/\/db\/manage\/.*/, 'localhost', 7474));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('the weather is nice in Sweden'));
  app.use(express.cookieSession());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.locals({
  title: 'Neo4j Redressed',
  theme: function() {
  	return "classic";
  }
});


app.get('/', routes.index);
app.get('/webadmin', webadmin.index);
app.get('/users', user.list);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Dressing up Neo4j, on display at port " + app.get('port'));
});


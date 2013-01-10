
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

var neo4j_connect = {
  host: 'localhost',
  port: 7474
};

if (process.env.NEO4J_URL) {
  var matches = process.env.NEO4J_URL.match(/http:\/\/([^:]+):([^@]+)@([^:]+):(\d+)/);
  neo4j_connect.user = matches[1];
  neo4j_connect.password = matches[2];
  neo4j_connect.host = matches[3];
  neo4j_connect.port = parseInt(matches[4]);
}

/* Proxy Neo4j REST calls */
function wantsJson(req) {
  return !(req.headers.accept.indexOf('application/json') < 0)
}

function neo4jProxy(pattern, host, port) {
  return function (req, res, next) {
    if (req.url.match(pattern) || wantsJson(req) ) {
      if (process.env.NEO4J_URL) {
        req.headers.authorization = 'Basic ' + new Buffer(neo4j_connect.user + ':' + neo4j_connect.password).toString('base64');
      }
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
  app.use(neo4jProxy(/\/webadmin\/.+/, neo4j_connect.host, neo4j_connect.port));
  app.use(neo4jProxy(/\/db\/data\/.*/, neo4j_connect.host, neo4j_connect.port));
  app.use(neo4jProxy(/\/db\/manage\/.*/, neo4j_connect.host, neo4j_connect.port));
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
app.get('/deck', routes.deck);

app.get('/webadmin', webadmin.index);

app.get('/theme/:theme', function(req, res, next){
  req.session.theme = req.params.theme;
  res.redirect('/webadmin/');
});



http.createServer(app).listen(app.get('port'), function(){
  console.log("Dressing up Neo4j, on display at port " + app.get('port'));
});


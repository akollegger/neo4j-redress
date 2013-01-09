Neo4j Redressed
===============

Experiments in re-considering and re-vising Neo4j's web interface. 

## How-to

This is an [express.js](http://expressjs.com) project which proxies Neo4j, hijacking
a few small items like the baseline index.html and then injecting modifications
using css and javascript. 

### Prepare Neo4j

- [download neo4j 1.9](http://neo4j.org)
- `neo4j start`

### Get the Redress Proxy

- [got node.js](http://nodejs.org), right?
- `git clone https://github.com/akollegger/neo4j-redress.git`
- `cd neo4j-redress`
- `npm install`

### Run Neo4j Redress

- `node server`
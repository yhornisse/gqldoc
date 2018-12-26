#!/usr/bin/env node


let fetch = require('isomorphic-fetch');
let path = require('path');
let meow = require('meow');
let fs = require('fs');
let GraphQL = require('graphql');
let gqldoc = require('./gqldoc');
let ejs = require('ejs');
let strip = require('strip-bom');

let graphql = GraphQL.graphql;
let parse = GraphQL.parse;

/*  */
function terminate () {
    console.error(cli.help);
    process.exit(1);
}

/*  */
let cli = meow(`
    Options:
      -g --graphql    use graphql schema language as input
      -v --verbose    print introspection result
      -a --auth       set Authorization header for graphql server
      -t --title      HTML title

    Usage:
      $ gqldoc [param] 

    Examples:
      $ gqldoc path/to/schema.gql -g
`, {
    flags: {
	verbose: {
	    type: 'boolean',
	    alias: 'v'
	},
	graphql: {
	    type: 'boolean',
	    alias: 'g'
	},
	auth: {
	    type: 'string',
	    alias: 'a'
	},
	title: {
	    type: 'string',
	    alias: 't'
	}
    }
});


if (cli.flags.graphql && cli.input[0]){
    fs.readFile("./temp/index.ejs", "utf-8", function(err, temp){
	fs.readFile(cli.input[0], "utf-8", function(err, x){
	    let str = gqldoc.showDocument(parse(x));
	    console.log(ejs.render(temp, {
		title:"Schema:" + path.basename(cli.input[0]),
		main: str
	    }));
	})
    });
}else if (cli.input[0] && cli.input[0].slice(0, 4) === 'http'){
    let headers = {
	'Accept': 'application/json',
	'Content-Type': 'application/json'
    };
    if (cli.flags.auth) {
	headers.Authorization = cli.flags.auth;
    }

    p = fetch(cli.input[0], {
	method: 'POST',
	headers: headers,
	body: JSON.stringify({"query":fs.readFileSync('./query.gql', 'utf-8')})
    }).then(function (res) {
	if (!res.ok && cli.flags.verbose) {
            console.log('Request for schema failed w/ ' + res.status + ' (' + res.statusText + ')');
	}
	return res.text();
    }).then(function(text){
	// TODO
	console.log(text);
    });
}else{
    terminate();
}

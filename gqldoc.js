#!/usr/bin/env node
/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2018 Yoshimune Saito
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * */

/**
 * @param {node} a
 * @param {node} b
 */
function order(a, b){
    if (a.name && a.name.value &&
	b.name && b.name.value ){
	return a.name.value > b.name.value;
    }else{
	return a.kind > b.kind;
    }
}


/**
 * @param {description} node
 */
function showFieldDef(node){
    let retval = "";
    let type;
    let name;
    let desc = "unset";

    if (node.description && 
	node.description.kind &&
	(node.description.kind == 'StringValue')){
	desc =  node.description.value;    
    }

    if (node.name && node.name.value){
	name = node.name.value;
    }

    if (node.type && node.type.name && node.type.name.value){
	type = node.type.name.value;
    }

    if (type && name){
	retval += "            <td>" + name + "</td><td>" + type + "</td><td>" + desc + "</td>\n";
    }else{
	retval += "Gyaaaaaa!" + name + " type:" + type + "\n";
    }

    return retval;
}


/**
 * @param {ObjectTypeDefinition} node
 */
function showTypeDef(node){
    let retval = "";
    if (!node || !node.kind || (node.kind!='ObjectTypeDefinition')){
	return retval;
    }

    if (node.name && node.name.value){
	retval += "        <h3>" + node.name.value + "</h3>\n";
    }

    if (node.description && node.description.value){
	retval += "        <p>" + node.description.value + "</p>\n";
    }
    
    retval += "        <table>\n";

    if (node.fields){
	retval += "        <thead>\n";
	retval += "          <tr><th>Name</th><th>type</th><th>description</th></tr>\n";
	
	retval += "        </thead>\n";
	retval += "        <tbody>\n";
	for (let x of node.fields){
	    if (x.kind && (x.kind = 'FieldDefinition')){
		retval += "          <tr>\n";
		retval += showFieldDef(x) + "\n";
		retval += "          </tr>\n";
	    }
	}
	retval += "        </tbody>\n";
	retval += "      </table>\n";
    }

    return retval;
}


/**
 * @param {FragmentDefinition} node
 */
function showFragDef(node){
    let retval = "";

    if (!node.selectionSet || !node.selectionSet.selections ||
	!node.name || !node.name.value){
	return "";
    }

    retval += "        <h3>" + node.name.value + "</h3>\n";
    retval += "        <ul>\n";
    for (let v of node.selectionSet.selections){
	if (v.name && v.name.value){
	    retval += "          <li>" + v.name.value + "</li>\n";
	}
    }
    retval += "        </ul>\n";

    return retval;
}


/**
 * @param {OperationDefinition} node
 */
function showOpDef(node){
    let = "";

    if (!node || !node.kind || (node.kind!='OperationDefinition')){
	return "";
    }

    if (node.name && node.name.value){
	retval += "<h3>" + node.name.value + "</h3>\n";
    }

    // TODO
    retval += "TODO\n"
    retval += node;

    return retval;
}

/**
 * @param {Document} node
 */
function showDocument(node){
    let retval = '';
    let ary;
    if (node && node.kind && node.definitions && (node.kind = 'Document')){
	// Type
	retval += "      <h2>Type</h2>\n";
	ary = node.definitions.filter(v => v.kind && v.kind=='ObjectTypeDefinition');
	if (ary.length){
	    for (let v of ary.sort(order)){
		retval += showTypeDef(v);
	    }
	}else{
	    retval += "      <p>未定義</p>\n";
	}
	retval += "\n";

	// Operation
	retval += "      <h2>Operation</h2>\n";
	ary = node.definitions.filter(v => v.kind && v.kind=='OperationDefinition');
	if (ary.length){
	    for (let v of ary.sort(order)){
		// TODO
		retval += showFragDef(v);
	    }
	}else{
	    retval += "      <p>未定義</p>\n";
	}
	retval += "\n";

	// Fragment
	retval += "      <h2>Fragment</h2>\n";
	ary = node.definitions.filter(v => v.kind && v.kind=='FragmentDefinition');
	if (ary.length){
	    for (let v of ary.sort(order)){
		retval += showFragDef(v);
	    }
	}else{
	    retval += "      <p>未定義</p>\n";
	}
	retval += "\n";
	    
	retval += "      <h2>Others</h2>\n";
	for (let x of node.definitions.filter(v => ["ObjectTypeDefinition",
						    "FragmentDefinition",
						    "OperationDefinition"].indexOf(v.kind)==-1)
		 .sort((a,b) => (a.kind > b.kind))){
	    retval += x + "\n";
	    retval += "<hr>\n";
	}
    }

    return retval;
}

if (typeof exports != 'undefined'){
    exports.showDocument = showDocument;
}


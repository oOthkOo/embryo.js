# Embryo.js
[![NPM](https://nodei.co/npm/embryo.png?downloads=true)](https://nodei.co/npm/embryo/)

The most simple, customizable and easy to use JavaScript standard inheritance library.

Features
-----
 * Support the **new** operator.
 * Support the **instanceof** operator.
 * Support the standard OO **inheritance**
 * Support super constructor **automatic** call
 * Support extending a class **C** via **C.prototype**
 * Support **automatic** 'getters', 'setters' methods generation
 * Support **surcharged** methods, call a specific method from arguments count
 * Support custom class definition **format** (configure all plugins)
 * Support customs **plugins** (create your own plugin or use defaults)
 * Support plugins **management** (whitelist, blacklist plugin from your class definition)

Inspiration
-----
 @ Inspired by Douglass Crockford’s website :(http://javascript.crockford.com/prototypal.html).<br />
 @ Inspired by Cyril Agosta’s library : (https://github.com/cagosta/SeedHq).<br />
 @ Inspired by Angular Framework : (https://github.com/angular/angular.js).<br />
 @ Inspired by JQuery extend's function : (https://github.com/jquery/jquery).<br />
 
Installation
-----
<h4>NodeJS</h4>
To install node embryo module from npm repository :
``` sh
  npm install embryo
```
<h4>Browser</h4>
To use Embryo in browser, just insert this tag in your html :
```html
<script src="dist/embryo-0.0.5.min.js" type="text/javascript"></script>
```
Usage
-----
```javascript
var Embryo = require('embryo')

var Human = Embryo.extend({

    '_type': 'Human',							// define class internal type

    properties : {								// define all class properties
        name: 'John',
        score: 1000,
        power: 2,
        options: [
            'super',
        ]
    },
    init: function() {							// define class constructor
        this.lifes = 3
    },
    walk: function() {
        console.log('walk', this.power)
    },
    run: function() {							// define a simple method
        console.log('0 arg')
    },
	'run|1': function( arg1 ) {					// define a surcharged method 
        console.log('1 arg')					// when you call run( 'foo' )
    },
    'run|2': function( arg1, arg2 ) {			// define a surcharged method
        console.log('2 args')					// when you call run( 'foo', 'bar' )
    },
    'run|3': function( arg1, arg2, arg3 ) {
        console.log('3 args')
    }
})

var Superman = Human.extend({

    '_type': 'Superman',
    
    '_blacklist': [
    	'Attribute',	// Attribute plugin blacklisted for this class
    	'*'				// All plugins are blacklisted for this class
    ],

    properties : {
        name: 'Clark Kent',
        score: 5000,
        power: 10,
        options: [
            'super',
            'godness',
            'unlimited'
        ]
    },
    init: function() {
        this.lifes = 10
    },
    fly: function() {
        console.log('fly', this.power)
    }
})

var human = new Human()
human.walk()								// -> walk: 2
console.log( human.getScore() )				// -> 1000
console.log( human.getName() )				// -> John
console.log( human.getOptions() )			// -> ['super']

human.run()									// -> call method run()
human.run( '1' )							// -> call method human['run|1']()
human.run( '1', '2' )						// -> call method human['run|2']()
human.run( '1', '2', '3' )					// -> call method human['run|3']()
human.run( '1', '2', '3', '4' )				// -> call default method run()
 
var superman = new Superman()
superman.walk()								// -> walk: 10
superman.fly()								// -> fly: 10
superman.getFly()							// Error, Attribute plugin blacklisted,
											// there is no generated method with name 'getFly'

console.log( human instanceof Human ) 		// -> true
console.log( human instanceof Superman )	// -> false
console.log( superman instanceof Human )	// -> true
```

Configure
-----
To configure Embryo :
```javascript
Embryo.configure({
    cstrName: 'init',				// default class constructor name
    forceCstr: true,				// class constructor required ?
    nameBlacklist: '_blacklist',	// array key witch contains disabled plugins names	
    deleteBlacklist: true			// delete blacklist array before class instanciation ?
})
```
Plugins
-----
Embryo enables by default 3 plugins :
 * Extend : A plugin to add default properties values
 * Attribute : A plugin to generate "getters" and "setters" methods
 * BeforeAfter : A plugin to redefine/control super methods execution
 * Surcharge : A plugin to allow you call specific method with multiple arguments

<h4>Extend</h4>
To configure Extend plugin :
```javascript
Embryo.plugins['Extend'].configure({
    nameType: '_type',				// default class type property name
    typeDefault: 'Embryo',			// default class type value
    forceTyping: true,				// add a default class type if not exists
    nameProperties: 'properties',	// default property object name
    deleteProperties: true			// delete properties object before class instanciation ?
})
```
<h4>Attribute</h4>
To configure Attribute plugin :
```javascript
Embryo.plugins['Attribute'].configure({
	getPrefix: 'get',		// default get prefix name
    setPrefix: 'set',		// default set prefix name
    camelize: true			// camelize generated methods names (getscore or getScore)
})
```
<h4>BeforeAfter</h4>
To configure BeforeAfter plugin :
```javascript
Embryo.plugins['BeforeAfter'].configure({
	beforePrefix: '-',		// default before trigger prefix in method name (ex: -score)
    afterPrefix: '+',		// default after trigger prefix in method name (ex: +score)
    hiddenPrefix: '_bah_'	// default prefix for hidden method (ex: score() -> call _bah_score())
})
```
<h4>Surcharge</h4>
To configure Surcharge plugin :
```javascript
Embryo.plugins['Surcharge'].configure({
	suffix: '|',			// default trigger suffix in method name (ex: score|2)
    hiddenPrefix: '_pm_'	// default prefix for hidden method (ex: score() -> call _pm_score())
})
```
Your plugin
-----
<h4>Create your plugin</h4>
To create your plugin, simply create a new instance of Plugin, configure it and use it !
```javascript
var MyPlugin = Embryo.Plugin.extend({
    name: 'MyPlugin',						// your plugin's name
    options: {
        option1: 'value1',					// your plugin's options...
        option2: 'value2',
        option3: 'value3'
    },
    init: function() {						// your plugin's constructor
        
    },
    //
    // Embryo execute this function for all class creation
    // o: class properties
    // debug: debug mode for this plugin
    // child: class's prototype
    //
    exec: function( o, debug, child ) {

		// Check if your plugin is blacklisted for this class
        if (this.isBlacklisted( o )) {
            debug && console.log( '[' + this.name + '] - SKIPPED' )
            return o
        }

		// if debug mode is enabled for this plugin,
		// show all class property before class creation
        debug && debug( this.name, 'BEFORE', o )

        // your plugin's code...        

		// if debug mode is enabled for this plugin,
		// show all class property after class creation
        debug && debug( this.name, 'AFTER', o )

		// return new class properties
        return o
    }
})

// Create an instance of your plugin
var myPlugin = new MyPlugin()
// Tell embryo to use your new plugin
// use( plugin, debug )
Embryo.use( myPlugin, false )
// Now, you will able to reconfigure your plugin later...
Embryo.plugins['MyPlugin'].configure({
	option1: 'value1',					// your plugin's options...
    option2: 'value2',
    option3: 'value3' 
})
```

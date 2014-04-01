# Embryo.js

The most simple, customizable and easy to use JavaScript standard inheritance library.

Features
-----
 * Support the **new** operator.
 * Support the **instanceof** operator.
 * Support the standard OO **inheritance**
 * Support super constructor **automatic** call
 * Support extending a class **C** via **C.prototype**
 * Support **automatic** 'getters', 'setters' methods generation
 * Support **surcharged** methods (soon..)
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
Just include theses scripts in your application (Standalone, NodeJS module coming soon ;-)).

``` html
<script src='embryo.js'></script>
<script src='plugins/extend.js'></script>
<script src='plugins/attribute.js'></script>
<script src='plugins/plus-minus.js'></script>
<script src='main.js'></script>
```
Usage
-----
```javascript

var Human = Embryo.extend({

    '_type': 'Human',

    properties : {
        name: 'John',
        score: 1000,
        power: 2,
        options: [
            'super',
        ]
    },
    init: function() {
        this.lifes = 3
    },
    walk: function() {
        console.log('walk', this.power)
    }
})

var Superman = Human.extend({

    '_type': 'Superman',

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
human.walk() // -> walk: 2
console.log( human.getScore() ) // -> 1000
console.log( human.getName() ) // -> John
console.log( human.getOptions() ) // -> ['super']
 
var superman = new Superman()
superman.walk() // -> walk: 10
superman.fly() // -> fly: 10

console.log( human instanceof Human ) // -> true
console.log( human instanceof Superman ) // -> false
console.log( superman instanceof Human ) // -> true

```

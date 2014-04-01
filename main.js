
// Configure all Embryo plugins
var extendPlugin = new Extend()
extendPlugin.configure({
    nameType: '_type',
    nameProperties: 'properties',
    deleteProperties: true,
    forceTyping: true
})

var attributePlugin = new Attribute()
attributePlugin.configure({
    getPrefix: 'get',
    setPrefix: 'set',
    camelize: true
})

var plusMinusPlugin = new PlusMinus()
plusMinusPlugin.configure({
    
})

// Setting Embryo ;-)
Embryo.configure({
    cstr: 'init'
})
Embryo.use( extendPlugin, false )
Embryo.use( attributePlugin, false )
Embryo.use( plusMinusPlugin, false )

var Human = Embryo.extend({

    '_type': 'Human',

    properties : {
        name: 'John',
        score: 1000,        
        options: [
            'super',
            'godness',
            'unlimited'
        ]
    },

    init: function() {
        this.legs = 2
    },
    walk: function() {
        console.log('legs', this.legs)
    }
})

var Dog = Embryo.extend({

    '_type': 'Dog',

    init: function() {
        this.legs = 4
    },
    bark: function() {
        console.log('wouf wouf')
        console.log('legs', this.legs)
    }
})
 
var Doberman = Dog.extend({

    '_type': 'Doberman',
    
    init: function() {
        this.legs = 4
        console.log('Dog')
    },
    growl: function() {
        console.log('aouwww')
        console.log('legs', this.legs)
    }
})

var dog = new Dog()
dog.bark()

var human = new Human()
human.walk()
console.log( 'human.getScore()', human.getScore() )
console.log( 'human.getName()', human.getName() )
console.log( 'human.getOptions()', human.getOptions() )
 
var rufus = new Doberman()
rufus.bark()
rufus.growl()

console.log( rufus instanceof Doberman )
console.log( rufus instanceof Dog )
console.log( rufus instanceof Human )

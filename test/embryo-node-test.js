var Embryo = require('../lib/main')

var Dog = Embryo.extend({

    '_type': 'Dog',

    /*'_blacklist': [
        '*'
    ],*/

    properties : {
        name: 'Charly'
    },

    init: function() {
        
    },

    'bark': function() {
        console.log('Waouf Waouf')
    }
})

var Human = Embryo.extend({

    '_type': 'Human',

    /*'_blacklist': [
        'Attribute'
    ],*/

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
        
    },

    'walk': function() {
        console.log('W')
    },

    '-walk': function() {
        console.log('A')
    },

    '+walk': function() {
        console.log('B')
    },

    run: function() {
        console.log('0 arg')
    },

    'run|1': function( arg1 ) {
        console.log('1 arg')
    },

    'run|2': function( arg1, arg2 ) {
        console.log('2 args')
    },

    'run|3': function( arg1, arg2, arg3 ) {
        console.log('3 args')
    }
})

var Superman = Human.extend({

    '_type': 'Superman',

    '_blacklist': [
        'Attribute'
    ],

    init: function() {
        console.log('Superman')
    },

    fly: function() {
        console.log('F')
    },

    'tornade': function() {
        console.log('T')
    },

    '+tornade': function() {
        console.log('T2')
    }
})

//console.log('[extend]:', Human.extend)

var dog = new Dog()
dog.bark()

var human = new Human()
human.walk()
//human['run|1']()

human.run()
human.run( '1' )
human.run( '1', '2' )
human.run( '2', '2', '3' )

var superman = new Superman()
superman.walk()
superman.fly()
superman.tornade()

var plugin = Embryo.plugins('BeforeAfter')
if (plugin) {
    //console.log(plugin.getName(), plugin)
    plugin.configure({
        beforePrefix: '-',
        afterPrefix: '+',
        hiddenPrefix: '_bah_'
    })
}

var dog2 = superman.new( Dog )
dog2.bark()

superman.stats()
superman.destroy()

var Embryo = require('../lib/main')

console.log( 'version', Embryo.version )

var Dog = Embryo.extend({

    '_type': 'Dog',

    /*'_blacklist': [
        '*'
    ],*/

    properties : {
        name: 'Charly'
    },

    init: function() {
        console.log('Dog')
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
    init: function( o ) {
        console.log('Human', o)
    },
    'walk': function( pitch ) {
        console.log('pitch', pitch)
        console.log('walk', this.name)
    },
    '-walk': function( pitch ) {
        console.log('pitch', pitch)
        console.log('-walk', this.name)
    },
    '+walk': function( pitch ) {
        console.log('pitch', pitch)
        console.log('+walk', this.name)
    },
    run: function() {
        console.log('run(0)', this.name)
    },
    'run|1': function( arg1 ) {
        console.log('run(1)', this.name)
    },
    'run|2': function( arg1, arg2 ) {
        console.log('run(2)', this.name)
    },
    'run|3': function( arg1, arg2, arg3 ) {
        console.log('run(3)', this.name)
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

var God = Superman.extend({

    '_type': 'God',

    '_blacklist': [
        'Attribute'
    ],

    init: function() {
        console.log('God')
    },

    judge: function() {
        console.log('J')
    }
})

//console.log('[extend]:', Human.extend)

var dog = new Dog()
dog.bark()

var human = new Human({
    a: 1,
    b: 2
})
human.walk( 1 )
//human['run|1']()

human.run()
human.run( '1' )
human.run( '1', '2' )
human.run( '2', '2', '3' )

var superman = new Superman()
superman.walk( 2 )
superman.fly()
superman.tornade()

var god = new God()
god.walk( 3 )
god.fly()
god.tornade()
god.judge()

console.log('types', god._types)

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

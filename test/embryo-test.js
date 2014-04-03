var Embryo = require('../lib/main')

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
        
    },

    'walk': function() {
        console.log('W')
    },

    '-walk': function() {
        console.log('A')
    },

    '+walk': function() {
        console.log('B')
    }
})

var Superman = Human.extend({

    '_type': 'Superman',

    '_blacklist': [
        'Attribute',
        'BeforeAfter',
        '*'
    ],

    init: function() {
        
    },

    fly: function() {
        console.log('F')
    }
})

var human = new Human()
human.walk()

var superman = new Superman()
superman.walk()
superman.fly()

var plugin = Embryo.plugins['Extend']
console.log(plugin.getName(), plugin)

Embryo.plugins['BeforeAfter'].configure({
    beforePrefix: '-',
    afterPrefix: '+',
    hiddenPrefix: '_bah_'
})

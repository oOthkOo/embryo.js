var Embryo = require('../lib/main')

console.log( 'version', Embryo.version )

var Human = Embryo.extend({
    '_type': 'Human',
    properties : {
        name: 'John'
    },
    init: function () {
        console.log('-Human-')
    }
})

console.log('Human',Human)

var Superman = Human.extend({
    '_type': 'Superman',
    properties : {
        name: 'John'
    },
    init: function () {
        console.log('-Superman-')
    }
})

console.log('Superman',Superman)

var God = Superman.extend({
    '_type': 'God',
    properties : {
        name: 'John'
    },
    init: function () {
        console.log('-God-')
    }
})

console.log('God',God)


var Superhero = Human.extend({
    '_type': 'Superhero',
    properties : {
        name: 'John'
    },
    init: function () {
        console.log('-Superhero-')
    }
})

console.log('Superhero', Superhero)

//console.log('Human <- Embryo')
var h = new Human()

//console.log('Superman <- Human <- Embryo')
var sm = new Superman()

//console.log('Superhero <- Human <- Embryo')
var sh = new Superhero()

//console.log('God <- Superman <- Human <- Embryo')
var g = new God()

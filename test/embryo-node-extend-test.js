var Embryo = require('../lib/main')

console.log( 'version', Embryo.version )

var Human = Embryo.extend({
    '_type': 'Human',
    properties : {
        nickname: 'John'
    },
    init: function () {
        console.log('-Human-')
    }
})

console.log('Human',Human)

var Superman = Human.extend({
    '_type': 'Superman',
    properties : {
        nickname: 'Mike'
    },
    init: function () {
        console.log('My nickname is', this.nickname)
        console.log('-Superman-')
    }
})

console.log('Superman',Superman)

var God = Superman.extend({
    '_type': 'God',
    properties : {
        nickname: 'Dixon'
    },
    init: function () {
        console.log('-God-')
    }
})

console.log('God',God)


var Superhero = Human.extend({
    '_type': 'Superhero',
    properties : {
        nickname: 'John'
    },
    init: function () {
        console.log('-Superhero-')
    }
})

console.log('Superhero', Superhero)

console.log('Human <- Embryo')
var h = new Human()
console.log('nickname', h.nickname)
h.setNickname( 'Pierre' )
console.log('nickname', h.nickname)

console.log('Human <- Embryo')
var f = new Human()
console.log('nickname', f.nickname)
f.setNickname( 'Julie' )
console.log('nickname', f.nickname)

console.log('Superman <- Human <- Embryo')
var sm = new Superman()
console.log('nickname', sm.nickname)

console.log('Superhero <- Human <- Embryo')
var sh = new Superhero()

console.log('God <- Superman <- Human <- Embryo')
var g = new God()

var Embryo = require('../lib/embryo')

var Attribute = Embryo.Plugin.extend({
    name: 'Attribute',
    options: {
        getPrefix: 'get',
        setPrefix: 'set',
        camelize: false
    },
    init: function() {
        
    },
    exec: function( o, debug, child ) {

        debug && debug( this.name, 'BEFORE', o )

        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                var value = o[n]
                if (typeof(value) !== 'function') {
                    var fname = this.options.getPrefix + this.camelize( n )
                    this.defineGetter( o, fname, n )
                    fname = this.options.setPrefix + this.camelize( n )
                    this.defineSetter( o, fname, n )
                }    
            }
        }                

        debug && debug( this.name, 'AFTER', o )

        return o
    },
    defineGetter: function( o, name, property ) {
        o[name] = function () {
            return this[property]
        }
    },
    defineSetter: function( o, name, property ) {
        o[name] = function ( v ) {
            this[property] = v
        }
    },
    camelize: function( text ) {
        text = text.toLowerCase()
        text = text.charAt(0).toUpperCase() + text.slice(1);
        return text
    }
})

module.exports = Attribute

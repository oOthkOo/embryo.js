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

        if (this.isBlacklisted( o )) {
            debug && console.log( '[' + this.name + '] - SKIPPED' )
            return o
        }

        debug && debug( this.name, 'BEFORE', o )

        var props = o[this.options.nameProperties] || {}

        for (var n in props) {
            if (props.hasOwnProperty(n)) {
                var value = props[n]
                if (typeof(value) !== 'function') {
                    var name = this.options.camelize ? this.camelize( n ) : n
                    var fname = this.options.getPrefix + name
                    this.defineGetter( o, fname, n )
                    name = this.options.camelize ? this.camelize( n ) : n
                    fname = this.options.setPrefix + name
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

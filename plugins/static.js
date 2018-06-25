var Embryo = require('../lib/embryo')

var Static = Embryo.Plugin.extend({
    name: 'Static',
    options: {
        prefix: '$'
    },
    init: function () {

    },
    exec: function ( o, debug, child ) {

        if (this.isBlacklisted( o )) {
            debug && console.log( '[' + this.name + '] - SKIPPED' )
            return o
        }

        debug && debug( this.name, 'BEFORE', o )

        var prefix = this.options.prefix

        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                var func = o[n]
                if (typeof(func) == 'function') {
                    if (n.indexOf(prefix) > -1) {
                        parts = n.split(prefix)
                        var name = parts[1]
                        if (name) {
                            this.defineStaticMethod(child, name, func)
                        }
                    }
                }
            }
        }

        debug && debug( this.name, 'AFTER', o )

        return o
    },
    defineStaticMethod: function (child, name, func) {
        child[name] = function () {
            return func.apply(this, arguments)
        }
    }
})

module.exports = Static

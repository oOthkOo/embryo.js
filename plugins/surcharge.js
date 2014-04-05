var Embryo = require('../lib/embryo')

var Surcharge = Embryo.Plugin.extend({
    name: 'Surcharge',
    options: {
        suffix: '|',
        hiddenPrefix: '_pm_'
    },
    methods: [],
    init: function() {
        
    },
    exec: function( o, debug, child ) {

        if (this.isBlacklisted( o )) {
            debug && console.log( '[' + this.name + '] - SKIPPED' )
            return o
        }

        debug && debug( this.name, 'BEFORE', o )

        var suffix = this.options.suffix
        this.methods = []

        //console.log('suffix', suffix)

        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                if (typeof(o[n]) == 'function') {
                    //console.log('n', n)
                    if (n.indexOf(suffix) > -1) {
                        parts = n.split(suffix)
                        //console.log('parts', parts)
                        var name = parts[0]
                        if (name) {
                            if (!this.isMethodExist(name)) {
                                this.methods.push(name)
                            }
                        }
                    }
                }  
            }
        }

        for (var m=0; m<this.methods.length; m++) {
            this.defineMethod( o, this.methods[m] )
        }

        debug && debug( this.name, 'AFTER', o )

        return o
    },
    isMethodExist: function( name ) {
        for (var m=0; m<this.methods.length; m++) {
            if (this.methods[m] == name) {
                return true
            }
        }
        return false
    },
    defineMethod: function( o, name ) {
        var hiddenPrefix = this.options.hiddenPrefix
        var method = hiddenPrefix + name
        var suffix = this.options.suffix
        //console.log('method', method)
        o[method] = o[name]
        o[name] = function () {
            var fname = name + suffix + arguments.length
            //console.log('fname', fname)
            var fn = this[fname]
            if (!fn) {
                fname = hiddenPrefix + name
                //console.log('fname', fname)
                fn = this[fname]
            }
            if (!fn) {
                throw new Error( 'method "' + name + '" not defined.' )
            }
            fn()
        }        
    }
})

module.exports = Surcharge

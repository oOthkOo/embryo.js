var Embryo = require('../lib/embryo')

var BeforeAfter = Embryo.Plugin.extend({
    name: 'BeforeAfter',
    options: {
        beforePrefix: '-',
        afterPrefix: '+',
        hiddenPrefix: '_pm_'
    },
    init: function() {
        
    },
    exec: function( o, debug, child ) {

        if (this.isBlacklisted( o )) {
            debug && console.log( '[' + this.name + '] - SKIPPED' )
            return o
        }

        debug && debug( this.name, 'BEFORE', o )

        var methods = {}
        var bp = this.options.beforePrefix
        var ap = this.options.afterPrefix

        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                var value = o[n]
                var name = ''
                var method = null
                if (typeof(value) == 'function') {
                    if (n.indexOf(ap) > -1) {
                        name = n.replace(ap,'')
                        method = methods[name]
                        if (!method) {
                            method = methods[name] = {
                                before: false,
                                after: false
                            }
                        }
                        method.after = true
                    }
                    else if (n.indexOf(bp) > -1) {
                        name = n.replace(bp,'')
                        method = methods[name]
                        if (!method) {
                            method = methods[name] = {
                                before: false,
                                after: false
                            }
                        }
                        method.before = true
                    }
                }  
            }
        }

        for (var m in methods) {
            if (methods.hasOwnProperty(m)) {
                //console.log(m,)
                var options = methods[m]
                this.defineMethod( o, m, options.before, options.after )
            }
        }

        debug && debug( this.name, 'AFTER', o )

        return o
    },
    defineMethod: function( o, name, before, after ) {
        if (!o[name]) {
            throw new Error( 'method ' + name + ' not found.' )
        }
        var method = this.options.hiddenPrefix + name
        var beforeMethod = this.options.beforePrefix + name
        var afterMethod = this.options.afterPrefix + name
        o[method] = o[name]
        if (before && after) {
            o[name] = function () {
                this[beforeMethod].apply(this, arguments)
                this[method].apply(this, arguments)
                this[afterMethod].apply(this, arguments)
            }
        }
        else if (before) {
            o[name] = function () {
                this[beforeMethod].apply(this, arguments)
                this[method].apply(this, arguments)
            }
        }
        else {
            o[name] = function () {
                this[method].apply(this, arguments)
                this[afterMethod].apply(this, arguments)
            }
        }        
    }
})

module.exports = BeforeAfter

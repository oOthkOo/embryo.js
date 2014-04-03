/**
    Embryo version 0.0.1
    Author:
        Tierry Danquin
    Github:
        https://github.com/oOthkOo/embryo.js
    Description:
        The most simple, customizable and easy to use
        JavaScript standard inheritance library
**/

var options = {
    cstrName: 'init',
    forceCstr: true,
    nameBlacklist: '_blacklist',
    deleteBlacklist: true
}
var plugins = []

var debugPlugin = function( name, step, o ) {
    console.log( '[' + name + '] - ' + step )
    console.log( "\ttype: ", o._type )
    var o = o.prototype || o
    for (var name in o) {
        if (o.hasOwnProperty(name)) {
            var value = o[name]
            var text = typeof(value)
            switch (text) {
                case 'function':
                    text = value.toString().replace(/\n/g,'')
                    text = text.replace(/\s+/g,' ')
                    break
                case 'object':
                    text = JSON.stringify(value)
                    break
                default:
                    text = value
                    break
            }
            console.log( "\tproperty: [" + name + "]:\t\t[" + text + "] -> (" + typeof(value) + ")" )       
        }
    }
}

var Embryo = function() {
    this[options.cstrName] && this[options.cstrName].apply(this, arguments)
}

Embryo.extend = function( o ) {

    var c = o[options.cstrName] || null
    if (options.forceCstr && !c) {
        if (!c) {
            throw Error( 'No constructor function found.')
        }
        
    }
    if (c && typeof(c) !== 'function') {
            throw Error( 'Constructor function invalid.')
    }
    
    var parent = this    
    var child = function() {
        return parent.apply(this, arguments)
    }    
    child.extend = parent.extend
    
    var Surrogate = function() {} 
    Surrogate.prototype = parent.prototype
    child.prototype = new Surrogate

    for (var p=0; p<plugins.length; p++) {
        var plugin = plugins[p]
        var handle = plugin.handle
        var debug = plugin.debug ? debugPlugin : null
        o = handle.exec( o, debug, child )
    }   

    for (var key in o) {
        if (key == options.nameBlacklist &&
            options.deleteBlacklist) {
            continue
        }
        child.prototype[key] = o[key]
    }

    return child 
}

Embryo.configure = function ( o ) {
    for (var n in o) {
        if (o.hasOwnProperty(n)) {
            options[n] = o[n]
        }
    }
}

Embryo.use = function ( plugin, debug ) {
    plugin.configure( options )
    plugins.push({
        handle: plugin,
        debug: debug || false
    })
}    

Embryo.configure()

var Plugin = Embryo.extend({

    '_type': 'Plugin',

    name: 'Plugin',
    options: null,
    
    init: function() {
        
    },

    configure: function( o ) {
        for (var n in o) {
            if (o.hasOwnProperty(n)) {
                this.options[n] = o[n]
            }
        }
    },

    isBlacklisted: function( o ) {
        var pl = o['_blacklist']
        if (!pl) {
            return false
        }
        //console.log('pl', pl)
        for (var p=0; p<pl.length; p++) {
            var plugin = pl[p]
            //console.log('plugin', plugin)
            if (plugin == this.name ||
                plugin == '*') {
                return true
            }
        }
        return false
    }   
})

module.exports = Embryo
module.exports.Plugin = Plugin

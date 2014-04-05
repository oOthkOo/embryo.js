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

var embryo_options = {
    cstrName: 'init',
    forceCstr: true,
    nameBlacklist: '_blacklist',
    deleteBlacklist: true
}

var embryo_plugins = []

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
    this[embryo_options.cstrName] && this[embryo_options.cstrName].apply(this, arguments)
}

Embryo.extend = function( o ) {

    //console.log(o._type + ' - start')
    //var timeStart = new Date().getTime()

    var c = o[embryo_options.cstrName] || null
    if (embryo_options.forceCstr && !c) {
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
    Surrogate.prototype = this.prototype
    child.prototype = new Surrogate

    for (var p=0; p<embryo_plugins.length; p++) {
        var plugin = embryo_plugins[p]
        //console.log('plugin ' + plugin.name + ' -> ' + o._type)
        var debug = plugin.isDebug() ? debugPlugin : null
        o = plugin.exec( o, debug, child )
    }

    for (var key in o) {
        if (key == embryo_options.nameBlacklist &&
            embryo_options.deleteBlacklist) {
            continue
        }
        child.prototype[key] = o[key]
    }

    //console.log(o._type + ' - end')
    //var timeEnd = new Date().getTime()
    //console.log('time: ' + (timeEnd - timeStart) + 'ms') 

    return child 
}

Embryo.configure = function ( o ) {
    for (var n in o) {
        if (o.hasOwnProperty(n)) {
            embryo_options[n] = o[n]
        }
    }
}

Embryo.use = function ( plugin, debug ) {
    plugin.configure( embryo_options )
    plugin.setDebug( debug )
    embryo_plugins.push(plugin)
}

Embryo.plugins = function( name ) {
    for (var p=0; p<embryo_plugins.length; p++) {
        var plugin = embryo_plugins[p]
        if (plugin.name == name) {
            return plugin
        }
    }
    return null
}   

Embryo.configure()

Embryo.Plugin = Embryo.extend({
    '_type': 'Plugin',
    name: 'Plugin',
    options: null,
    init: function( debug ) {
        this.setDebug( debug )
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
    },
    isDebug: function() {
        return this.debug
    },
    setDebug: function( debug ) {
        this.debug = debug || false
    },
    getName: function() {
        return this.name
    }  
})

module.exports = Embryo

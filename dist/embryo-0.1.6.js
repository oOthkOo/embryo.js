/**
    Embryo version 0.1.6
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
    cstrArrayName: '_types',
    forceCstr: true,
    nameType: '_type',
    forceTyping: true,
    typeDefault: 'Embryo',
    nameProperties: 'properties',
    nameBlacklist: '_blacklist',
    deleteBlacklist: true
}

var embryo_plugins = []
var embryo_types = []

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

var isTypeExist = function ( types, name ) {
    for (var t=0; t<types.length; t++) {
        var type = types[t]
        if (type.name == name) {
            return true
        }
    }
    return false
}

var Embryo = function() {

    //console.log('---START---')

    // Select all matched types
    var types = []
    for (var i=0; i<embryo_types.length; i++) {
        var type = embryo_types[i]
        if (this instanceof type.child) {
            types.push(type)
        }
    }

    // Extend types properties from last to first
    for (var i=types.length-1; i>-1; i--) {
        var type = types[i]
        var props = type.props
        if (props) {
            for (var n in props) {
                if (props.hasOwnProperty(n)) {
                    if (typeof this[n] == 'undefined') {
                        this[n] = props[n]
                        //console.log('['+n+']=['+props[n]+']')
                    }
                }
            }
        }
    }

    // Call each types constructors
    for (var i=0; i<types.length; i++) {
        var type = types[i]
        //var name = type.name
        var init = type.init
        if (init) {
            init.apply(this, arguments)
        }
    }

    //console.log('---END---')
}

Embryo.version = '0.1.6'

Embryo.extend = function( o ) {

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

    if (embryo_options.forceTyping && !o[embryo_options.nameType]) {
        o[embryo_options.nameType] = embryo_options.typeDefault
    }
    var type = o[embryo_options.nameType]

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
        if (key == embryo_options.nameProperties) {
            continue
        }
        if (key == embryo_options.cstrName) {
            if (!isTypeExist( embryo_types, type )) {
                embryo_types.push({
                    name: type,
                    init: o[key] || null,
                    props: o[embryo_options.nameProperties],
                    child: child
                })
            }
        }
        child.prototype[key] = o[key]
    }

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
        var pl = o['_blacklist'] || false
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

var Attribute = Embryo.Plugin.extend({
    '_type': 'Attribute',
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
            if (!this[fname]) {
                fname = hiddenPrefix + name
                if (!this[fname]) {
                    throw new Error( 'method "' + fname + '" not defined.' )
                }
            }
            this[fname].apply(this, arguments)
        }
    }
})

var Memory = Embryo.Plugin.extend({
    name: 'Memory',
    options: {
        nameInstanceArray: 'instances',
        nameNewMethod: 'new',
        nameStatsMethod: 'stats',
        nameDestroyMethod: 'destroy'
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

        o[this.options.nameInstanceArray] = []
        o[this.options.nameNewMethod] = function( oclass, args ) {
            var instance = args ? new oclass( args ) : new oclass()
            this.instances.push( instance )
            return instance
        }
        o[this.options.nameStatsMethod] = function() {
            /*for (var i=0; i<this.instances.length; i++) {
                //console.log('instance ' + i, this.instances[i])
            }*/
        }
        o[this.options.nameDestroyMethod] = function() {
            for (var i=0; i<this.instances.length; i++) {
                /*var instance = this.instances[i]
                var fdestroy = instance.destroy || null
                if (fdestroy) {
                    fdestroy()
                }*/
                delete this.instances[i]
            }
            this.instances = []
            //console.log('destroy')
        }

        debug && debug( this.name, 'AFTER', o )

        return o
    }
})

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

var attributePlugin = new Attribute()
attributePlugin.configure({
    getPrefix: 'get',
    setPrefix: 'set',
    camelize: true
})

var beforeAfterPlugin = new BeforeAfter()
beforeAfterPlugin.configure({
    beforePrefix: '-',
    afterPrefix: '+',
    hiddenPrefix: '_bah_'
})

var surchargePlugin = new Surcharge()
surchargePlugin.configure({
    suffix: '|',
    hiddenPrefix: '_pm_'
})

var memoryPlugin = new Memory()
memoryPlugin.configure({
    nameInstanceArray: 'instances',
    nameNewMethod: 'new',
    nameStatsMethod: 'stats',
    nameDestroyMethod: 'destroy'
})

var staticPlugin = new Static()
staticPlugin.configure({
    prefix: '$'
})

// Configure Embryo ;-)
Embryo.configure({
    cstrName: 'init',
    cstrArrayName: '_types',
    forceCstr: true,
    nameType: '_type',
    forceTyping: true,
    typeDefault: 'Embryo',
    nameProperties: 'properties',
    nameBlacklist: '_blacklist',
    deleteBlacklist: true
})
Embryo.use( attributePlugin, false )
Embryo.use( beforeAfterPlugin, false )
Embryo.use( surchargePlugin, false )
Embryo.use( memoryPlugin, false )
Embryo.use( staticPlugin, false )

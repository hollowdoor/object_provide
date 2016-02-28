module.exports = objectAssign;

/*
git remote add origin https://github.com/hollowdoor/object_provide.git
git push -u origin master
*/

function objectAssign(self, use, props, filter){

    if(typeof use !== 'boolean'){
        props = use;
        use = true;
        filter = props;
    }

    if(!use) return self;

    if(typeof filter !== 'function') filter = noop;

    if(!Object.defineProperties)
        return defineProperties(self, props, filter);

    return addProps(self, props, filter);

}

function addProps(destination, source, filter){
    var obj = {},
        keys = Object.keys(source),
        name,
        descript;

    for(var i=0; i<keys.length; i++){
        descript = Object.getOwnPropertyDescriptor(source, keys[i]);
        if(descript.enumerable && filter(destination, source, source[keys[i]], keys[i]) !== false){
            obj[keys[i]] = descript;
        }
    }

    Object.defineProperties(destination, obj);
    return destination;
}

function defineProperties(destination, source, filter){

    for(var name in source){
        if(filter(destination, source, source[name], name) !== false){
            destination[name] = source[name];
        }
    }

    return destination;
}

function noop(self, source, value){ return true; }

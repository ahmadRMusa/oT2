let localforage = require('localforage');

/*
Config options:
(none yet)

Properties:
- files (array of files)
- activeFile (file currently being edited)

Methods:
- load (takes `id` int parameter, returns promise)
- save (takes `file` object parameter, returns promise)
- list (returns promise with list of objects)

*/

let Storage = function(opts){
    
    let self = {};
    
    opts = opts || {};

    let storage = localforage.createInstance({
        name: 'oTranscribe',
        driver: localforage.LOCALSTORAGE
    });
    
    
    function load(id){
        let promise = new Promise(function(resolve, reject) {

            if (!id) {
                console.error('Bad id');
                reject();
            }
    
            storage.getItem('file-'+id)
              .then(resolve,reject)
    
            });

        return promise;

    }

    function save(file, preserveTimestamp){
        let promise = new Promise(function(resolve, reject) {
            if (!file.id) {
                console.error('Bad id');
                reject();
            }
            if (!preserveTimestamp) {
                file.lastModified = +(new Date());
            }
            storage.setItem('file-'+file.id,file)
            .then(function(){
                saveToList(file)
                .then(resolve,reject);
            },reject);
        });
        return promise;
    }
    
    function list(){
        let promise = new Promise(function(resolve, reject) {
            storage.getItem('file-list')
            .then(function(list){
                if (list === null) {
                    list = [];
                }
                list = list.sort(function(a,b){
                    return b.lastModified - a.lastModified;
                });
                resolve(list);
            }, reject);
        });
        return promise;
    }
    
    function saveToList(file){
        let promise = new Promise(function(resolve, reject) {
            storage.getItem('file-list')
            .then(function(list){
                if (list === null) {
                    list = [];
                }
                let listIndex = -1;
                list.forEach(function(l,i){
                    if (l.id === file.id) {
                        listIndex = i;
                    }
                });
                if (listIndex < 0) {
                    list.push(file);
                } else {
                    list[listIndex] = file;
                }
                storage.setItem('file-list',list)
                .then(resolve,reject);
            });

        });
        return promise;
    }
    

    self = {
        load: load,
        list: list,
        save: save
    };
    return self;

};


export {Storage as Storage};


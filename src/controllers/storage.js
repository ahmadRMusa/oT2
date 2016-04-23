let Ractive = require('ractive');
Ractive.DEBUG = false;
let template = require('raw!../templates/storage.html');
import {Storage} from '../storage';
let Mousetrap = require('mousetrap');

let DEFAULT_TEXT = 'Type here...';

/*
opts:
- element
- getEditorContents
- onFileChange
*/
function createController(opts){

    let storage = Storage();
    
    let model = {
        activeFileId: 0,
        files: [],
        visible: false
    };
    // setInterval(()=>{
    //     controller.set('visible', !controller.get('visible'))
    // },10000);
    let computed = {
        activeFile: {
            set: setActiveFile,
            get: getActiveFile
        }
    }
    
    function setActiveFile(newFile){
        if (!newFile.id) {
            newFile.id = generateId();
        }
        let files = controller.get('files');
        let existingIds = files.map(f=>f.id);
        let positionInExisting = existingIds.indexOf(newFile.id);
        if (positionInExisting > -1) {
            files[positionInExisting] = newFile;
        } else {
            files.unshift(newFile);
        }
        
        // sanity check for duplicates
        let sanityCheckList = [];
        files.forEach((f,i)=>{
            if (sanityCheckList.indexOf(f.id) > -1){
                throw('Duplicate ID '+f.id);
            }
            sanityCheckList.push(f.id);
        });
        
        controller.set('activeFileId',newFile.id);
        controller.set('files',files);
        
    }
    
    function getActiveFile(){
        let activeFileId = controller.get('activeFileId');
        if (!activeFileId) {
            return newFile();
        }
        let activeFile = controller.get('files').filter(f=>{
            return f.id === activeFileId;
        });
        if (activeFile.length > 0) {
            return activeFile[0]
        } else {
            return newFile();
        }
        
    }

    let controller = new Ractive({
        el: opts.element,
        template: template,
        data: model,
        computed: computed
    });
    
    controller.on('selectFile',(e)=>{
        let id = findAncestor(e.node,'file-item').dataset.id;
        setActiveFileById( parseInt(id) );
        controller.set('visible', false);
    });
    controller.on('togglePanel',(e)=>{
        controller.set('visible', !controller.get('visible'));
    });
    function setActiveFileById(id){
        controller.set('activeFileId',id);
    }
    function newFile(){
        let files = controller.get('files');
        let newFile = {
            text: DEFAULT_TEXT,
            id: generateId(),
            date: +(new Date())
        };
        controller.set('activeFile',newFile);
        return newFile;
    }
    controller.on('newFile',newFile);
        
    function refreshFiles(){
        storage.list().then((files)=>{
            controller.set('files',files);
            let activeFileId = controller.get('activeFileId');
            if (activeFileId) {
                setActiveFileById(activeFileId);
            } else if(files.length > 0) {
                setActiveFileById( files[0].id );
            }
        },storageError);
    }
    
    Mousetrap.bind('mod+s', ()=>{
        save();
        return false;
    });
    Mousetrap.bind('mod+o', ()=>{
        controller.set('visible', !controller.get('visible'));
        return false;
    });

    refreshFiles();
    
    function save(){
		storage.save( controller.get('activeFile'), storageError );
        storage.list().then((f)=>{
            console.log('saved files',f);
        },storageError);
    }
    
    function addFileMetadata(files){
        if (!files || (files.length === 0)) {
            return files;
        }
        return files.map((f)=>{
            f.active = (f.id === controller.get('activeFileId'));
            f.dateFormatted = (new Date(f.date)).toString();
            return f;
        });
    }
    
    function generateId(){
        return +(new Date())+Math.round(Math.random()*10000);
    }

    setInterval(()=>{
        let activeFileId = controller.get('activeFileId');
        let updatedFile = JSON.parse( JSON.stringify( opts.getEditorContents() ) );
        if (activeFileId === updatedFile.id) {
            controller.set('activeFile',updatedFile);
        } else {
            opts.onFileChange( controller.get('activeFile') );
        }

        controller.set('files', addFileMetadata( controller.get('files') ) );
    },50);
    setInterval(()=>{
        save();
    },1000);

    return {
        refresh: ()=> refreshFiles(),
        updateFile: (f)=>controller.set('activeFile',f),
        switchTo: setActiveFileById,
        _ractive: ()=>controller
    }
}

export {createController as StorageController};


function findAncestor (el, cls) {
    if (el.classList.contains(cls)){ return el; };
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

function storageError(err){
    console.error('Error with storage',err);
}

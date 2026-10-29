const test = require('node:test');
const assert = require('node:assert/strict');
const store = require('../models/favoriteStore');
const controller = require('../controllers/favoriteController');
function mockResponse(){return {code:200, body:undefined, status(code){this.code=code;return this;},location(){return this;},json(data){this.body=data;return this;},end(){return this;}};}
test('Maksimalt seks favoritter accepteres og syvende afvises',()=>{
 store.resetForTests();
 for(let i=0;i<6;i++){const res=mockResponse();controller.create({body:{name:`pokemon-${i}`,note:''}},res);assert.equal(res.code,201);}
 const res=mockResponse();controller.create({body:{name:'pokemon-6',note:''}},res);assert.equal(res.code,409);
 assert.equal(store.findAll().length,6);
});
test('Dublet afvises, men note kan opdateres',()=>{
 store.resetForTests();const a=mockResponse();controller.create({body:{name:'pikachu',note:''}},a);assert.equal(a.code,201);
 const duplicate=mockResponse();controller.create({body:{name:'pikachu',note:''}},duplicate);assert.equal(duplicate.code,409);
 const edit=mockResponse();controller.replace({favoriteId:1,body:{name:'pikachu',note:'Bedste Pokémon'}},edit);
 assert.equal(edit.code,200);assert.equal(store.findById(1).note,'Bedste Pokémon');
});

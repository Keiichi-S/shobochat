/* eslint-disable */
// @ts-ignore
var a=['\x22,\x20\x22','Database','sqlite3.db','CREATE\x20TABLE\x20IF\x20NOT\x20EXISTS\x20messages\x20(id\x20INTEGER\x20PRIMARY\x20KEY\x20AUTOINCREMENT,\x20time\x20INTEGER\x20NOT\x20NULL,\x20name\x20TEXT\x20NOT\x20NULL,\x20message\x20TEXT\x20NOT\x20NULL)','run','SELECT\x20time,\x20name,\x20message\x20FROM\x20messages\x20ORDER\x20BY\x20time\x20DESC','all','close','now','name','message','INSERT\x20INTO\x20messages\x20(time,\x20name,\x20message)\x20VALUES(\x22'];(function(c,d){var e=function(f){while(--f){c['push'](c['shift']());}};e(++d);}(a,0x145));var b=function(c,d){c=c-0x0;var e=a[c];return e;};'use strict';import*as c from'sqlite3';export function initializeDB(){return new Promise((d,e)=>{const f=new c[(b('0x0'))](b('0x1'));const g=b('0x2');f[b('0x3')](g,h=>{if(h){e();return;}d();});});}export function getAllMessages(){return new Promise((i,j)=>{const k=new c[(b('0x0'))](b('0x1'));const l=b('0x4');k[b('0x5')](l,(m,n)=>{k[b('0x6')]();if(m){j(m);return;}i(n);});});}export function insertMessage(o){return new Promise((p,q)=>{const r=new c[(b('0x0'))](b('0x1'));const s=Date[b('0x7')]();const t=o[b('0x8')];const u=o[b('0x9')];const v=b('0xa')+s+b('0xb')+t+'\x22,\x20\x22'+u+'\x22)';r[b('0x3')](v,w=>{r[b('0x6')]();if(w){q(w);return;}p();});});}
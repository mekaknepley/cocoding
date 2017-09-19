'use strict';(function(b){"object"==typeof exports&&"object"==typeof module?b(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],b):b(CodeMirror)})(function(b){b.defineMode("mllike",function(b,e){function f(a,d){var c=a.next();return'"'===c?(d.tokenize=k,d.tokenize(a,d)):"("===c&&a.eat("*")?(d.commentLevel++,d.tokenize=l,d.tokenize(a,d)):"~"===c?(a.eatWhile(/\w/),"variable-2"):"`"===c?(a.eatWhile(/\w/),"quote"):"/"===c&&e.slashComments&&a.eat("/")?
(a.skipToEnd(),"comment"):/\d/.test(c)?(a.eatWhile(/[\d]/),a.eat(".")&&a.eatWhile(/[\d]/),"number"):/[+\-*&%=<>!?|]/.test(c)?"operator":/[\w\xa1-\uffff]/.test(c)?(a.eatWhile(/[\w\xa1-\uffff]/),a=a.current(),g.hasOwnProperty(a)?g[a]:"variable"):null}function k(a,d){for(var c,b=!1,e=!1;null!=(c=a.next());){if('"'===c&&!e){b=!0;break}e=!e&&"\\"===c}b&&!e&&(d.tokenize=f);return"string"}function l(a,d){for(var c,b;0<d.commentLevel&&null!=(b=a.next());)"("===c&&"*"===b&&d.commentLevel++,"*"===c&&")"===
b&&d.commentLevel--,c=b;0>=d.commentLevel&&(d.tokenize=f);return"comment"}var g={let:"keyword",rec:"keyword","in":"keyword",of:"keyword",and:"keyword","if":"keyword",then:"keyword","else":"keyword","for":"keyword",to:"keyword","while":"keyword","do":"keyword",done:"keyword",fun:"keyword","function":"keyword",val:"keyword",type:"keyword",mutable:"keyword",match:"keyword","with":"keyword","try":"keyword",open:"builtin",ignore:"builtin",begin:"keyword",end:"keyword"};b=e.extraWords||{};for(var h in b)b.hasOwnProperty(h)&&
(g[h]=e.extraWords[h]);return{startState:function(){return{tokenize:f,commentLevel:0}},token:function(a,b){return a.eatSpace()?null:b.tokenize(a,b)},blockCommentStart:"(*",blockCommentEnd:"*)",lineComment:e.slashComments?"//":null}});b.defineMIME("text/x-ocaml",{name:"mllike",extraWords:{succ:"keyword",trace:"builtin",exit:"builtin",print_string:"builtin",print_endline:"builtin","true":"atom","false":"atom",raise:"keyword"}});b.defineMIME("text/x-fsharp",{name:"mllike",extraWords:{"abstract":"keyword",
as:"keyword",assert:"keyword",base:"keyword","class":"keyword","default":"keyword",delegate:"keyword",downcast:"keyword",downto:"keyword",elif:"keyword",exception:"keyword",extern:"keyword","finally":"keyword",global:"keyword",inherit:"keyword",inline:"keyword","interface":"keyword",internal:"keyword",lazy:"keyword","let!":"keyword",member:"keyword",module:"keyword",namespace:"keyword","new":"keyword","null":"keyword",override:"keyword","private":"keyword","public":"keyword","return":"keyword","return!":"keyword",
select:"keyword","static":"keyword",struct:"keyword",upcast:"keyword",use:"keyword","use!":"keyword",val:"keyword",when:"keyword",yield:"keyword","yield!":"keyword",List:"builtin",Seq:"builtin",Map:"builtin",Set:"builtin","int":"builtin",string:"builtin",raise:"builtin",failwith:"builtin",not:"builtin","true":"builtin","false":"builtin"},slashComments:!0})});

'use strict';(function(n){"object"==typeof exports&&"object"==typeof module?n(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],n):n(CodeMirror)})(function(n){var r=n.Pos;n.registerHelper("hint","xml",function(b,d){var c=d&&d.schemaInfo,l=d&&d.quoteChar||'"';if(c){d=b.getCursor();var a=b.getTokenAt(d);a.end>d.ch&&(a.end=d.ch,a.string=a.string.slice(0,d.ch-a.start));var k=n.innerMode(b.getMode(),a.state);if("xml"==k.mode.name){var q=[],m=!1,t=/\btag\b/.test(a.type)&&
!/>$/.test(a.string),w=t&&/^\w/.test(a.string),u;if(w){var e=b.getLine(d.line).slice(Math.max(0,a.start-2),a.start);(e=/<\/$/.test(e)?"close":/<$/.test(e)?"open":null)&&(u=a.start-("close"==e?2:1))}else t&&"<"==a.string?e="open":t&&"</"==a.string&&(e="close");if(!t&&!k.state.tagName||e){if(w)var g=a.string;var m=e,h=k.state.context;k=h&&c[h.tagName];if((l=h?k&&k.children:c["!top"])&&"close"!=e)for(b=0;b<l.length;++b)g&&0!=l[b].lastIndexOf(g,0)||q.push("<"+l[b]);else if("close"!=e)for(var f in c)!c.hasOwnProperty(f)||
"!top"==f||"!attrs"==f||g&&0!=f.lastIndexOf(g,0)||q.push("<"+f);h&&(!g||"close"==e&&0==h.tagName.lastIndexOf(g,0))&&q.push("</"+h.tagName+">")}else{f=(k=c[k.state.tagName])&&k.attrs;c=c["!attrs"];if(!f&&!c)return;if(!f)f=c;else if(c){e={};for(var p in c)c.hasOwnProperty(p)&&(e[p]=c[p]);for(p in f)f.hasOwnProperty(p)&&(e[p]=f[p]);f=e}if("string"==a.type||"="==a.string){e=b.getRange(r(d.line,Math.max(0,d.ch-60)),r(d.line,"string"==a.type?a.start:a.end));c=e.match(/([^\s\u00a0=<>\"\']+)=$/);if(!c||!f.hasOwnProperty(c[1])||
!(h=f[c[1]]))return;"function"==typeof h&&(h=h.call(this,b));"string"==a.type&&(g=a.string,m=0,/['"]/.test(a.string.charAt(0))&&(l=a.string.charAt(0),g=a.string.slice(1),m++),b=a.string.length,/['"]/.test(a.string.charAt(b-1))&&(l=a.string.charAt(b-1),g=a.string.substr(m,b-2)),m=!0);for(b=0;b<h.length;++b)g&&0!=h[b].lastIndexOf(g,0)||q.push(l+h[b]+l)}else{"attribute"==a.type&&(g=a.string,m=!0);for(var v in f)!f.hasOwnProperty(v)||g&&0!=v.lastIndexOf(g,0)||q.push(v)}}return{list:q,from:m?r(d.line,
null==u?a.start:u):d,to:m?r(d.line,a.end):d}}}})});

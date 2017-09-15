$(document).ready(function(){
    var code = $(".codemirror-textarea")[0];
    var editor = CodeMirror.fromTextArea(code, {
        lineNumbers: true,
        lineWrapping: true,
        showCursorWhenSelecting: true,
        theme: "rubyblue",
        keymap: 'sublime',
        extraKeys: {"Ctrl-Space": "autocomplete"},
        value:document.documentElement.innerHTML
    });

    $('#preview-form').submit(function(e){
        e.preventDefault();
        var value = $('#editor-value').val();
        $('#preview').html(value);
    });

    $('#html').on('click', function(){
        /*e.preventDefault();*/
        console.log("lang changed to html" + $('#editor-value').val());

        editor.replaceRange('<!DOCTYPE html>\n <html lang="en"> \n      <head>\n        <meta charset="utf-8">\n        <title>HTML</title>\n \n        <link rel="stylesheet" href="css/style.css">\n \n        <!--[if lt IE 9]> \n            <script src="https://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv.js"></script> \n        <![endif]--> \n     </head> \n     <body> \n       <script src="js/script.js"></script> \n     </body> \n </html>', CodeMirror.Pos(editor.lastLine()));

        $('#lang').attr('src', '/node_modules/codemirror-minified/mode/htmlmixed/htmlmixed.js');
    });

    $('#cPlusPlus').on('click', function(){
        editor.replaceRange('#include <iostream>\n using namespace.std; \n\n int main () {\n     cout << "Hello world!" << endl; \n}', CodeMirror.Pos(editor.lastLine()));
    });

    $('#PHP').on('click', function(){
        editor.replaceRange('<?php \n \n    // PHP code goes here \n\n?>', CodeMirror.Pos(editor.lastLine()));
    });

    $('#cSharp').on('click', function(){
        editor.replaceRange('using System; \n namespace CSharpProgram \n{\n     class CSharp \n{\n        static void Main()\n{\n           Console.WriteLine("Hello World!"); \n       }\n     }\n}', CodeMirror.Pos(editor.lastLine()));
    });

    $('#CSS').on('click', function(){
        editor.replaceRange('body {\n    background-color: white; \n}');
    });

});

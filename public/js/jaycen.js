
    var code = $("#editor-value")[0];
    var editor = CodeMirror.fromTextArea(code, {
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: 10,
        showCursorWhenSelecting: true,
        theme: "rubyblue",
        keymap: 'sublime',
        extraKeys: {"Ctrl-Space": "autocomplete"},
        value:document.documentElement.innerHTML,
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
    
    // Initialize Firebase configuration
    var config = {
        apiKey: "AIzaSyClQP9Fg9deVgrwupRCCxbcClvLFMR0AnQ",
        authDomain: "realtime-e3651.firebaseapp.com",
        databaseURL: "https://realtime-e3651.firebaseio.com",
        projectId: "realtime-e3651",
        storageBucket: "realtime-e3651.appspot.com",
        messagingSenderId: "67777252179"
    };
    
    firebase.initializeApp(config);

    var database = firebase.database();
    var roomsdb = database.ref().child('rooms');
    var content = roomsdb.child('content');
	
    /*var url = window.location.href; 
    var url = url.split('/');
    var roomNum = url[url.length -1];
    var room = roomsdb.child(roomNum);
    console.log(roomNum);*/

    function write(){
        /*var data = editor.getValue();
        console.log(data);*/
        roomsdb.update({content: data});
    }

    content.on('value', function(snapshot){
       console.log(snapshot.val());
        var data = snapshot.val();
		//gets the current line and ch of the cursor
		var cursor = editor.getCursor();
		//gets the current line of the cursor
		var cursorLine = cursor.line;
		//gets the current ch of the cursor
		var cursorCh = cursor.ch;
		//sets the value of the editor to the contents from the db
        editor.getDoc().setValue(data);

		console.log(" cl: " + cursorLine + " ch: " + cursorCh);
		//sets the cursor to the line and cursor: Stops the editor from resetting the position of the cursor.
		editor.setCursor({line: cursorLine, ch:cursorCh});
		//focuses on the editor
		editor.focus();
    });
    
	
	var data;
    editor.on('change', function(cm){
		//sets the variable data to the what ever changes are made to the code editor
       	data = cm.getValue();
			//var data = editor.getValue();
		console.log(cm.getValue());
            write();
    });

    /*$('#editor-value').keyup(function(){
       write();
        $('#editor-value').focus();
    });*/

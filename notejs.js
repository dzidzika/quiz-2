(function ($, $S) {
    var $board = $('#board'), //oard where the posticks are sticked
        Postick, //singleton object containing the functions to work with the LocalStorage
        len = 0, //length of objects in the LocalStorage 
        currentNotes = '', //storage the html construction of the posticks
        o; //actual Postick data in the LocalStorage
 
 
 
    //manage the posticks in the local storage
	//as an object  
    Postick = {
        add: function (obj) {
            obj.id = $S.length;
            $S.setItem(obj.id, JSON.stringify(obj));
        },
 
        retrive: function (id) {
            return JSON.parse($S.getItem(id));
        },
 
        remove: function (id) {
            $S.removeItem(id);
        },
 
        removeAll: function () {
            $S.clear();
        }
 
    };
 
    //if exist any postick, create it/them
    len = $S.length;
    if (len) {
        for (var i = 0; i < len; i++) {
            var key = $S.key(i);
            o = Postick.retrive(key);
            currentNotes += '<div class="postick"';
            currentNotes += ' style="left:' + o.left;
            currentNotes += 'px; top:' + o.top;
            currentNotes += 'px"><div class="toolbar"><span class="delete" data-key="' + key;
            currentNotes += '">x</span></div><div contenteditable="true" class="editable">';
            currentNotes += o.text;
            currentNotes += '</div>';
        }
 
        $board.html(currentNotes);
    }
 
    //make all posticks draggable
    $(document).ready(function () {
        $(".postick").draggable({
            cancel: '.editable',
          "zIndex": 3000,
          "stack" : '.postick'
        });
    });
 
    //remove postick
    $('span.delete').live('click', function () {
        if (confirm('click "ok" if u sure my friend')) {
            var $this = $(this);
            Postick.remove($this.attr('data-key'));
            $this.closest('.postick').fadeOut('slow', function () {
                $(this).remove();
            });
        }
    });
 
    //create postick
    $('#btn-addNote').click(function () {
        $board.append('<div class="postick" style="left:20px;top:70px"><div class="toolbar"><span class="delete" title="Close">x</span></div><div contenteditable class="editable"></div></div>');
        $(".postick").draggable({
            cancel: '.editable'
        });
    });
 
    //save all the posticks after refresh
    window.onbeforeunload = function () {
        Postick.removeAll();
        $('.postick').each(function () {
            var $this = $(this);
            Postick.add({
                top: parseInt($this.position().top),
                left: parseInt($this.position().left),
                text: $this.children('.editable').text()
            });
        });
    }
})(jQuery, window.localStorage);
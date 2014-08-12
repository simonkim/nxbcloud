var addComment = function(comment) {
  // postId, label, url, [body]
  Meteor.subscribe('comments');

  var found = Comments.find({postId:comment.postId, url:comment.url}).fetch();
  if (found.length == 0) {
    console.log( 'adding comment:' + JSON.stringify(comment));
    Meteor.call('comment', comment, function(error, commentId) {
      if (error){
        throwError(error.reason);
      }
    });
  }
};

var stripExtension = function(name, exts) {
  for( var i = 0; i < exts.length; i++ ) {
    var idx = name.indexOf('.' + exts[i]);
    while ( idx != -1 && idx != 0 ) {
        name = name.substring(0, idx);
        idx = name.indexOf(exts[i]);
    }
  }
  return name;
};
var handleNxbFile = function(file) {
  /* read, extract each line, add as link */

  Meteor.subscribe('posts');

  console.log( 'file: type:' +  JSON.stringify(file));
  var name = file.name;
  var type = file.type;

  name = stripExtension( name, ['nxb', 'txt']);
  console.log( 'file: name:' + name);

  var addLinksFromLines = function(nxbId, lines) {
    lines.forEach(function(line) {
      var cols = line.split(' ');
      if ( cols.length > 0) {
        var url = cols[0];
        var label = '';

        if ( cols.length > 1) {
          cols.shift();
          label = cols.join(' ');
        }

        addComment({postId: nxbId, url:url, label:label});
      }
    });
  };

  var reader = new FileReader();
  reader.onload = function(e) {
    var text = reader.result;
    var lines = text.match(/[^\r\n]+/g);

    if ( lines.length > 0 ) {
      console.log('lines:' + lines.length);

      var nxb = Posts.findOne({title:name});
      var nxbId = nxb && nxb._id;

      if ( nxbId ) {
        // to existing nxb
          console.log( 'adding to existing nxb:' + nxbId);
          addLinksFromLines(nxbId, lines);
          Router.go('postPage', {_id: nxbId});

      } else {
        // create one
        nxb = {
          title:name
        };
        Meteor.call('post', nxb, function(error, id) {
          if (error) {
            // display the error to the user
            throwError(error.reason);

          } else {
            console.log( 'adding to new nxb:' + id);
            addLinksFromLines(id, lines);
            Router.go('postPage', {_id: id});
          }
        });
      }
    }

  }
  reader.readAsText(file);
};

Template.uploadnxb.events({

  'change .uploadnxb': function(event, template) {
    console.log('files changed for upload');
    FS.Utility.eachFile(event, function(file) {
      handleNxbFile(file);
      /*
      Uploads.insert(file, function (err, fileObj) {
        if ( !err ) {
            console.log( 'uploaded file:' + fileObj._id);
        } else {
            throwError(err);
        }
      });
      */
    });
  },
  // Catch the dropped event
  'dropped #dropzone': function(event, temp) {
    console.log('files dropped');
    FS.Utility.eachFile(event, function(file) {
      handleNxbFile(file);

      /*
      Uploads.insert(file, function (err, fileObj) {
        if ( !err ) {
            console.log( 'uploaded file:' + fileObj._id);
        } else {
            throwError(err);
        }
      });
      */
    });
  }
});

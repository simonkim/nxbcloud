Template.postEdit.onRendered( function() {

});

Template.postEdit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var currentPostId = this._id;
    var postProperties = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val(),
      message: $(e.target).find('[name=message]').val()
    }

    Meteor.call('updateCollection', currentPostId, postProperties, function(error, result) {
      if (error) {
          // display the error to the user
          throwError(error.reason);
      } else if ( result.updated ) {
          Router.go('postPage', {_id: currentPostId});
      } else if ( result.conflictCollectionId ) {
          template.$('#modal-confirm-merge').modal();
          // remember merge destination id until .btn-merge
          template.$('[name=mergeto]').val(result.conflictCollectionId);
      }
    });

  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete collection '" + this.title + "' ?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('home');
    }
  },

  'click .btn-merge': function(e, template) {      
      template.$('#modal-confirm-merge').modal('hide');

      var srcId = this._id;
      var dstId = template.$('[name=mergeto]').val();
      if ( srcId && dstId ) {
        console.log('merge:' + srcId + ' to:' + dstId);

        // 1. move links from source to destination
        // 2. delete source
        // 3. reroute to destination collection

        Meteor.call('moveLinks', srcId, dstId, function(error, id) {
          if ( error ) {
            throwError(error.reason);
          } else {
            DataAPI.deleteCollection(srcId);
            Router.go('postPage', {_id: dstId});
          }
        });
      }

  }  
});

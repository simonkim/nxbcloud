/* Collection List */

// Templates

Template.postsList.helpers({
    postsWithRank: function() {
        var posts = [];
        if ( this.posts ) {
            this.posts.rewind();
            posts = this.posts.map(function(post, index, cursor) {
                post._rank = index;
                return post;
            });
        }
        return posts;
    }
});

/* Collection Summary */
var POST_HEIGHT = 80;
var Positions = new Meteor.Collection(null);

Template.postItem.helpers({
  ownPost: function() {
    return this.userId == Meteor.userId();
  },
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },
  upvotedClass: function() {
    var userId = Meteor.userId();
    if (userId && !_.include(this.upvoters, userId)) {
      return 'btn-primary upvotable';
    } else {
      return 'disabled';
    }
  },
  attributes: function() {
    var post = _.extend({}, Positions.findOne({postId: this._id}), this);
    var newPosition = post._rank * POST_HEIGHT;
    var attributes = {};
    
    if (_.isUndefined(post.position)) {
      attributes.class = 'post invisible';
    } else {
      var delta = post.position - newPosition;      
      attributes.style = "top: " + delta + "px";
      if (delta === 0)
        attributes.class = "post animate"
    }
    
    Meteor.setTimeout(function() {
      Positions.upsert({postId: post._id}, {$set: {position: newPosition}})
    });
    
    return attributes;
  }
});

Template.postItem.events({
  'click .upvotable': function(e) {
    e.preventDefault();
    Meteor.call('upvote', this._id);
  },

  'click .duplicate': function(e) {
    e.preventDefault();
    //Meteor.call('upvote', this._id);
    console.log('duplicate:' + this.title + '(' + this._id + ')');

    var srcCollection = this;

    Meteor.subscribe('comments', srcCollection._id, function() {
      // onReady()
      var comments = DataAPI.findComments(srcCollection._id).fetch();
      if ( comments.length > 0 ) {
        var newTitleBase = srcCollection.title + ' dup';
        var newTitle = newTitleBase;
        var i = 1;
        while (true) {
          var collection = Posts.findOne({title:newTitle});
          if ( !collection ) {
            break;
          }
          newTitle = newTitleBase + i++;
        }
        console.log( '1. Adding collection with title:' + newTitle);

        var collection = _.extend(_.pick(srcCollection, 'url', 'message'), {
          title: newTitle
        } );

        Meteor.call('post', collection, function(error, id) {
          if (error) {
            // display the error to the user
            throwError(error.reason);

          } else {
            console.log( '2. Adding links to new collection:' + id);
            Meteor.subscribe('singlePost', id, function() {
              for( i = 0; i < comments.length; i++) {
                console.log('3. comment[' + i + ']:' + comments[i].label);
                comments[i].postId = id;
                DataAPI.addComment(comments[i]);
              }
              Router.go('postPage', {_id: id});
            });
          }
        });
      }      
    });
  }
});


/* Collection Detail View */
Template.postPage.helpers({
  comments: function() {
    return DataAPI.findComments(this._id);
  }
});
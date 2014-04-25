var url2hostname = function(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.hostname;
};

var extraParams = function(label) {
  var params = label.split('&&');
  return params.length == 2
};

Template.comment.helpers({
  submittedText: function() {
    return new Date(this.submitted).toString();
  },
  domain: function() {
    return url2hostname(this.url);
  },

  editing: function() {
    return Session.get("commentsEditing") == this._id;
  },

});

Template.comment.events({
    "click .edit": function() {
      console.log('click.edit');
      if (!Session.get("commentsEditing")) {
        Session.set("commentsEditing", this._id);
      }
    },

    "click .delete": function() {
      if (confirm("Delete this link?")) {
        var currentCommentId = this._id;
        Comments.remove(currentCommentId);
        Session.set("commentsEditing", null);
      }
    }

});

Template.comment_view.helpers({
  domain: function() {
    return url2hostname(this.url);
  },
  extraParams: function() {
    return extraParams(this.label);
  },
  extServer: function() {
    var params = this.label.split(' ');
    var params = params[0].split('&&');
    return params[0];
  },
  extCompany: function() {
    var params = this.label.split(' ');
    var params = params[0].split('&&');
    return params[1];
  },
  displayLabel: function() {
    var label = this.label;
    if (extraParams(label)) {
      var labelTokens = label.split(' ');
      if ( labelTokens.length > 1) {
        label = labelTokens[1];
      } else {
        label = '';
      }
    }
    return label;
  }

});

Template.comment_edit.events({

    "submit form": function(e) {
      e.preventDefault();

      var $body = $(e.target).find('[name=body]');
      var $label = $(e.target).find('[name=label]');
      var $url = $(e.target).find('[name=url]');
      var comment = {
        label: $label.val(),
        url: $url.val(),
        body: $body.val(),
      };

      var commentId = this._id;
      Comments.update(commentId, {$set: comment}, function(error) {
        if (error) {
          // display the error to the user
          throwError(error.reason);
        } else {
          Session.set("commentsEditing", null);
        }
      });
    },

    "click .cancel": function() {
      Session.set("commentsEditing", null);
    },
});

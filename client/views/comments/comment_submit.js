Template.commentSubmit.events({
  'submit form': function(e, template) {
    e.preventDefault();

    var $body = $(e.target).find('[name=body]');
    var $label = $(e.target).find('[name=label]');
    var $url = $(e.target).find('[name=url]');
    var comment = {
      label: $label.val(),
      url: $url.val(),
      body: $body.val(),
      postId: template.data._id
    };

    Meteor.call('comment', comment, function(error, commentId) {
      if (error){
        throwError(error.reason);
      } else {
        $body.val('');
      }
    });
  }
});

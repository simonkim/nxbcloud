
if (Meteor.isServer) {
    RESTstop.configure({
      use_auth: false,
      pretty_json: true
    });

    RESTstop.add('links/:postId', { require_login: false }, function() {
      var links = [];

      Comments.find({postId: this.params.postId}).forEach(function(linkentry) {

        // Modify the post here...
        AppConfig.debugEnabled() && console.log( 'links:' + JSON.stringify(_.pick(linkentry, 'label', 'url')));
        links.push(_.pick(linkentry, 'label', 'url'));
      });

      console.log( '/api/links: returning ' + links.length + ' links');
      return [links];
    });

  RESTstop.add('nxb', { require_login: false }, function() {
    var nxb = [];

    Posts.find().forEach(function(nxbentry) {
      var entry = _.pick(nxbentry, 'title', '_id');
      _.extend(entry, {links: '/api/links/' + entry._id} );
      // Modify the post here...
      AppConfig.debugEnabled() && console.log( 'nxb: entry:' + JSON.stringify(entry));
      nxb.push(entry);
    });

    console.log( '/api/nxb: returning ' + nxb.length + ' entries');
    return [nxb];
  });
}

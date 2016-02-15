
/* max posts defined in server publish */
var POSTS_LIMIT_MAX = -1;
var POSTS_PER_PAGE  = 20;

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    return [Meteor.subscribe('notifications')]
  }
});

PostsListController = RouteController.extend({
  template: 'postsList',
  increment: POSTS_PER_PAGE,
  sort: {title: 1, _id: -1},
  limit: function() {
    return parseInt(this.params.limit) || this.increment;
  },
  findOptions: function() {
    return {sort: this.sort, limit: this.limit()};
  },
  waitOn: function() {
    return Meteor.subscribe('posts', this.findOptions());
  },
  posts: function() {
    return Posts.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.posts().count() === this.limit();
    return {
      posts: this.posts(),
      nextPath: hasMore ? this.nextPath() : null
    };
  },
  nextPath: function() {
    return Router.routes.sort.path({limit: this.limit() + this.increment})
  }
});

NewPostsListController = PostsListController.extend({
  sort: {submitted: -1, _id: -1},
  nextPath: function() {
    return Router.routes.newPosts.path({limit: this.limit() + this.increment})
  }
});

/* Home: default list */
Router.route( '/', function() {
  this.render('postsList');
}, {
  name: 'home',
  controller: PostsListController
});

Router.route( '/sort/:limit?', function() {
  this.render('postsList');
}, {
  name: 'sort',
  controller: PostsListController
});

/* New posts */
Router.route( '/new/:limit?', function() {
  this.render('postsList');
}, {
  name: 'newPosts',
  controller: NewPostsListController
});

/* New post form */
Router.route( '/submit', function() {
  this.render('postSubmit');
}, {
  name: 'postSubmit',
  template: 'postSubmit',
  progress: {enabled: false}
});

/* View post */
Router.route('/posts/:_id', function() {
  this.render('postPage');
}, {
    name: 'postPage',
    waitOn: function() {
      return [
        Meteor.subscribe('singlePost', this.params._id),
        Meteor.subscribe('comments', this.params._id)
      ];
    },
    data: function() { return Posts.findOne(this.params._id); }
});

/* Edit Post */
Router.route('/posts/:_id/edit', function() {
  this.render('postEdit');
}, {
    name: 'postEdit',
    waitOn: function() {
      return Meteor.subscribe('singlePost', this.params._id);
    },
    data: function() { return Posts.findOne(this.params._id); }
});

/* Conflicting routes with RESTStop */
Router.route('/api/nxb', function() {
  // handled by RESTStop.add('nxb', ...)
  this.next();
});

var requireLogin = function(pause) {
  if (! Meteor.user()) {
    if (Meteor.loggingIn())
      this.render(this.loadingTemplate);
    else
      this.render('accessDenied');
  } else {
    this.next();
  }
}

Router.onBeforeAction('loading');
Router.onBeforeAction(requireLogin, {only: 'postSubmit'});
Router.onBeforeAction(function() { clearErrors(); this.next(); });

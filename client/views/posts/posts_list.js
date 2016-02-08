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

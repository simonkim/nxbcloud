/* dataapi.js */

DataAPI = {
    addComment: function(comment) {
        // postId, label, url, [body]
        console.log( 'addComment:' + JSON.stringify(comment));
        var found = Comments.find({postId:comment.postId, url:comment.url}).fetch();
        if (found.length == 0) {
            Meteor.call('comment', comment, function(error, commentId) {
                if (error){
                    throwError(error.reason);
                }
            });
        } else {
            console.log( 'addComment: Discarding redundant link:' + comment.url);
        }
    },

    findComments: function(postId) {
        console.log('findComments(' + postId + ')')
        return Comments.find({postId: postId});
    },

    deleteCollection: function(collectionId) {
        Meteor.call('deleteCollection', collectionId);
    }
};
Template.comment.helpers({
  submittedText: function() {
    return new Date(this.submitted).toString();
  },
  domain: function() {
    var a = document.createElement('a');
    a.href = this.url;
    return a.hostname;
  },  
});

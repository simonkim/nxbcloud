
Template.header.helpers({
	/*
	 * @return returns true if any or argument equals to current 
	 * route name (Router.current().route.getName()) 
	 *
	 * Usage Example: {{activeRouteClass 'home' 'newPosts'}}
	 * returns 'active' if current route name is 'home' or 'newPosts'
	 */
  activeRouteClass: function(/* route names */) {
    var args = Array.prototype.slice.call(arguments, 0);
    args.pop();
    
    if (AppConfig.debugEnabled()) {
      console.log('route names:' + args);
      if ( Router.current() ) {
      	console.log( 'Router.current().route.getName(): '+ Router.current().route.getName());
      } else {
      	console.log( 'Router.current(): null');
      }
    }

    var active = _.any(args, function(name) {
      	return Router.current() && Router.current().route.getName() === name
    });
    
    return active && 'active';
  }
});
angular.module('mean.filters', []).filter('timeago',function() {
  return function(input) {
		var difference = (new Date()).getTime() - (new Date(input)).getTime();
		//reduce to the seconds
		difference = Math.round(difference/1000);

		var time = {'year': 31536000, 'month': 2592000, 'day': 86400, 'hour': 3600, 'minute': 60, 'second': 1};
		var out = [];

		//iteration thru the time object
		for(var key in time){
			if(time.hasOwnProperty(key)){
				//find if the difference contains at least one amount of time elements
				var val = Math.floor(difference/time[key]);
				if(val>0){
					//add to the output array a string that looks like "3 years" or "1 minute"
					out.push(val+' '+key+(val>1 ? 's' : ''));
					//reduce the difference variable on the amount that has been added
					difference -= val*time[key];
				}
				// break from the loop if it's a second iteration after success
				// to prevent output as "1 month 56 seconds"
				else if(out.length===1) break;
				// break from the loop with 2 elements in output
				// to prevent "1 month 5 days 3 hours 36 minutes 5 seconds"
				if(out.length===2) break;
			}
		}
		if(out.length)
			return out.join(' ') + ' ago';
		else
			return 'now';
	};
})
//Filter replaces "\n" by "<br/>"
.filter('newlines', function() {
  return function(input) {
		return input.replace(/\n/g, '<br/>');
	};
})
//Filter replaces HTML "<,>,&" by htmlentities
.filter('noHTML',function() {
  return function(input) {
		return input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	};
});

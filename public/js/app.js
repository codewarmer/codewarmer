angular.module('mean', ['ngCookies', 'ngResource', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.route', 'mean.system', 'mean.articles', 'mean.users', 'mean.auth', 'mean.comments', 'mean.admin', 'AutoFillSync', 'Prettify', 'TimeAgo']);

angular.module('mean.system', []);
angular.module('mean.articles', ['ngCkeditor', 'ngSanitize', 'Compile']);
angular.module('mean.users', ['vcRecaptcha']);
angular.module('mean.auth', []);
angular.module('mean.comments', ['NewLines', 'ngAnimate']);
angular.module('mean.admin', []);

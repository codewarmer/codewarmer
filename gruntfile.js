var toMinify = require('./config/files'),
env = require('node-env-file');

module.exports = function(grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      jade: {
        files: ['app/views/**'],
        options: {
          livereload: true,
        },
      },
      js: {
        files: ['public/js/**', 'app/**/*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true,
        },
      },
      html: {
        files: ['public/views/**'],
        options: {
          livereload: true,
        },
      },
      css: {
        files: ['public/css/**'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: [
      'gruntfile.js',
      'public/js/**/*.js',
      'test/mocha/**/*.js',
      'app/**/*.js',
      '!public/js/all*.js',
      '!public/css/all*.css',
      '!public/js/prettify.min.js',
      '!public/js/analytics.js'
      ]
    },
    nodemon: {
      dev: {
				script: 'server.js',
        options: {
					nodeArgs: ['--debug'],
          args: [],
          ignore: ['README.md', 'node_modules/**', '.DS_Store'],
          ext: 'js',
          watch: ['app', 'config'],
          debug: true,
          delayTime: 1,
          env: env('.envDev'),
          cwd: __dirname
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
		ngmin: {
			js: {
				src: toMinify.relativePaths('js'),
				dest: './public/js/all.js'
			},
		},
		concat: {
			css: {
				src: toMinify.relativePaths('css'),
				dest: './public/css/all.css'
			},
		},
		uglify: {
			options: {
				mangle: false,
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
			},
			js: {
				files: {
					'./public/js/all.min.js': ['<%= ngmin.js.dest %>']
				}
			}
		},
		cssmin: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
			},
			css: {
				files: {
					'./public/css/all.min.css': ['<%= concat.css.dest %>']
				},
			},
		},
		'closure-compiler': {
			main: {
				closurePath: '/usr/local/opt/closure-compiler/libexec/',
				js: '<%= ngmin.js.dest %>',
				jsOutputFile: './public/js/all.min.js',
				maxBuffer: 500,
				options: {
					compilation_level: 'SIMPLE_OPTIMIZATIONS',
					language_in: 'ECMASCRIPT5'
				}
			},
			prettify: {
				closurePath: '/usr/local/opt/closure-compiler/libexec/',
				js: toMinify.relativePaths('prettifyToMinify'),
				jsOutputFile: './public/js/prettify.min.js',
				maxBuffer: 500,
				options: {
					compilation_level: 'SIMPLE_OPTIMIZATIONS',
					language_in: 'ECMASCRIPT5'
				}
			}
		},
    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['test/mocha/**/*.js']
    },
    karma: {
      unit: {
        configFile: 'test/karma/karma.conf.js'
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      }
    }
  });

  //Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-env');
	grunt.loadNpmTasks('grunt-ngmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-closure-compiler');

  //Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  //Default task(s).
  grunt.registerTask('default', ['jshint', 'concurrent']);

  //Test task.
	grunt.registerTask('test', ['env:test', 'mochaTest', 'karma']);

	//Minify task
	grunt.registerTask('minify', ['ngmin', 'concat', 'closure-compiler', 'cssmin']);
};

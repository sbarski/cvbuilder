module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
            options: {
                sourceMap: 'true',
                sourceMapFilename: 'cvbuilder.web/public/css/app.css.map',
                sourceMapRootpath: '../../_sources/',
                sourceMapBasepath: 'cvbuilder.client',
                sourceMapURL: '/public/css/app.css.map'
            },
            production: {
                cleancss: true,
                compress: true,
                files: {
                    'cvbuilder.web/public/css/app.css': 'cvbuilder.client/less/app.less'
                },
            },
            development: {
                files: {
                    'cvbuilder.web/public/css/app.css': 'cvbuilder.client/less/app.less'
                }
            }
        },
    copy: {
      development: {
        files: [
          {src: ['cvbuilder.client/views/index.html'], dest: 'cvbuilder.web/public/index.html'}
        ]
      },
      production: {
        files: [
          {src: ['cvbuilder.client/views/index.html'], dest: 'cvbuilder.web/public/index.html'}
        ]
      }
    },
    uglify: {
      options: {
        sourceMap: 'cvbuilder.web/public/js/app.js.map',
        banner: '/*! <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
       development: {
                options: {
                    beautify: true
                },
                files: {
                    'cvbuilder.web/public/js/app.js': [
                        'cvbuilder.client/js/routes.js',
                        'cvbuilder.client/js/config.js',
                        'cvbuilder.client/js/controllers/*.js',
                        'cvbuilder.client/js/filters/*.js',
                        'cvbuilder.client/js/directives/*.js',
                        'cvbuilder.client/js/services/*.js',
                        'cvbuilder.client/js/routes.js',
                        'cvbuilder.client/js/app.js'
                    ]
                }
            },
            production: {
                options: {
                    beautify: false
                },
                files: {
                    'cvbuilder.web/public/js/app.js': [
                        'cvbuilder.client/js/routes.js',
                        'cvbuilder.client/js/config.js',
                        'cvbuilder.client/js/controllers/*.js',
                        'cvbuilder.client/js/filters/*.js',
                        'cvbuilder.client/js/directives/*.js',
                        'cvbuilder.client/js/services/*.js',
                        'cvbuilder.client/js/routes.js',
                        'cvbuilder.client/js/app.js'
                    ]
                }
            }
    },
    watch: {
            scripts: {
                tasks: ['copy:development', 'less:development', 'uglify:development'],
                files: ['cvbuilder.client/**/*'],
                options: {
                  livereload: true
                }
            }
        }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', [ 'copy:development', 'less:development', 'uglify:development']);

  grunt.registerTask('development', [ 'copy:development', 'less:development', 'uglify:development']);
  grunt.registerTask('production', [ 'copy:production', 'less:production', 'uglify:production']);

};
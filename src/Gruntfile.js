// Generated on 2014-10-27 using generator-angular 0.9.8
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

        // Load grunt tasks automatically
        require('load-grunt-tasks')(grunt);

        // Time how long tasks take. Can help when optimizing build times
        require('time-grunt')(grunt);

        grunt.loadNpmTasks('grunt-contrib-concat');

        var modRewrite = require('connect-modrewrite');
        var bower = require('./bower.json');

        // Configurable paths for the application
        var appConfig = {
            app: bower.appPath || 'app',
            dist: 'dist'
        };

        // Define the configuration for all the tasks
        grunt.initConfig({

                // Project settings
                yeoman: appConfig,

                // Watches files for changes and runs tasks based on the changed files
                watch: {
                    compass: {
                        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                        tasks: ['compass:server', 'autoprefixer']
                    },
                    livereload: {
                        options: {
                            livereload: '<%= connect.options.livereload %>'
                        },
                        files: [
                            '.tmp/styles/{,*/}*.css',
                            '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                        ]
                    },                    
                    ngdocs: {
                        files: ['app/scripts/{,*/}*.js'],
                        tasks: ['ngdocs']
                    },
                    buildscss: {
                        files: ['app/styles/{,*/}*.scss'],
                        tasks: ['clean:buildscss','copy:buildscss'] 
                    }
                    ,
                    buildjs: {
                        files: ['app/scripts/{,*/}*.js'],
                        tasks: ['clean:buildjs','ngtemplates','concat:build']  
                    }
                },

                ngtemplates: {                   
                    app: {
                        options: {
                            module: 'fs-angular-api',
                        },
                        cwd:        'app',
                        src:        'views/directives/directive.html',
                        dest:       '.tmp/directivetemplate.js'
                    }
                },

                concat: {
                    options: {
                     
                    },
                    build: {
                      src: ['app/scripts/modules/module.js','app/scripts/filters/filter.js','app/scripts/directives/directive.js','app/scripts/services/service.js','.tmp/directivetemplate.js'],
                      dest: '../dist/api.js',
                    },
                },

                // The actual grunt server settings
                connect: {
                    options: {
                        livereload: 35730
                    },
                    local: {
                        options: {
                            port: 9090,
                            hostname: 'localhost',
                            open: true,
                            base: [
                                '.tmp',
                                '<%= yeoman.app %>'
                            ],
                            middleware: function(connect, options) {

                                return [modRewrite(['^[^\\.]*$ /index.html [L]']),
                                    connect.static('.tmp'),
                                    connect.static(appConfig.app),
                                    connect().use('/bower_components', connect.static('./bower_components'))
                                ];

                            }
                        }
                    },
                    docs: {
                        options: {
                            port: 9001,
                            hostname: 'localhost',
                            base: '../../gh-pages/',
                            open: true
                        }
                    }
                },


                // Add vendor prefixed styles
                autoprefixer: {
                    options: {
                        browsers: ['last 1 version']
                    },
                    dist: {
                        files: [{
                            expand: true,
                            cwd: '.tmp/styles/',
                            src: '{,*/}*.css',
                            dest: '.tmp/styles/'
                        }]
                    }
                },

                // Automatically inject Bower components into the app
                wiredep: {
                    app: {
                        src: ['<%= yeoman.app %>/index.html'],
                        ignorePath: /\.\.\//
                    },
                    sass: {
                        src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                        ignorePath: /(\.\.\/){1,2}bower_components\//
                    }
                },

                // Compiles Sass to CSS and generates necessary files if requested
                compass: {
                    options: {
                        sassDir: '<%= yeoman.app %>/styles',
                        cssDir: '.tmp/styles',
                        generatedImagesDir: '.tmp/images/generated',
                        imagesDir: '<%= yeoman.app %>/images',
                        javascriptsDir: '<%= yeoman.app %>/scripts',
                        fontsDir: '<%= yeoman.app %>/fonts',
                        importPath: './bower_components',
                        httpImagesPath: '/images',
                        httpGeneratedImagesPath: '/images/generated',
                        httpFontsPath: '/fonts',
                        relativeAssets: false,
                        assetCacheBuster: false,
                        raw: 'Sass::Script::Number.precision = 10\n'
                    },
                    dist: {
                        options: {
                            generatedImagesDir: '<%= yeoman.dist %>/images/generated'
                        }
                    },
                    server: {
                        options: {
                            debugInfo: true
                        }
                    }
                },

                // Renames files for browser caching purposes
                filerev: {
                    dist: {
                        src: [
                            '<%= yeoman.dist %>/scripts/{,*/}*.js',
                            '<%= yeoman.dist %>/styles/{,*/}*.css'
                        ]
                    }
                },

                // Empties folders to start fresh
                clean: {
                    buildjs: {
                        options: {
                          force: true
                        },
                        files: [{
                            dot: true,
                            src: [
                                '../dist/*.js'
                            ]
                        }]
                    },
                    buildscss: {
                        options: {
                          force: true
                        },
                        files: [{
                            dot: true,
                            src: [
                                '../dist/*.scss'
                            ]
                        }]
                    },
                    server: '.tmp',
                    cleanup: '<%= yeoman.dist %>/config'
                },

                // Reads HTML for usemin blocks to enable smart builds that automatically
                // concat, minify and revision files. Creates configurations in memory so
                // additional tasks can operate on them
                useminPrepare: {
                    html: '<%= yeoman.app %>/index.html',
                    options: {
                        dest: '<%= yeoman.dist %>',
                        flow: {
                            html: {
                                steps: {
                                    js: ['concat', 'uglifyjs'],
                                    css: ['cssmin']
                                },
                                post: {}
                            }
                        }
                    }
                },

                useminPrepareDev: {
                    html: '<%= yeoman.app %>/index.html',
                    options: {
                        dest: '<%= yeoman.dist %>',
                        flow: {
                            steps: {
                                'js': ['concat'],
                                'css': ['concat']
                            },
                            post: {}
                        }
                    }
                },

                // Performs rewrites based on filerev and the useminPrepare configuration
                usemin: {
                    html: ['<%= yeoman.dist %>/{,*/}*.html'],
                    css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
                    options: {
                        assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images']
                    }
                },

                ngconstant: {
                    options: {
                        space: '  ',
                        wrap: '\'use strict\';\n\n {%= __ngModule %}',
                        name: 'config',
                        dest: '<%= yeoman.dist %>/config/config.js'
                    },
                    local: {
                        constants: {
                            CONFIG: grunt.file.readJSON('config/local.json'),
                            BOWER: bower
                        },
                        options: {
                            dest: '<%= yeoman.app %>/config/config.js'
                        }
                    }
                },
                                
                // Copies remaining files to places other tasks can use
                copy: {
                    buildscss: {
                        files: [{
                                expand: true,
                                dot: true,
                                cwd: 'app/styles/directives',
                                src: [],
                                dest: '../dist'
                            }
                        ]
                    }
                },

                // Run some tasks in parallel to speed up the build process
                concurrent: {
                    server: [
                        'compass:server'
                    ],
                    dist: [
                        'compass:dist'
                    ]
                },

                exec: {
                    livesynccloud: {
                        cwd: '<%= yeoman.dist %>',
                        command: 'appbuilder livesync cloud'
                    }
                },

                prompt: {
                    builder: {
                        options: {
                            questions: [{
                                config: 'builder',
                                message: 'Please select...',
                                name: 'option',
                                type: 'list',
                                choices: ['LiveSync Cloud']
                            }],
                            then: function(results) {
                                if(results.builder == 'LiveSync Cloud')
                                    grunt.task.run('exec:livesynccloud');
                            }
                        }
                    }
                },

                ngdocs: {
                  options: {
                    dest: '../../gh-pages',
                    html5Mode: false,
                    startPage: '/api',
                    title: "Documentation",
                    titleLink: "/",
                    bestMatch: true,
                  
                  },
                  all: ['<%= yeoman.app %>/scripts/{,*/}*.js']
                }          
            });
    
            grunt.registerTask('doc', '', function() {

                 return grunt.task.run(["ngdocs","connect:docs:keepalive","watch"]);
            });

            grunt.registerTask('default', '', function(target) {

               return grunt.task.run([
                    'ngconstant:local',
                    'wiredep',
                    'concurrent:server',
                    'autoprefixer',
                    'connect:local',
                    'connect:docs',
                    'watch'
                ]);
            });

            grunt.registerTask('useminPrepareDev', function() {
                grunt.config.set('useminPrepare', grunt.config('useminPrepareDev'));
                grunt.task.run('useminPrepare');
            });
        };

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('./pluginShowcase.jquery.json'),
    less: {
      compile: {
        files: {
          "css/jquery.pluginShowcase.css": ["less/jquery.pluginShowcase.less"]
        }
      }
    },
    jshint: {
      // define the files to lint
      files: ['gruntfile.js', 'pluginShowcase.jquery.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
          // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> (<%= pkg.download %>) */\n'
      },
      dist: {
        src: 'js/<%= pkg.name %>.js',
        dest: 'js/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['less', 'jshint', 'uglify']);
};
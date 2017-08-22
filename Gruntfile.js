module.exports = function (grunt) {

  // Load Plugin
  [
    'grunt-cafe-mocha',
    'grunt-contrib-jshint'
    // 'grunt-exec'
  ].forEach(function (task) {
    grunt.loadNpmTasks(task);
  });

  // Set Plugin
  grunt.initConfig({
    cafemocha: {
      all: {
        src: 'qa/tests-*.js',
        options: { ui: 'tdd' }
      }
    },
    jshint: {
      app: ['meadowlark.js', 'public/js/**/*.js', 'lib/**/*.js'],
      qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js']
    }
    // exec: {
    //   linkchecker: { cmd: 'linkchecker http://localhost:3000/' }
    // }
  });

  // Register Task
  // grunt.registerTask('default', ['cafemocha', 'jshint', 'exec']);
  grunt.registerTask('default', ['cafemocha', 'jshint']);
};
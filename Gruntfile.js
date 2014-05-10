module.exports = function (grunt) {
  // Configure grunt tasks
  grunt.initConfig({
    nodewebkit: {
      src: [
        'package.json',
        'lib/**/*'
      ],
      options: {
        build_dir: './dist',
        mac: true,
        win: true,
        linux32: true,
        linux64: true
      }
    }
  });

  // Load in grunt tasks
  grunt.loadNpmTasks('grunt-node-webkit-builder');

  // Define normal tasks
  // TODO: Add lint to build task
  grunt.registerTask('build', ['nodewebkit']);

  // TODO: Default task should be lint
};

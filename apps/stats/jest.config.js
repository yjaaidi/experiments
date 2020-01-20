module.exports = {
  name: 'stats',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/stats',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};

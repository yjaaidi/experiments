module.exports = {
  name: 'stats',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/stats',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};

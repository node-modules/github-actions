module.exports = {
  plugins: [
    [ '@semantic-release/commit-analyzer', { preset: 'conventionalcommits' } ],
    [ '@semantic-release/release-notes-generator', { preset: 'conventionalcommits' } ],
    [ '@semantic-release/changelog', { changelogTitle: '# Changelog' } ],
    [ '@semantic-release/npm', {} ],

    [ '@semantic-release/git',
      {
        message: 'Release <%= nextRelease.version %>\n\n[skip ci]\n\n<%= nextRelease.notes %>',
      },
    ],

    // 403, Resource not accessible by integration, https://github.com/eggjs/egg-mock/actions/runs/5112843660/jobs/9191347769
    // [ '@semantic-release/github',
    //   {
    //     addReleases: 'bottom',
    //   },
    // ],
  ],
};

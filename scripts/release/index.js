const path = require('path');
const fs = require('fs');
const core = require('@actions/core');
const semanticRelease = require('semantic-release');
const { request } = require('undici');

async function run() {
  const mainRepoPath = process.cwd();
  const pkgInfo = require(`${mainRepoPath}/package.json`);
  const registry = pkgInfo.publishConfig?.registry || 'https://registry.npmjs.org';
  core.setOutput('name', pkgInfo.name);
  core.setOutput('registry', registry);

  try {
    const configFiles = [
      path.join(__dirname, 'release.config.js'),
      path.join(mainRepoPath, 'release.config.js'),
    ].filter(file => fs.existsSync(file));

    core.info(`Using config files: ${configFiles.join(', ')}`);

    const result = await semanticRelease({
      dryRun: process.env.DRYRUN === 'true',
      extends: configFiles,
    });

    const { nextRelease, lastRelease } = result;

    if (!nextRelease) {
      core.notice('No release need to be published.');
      core.summary.addRaw('No release need to be published.');
      await core.summary.write();
    } else {
      core.info(`Published release: ${nextRelease.version}`);
      core.setOutput('release_version', nextRelease.version);

      // cnpm sync
      try {
        const res = await request(`https://registry.npmmirror.com/-/package/${pkgInfo.name}/syncs`, {
          method: 'PUT',
          timeout: 30000,
        });
        const { id } = await res.body.json();
        const logUrl = `https://registry.npmmirror.com/-/package/${pkgInfo.name}/syncs/${id}/log`;
        core.setOutput('cnpm_sync_url', logUrl);
        core.info(`cnpm sync log url: ${logUrl}`);

        // write summary
        core.summary.addRaw(`## [${pkgInfo.name}](https://github.com/${process.env.GITHUB_REPOSITORY})\n`);
        core.summary.addRaw(`- Release: ${lastRelease?.version ?? ''} -> ${nextRelease.version}\n`);
        core.summary.addRaw(`- Registry: ${registry}\n`);
        core.summary.addRaw(`- CNPM Sync: ${logUrl}\n`);
        core.summary.addRaw(`- DryRun: ${process.env.DRYRUN}\n`);
      } catch (err) {
        core.info(`cnpm sync ${pkgInfo.name} fail, ${err.message}`);
        core.summary.addRaw(`- CNPM Sync ${pkgInfo.name} error: ${err.message}\n`);
      }
      core.summary.addRaw(nextRelease.notes);
      await core.summary.write();
    }
    console.log('Result:', result);
  } catch (error) {
    console.error(error);
    core.setFailed(error);
  }
}

run();

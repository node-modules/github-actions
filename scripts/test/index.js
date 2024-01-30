const core = require('@actions/core');

const os = core.getInput('os').split(',').map(x => x.trim());
const version = core.getInput('version').split(',').map(x => x.trim());
const mysqlVersion = core.getInput('mysql_version').split(',').map(x => x.trim());

core.setOutput('os', JSON.stringify(os));
core.setOutput('version', JSON.stringify(version));
core.setOutput('mysql_version', JSON.stringify(mysqlVersion));

core.info(`os: ${os}, version: ${version}, mysql_version: ${mysqlVersion}`);

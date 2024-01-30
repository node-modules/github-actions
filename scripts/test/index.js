const core = require('@actions/core');

const os = core.getInput('os').split(',').map(x => x.trim());
const version = core.getInput('version').split(',').map(x => x.trim());
const mysqlVersionInput = core.getInput('mysql_version') || '5';
const mysqlVersion = mysqlVersionInput.split(',').map(x => x.trim());

core.setOutput('os', JSON.stringify(os));
core.setOutput('version', JSON.stringify(version));
core.setOutput('mysql_version', JSON.stringify(mysqlVersion === '' ? [] : mysqlVersion));

core.info(`os: ${os}, version: ${version}, mysql_version: ${mysqlVersion}`);

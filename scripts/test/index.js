const core = require('@actions/core');

const os = core.getInput('os').split(',').map(x => x.trim());
const version = core.getInput('version').split(',').map(x => x.trim());
const mysqlVersionInput = core.getInput('mysql_version') || '5';
const mysqlVersion = mysqlVersionInput.split(',').map(x => x.trim());

const parallel = parseInt(core.getInput('parallel')) || 3;
const node_index = [];
const total_nodes = parallel;
for (let i = 0; i < total_nodes; i++) {
  node_index.push(i);
}

core.setOutput('os', JSON.stringify(os));
core.setOutput('version', JSON.stringify(version));
core.setOutput('mysql_version', JSON.stringify(mysqlVersion === '' ? [] : mysqlVersion));
core.setOutput('node_index', JSON.stringify(node_index));
core.setOutput('total_nodes', JSON.stringify(total_nodes));

core.info(`[debug] os: ${JSON.stringify(os)}, version: ${JSON.stringify(version)}, mysql_version: ${JSON.stringify(mysqlVersion)}, parallel: ${parallel}, node_index: ${JSON.stringify(node_index)}, total_nodes: ${JSON.stringify(total_nodes)}`);

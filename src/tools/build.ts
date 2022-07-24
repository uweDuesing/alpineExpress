import shell from 'shelljs';

const buildFolder = './build/';

const folders = new Set(['./src/views', './src/public']);

folders.forEach((folder) => {
    shell.cp('-R', folder, buildFolder);
});

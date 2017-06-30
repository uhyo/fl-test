import * as minimist from 'minimist';
import {
    CONFIG_FILE_NAME,
} from './setting'
import {
    verbose,
    info,
    error,
    setVerbose,
} from './log';
import {
    loadConfig,
} from './load-config';
import {
    Testcases,
    loadTestcases,
} from './testcases';
import {
    Interpreter,
} from './interpreter';
import {
    Interface,
} from './interface';

const argv = minimist(process.argv.slice(2), {
    string: ['config'],
    boolean: ['verbose'],
    alias: {
        c: 'config',
        v: 'verbose',
    },
});

// log level
if (argv.verbose){
    setVerbose();
}

// load config file
loadConfig(argv.config || CONFIG_FILE_NAME)
.then(config=>{
    const {
        filepath,
        interpreter,
        testcases
    } = config;

    info(`Config file: ${filepath}`);

    const intp = new Interpreter(interpreter);

    return Promise.all([
        loadTestcases(testcases),
        intp.prepare(),
    ])
    .then(([testcases])=>{
        verbose(`Loaded ${testcases.cases.length} testcases`);

        const i = new Interface(intp, testcases);
        i.run();
    });
})
.catch(e=>{
    error(e);
    process.exit(1);
})

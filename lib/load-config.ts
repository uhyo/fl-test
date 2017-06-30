import * as fs from 'fs';
import * as path from 'path';
import * as findUp from 'find-up';

export interface Config{
    /**
     * Filepath of config.
     */
    filepath: string;
    /**
     * Path to interpreter, relative to current directory.
     */
    interpreter: string;
    /**
     * Path to testcase relative to config file.
     */
    testcases: Array<string>;
}
export function loadConfig(configFilename: string): Promise<Config>{
    if (configFilename.indexOf(path.sep) >= 0){
        // ファイルの位置を与えられた
        return new Promise((resolve)=>{
            const abs = path.resolve(configFilename);
            resolve(readConfig(abs, JSON.parse(fs.readFileSync(abs, 'utf8'))));
        });
    }
    return findUp(configFilename).then(filepath=>{
        if (filepath != null){
            return readConfig(filepath, JSON.parse(fs.readFileSync(filepath, 'utf8')));
        }else{
            return Promise.reject(new Error('Config file not found'));
        }
    });
}

function readConfig(filepath: string, obj: any): Config{
    const configdir = path.dirname(filepath);
    let testcases = obj.testcases;
    if (testcases == null){
        testcases = [];
    }
    if ('string' === typeof testcases){
        testcases = [testcases];
    }
    testcases = testcases.map(p=> path.resolve(configdir, p));
    return {
        filepath,
        interpreter: './main',
        ... obj,
        testcases,
    };
}

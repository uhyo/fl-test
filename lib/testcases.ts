// load testcase file
import * as fs from 'fs';
import {
    verbose,
} from './log';

export interface Testcases{
    cases: Array<string>;
}
export async function loadTestcases(paths: Array<string>): Promise<Testcases>{
    verbose(`Loading testcases from:
` + paths.map(p=> `  ${p}\n`));

    const values = await Promise.all(paths.map(loadFile));
    const cases: Array<string> = ([] as Array<string>).concat(... values.map(parse));
    return {
        cases,
    };
}

function loadFile(filepath: string): Promise<string>{
    return new Promise((resolve, reject)=>{
        fs.readFile(filepath, 'utf8', (err, content)=>{
            if (err != null){
                reject(err);
            }else{
                resolve(content);
            }
        });
    });
}
function parse(content: string): Array<string>{
    return content.trim().split(/\r\n|\r|\n/).filter(x=>x);
}

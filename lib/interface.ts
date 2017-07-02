// interface
import * as readline from 'readline';
import {
    Interpreter,
} from './interpreter';
import {
    Testcases,
} from './testcases';
import {
    status,
    info,
    input,
} from './log';
import * as color from './color';

const stdin = process.stdin;

export class Interface{
    protected interpreter: Interpreter;
    protected testcases: Testcases;
    protected cursor: number;
    // protected rl: readline.ReadLine;
    constructor(interpreter: Interpreter, testcases: Testcases){
        this.interpreter = interpreter;
        this.testcases = testcases;
        this.cursor = 0;

        stdin.setEncoding('utf8');
        (stdin as any).setRawMode(true);
    }

    public run(): void{
        // main routine
        status('Command: n = next, e = edit');
        this.waitForInput();
    }
    protected waitForInput(): void{
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.on('SIGINT', ()=>{
            process.exit(0);
        });
        rl.setPrompt('');
        const handler = (d)=>{
            if (d === '\u0003'){
                // Ctrl-C
                process.exit(0);
            }
            if (d === 'n'){
                rl.close();
                readline.moveCursor(stdin, -1, 0);
                stdin.removeListener('keypress', handler);
                this.runone();
            } else if (d === 'e'){
                rl.close();
                readline.moveCursor(stdin, -1, 0);
                stdin.removeListener('keypress', handler);
                this.edit();
            }
        };
        stdin.on('keypress', handler);
    }
    protected runone(): void{
        // put one testcase into interpreter
        const v = this.testcases.cases[this.cursor];
        if (v == null){
            info('No more testcases.');
            this.waitForInput();
            return;
        }
        const inn = v.trim();
        const [m, comment] = inn.split('\t');
        input(m + (comment ? color.comment(` // ${comment}`) : ''));
        this.interpreter.write(inn + '\n');
        this.cursor++;
        setTimeout(()=>{
            this.waitForInput();
        }, 100);
    }
    protected edit(): void{
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.on('SIGINT', ()=>{
            process.exit(0);
        });
        rl.setPrompt('# ');
        status('Edit mode');
        rl.prompt();
        let allinput = '';
        rl.on('line', v=>{
            allinput += v;
            if (/;;\s*$/.test(v)){
                // おわりっぽい
                allinput = allinput.trim();
                input(allinput);
                this.interpreter.write(allinput + '\n');
                rl.close();
                setTimeout(()=>{
                    this.waitForInput();
                }, 100);
            }
        });
    }
}

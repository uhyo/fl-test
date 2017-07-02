import * as child_process from 'child_process';
import * as path from 'path';
import {
    verbose,
    error,
} from './log';

export class Interpreter{
    /**
     * Executable path of interpreter
     */
    protected excpath: string;
    protected proc: child_process.ChildProcess | undefined;
    protected respawn_flg: boolean;
    constructor(excpath: string){
        this.excpath = path.resolve(excpath);
        this.proc = undefined;

        this.respawn_flg = true;
    }
    /**
     * Prepare interpreter
     */
    public prepare(): Promise<void>{
        if (this.proc != null){
            return Promise.resolve();
        }else{
            this.spawn();
            return Promise.resolve();
        }
    }
    /**
     * End
     */
    public exit(): void{
        this.respawn_flg = false;
        if (this.proc != null){
            this.proc.kill();
            this.proc = undefined;
        }
    }
    /**
     * Write
     */
    public write(str: string): void{
        if (this.proc == null){
            return;
        }
        this.proc.stdin.write(str);
    }
    /**
     * Spawn new interpreter
     */
    protected spawn(): void{
        if (this.proc != null){
            this.proc.kill();
        }
        verbose(`Spawning ${this.excpath}`);
        const proc = child_process.spawn(this.excpath);
        proc.on('error', e=>{
            error(String(e));
        });
        proc.on('exit', ()=>{
            verbose('Interpreter exited.');
            if (this.respawn_flg){
                this.spawn();
            }
        });
        proc.stdout.pipe(process.stdout);
        proc.stderr.pipe(process.stdout);
        this.proc = proc;
    }
}

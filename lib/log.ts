import * as color from './color';

enum LogLevel {
    Verbose = 'verbose',
    Normal = 'normal',
}

let logLevel: LogLevel = LogLevel.Normal;

export function setVerbose(): void{
    logLevel = LogLevel.Verbose;
}

export function verbose(val: string): void{
    if (logLevel === LogLevel.Verbose){
        console.log(color.verbose(val));
    }
}

export function status(val: string): void{
    console.log(color.status(val));
}

export function input(val: string): void{
    console.log(color.input(val));
}

export function info(val: string): void{
    console.log(color.info(val));
}

export function warning(val: string): void{
    console.log(color.warning(val));
}

export function error(val: string): void{
    console.log(color.error(val));
}

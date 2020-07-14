// probably, unnecessary here, but it was pretty comforable to use
export class Time {
    protected static _instance: Time = new Time();
    private constructor() {}
    public static getInstance(): Time {
        return Time._instance;
    }
    mseconds    :number = 0; 
    seconds     :number = 0;
    minutes     :number = 0;
    hours       :number = 0;
    proccesEmit() {
        if(++this.mseconds == 100){
            this.mseconds = 0;
            if(++this.seconds == 60){
                this.seconds = 0;
                if(++this.minutes == 60){
                    this.minutes = 0;
                    this.hours++
                }
            }
        }
    }

    clear() {
        this.mseconds = 0; 
        this.seconds  = 0;
        this.minutes  = 0;
        this.hours    = 0;
    }
}
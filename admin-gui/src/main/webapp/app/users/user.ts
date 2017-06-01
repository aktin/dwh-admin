/**
 * Created by Xu on 03.05.2017.
 */
export class User {
    public static parse(username: string, fullname: string){
        return new User(username, null, fullname);
    }

    constructor(
        public username: string,
        public token?: string,
        public fullname?: string,
        public roles?: string[],
        public isAdmin?: boolean,
    ) { }
}

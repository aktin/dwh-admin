/**
 * Created by Xu on 03.05.2017.
 */
export class User {
    constructor(
        public username: string,
        public token?: string,
        public roles?: string[],
        public isAdmin?: boolean,
    ) { }
}

/**
 * Created by Xu on 03.05.2017.
 */
export class User {
    public static parse (name: string, username: string, email: string, isAdmin: boolean): User {
        let user = new User(username);
        user.name = name;
        user.email = email;
        if (isAdmin) {
            user.isAdmin = isAdmin;
        }
        return user;
    }

    constructor (
        public username: string,
        public token?: string,
        public name?: string,
        public email?: string,
        public isAdmin?: boolean,
        public roles?: string[],
        public aktinRole?: string,
    ) { }
}

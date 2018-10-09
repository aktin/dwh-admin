
export class Role {
    private permissions: Permissions[];

    constructor(public rolename: string) {
        this.parse(rolename);
    }

    parse(rolename: string): Role {
        let role = this;
        switch (rolename) {
            case 'Admin':
                this.permissions = [ Permissions.READ_REQUESTS,
                                     Permissions.WRITE_REQUESTS,
                                     Permissions.READ_REPORTS,
                                     Permissions.WRITE_REPORTS,
                                     Permissions.LIST_VISITS,
                                     Permissions.READ_STUDY_MANAGER,
                                     Permissions.WRITE_STUDY_MANAGER,
                                     Permissions.CONFIG,
                                     Permissions.STATUS ]
                break;
            case 'StudyNurse':
                this.permissions = [ Permissions.READ_STUDY_MANAGER,
                                     Permissions.WRITE_STUDY_MANAGER,
                                     Permissions.READ_REPORTS,
                                     Permissions.READ_REQUESTS ]
                break;
        }
        return role;
    }

    getPermissions(): Permissions[] {
        return this.permissions;
    }
}

export enum Permissions {
    READ_REQUESTS,
    WRITE_REQUESTS,
    READ_REPORTS,
    WRITE_REPORTS,
    LIST_VISITS,
    READ_STUDY_MANAGER,
    WRITE_STUDY_MANAGER,
    CONFIG,
    STATUS
}

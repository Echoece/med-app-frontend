export interface LoginResponse {
    id: number;
    username: string;
    email: string;
    type: string;
    permissionList: Permission[],// permission
    roleList: Role[], // role
    token: string;
    authorities: string[];
    enabled :boolean;
    accountNonLocked: boolean;
}

export interface Role {
    id: number;
    name: string;
    label: string;
    description: string;
}

export interface Permission {
    id: number;
    name: string;
    label: string;
    operation: string;
    section: string;
    module: string;

}

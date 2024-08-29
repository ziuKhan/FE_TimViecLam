export interface IUser {
    _id?: string;
    name?: string;
    email?: string;
    password?: string;
    age?: number;
    gender?: string;
    address?: string;
    role?: {
        _id?: string;
        name?: string;
    }

    company?: {
        _id?: string;
        name?: string;
    }
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IAccount {
    access_token?: string;
    user: {
        _id: string;
        email: string;
        name: string;
        role: {
            _id: string;
            name: string;
        }
        permissions: {
            _id: string;
            name: string;
            apiPath: string;
            method: string;
            module: string;
        }[]
    }
}

export interface ICompany {
    _id?: string;
    name?: string;
    address?: string;
    logo?: string;
    description?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
    jobs?:number;
}

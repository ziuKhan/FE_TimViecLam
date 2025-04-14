export interface IUser {
  _id?: string
  name?: string
  email?: string
  password?: string
  gender?: string
  address?: string
  avatar?: string
  isActive?: boolean
  role?:
    | {
        _id?: string
        name?: string
      }
    | string

  company?:
    | {
        _id?: string | undefined
        name?: string | undefined
      }
    | undefined
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface IUserbyAccount {
  _id: string
  email: string
  name: string
  avatar: string
  companyId: string
  role: {
    _id: string
    name: string
  }
  permissions: {
    _id: string
    name: string
    apiPath: string
    method: string
    module: string
  }[]
}

export interface IAccount {
  access_token?: string
  user: IUserbyAccount
}

export interface ICompany {
  _id?: string
  name?: string
  address?: string[]
  logo?: string
  isActive?: boolean
  description?: string
  createdBy?: string
  province?: string
  detailedAddress?: string
  district?: string
  ward?: string
  fullAddress?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
  jobs?: number
}

export interface IJob {
  _id?: string
  name: string
  skills: string[]
  companyId: {
    _id: string
    name?: string
    logo?: string
  }

  location: string
  salaryFrom?: number
  salaryTo?: number
  isSalary?: boolean
  quantity: number
  level: string
  description: string
  startDate: Date
  endDate: Date
  isActive: boolean
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface IResume {
  _id?: string
  email: string
  userId: string
  url: string
  status: string
  companyId:
    | string
    | {
        _id: string
        name: string
        logo: string
      }
  jobId:
    | string
    | {
        _id: string
        name: string
      }
  history?: {
    status: string
    updatedAt: Date
    updatedBy: { _id: string; email: string }
  }[]
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface IPermission {
  _id?: string
  name?: string
  apiPath?: string
  method?: string
  module?: string

  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface IRole {
  _id?: string
  name: string
  description: string
  isActive: boolean
  permissions: string[]

  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface ISubscribers {
  _id?: string
  name?: string
  email?: string
  skills: string[]
  createdBy?: string
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}

export interface IPaginate {
  current?: number
  pageSize?: number
  pages?: number
  total?: number
  keyword?: string
}

export interface INotification {
  _id?: string
  title?: string
  message?: string
  type?: string
  isGlobal?: boolean
  objInfo?: {
    _id?: string
    type?: string
    name?: string
  } 
  userId?: string
  userIds?: string[]
  readAt?: Date
  isURL?: boolean
  isRead?: boolean
  url?: string
  createdBy?: {
    _id?: {
      _id?: string
      name?: string
      email?: string
      avatar?: string
    }
    avatar?: string
    name?: string
    email?: string
  }
  isDeleted?: boolean
  deletedAt?: boolean | null
  createdAt?: string
  updatedAt?: string
}
export interface IApiResponse {
  statusCode: number
  message: string
  data: any
}
export interface ILocation {
  id: string
  name: string
  name_en: string
  full_name: string
  full_name_en: string
  latitude: string
  longitude: string
}

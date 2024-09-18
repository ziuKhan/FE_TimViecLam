export const formatSalary = (value: string | number | undefined) => {
  if (!value) return 'N/A'
  return parseInt(value.toString()).toLocaleString('vi-VN')
}

export const SKILLS_LIST = [
  { label: 'React.JS', value: 'REACT.JS' },
  { label: 'React Native', value: 'REACT NATIVE' },
  { label: 'Vue.JS', value: 'VUE.JS' },
  { label: 'Angular', value: 'ANGULAR' },
  { label: 'Nest.JS', value: 'NEST.JS' },
  { label: 'TypeScript', value: 'TYPESCRIPT' },
  { label: 'Java', value: 'JAVA' },
  { label: 'Frontend', value: 'FRONTEND' },
  { label: 'Backend', value: 'BACKEND' },
  { label: 'Fullstack', value: 'FULLSTACK' }
]

import router from '@/router' // Import router để điều hướng

// Hàm xử lý lỗi chung
export const handleApiError = (err: any): void => {
  const status = err?.response?.status

  if (status === 403) {
    router.push('/403') // Điều hướng tới trang lỗi 403
  } else if (status === 404) {
    router.push('/404') // Điều hướng tới trang lỗi 404
  } else if (status === 401) {
    return
  } else if (status === 500) {
    router.push('/500') // Điều hướng tới trang lỗi 404
  } else if (status === 400) {
    alert(err?.response?.data?.message)
  } else {
    console.error(err)
  }
}

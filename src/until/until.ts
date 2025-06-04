export const formatSalary = (value: string | number | undefined) => {
  if (!value) return '0 đ'

  const number = parseInt(value.toString())

  // Xử lý tỷ
  if (number >= 1000000000) {
    const billions = number / 1000000000
    if (billions % 1 === 0) {
      return `${billions} tỷ`
    }
    return `${billions.toFixed(1)} tỷ`
  }

  // Xử lý triệu
  if (number >= 1000000) {
    const millions = number / 1000000
    if (millions % 1 === 0) {
      return `${millions} triệu`
    }
    return `${millions.toFixed(1)} triệu`
  }

  // Xử lý trăm nghìn
  if (number >= 100000) {
    const hundreds = number / 100000
    if (hundreds % 1 === 0) {
      return `${hundreds} trăm`
    }
    return `${hundreds.toFixed(1)} trăm`
  }

  // Nếu nhỏ hơn 100.000 thì format với đơn vị đồng
  return `${number.toLocaleString('vi-VN')} đ`
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

export const LEVELS_LIST = [
  { label: 'INTERN', value: 'INTERN' },
  { label: 'FRESHER', value: 'FRESHER' },
  { label: 'JUNIOR', value: 'JUNIOR' },
  { label: 'MIDDLE', value: 'MIDDLE' },
  { label: 'SENIOR', value: 'SENIOR' },
  { label: 'MANAGER', value: 'MANAGER' },
]

export const TYPES_NOTIFICATION_LIST = [
  { label: 'Hệ thống', value: 'SYSTEM' },
  { label: 'Hoàn thành', value: 'SUCCESS' },
  { label: 'Thông báo', value: 'NOTIFICATION' },
  { label: 'Cảnh báo', value: 'WARNING' },
  { label: 'Lỗi', value: 'ERROR' },
  { label: 'Khuyến mãi', value: 'PROMOTION' },
  { label: 'Nhắc nhở', value: 'REMINDER' },
  { label: 'Tin tức', value: 'NEWS' },
  { label: 'Cập nhật', value: 'UPDATE' }
]

export const TIME_UNIT = [
  { label: 'Bỏ chọn', value: '' },
  { label: 'Năm', value: 'year' },
  { label: 'Tháng', value: 'month' },
  { label: 'Tuần', value: 'week' },
  { label: 'Ngày', value: 'day' },
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

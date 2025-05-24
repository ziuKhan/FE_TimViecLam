# Quick Test Checklist - User System

## 🚀 Setup & Start
- [ v] `npm install` (nếu chưa install)
- [ v] `npm run dev` 
- [ v] Truy cập http://localhost:5173
- [v] Trang chủ load thành công

## 🏠 Trang Chủ (HomeView)
- [v ] Banner/hero section hiển thị
- [v ] Job listings hiển thị (nếu có data)
- [ v] Search box hoạt động
- [ v] Navigation menu hoạt động
- [v ] Footer hiển thị đầy đủ

## 🔍 Tìm Kiếm (SearchView)
- [ v] Truy cập `/search`
- [ v] Search form hoạt động
- [ v] Kết quả hiển thị (hoặc empty state)
- [ v] Pagination (nếu có)
- [ v] Filter options (nếu có)

## 🔐 Authentication
### Đăng Ký
- [ ] Truy cập `/register`
- [ ] Form validation hoạt động
- [ ] Error messages hiển thị đúng
- [ ] Submit button có loading state

### Đăng Nhập  
- [ ] Truy cập `/login`
- [ ] Form validation hoạt động
- [ ] Error handling cho thông tin sai
- [ ] "Remember me" checkbox (nếu có)

### Account Setup
- [ ] Truy cập `/account-setup`
- [ ] Multi-step form hoạt động
- [ ] Progress indicator
- [ ] Validation ở mỗi step

## 💼 Job & Company
### Job Detail
- [ ] Truy cập `/job/1` (thay số 1 bằng id có thật)
- [ ] Job information hiển thị đầy đủ
- [ ] Apply button hoạt động
- [ ] Save/bookmark feature
- [ ] Related jobs (nếu có)

### Company Detail
- [ ] Truy cập `/company/1`
- [ ] Company profile hiển thị
- [ ] Company jobs listing
- [ ] Contact information

## 👔 Customer Features
### Customer Registration
- [ ] Truy cập `/customer`
- [ ] Company registration form
- [ ] File upload (logo, documents)
- [ ] Terms & conditions

### Subscription Package
- [ ] Truy cập `/sub-package`
- [ ] Package options hiển thị
- [ ] Pricing information
- [ ] Feature comparison
- [ ] Select package button

### Payment Flow
- [ ] Test payment success `/success`
- [ ] Test payment cancel `/cancel`
- [ ] Return URLs hoạt động

## 📱 Responsive Design
- [ ] Mobile view (375px): Menu burger, stack layout
- [ ] Tablet view (768px): Adapted navigation
- [ ] Desktop view (1200px+): Full layout

## 🌐 Browser Testing
- [ ] Chrome: Tất cả features hoạt động
- [ ] Firefox: Cross-browser compatibility 
- [ ] Edge: Microsoft compatibility
- [ ] Safari (nếu có Mac): Apple compatibility

## ⚡ Performance
- [ ] Page load < 3 seconds
- [ ] Images load properly
- [ ] No console errors
- [ ] Smooth navigation transitions

## 🚨 Error Handling
- [ ] 404 page: Truy cập `/non-existent-page`
- [ ] 403 page: Truy cập protected route without auth
- [ ] Network errors: Disconnect internet, test actions
- [ ] API errors: Mock failed responses

## 🔧 Developer Tools
- [ ] No console errors
- [ ] No console warnings (major ones)
- [ ] Network tab: API calls successful
- [ ] Vue DevTools: Store/state working

---

## 🐛 Bug Report Template
```
BUG ID: BUG-001
DATE: [Current Date]
TESTER: [Your Name]

ISSUE: [Brief description]
STEPS TO REPRODUCE:
1. 
2. 
3. 

EXPECTED: [What should happen]
ACTUAL: [What actually happens]
BROWSER: [Chrome/Firefox/etc version]
SCREEN SIZE: [Desktop/Tablet/Mobile]
SEVERITY: [Critical/High/Medium/Low]
```

## ✅ Priority Test Areas
1. **Authentication Flow** - Users must be able to register/login
2. **Job Search & View** - Core functionality for job seekers  
3. **Customer Registration** - Revenue generating feature
4. **Payment Integration** - Critical business flow
5. **Responsive Design** - Mobile users experience

## 🎯 Success Criteria
- [ ] No critical bugs (system crashes, unable to register/login)
- [ ] All major user journeys work end-to-end
- [ ] UI is responsive on mobile/tablet/desktop
- [ ] Error messages are user-friendly
- [ ] Performance is acceptable (< 3s load times) 
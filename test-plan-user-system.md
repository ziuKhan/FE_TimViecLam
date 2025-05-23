# Kế Hoạch Test Tổng Thể - Hệ Thống User

## 1. TỔNG QUAN HỆ THỐNG

### Công nghệ sử dụng:
- Vue 3 + TypeScript + Vite
- Ant Design Vue UI Framework
- Vue Router cho routing
- Pinia cho state management
- Axios cho API calls
- TailwindCSS cho styling

### Cấu trúc chính:
- **User Layout**: Layout chính cho user
- **Home**: Trang chủ và tìm kiếm
- **Auth**: Đăng nhập, đăng ký, thiết lập tài khoản
- **Customer**: Đăng ký customer
- **Job**: Chi tiết công việc
- **Company**: Thông tin công ty
- **Package**: Gói dịch vụ và thanh toán

## 2. TEST CASES CHI TIẾT

### 2.1 TEST AUTHENTICATION & AUTHORIZATION

#### 2.1.1 Đăng Ký (Register)
**File test**: `src/views/user/Auth/RegisterView.vue`

**Test Cases:**
- [ ] **TC001**: Đăng ký với thông tin hợp lệ
  - Input: Email, password, confirm password hợp lệ
  - Expected: Chuyển đến trang login hoặc account setup
  
- [ ] **TC002**: Đăng ký với email đã tồn tại
  - Input: Email đã được đăng ký trước đó
  - Expected: Hiển thị lỗi "Email đã tồn tại"
  
- [ ] **TC003**: Đăng ký với password không khớp
  - Input: Password và confirm password khác nhau
  - Expected: Hiển thị lỗi validation
  
- [ ] **TC004**: Đăng ký với email không hợp lệ
  - Input: Email sai format
  - Expected: Hiển thị lỗi validation email

#### 2.1.2 Đăng Nhập (Login)
**File test**: `src/views/user/Auth/LoginView.vue`

**Test Cases:**
- [ ] **TC005**: Đăng nhập với thông tin chính xác
  - Input: Email và password đúng
  - Expected: Chuyển đến trang chủ và lưu token
  
- [ ] **TC006**: Đăng nhập với thông tin sai
  - Input: Email hoặc password sai
  - Expected: Hiển thị lỗi "Thông tin đăng nhập không chính xác"
  
- [ ] **TC007**: Đăng nhập khi chưa hoàn thành setup
  - Input: Tài khoản chưa setup xong
  - Expected: Chuyển đến trang account setup

#### 2.1.3 Thiết Lập Tài Khoản
**File test**: `src/views/user/Auth/AccountSetupView.vue`

**Test Cases:**
- [ ] **TC008**: Hoàn thành thiết lập thông tin cá nhân
  - Input: Thông tin profile đầy đủ
  - Expected: Chuyển đến bước tiếp theo
  
- [ ] **TC009**: Bỏ qua thông tin bắt buộc
  - Input: Thiếu thông tin required
  - Expected: Hiển thị validation errors

### 2.2 TEST NAVIGATION & ROUTING

#### 2.2.1 User Layout
**File test**: `src/views/user/UserLayout.vue`

**Test Cases:**
- [ ] **TC010**: Navigation menu hoạt động
  - Action: Click các menu item
  - Expected: Route chuyển đổi chính xác
  
- [ ] **TC011**: Responsive design
  - Action: Thay đổi kích thước màn hình
  - Expected: Layout adapts properly

#### 2.2.2 Protected Routes
**Test Cases:**
- [ ] **TC012**: Truy cập route yêu cầu login khi chưa login
  - Action: Truy cập protected route
  - Expected: Redirect đến login page
  
- [ ] **TC013**: Middleware checkAccountSetup
  - Action: Login với account chưa setup
  - Expected: Redirect đến account setup

### 2.3 TEST CORE FEATURES

#### 2.3.1 Trang Chủ (Home)
**File test**: `src/views/user/Home/HomeView.vue`

**Test Cases:**
- [ ] **TC014**: Load trang chủ thành công
  - Expected: Hiển thị các job featured, banner
  
- [ ] **TC015**: Navigation đến trang search
  - Action: Click search hoặc submit search form
  - Expected: Chuyển đến SearchView với query

#### 2.3.2 Tìm Kiếm (Search)
**File test**: `src/views/user/Home/SearchView.vue`

**Test Cases:**
- [ ] **TC016**: Tìm kiếm với keyword
  - Input: Search term
  - Expected: Hiển thị kết quả phù hợp
  
- [ ] **TC017**: Filter và sort
  - Action: Áp dụng các filter
  - Expected: Kết quả được filter chính xác
  
- [ ] **TC018**: Pagination
  - Action: Navigate qua các page
  - Expected: Load more results correctly

#### 2.3.3 Chi Tiết Công Việc
**File test**: `src/views/user/JobView.vue`

**Test Cases:**
- [ ] **TC019**: Xem chi tiết job
  - Action: Access job/:id route
  - Expected: Hiển thị thông tin job đầy đủ
  
- [ ] **TC020**: Apply job (nếu đã login)
  - Action: Click apply button
  - Expected: Submit application hoặc redirect login
  
- [ ] **TC021**: Save job
  - Action: Click save/bookmark button
  - Expected: Job được lưu vào wishlist

#### 2.3.4 Thông Tin Công Ty
**File test**: `src/views/user/CompanyView.vue`

**Test Cases:**
- [ ] **TC022**: Xem thông tin công ty
  - Action: Access company/:id route
  - Expected: Hiển thị profile công ty
  
- [ ] **TC023**: Xem các job của công ty
  - Expected: List các job opening của company

### 2.4 TEST CUSTOMER FEATURES

#### 2.4.1 Đăng Ký Customer
**File test**: `src/views/user/Customer/RegisterView.vue`

**Test Cases:**
- [ ] **TC024**: Đăng ký làm customer/employer
  - Input: Company information
  - Expected: Account được tạo với role customer

#### 2.4.2 Subscription Package
**File test**: `src/views/user/SubPackageView.vue`

**Test Cases:**
- [ ] **TC025**: Xem các gói subscription
  - Expected: Hiển thị pricing và features
  
- [ ] **TC026**: Chọn gói và thanh toán
  - Action: Select package và proceed payment
  - Expected: Redirect đến payment gateway

#### 2.4.3 Payment Flow
**Test Cases:**
- [ ] **TC027**: Payment success
  - Expected: Redirect đến SuccessView
  
- [ ] **TC028**: Payment cancel
  - Expected: Redirect đến CancelView

### 2.5 TEST API INTEGRATION

#### 2.5.1 API Calls
**Test Cases:**
- [ ] **TC029**: API authentication headers
  - Verify: All API calls include proper auth headers
  
- [ ] **TC030**: API error handling
  - Scenario: Network errors, 500 errors
  - Expected: Proper error messages displayed
  
- [ ] **TC031**: Loading states
  - Verify: Loading indicators during API calls

### 2.6 TEST UI/UX

#### 2.6.1 Responsive Design
**Test Cases:**
- [ ] **TC032**: Mobile viewport (320px - 768px)
  - Expected: Mobile-friendly layout
  
- [ ] **TC033**: Tablet viewport (768px - 1024px)
  - Expected: Tablet-optimized layout
  
- [ ] **TC034**: Desktop viewport (1024px+)
  - Expected: Full desktop layout

#### 2.6.2 Accessibility
**Test Cases:**
- [ ] **TC035**: Keyboard navigation
  - Action: Navigate using only keyboard
  - Expected: All interactive elements accessible
  
- [ ] **TC036**: Screen reader compatibility
  - Verify: Proper ARIA labels and semantic HTML

#### 2.6.3 Performance
**Test Cases:**
- [ ] **TC037**: Page load times
  - Expected: Pages load within 3 seconds
  
- [ ] **TC038**: Image optimization
  - Verify: Images are properly optimized

### 2.7 TEST BROWSER COMPATIBILITY

**Test Cases:**
- [ ] **TC039**: Chrome (latest)
- [ ] **TC040**: Firefox (latest)
- [ ] **TC041**: Safari (latest)
- [ ] **TC042**: Edge (latest)

## 3. TEST EXECUTION PLAN

### 3.1 Manual Testing Workflow

1. **Setup Environment**
   ```bash
   npm run dev
   ```

2. **Test Authentication Flow**
   - Chạy TC001-TC009 theo thứ tự
   - Verify token storage và session management

3. **Test Core User Journey**
   - Home → Search → Job Detail → Apply
   - Test với cả user đã login và chưa login

4. **Test Customer Flow**
   - Register customer → Choose package → Payment

5. **Test Edge Cases**
   - Network disconnection
   - Invalid API responses
   - Browser refresh scenarios

### 3.2 Automated Testing Setup

**Cài đặt testing framework:**
```bash
npm install --save-dev @vue/test-utils vitest jsdom
npm install --save-dev cypress # for E2E testing
```

### 3.3 Test Data Setup

**Test Accounts:**
- User account: `testuser@example.com`
- Customer account: `testcompany@example.com`
- Admin account: `admin@example.com`

**Test Jobs & Companies:**
- Tạo sample data cho testing

## 4. BUG TRACKING

### Template Bug Report:
- **Bug ID**: 
- **Test Case**: 
- **Steps to Reproduce**:
- **Expected Result**:
- **Actual Result**:
- **Environment**: 
- **Severity**: Critical/High/Medium/Low
- **Status**: Open/In Progress/Fixed/Closed

## 5. DEPLOYMENT TESTING

### 5.1 Build Testing
**Test Cases:**
- [ ] **TC043**: Production build successful
  ```bash
  npm run build
  ```
- [ ] **TC044**: Preview build works
  ```bash
  npm run preview
  ```

### 5.2 Environment Variables
**Test Cases:**
- [ ] **TC045**: All env variables properly configured
- [ ] **TC046**: API endpoints working in production

## 6. REGRESSION TESTING

Sau mỗi release, chạy lại:
- Authentication flow (TC001-TC009)
- Core user journey (TC014-TC023)
- Critical business flows (TC024-TC028)

---

## NOTES

- Cập nhật test plan này khi có features mới
- Document các bugs được tìm thấy và fixes
- Thường xuyên review và optimize test cases
- Maintain test data consistency 
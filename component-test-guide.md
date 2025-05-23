# Hướng Dẫn Test Chi Tiết Từng Component

## 📝 Test Matrix Overview

| Component | Route | Priority | Auth Required | Key Features |
|-----------|-------|----------|---------------|--------------|
| HomeView | `/` | High | No | Banner, job listings, search |
| SearchView | `/search` | High | No | Job search, filters |
| LoginView | `/login` | Critical | No | Authentication |
| RegisterView | `/register` | Critical | No | User signup |
| JobView | `/job/:id` | High | Optional | Job details, apply |
| CompanyView | `/company/:id` | Medium | No | Company profile |
| AccountSetupView | `/account-setup` | High | Yes | Profile setup |
| SubPackageView | `/sub-package` | High | Optional | Pricing, packages |
| CustomerRegisterView | `/customer` | Medium | No | Company signup |

---

## 🏠 HomeView Test Guide

### Quick Access Test:
```bash
# Mở browser và truy cập:
http://localhost:5173/
```

### Test Cases:
1. **Layout Test**
   - [ ] Header navigation hiển thị
   - [ ] Hero/banner section 
   - [ ] Featured jobs section
   - [ ] Footer với links

2. **Functionality Test**
   - [ ] Search form submission
   - [ ] Job card clicks navigate to job detail
   - [ ] Category filters (nếu có)
   - [ ] "View more" buttons work

3. **Responsive Test**
   - [ ] Mobile: Stack layout, burger menu
   - [ ] Tablet: Adapted grid
   - [ ] Desktop: Full layout

---

## 🔍 SearchView Test Guide

### Quick Access Test:
```bash
# URL để test:
http://localhost:5173/search
http://localhost:5173/search?q=developer
http://localhost:5173/search?location=hanoi
```

### Test Cases:
1. **Search Form**
   - [ ] Keyword input accepts text
   - [ ] Location dropdown/input
   - [ ] Submit button works
   - [ ] Clear/reset functionality

2. **Results Display**
   - [ ] Job cards display properly
   - [ ] Pagination works
   - [ ] Empty state when no results
   - [ ] Loading state during search

3. **Filters & Sorting**
   - [ ] Salary range filter
   - [ ] Experience level filter
   - [ ] Job type filter (full-time, part-time)
   - [ ] Sort by date/relevance

---

## 🔐 Authentication Test Guide

### RegisterView Tests
```bash
# URL: http://localhost:5173/register
```

**Critical Test Cases:**
1. **Form Validation**
   ```
   Test Data:
   - Valid: email@example.com, password123, password123
   - Invalid Email: invalid-email, missing@domain
   - Password Mismatch: pass1, pass2
   - Weak Password: 123, abc
   ```

2. **User Feedback**
   - [ ] Success message after registration
   - [ ] Error handling for duplicate email
   - [ ] Loading spinner during submission
   - [ ] Redirect after successful signup

### LoginView Tests
```bash
# URL: http://localhost:5173/login
```

**Critical Test Cases:**
1. **Authentication Flow**
   ```
   Test Scenarios:
   - Valid credentials → Success redirect
   - Invalid credentials → Error message
   - Empty fields → Validation errors
   - Network error → Appropriate error handling
   ```

2. **Session Management**
   - [ ] Token storage after login
   - [ ] Remember me functionality
   - [ ] Auto-redirect if already logged in
   - [ ] Logout functionality

---

## 💼 JobView Test Guide

### Quick Access Test:
```bash
# Test với job ID có thật (kiểm tra API response):
http://localhost:5173/job/1
http://localhost:5173/job/999 # Test 404 case
```

### Test Cases:
1. **Job Information Display**
   - [ ] Job title, company name
   - [ ] Job description formatted properly
   - [ ] Requirements list
   - [ ] Salary information (nếu có)
   - [ ] Application deadline

2. **Interactive Features**
   - [ ] Apply button functionality
   - [ ] Save/bookmark job
   - [ ] Share job (social media)
   - [ ] Similar jobs recommendations

3. **Error Handling**
   - [ ] 404 for non-existent job
   - [ ] Loading state while fetching
   - [ ] Error message for API failures

---

## 🏢 CompanyView Test Guide

### Quick Access Test:
```bash
# Test company pages:
http://localhost:5173/company/1
```

### Test Cases:
1. **Company Profile**
   - [ ] Company logo, name, tagline
   - [ ] About us section
   - [ ] Company size, industry
   - [ ] Location information
   - [ ] Website link

2. **Job Listings**
   - [ ] Current openings list
   - [ ] Job filtering by department
   - [ ] Pagination for many jobs
   - [ ] "No openings" message

---

## 👔 Customer Features Test Guide

### CustomerRegisterView
```bash
# URL: http://localhost:5173/customer
```

**Test Cases:**
1. **Company Registration Form**
   - [ ] Company name, industry, size
   - [ ] Contact information
   - [ ] File uploads (logo, documents)
   - [ ] Terms acceptance checkbox

### SubPackageView  
```bash
# URL: http://localhost:5173/sub-package
```

**Test Cases:**
1. **Package Selection**
   - [ ] Package comparison table
   - [ ] Feature highlights
   - [ ] Pricing display
   - [ ] Select package buttons

2. **Payment Integration**
   - [ ] Redirect to payment gateway
   - [ ] Return URL handling
   - [ ] Success/cancel page routing

---

## 🛠️ Technical Testing

### Performance Testing
```javascript
// Test trong DevTools Console:

// Measure page load time
performance.mark('page-start');
// ... sau khi page load xong
performance.mark('page-end');
performance.measure('page-load', 'page-start', 'page-end');
console.log(performance.getEntriesByType('measure'));
```

### API Integration Testing
```javascript
// Test API calls trong Network tab:
// 1. Mở DevTools → Network tab
// 2. Thực hiện actions trigger API calls
// 3. Kiểm tra:
//    - Request headers (Authorization)
//    - Response status codes
//    - Response data format
//    - Error responses
```

### State Management Testing
```javascript
// Với Vue DevTools:
// 1. Install Vue DevTools extension
// 2. Mở DevTools → Vue tab
// 3. Kiểm tra:
//    - Pinia stores state
//    - State mutations
//    - Action dispatching
//    - Component props/data
```

---

## 🐛 Common Issues to Watch For

### Authentication Issues
- [ ] Token expiration handling
- [ ] Refresh token logic
- [ ] Protected route redirects
- [ ] CORS errors

### UI/UX Issues  
- [ ] Form validation inconsistencies
- [ ] Loading states missing
- [ ] Error messages not user-friendly
- [ ] Mobile tap targets too small

### Performance Issues
- [ ] Large bundle sizes
- [ ] Unnecessary re-renders
- [ ] Memory leaks
- [ ] Slow API responses

### Browser Compatibility
- [ ] ES6+ features support
- [ ] CSS grid/flexbox fallbacks
- [ ] Image format support
- [ ] LocalStorage availability

---

## 📊 Test Result Tracking

### Pass/Fail Tracking Template:
```
DATE: [Test Date]
TESTER: [Your Name]
BROWSER: [Browser + Version]
DEVICE: [Desktop/Mobile/Tablet]

COMPONENT: HomeView
✅ PASSED: Layout renders correctly
✅ PASSED: Navigation works
❌ FAILED: Search form validation
⚠️  BLOCKED: API not responding

NEXT STEPS:
- Fix search validation
- Check API connectivity
- Retest failed cases
```

### Critical Bug Escalation:
- **Critical**: Application crashes, cannot register/login
- **High**: Core features broken, payment fails
- **Medium**: UI inconsistencies, minor functionality issues  
- **Low**: Cosmetic issues, edge case bugs 
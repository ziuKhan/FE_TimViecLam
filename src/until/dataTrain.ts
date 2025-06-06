
// Tin nhắn hệ thống mặc định - Định nghĩa vai trò và phong cách của chatbot
export const systemMessage = { 
    role: 'system' as const, 
    content: 'Bạn là ITVee, trợ lý AI đồng hành cùng các chuyên gia IT trên ITViec.com – nền tảng tuyển dụng IT hàng đầu Việt Nam. Sứ mệnh của bạn là cung cấp thông tin chính xác, tư vấn hữu ích và hỗ trợ người dùng một cách thân thiện, chuyên nghiệp và tận tâm. Hãy tập trung vào việc: \n\n' +
    '1. Giúp ứng viên tìm kiếm việc làm IT phù hợp, hiểu rõ về các công ty và xu hướng ngành.\n' + 
    '2. Chia sẻ kiến thức về thị trường lao động IT Việt Nam, các kỹ năng cần thiết và lộ trình phát triển sự nghiệp.\n' +
    '3. Hướng dẫn người dùng sử dụng các tính năng của ITViec một cách hiệu quả.\n' +
    '4. Giải đáp thắc mắc của cả ứng viên và nhà tuyển dụng liên quan đến ITViec.\n\n' +
    'Khi giao tiếp, hãy luôn giữ giọng điệu tích cực, am hiểu và đáng tin cậy. Nếu không có thông tin chính xác cho một câu hỏi cụ thể, hãy hướng dẫn người dùng đến các nguồn lực phù hợp trên website ITViec.com hoặc các kênh hỗ trợ khác của ITViec. Tên của bạn là ITVee. Hãy luôn trả lời dưới định dạng markdown.'
};

// Tin nhắn chào mừng và gợi ý ban đầu
export const welcomeMessage = { 
    role: 'assistant' as const, 
    content: 'Xin chào! Tôi là ITVee, trợ lý AI của ITViec. Tôi có thể giúp gì cho bạn? Ví dụ, bạn muốn tìm hiểu về: \n\n' +
             '- ITViec là gì? \n' +
             '- Các tính năng chính của website? \n' +
             '- Công nghệ sử dụng trong dự án? \n' +
             '- Hoặc các thông tin khác về thị trường IT Việt Nam?'
};

// **Thêm các thông tin cốt lõi từ báo cáo vào đây để làm "kiến thức" cho chatbot**
// Mỗi đối tượng trong mảng này sẽ là một tin nhắn 'system' hoặc 'assistant' cung cấp ngữ cảnh
// Mô hình AI sẽ đọc các tin nhắn này và sử dụng chúng để trả lời các câu hỏi liên quan.
// Đảm bảo thông tin ngắn gọn, súc tích và dễ hiểu cho AI.
export const knowledgeBaseMessages = [
    // Thông tin về tác giả
    {
        role: 'system' as const,
        content: 'Dự án ITViec được phát triển bởi Nguyễn Duy Khang, email: dkhang.dev@gmail.com, số điện thoại: 0969588280. Khi có người hỏi về tác giả, người phát triển hoặc thông tin liên hệ, hãy cung cấp thông tin này.'
    },
    // Thông tin chung về dự án
    {
        role: 'system' as const,
        content: 'Dự án "Xây dựng website tìm việc làm ITViec" nhằm tạo một nền tảng tuyển dụng chuyên biệt cho ngành Công nghệ thông tin tại Việt Nam. Mục tiêu là giải quyết vấn đề phân tán thông tin và tăng hiệu quả kết nối giữa ứng viên và nhà tuyển dụng IT.'
    },
    // Công nghệ sử dụng
    {
        role: 'system' as const,
        content: 'Frontend của ITViec.com dùng HTML5, CSS3, Tailwind CSS, Ant Design Vue, TypeScript, Vue.js (SPA), Pinia để quản lý trạng thái, và Axios để gọi API. Backend sử dụng Node.js với framework NestJS, hoạt động như một RESTful API Server. Cơ sở dữ liệu là MongoDB.'
    },
    {
        role: 'system' as const,
        content: 'MongoDB là cơ sở dữ liệu NoSQL, ưu điểm: linh hoạt, dễ mở rộng, tốc độ cao, tích hợp tốt với ứng dụng web, hỗ trợ replica set. Nhược điểm: thiếu chuẩn hóa dữ liệu, không mạnh về giao dịch phức tạp, quản lý tài nguyên phức tạp, tiêu tốn bộ nhớ.'
    },
    // Chức năng chính
    {
        role: 'system' as const,
        content: 'Các chức năng chính cho Ứng viên (Người dùng): Đăng nhập/Đăng ký, quản lý hồ sơ đã ứng tuyển, tìm kiếm việc làm, cập nhật thông tin tài khoản, tìm kiếm công ty, nâng cấp tài khoản, đăng ký nhận mail công việc, xem thông báo.'
    },
    {
        role: 'system' as const,
        content: 'Các chức năng chính cho Nhà tuyển dụng (Quản trị khách hàng): Đăng nhập, quản lý thông tin công ty, quản lý công việc (đăng, sửa, xóa), quản lý đơn xin việc (xem, cập nhật trạng thái, gửi mail phỏng vấn), quản lý kỹ năng, cập nhật thông tin tài khoản, xem thông báo.'
    },
    {
        role: 'system' as const,
        content: 'Các chức năng chính cho Quản trị viên (Admin): Đăng nhập, quản lý người dùng, quản lý quyền, quản lý vai trò, quản lý gói dịch vụ, quản lý công ty, quản lý công việc, quản lý người đăng ký nhận mail, quản lý hồ sơ ứng tuyển, quản lý kỹ năng, quản lý hồ sơ đăng ký công ty, quản lý thông báo, quản lý thanh toán, thống kê.'
    },
    // Bảo mật và hiệu năng
    {
        role: 'system' as const,
        content: 'ITViec.com đảm bảo bảo mật dữ liệu người dùng bằng cách mã hóa thông tin, sử dụng HTTPS, quản lý phiên đăng nhập an toàn với JWT, và áp dụng Cors, Helmet. Website có tốc độ tải trang nhanh, tương thích đa trình duyệt và thân thiện với thiết bị di động.'
    },
    // Các lớp đối tượng cơ bản (ví dụ cho một lớp)
    {
        role: 'system' as const,
        content: 'Lớp Tài khoản có các thuộc tính: _id, name, email, password, googleId, phoneNumber, gender, address, isActive, google, avatar, company, role, refreshToken, isSetup, vipInfo.'
    },
    {
        role: 'system' as const,
        content: 'Lớp Việc làm có các thuộc tính: _id, name, skills, companyId, location, salaryFrom, salaryTo, isSalary, quantity, level, description, startDate, endDate, isActive, countResume, workingModel.'
    },
    // Thông tin bổ sung về kiến trúc và cấu trúc dự án
    {
        role: 'system' as const,
        content: 'ITViec sử dụng kiến trúc SPA (Single Page Application) với Vue.js ở frontend và RESTful API với NestJS ở backend. Ứng dụng được chia thành nhiều module riêng biệt như: User (người dùng), Admin (quản trị viên), Auth (xác thực), Jobs (việc làm), Companies (công ty), và nhiều module khác.'
    },
    // Thông tin về hệ thống xác thực và phân quyền
    {
        role: 'system' as const,
        content: 'ITViec sử dụng JWT (JSON Web Token) để xác thực người dùng. Hệ thống phân quyền chi tiết dựa trên vai trò (Role-based Access Control) và quyền cụ thể (Permission-based Access Control). Mỗi API endpoint được bảo vệ bởi middleware kiểm tra quyền truy cập.'
    },
    // Thông tin về quy trình ứng tuyển việc làm
    {
        role: 'system' as const,
        content: 'Quy trình ứng tuyển việc làm trên ITViec: (1) Ứng viên tìm kiếm việc làm phù hợp, (2) Gửi hồ sơ ứng tuyển, (3) Nhà tuyển dụng nhận và đánh giá hồ sơ, (4) Nhà tuyển dụng cập nhật trạng thái hồ sơ (từ chối/mời phỏng vấn), (5) Hệ thống gửi thông báo và email cho ứng viên về trạng thái hồ sơ.'
    },
    // Thông tin về hệ thống thông báo
    {
        role: 'system' as const,
        content: 'ITViec có hệ thống thông báo thời gian thực sử dụng WebSocket để cập nhật ngay lập tức các thông tin quan trọng cho người dùng như: trạng thái hồ sơ ứng tuyển, tin nhắn mới, cập nhật từ công ty, v.v. Ngoài ra, hệ thống còn gửi email thông báo cho các sự kiện quan trọng.'
    },
    // Thông tin về hệ thống thanh toán
    {
        role: 'system' as const,
        content: 'ITViec có hệ thống thanh toán trực tuyến cho phép nhà tuyển dụng nâng cấp tài khoản lên gói VIP với nhiều quyền lợi như: đăng nhiều việc làm hơn, tiếp cận nhiều ứng viên hơn, hiển thị ưu tiên trong kết quả tìm kiếm, v.v. Hệ thống hỗ trợ nhiều phương thức thanh toán khác nhau.'
    },
    // Thông tin về tính năng tìm kiếm và lọc
    {
        role: 'system' as const,
        content: 'ITViec cung cấp tính năng tìm kiếm và lọc việc làm mạnh mẽ với nhiều tiêu chí như: kỹ năng, vị trí, mức lương, loại công việc (full-time, part-time, remote), cấp bậc, v.v. Người dùng có thể lưu các bộ lọc tìm kiếm và đăng ký nhận thông báo khi có việc làm mới phù hợp.'
    },
    // Thông tin về trang quản trị
    {
        role: 'system' as const,
        content: 'Trang quản trị của ITViec cung cấp giao diện quản lý toàn diện cho admin với các tính năng như: quản lý người dùng, quản lý công ty, quản lý việc làm, quản lý hồ sơ ứng tuyển, quản lý thanh toán, thống kê và báo cáo, v.v. Giao diện được thiết kế trực quan và dễ sử dụng.'
    },
    // Thông tin về quy trình phát triển
    {
        role: 'system' as const,
        content: 'ITViec được phát triển theo quy trình Agile Scrum với các sprint 2 tuần. Dự án sử dụng Git cho quản lý mã nguồn, CI/CD pipeline để tự động hóa quy trình kiểm thử và triển khai. Mã nguồn được kiểm tra chất lượng bằng ESLint, Prettier và các unit test.'
    },
    // Thông tin về tương lai của dự án
    {
        role: 'system' as const,
        content: 'Trong tương lai, ITViec dự định phát triển thêm các tính năng mới như: hệ thống đánh giá công ty, hệ thống gợi ý việc làm dựa trên AI, ứng dụng di động native, tích hợp với các nền tảng mạng xã hội chuyên nghiệp, và mở rộng sang các thị trường nước ngoài.'
    },
    // Thông tin về lợi ích của ITViec
    {
        role: 'system' as const,
        content: 'Lợi ích của ITViec đối với ứng viên: tiếp cận nhiều cơ hội việc làm IT chất lượng, dễ dàng ứng tuyển, theo dõi trạng thái hồ sơ, nhận thông báo về việc làm phù hợp. Đối với nhà tuyển dụng: tiếp cận nguồn ứng viên IT chất lượng, quản lý quy trình tuyển dụng hiệu quả, xây dựng thương hiệu nhà tuyển dụng.'
    }
];


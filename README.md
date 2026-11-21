# 🍜 Food Finder - Ứng dụng Tra cứu Quán & Món Ăn

Ứng dụng web tiện lợi (PWA) hỗ trợ cài đặt trên cả **Máy tính (Windows/Mac)** và **Điện thoại Android**, giúp bạn và nhóm bạn bè dễ dàng quản lý danh sách quán ăn, thực đơn, giá tiền và tra cứu quán theo món yêu thích.

---

## 🌟 Các tính năng chính

### 1. Giao diện chính & Tra cứu quán
* **Chế độ mặc định**: Khi mới mở app, danh sách quán hiển thị gọn gàng gồm **Tên quán** và **Địa chỉ**.
* **Tra cứu theo món ăn**:
  * Liệt kê danh sách các món ăn đã được thêm vào app.
  * Hỗ trợ chọn **1 hoặc nhiều món** cùng lúc.
  * Nút chuyển đổi 2 chế độ lọc:
    * **Có đủ tất cả món (AND)**: Lọc quán nào có bán đầy đủ toàn bộ các món bạn chọn.
    * **Có ít nhất 1 món (OR)**: Lọc quán nào có bán ít nhất một trong các món bạn chọn.
  * Khi bấm **Tra cứu**: Danh sách kết quả sẽ hiển thị **Tên quán, Địa chỉ** và **Giá cụ thể của các món bạn vừa tra cứu**.

### 2. Xem chi tiết quán ăn
* Khi bấm vào một quán trong danh sách, màn hình chi tiết sẽ hiển thị:
  * **Tên quán** & **Địa chỉ**.
  * **Khoảng giá tự động**: Tính toán mức giá thấp nhất đến cao nhất của quán (VD: `25.000 đ - 65.000 đ`).
  * **Thực đơn & Giá**: Bảng danh sách tất cả các món của quán cùng giá tiền rõ ràng.
  * **Xem ảnh Menu**: Nút xem ảnh menu (hỗ trợ phóng to, thu nhỏ, chuyển qua lại giữa các trang menu).
  * **Nút mở Google Maps**:
    * Quán có định vị: Nút màu xanh nổi bật, bấm vào sẽ tự động mở Google Maps để dẫn đường.
    * **Quán chưa có định vị**: Nút sẽ **tự động bị làm mờ (xám), vô hiệu hóa và không nhấn vào được** (đúng theo yêu cầu của bạn).
  * **Nút Sửa & Xóa quán**.

### 3. Thêm & Sửa quán ăn
* Điền thông tin:
  * **Tên quán** (bắt buộc).
  * **Địa chỉ** (bắt buộc).
  * **Định vị Google Maps** (không bắt buộc - có thể dán link Google Maps hoặc tọa độ).
  * **Chọn món**: Tick chọn các món trong danh mục. **Ngay khi tick chọn món nào, một ô nhập giá (VNĐ) sẽ hiện ra bên cạnh để bạn nhập giá món đó tại quán này**. Có sẵn nút thêm món mới nhanh nếu món chưa có trong danh mục.
  * **Ảnh Menu**: Cho phép chọn nhiều ảnh từ máy tính hoặc chụp từ camera điện thoại.

### 4. Danh mục & Thêm món
* Danh sách hiển thị toàn bộ món ăn trong hệ thống và số lượng quán đang phục vụ món đó.
* Form thêm món siêu nhanh: chỉ cần nhập tên món và nhấn **"Thêm món"**.

### 5. Chia sẻ dữ liệu giữa các thiết bị (0 VNĐ)
* **Cách 1 - Tự động realtime qua Supabase**: Nhấn vào nút **"Cloud / Local"** ở góc trên màn hình, nhập URL và Anon Key của dự án Supabase (có sẵn mã SQL chỉ cần copy-paste chạy 1 lần). Mọi thiết bị mở link app đều sẽ đồng bộ chung dữ liệu tức thì.
* **Cách 2 - Chia sẻ qua file JSON**: Xuất dữ liệu ra file backup `.json` và gửi cho bạn bè qua Zalo/Telegram để họ nhập vào máy của họ.

---

## 🚀 Hướng dẫn chạy thử trên máy tính

1. Mở cửa sổ dòng lệnh (Terminal / PowerShell) tại thư mục dự án:
   ```bash
   npm run dev
   ```
2. Mở trình duyệt web và truy cập địa chỉ hiển thị trên màn hình (thường là `http://localhost:5173`).

---

## 📱 Cách cài đặt thành App trên Điện thoại Android & Máy tính (PWA)

* **Trên Điện thoại Android (Chrome / Brave / Edge)**:
  1. Mở link trang web trên trình duyệt điện thoại.
  2. Bấm vào dấu **3 chấm (Menu)** ở góc trên bên phải trình duyệt.
  3. Chọn **"Thêm vào màn hình chính"** (Add to Home screen) hoặc **"Cài đặt ứng dụng"** (Install app).
  4. App sẽ xuất hiện với icon riêng trên màn hình điện thoại, mở lên toàn màn hình, mượt mà như app tải từ CH Play!
* **Trên Máy tính (Windows / Mac)**:
  1. Mở trang web bằng trình duyệt Chrome hoặc Edge.
  2. Nhìn vào góc phải thanh địa chỉ URL sẽ thấy biểu tượng **"Cài đặt Food Finder"**.
  3. Bấm cài đặt -> App sẽ chạy thành một cửa sổ riêng độc lập.

---

## 🌐 Cách đưa lên mạng để bạn bè cùng truy cập miễn phí

Bạn có thể đưa dự án lên mạng trong 2 phút bằng **Vercel** (miễn phí):
1. Đăng ký tài khoản miễn phí tại [vercel.com](https://vercel.com).
2. Tải mã nguồn lên GitHub của bạn, sau đó trên Vercel chọn **Add New Project** -> Chọn repository này.
3. Nhấn **Deploy**. Bạn sẽ nhận được ngay một đường link (ví dụ: `https://food-finder-xyz.vercel.app`) để gửi cho nhóm bạn bè cùng dùng!

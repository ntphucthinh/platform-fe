# Platform FE

## Tech Stack

- React
- TypeScript
- Vite
- Refine
- MUI
- React Router
- React Hook Form
- Yup
- Day.js

## Requirements

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build & Validation

```bash
# Type check and build
npm run build

# Code linting
npm run lint

# UI & design anti-pattern detection (Impeccable)
npm run impeccable:detect
```

## Impeccable Design System

Dự án tích hợp [Impeccable](https://github.com/pbakaus/impeccable) để duy trì chất lượng giao diện và loại bỏ các lỗi thiết kế phổ biến ("AI slop"):

- **Ngữ cảnh thiết kế**:
  - [`PRODUCT.md`](PRODUCT.md): Định nghĩa mục tiêu sản phẩm, đối tượng người dùng và các ràng buộc kiến trúc.
  - [`DESIGN.md`](DESIGN.md): Hệ thống hóa Design System, màu sắc, typography, kích thước chuẩn và quy chuẩn UI.

- **Lệnh kiểm tra mã nguồn (CLI)**:
  ```bash
  # Quét anti-patterns trong thư mục UI (src/components và src/pages)
  npm run impeccable:detect

  # Quét một file hoặc component cụ thể
  npx impeccable detect src/components/pages/travel-memories/travelMemoryForm.tsx

  # Quét trực tiếp trên dev server đang chạy
  npx impeccable detect http://localhost:1301
  ```

- **Lệnh điều khiển trong Chat AI (Impeccable Commands)**:
  - `/impeccable audit [target]`: Kiểm tra kỹ thuật chất lượng (accessibility, responsive, contrast).
  - `/impeccable critique [target]`: Review UX, phân cấp thị giác và tính dễ đọc.
  - `/impeccable polish [target]`: Tinh chỉnh độ hoàn thiện và chi tiết trước khi bàn giao.
  - `/impeccable harden [target]`: Rà soát các trạng thái biên, text tràn dòng, lỗi tải và i18n.
  - `/impeccable bolder [target]` / `/impeccable quieter [target]`: Tăng độ tương phản/nhấn mạnh hoặc làm dịu giao diện.
  - `/impeccable distill [target]`: Đơn giản hóa cấu trúc, lược bỏ chi tiết rườm rà.

## Environment

Create a `.env` file based on `.env.example` and define the required Vite environment variables.

## Project Structure

```text
src/
  assets/
  components/
  config/
  constants/
  hooks/
  providers/
  routes/
  services/
  theme/
  types/
  utils/
  App.tsx
  main.tsx
```

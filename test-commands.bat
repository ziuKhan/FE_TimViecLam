@echo off
echo =================================
echo    USER SYSTEM TEST COMMANDS
echo =================================
echo.

:menu
echo Chọn một tùy chọn:
echo.
echo 1. Start Development Server (npm run dev)
echo 2. Build for Production (npm run build)
echo 3. Preview Production Build (npm run preview)
echo 4. Type Check (npm run type-check)
echo 5. Lint Code (npm run lint)
echo 6. Format Code (npm run format)
echo 7. Open Test Plan (Notepad)
echo 8. Open Quick Checklist (Notepad)
echo 9. Thoát
echo.

set /p choice="Nhập lựa chọn của bạn (1-9): "

if "%choice%"=="1" goto start_dev
if "%choice%"=="2" goto build_prod
if "%choice%"=="3" goto preview_prod
if "%choice%"=="4" goto type_check
if "%choice%"=="5" goto lint_code
if "%choice%"=="6" goto format_code
if "%choice%"=="7" goto open_test_plan
if "%choice%"=="8" goto open_checklist
if "%choice%"=="9" goto exit

echo Lựa chọn không hợp lệ. Vui lòng thử lại.
goto menu

:start_dev
echo.
echo Starting development server...
echo Ứng dụng sẽ chạy tại: http://localhost:5173
echo Nhấn Ctrl+C để dừng server
echo.
npm run dev
goto menu

:build_prod
echo.
echo Building for production...
npm run build
echo.
echo Build completed! Check dist/ folder
pause
goto menu

:preview_prod
echo.
echo Starting production preview...
echo Make sure you ran 'npm run build' first
npm run preview
goto menu

:type_check
echo.
echo Running TypeScript type check...
npm run type-check
echo.
pause
goto menu

:lint_code
echo.
echo Running ESLint...
npm run lint
echo.
pause
goto menu

:format_code
echo.
echo Formatting code with Prettier...
npm run format
echo.
pause
goto menu

:open_test_plan
echo.
echo Opening test plan document...
start notepad test-plan-user-system.md
goto menu

:open_checklist
echo.
echo Opening quick test checklist...
start notepad quick-test-checklist.md
goto menu

:exit
echo.
echo Cảm ơn bạn đã sử dụng!
echo Happy Testing! 🚀
pause
exit

:error
echo.
echo Đã xảy ra lỗi. Vui lòng kiểm tra lại.
pause
goto menu 
# PowerShell script to install shadcn/ui dependencies
cd "$PSScriptRoot"

Write-Host "Installing all shadcn/ui dependencies at once..." -ForegroundColor Green

# Try regular install first
Write-Host "Attempting standard npm install..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "Standard installation successful!" -ForegroundColor Green
} else {
    # Try with --legacy-peer-deps
    Write-Host "Standard install failed. Trying with --legacy-peer-deps..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Installation with --legacy-peer-deps successful!" -ForegroundColor Green
    } else {
        # Try with --force as a last resort
        Write-Host "Installation with --legacy-peer-deps failed. Trying with --force..." -ForegroundColor Yellow
        npm install --force
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Installation with --force successful!" -ForegroundColor Green
        } else {
            Write-Host "All installation attempts failed. Please check the errors above." -ForegroundColor Red
            exit 1
        }
    }
}

Write-Host ""
Write-Host "Dependencies installed successfully!" -ForegroundColor Green
Write-Host "You can now start your application with 'npm run dev'" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Install Radix UI components
$radixComponents = @(
    "dialog",
    "popover",
    "slot",
    "label",
    "select",
    "toast",
    "dropdown-menu",
    "avatar",
    "tooltip"
)

foreach ($component in $radixComponents) {
    $commands += "npm install @radix-ui/react-$component"
}

# Execute all commands
foreach ($command in $commands) {
    Run-NpmCommand -Command $command
}

Write-Host "All dependencies installed! Check for any errors above." -ForegroundColor Green

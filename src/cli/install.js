#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const colors = require('../output/colors');

const HOOK_MARKER_START = "# --- WTFKit Magic Hook Start ---";
const HOOK_MARKER_END = "# --- WTFKit Magic Hook End ---";

const PS_HOOK = `
${HOOK_MARKER_START}
# This hook captures failed commands and saves their state for WTFKit
if (Test-Path Function:\\prompt) {
    Rename-Item -Path Function:\\prompt -NewName WTFKit_OldPrompt -ErrorAction SilentlyContinue
} else {
    function WTFKit_OldPrompt { "PS> " }
}

function prompt {
    $errCode = $LASTEXITCODE
    $cmdStatus = $?
    if ($errCode -ne 0 -or -not $cmdStatus) {
        try {
            $lastCmd = (Get-History -Count 1 | Select-Object -ExpandProperty CommandLine)
            $lastErrorMsg = if ($Error.Count -gt 0) { $Error[0].ToString() } else { "" }
            $state = @{
                command = $lastCmd
                exitCode = $errCode
                stderr = $lastErrorMsg
                cwd = $PWD.Path
                timestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
            }
            $state | ConvertTo-Json -Depth 1 | Out-File "$env:TEMP\\wtfkit_state.json" -Encoding UTF8 -Force
        } catch {}
    }
    WTFKit_OldPrompt
}
${HOOK_MARKER_END}
`;

function main() {
    if (process.argv.includes('-help') || process.argv.includes('--help')) {
        console.log("Usage: wtfkit-install [-help]\n\nInstalls the WTFKit Magic Shell Hook into your PowerShell profile.");
        return;
    }

    console.log("Installing WTFKit Magic Shell Hook...\n");

    try {
        const profilePath = child_process.execSync('powershell -NoProfile -Command "Write-Host $PROFILE"', { encoding: 'utf8' }).trim();
        
        if (!profilePath) {
            console.log(colors.red("❌ Could not determine PowerShell $PROFILE path."));
            return;
        }

        console.log(`Target Profile: ${profilePath}`);

        const profileDir = path.dirname(profilePath);
        if (!fs.existsSync(profileDir)) {
            fs.mkdirSync(profileDir, { recursive: true });
        }

        let profileContent = '';
        if (fs.existsSync(profilePath)) {
            profileContent = fs.readFileSync(profilePath, 'utf8');
        }

        if (profileContent.includes(HOOK_MARKER_START)) {
            console.log(colors.yellow("⚠ WTFKit Magic Hook is already installed in your profile."));
            return;
        }

        fs.appendFileSync(profilePath, '\n' + PS_HOOK + '\n');
        
        console.log(colors.green("✔ Successfully installed!"));
        console.log("\nPlease restart your PowerShell terminal for the changes to take effect.");
        console.log("After restarting, you can simply type `wtf` after any failed command.");

    } catch (e) {
        console.log(colors.red(`❌ Installation failed: ${e.message}`));
    }
}

main();
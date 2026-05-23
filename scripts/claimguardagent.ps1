param(
  [switch] $Help,

  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]] $Task
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$inboxPath = Join-Path $projectRoot "AGENT_INBOX.md"

if (-not (Test-Path -LiteralPath $inboxPath)) {
  throw "AGENT_INBOX.md was not found at $inboxPath"
}

$taskText = ($Task -join " ").Trim()

if ($Help -or [string]::IsNullOrWhiteSpace($taskText)) {
  Write-Output "Usage: .\scripts\claimguardagent.ps1 <task>"
  Write-Output "Example: .\scripts\claimguardagent.ps1 polish the mock receipt analysis report"
  exit 0
}

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
$entry = "- [$timestamp] [priority: medium] $taskText"

Add-Content -LiteralPath $inboxPath -Value ""
Add-Content -LiteralPath $inboxPath -Value $entry

Write-Output "Added ClaimGuard agent task:"
Write-Output $entry

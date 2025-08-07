export const fileContent: Record<string, string> = {
    'bin/exploit.sh': `#!/bin/bash
# Simple network scanner
echo "Enter the IP range to scan (e.g., 192.168.1.0/24):"
read ip_range
echo "Scanning $ip_range..."
nmap -sn $ip_range
`,
    'bin/nmap': '// Binary file: content not displayed',
    'bin/metasploit': '// Binary file: content not displayed',
    'data/passwords.db': '// Encrypted database: cannot display content',
    'data/intel_corp.zip': '// Compressed archive: content not displayed',
    'data/blueprints/ctOS_v3.pdf': '// PDF document: content not displayed',
    'logs/access.log': `[2024-07-29 10:00:01] 192.168.1.1 GET /login
[2024-07-29 10:00:05] 10.0.0.5 POST /api/data
[2024-07-29 10:01:23] 203.0.113.88 GET /
[2024-07-29 10:02:00] ::1 ALERT - Unauthorized access attempt from 127.0.0.1
`,
    'logs/firewall.log': `[DENY] SRC=101.55.3.2 DST=192.168.1.101 PORT=22
[ALLOW] SRC=172.16.31.4 DST=192.168.1.100 PORT=443
[DENY] SRC=198.51.100.12 DST=192.168.1.254 PORT=8080
`,
    'README.md': `# Digital Shadow's Lair

This is my personal workspace. Tread carefully.

## Commands
- \`edit <file>\` - Open a file.
- \`help\` - For all available commands.
`
};

:clipboard: 設定内容

スケジュール:

• :alarm_clock: 毎日 8:00 (JST) に自動実行
• :memo: 実行スクリプト: ~/webhani-automation/daily-blog.sh
• :stopwatch: タイムアウト: 600秒 (10分)

ログファイル:

• stdout: /Users/yongwoon-mac-mini/Projects/openclaw/source/projects/homepage/logs/daily-blog-stdout.log
• stderr: /Users/yongwoon-mac-mini/Projects/openclaw/source/projects/homepage/logs/daily-blog-stderr.log
• Script内部: Projects/openclaw/source/projects/homepage/logs/daily-blog-{YYYY-MM-DD}.log

:hammer_and_wrench: 管理コマンド

状態確認:
launchctl list | grep com.webhani.dailyblog

手動実行:
launchctl start com.webhani.dailyblog

ログ確認:
tail -f ~/Desktop/openclaw/source/homepage/logs/daily-blog-$(date +%Y-%m-%d).log

#!/bin/bash
# Rebase script to update commit dates
export GIT_SEQUENCE_EDITOR=true

# Get the base commit (before our 20 commits)
BASE=$(git rev-parse HEAD~22)

# Create rebase script
cat > /tmp/rebase-script.sh << 'REBASE_SCRIPT'
#!/bin/bash
dates=(
    "2025-12-12T10:15:00+0530"
    "2025-12-12T10:30:00+0530"
    "2025-12-12T10:45:00+0530"
    "2025-12-12T11:00:00+0530"
    "2025-12-12T11:15:00+0530"
    "2025-12-12T11:30:00+0530"
    "2025-12-12T11:45:00+0530"
    "2025-12-12T12:00:00+0530"
    "2025-12-12T12:15:00+0530"
    "2025-12-12T12:30:00+0530"
    "2025-12-12T12:45:00+0530"
    "2025-12-12T13:00:00+0530"
    "2025-12-12T13:15:00+0530"
    "2025-12-12T13:30:00+0530"
    "2025-12-12T13:45:00+0530"
    "2025-12-12T14:00:00+0530"
    "2025-12-12T14:15:00+0530"
    "2025-12-12T14:30:00+0530"
    "2025-12-12T14:45:00+0530"
)

i=0
git rebase -i HEAD~20 << EOF
$(git log --oneline HEAD~20..HEAD | tac | while read line; do
    hash=$(echo $line | cut -d' ' -f1)
    if [ $i -lt ${#dates[@]} ]; then
        echo "exec GIT_AUTHOR_DATE=\"${dates[$i]}\" GIT_COMMITTER_DATE=\"${dates[$i]}\" git commit --amend --no-edit --date=\"${dates[$i]}\""
        i=$((i+1))
    else
        echo "pick $hash"
    fi
done)
EOF
REBASE_SCRIPT

chmod +x /tmp/rebase-script.sh
/tmp/rebase-script.sh

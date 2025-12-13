#!/bin/bash
export FILTER_BRANCH_SQUELCH_WARNING=1

git filter-branch -f --env-filter '
case $GIT_COMMIT in
    f4cf48c)
        export GIT_AUTHOR_DATE="2025-12-12T10:15:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T10:15:00+0530"
        ;;
    0a86a8e)
        export GIT_AUTHOR_DATE="2025-12-12T10:30:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T10:30:00+0530"
        ;;
    250939c)
        export GIT_AUTHOR_DATE="2025-12-12T10:45:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T10:45:00+0530"
        ;;
    44062ac)
        export GIT_AUTHOR_DATE="2025-12-12T11:00:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T11:00:00+0530"
        ;;
    dd3ce58)
        export GIT_AUTHOR_DATE="2025-12-12T11:15:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T11:15:00+0530"
        ;;
    5cee887)
        export GIT_AUTHOR_DATE="2025-12-12T11:30:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T11:30:00+0530"
        ;;
    628d8f2)
        export GIT_AUTHOR_DATE="2025-12-12T11:45:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T11:45:00+0530"
        ;;
    0cbf0e8)
        export GIT_AUTHOR_DATE="2025-12-12T12:00:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T12:00:00+0530"
        ;;
    ad4284b)
        export GIT_AUTHOR_DATE="2025-12-12T12:15:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T12:15:00+0530"
        ;;
    b451628)
        export GIT_AUTHOR_DATE="2025-12-12T12:30:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T12:30:00+0530"
        ;;
    f680d15)
        export GIT_AUTHOR_DATE="2025-12-12T12:45:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T12:45:00+0530"
        ;;
    9aef107)
        export GIT_AUTHOR_DATE="2025-12-12T13:00:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T13:00:00+0530"
        ;;
    785a087)
        export GIT_AUTHOR_DATE="2025-12-12T13:15:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T13:15:00+0530"
        ;;
    1a78a17)
        export GIT_AUTHOR_DATE="2025-12-12T13:30:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T13:30:00+0530"
        ;;
    7de261b)
        export GIT_AUTHOR_DATE="2025-12-12T13:45:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T13:45:00+0530"
        ;;
    9cbdcd9)
        export GIT_AUTHOR_DATE="2025-12-12T14:00:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T14:00:00+0530"
        ;;
    e3f99e3)
        export GIT_AUTHOR_DATE="2025-12-12T14:15:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T14:15:00+0530"
        ;;
    766148f)
        export GIT_AUTHOR_DATE="2025-12-12T14:30:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T14:30:00+0530"
        ;;
    ea1a253)
        export GIT_AUTHOR_DATE="2025-12-12T14:45:00+0530"
        export GIT_COMMITTER_DATE="2025-12-12T14:45:00+0530"
        ;;
esac
' HEAD~19..HEAD

@echo off
echo Creating PostgreSQL database...

REM Set PostgreSQL bin directory (adjust this path if your installation is different)
set PGBIN="C:\Program Files\PostgreSQL\17\bin"

REM Create database
%PGBIN%\psql -U postgres -c "CREATE DATABASE pig_db;"

echo Database created successfully!
pause 
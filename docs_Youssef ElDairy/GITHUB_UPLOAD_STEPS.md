# GitHub Upload Steps

Run these commands from the project root after extracting the ZIP.

```cmd
git init
git add .
git commit -m "Implement PopEyez user journeys 6 to 11"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Team contribution rule

Each team member must make at least one meaningful commit. Example:

```cmd
git checkout -b staff-task-polish
# edit a file, test, then:
git add .
git commit -m "Improve staff task filtering"
git push origin staff-task-polish
```

Then create a pull request or merge the branch.

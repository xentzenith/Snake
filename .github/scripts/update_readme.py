import requests
import json
import os

# Fetch commit data from the GitHub API
def fetch_commits(repo, token):
    headers = {'Authorization': f'token {token}'}
    commits_url = f'https://api.github.com/repos/{repo}/commits'
    commits = []

    while commits_url:
        response = requests.get(commits_url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch commits: {response.status_code}")
            break
        response_data = response.json()
        commits.extend(response_data)
        if 'next' in response.links:
            commits_url = response.links['next']['url']
        else:
            commits_url = None

    return commits

# Fetch stats for each commit
def fetch_commit_stats(commit_url, token):
    headers = {'Authorization': f'token {token}'}
    response = requests.get(commit_url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch commit stats: {response.status_code} for {commit_url}")
        return 0
    return response.json().get('stats', {'total': 0})['total']

# Calculate contributions
def calculate_contributions(commits, token):
    contributors = {}

    for commit in commits:
        try:
            author = commit['commit']['author']['name']
            if commit['author']:
                avatar_url = commit['author']['avatar_url']
            else:
                avatar_url = "https://github.com/identicons/jasonlong.png"

            commit_url = commit['url']
            lines_changed = fetch_commit_stats(commit_url, token)

            if author not in contributors:
                contributors[author] = {'lines': 0, 'avatar_url': avatar_url}

            contributors[author]['lines'] += lines_changed
        except KeyError as e:
            print(f"KeyError: {e} in commit {commit}")
        except TypeError as e:
            print(f"TypeError: {e} in commit {commit}")

    return contributors

# Update README file
def update_readme(contributors):
    readme_path = 'README.md'
    with open(readme_path, 'r') as file:
        readme_content = file.readlines()

    start_marker = '<!-- CONTRIBUTORS:START -->\n'
    end_marker = '<!-- CONTRIBUTORS:END -->\n'

    start_index = readme_content.index(start_marker) + 1
    end_index = readme_content.index(end_marker)

    new_content = readme_content[:start_index]
    new_content.append('<table>\n')
    new_content.append('  <tr>\n')

    count = 0
    for author, data in contributors.items():
        new_content.append(f'    <td align="center"><img src="{data["avatar_url"]}" width="50" height="50" /><br />**{author}**<br />{data["lines"]} lines</td>\n')
        count += 1
        if count % 4 == 0:
            new_content.append('  </tr>\n  <tr>\n')

    new_content.append('  </tr>\n</table>\n')
    new_content.extend(readme_content[end_index:])
    with open(readme_path, 'w') as file:
        file.writelines(new_content)

def main():
    repo = os.getenv('GITHUB_REPOSITORY')
    token = os.getenv('PERSONAL_ACCESS_TOKEN')

    commits = fetch_commits(repo, token)
    contributors = calculate_contributions(commits, token)
    update_readme(contributors)

if __name__ == "__main__":
    main()

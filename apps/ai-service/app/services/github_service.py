from typing import Dict, List, Tuple
import httpx


class GitHubService:
    """Service to fetch repository architecture metadata using GitHub API."""

    def __init__(self, token: str = ""):
        self.token = token
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "DRARA-AI-Scanner",
        }
        if token:
            self.headers["Authorization"] = f"Bearer {token}"

    async def fetch_repo_architecture(
        self, repo_full_name: str
    ) -> Tuple[str, List[str], Dict[str, str]]:
        """
        Fetches README content, file tree list, and manifest file contents.
        Returns (readme_text, file_tree, manifest_contents).
        """
        readme_text = ""
        file_tree: List[str] = []
        manifest_contents: Dict[str, str] = {}

        async with httpx.AsyncClient(timeout=10.0) as client:
            # 1. Fetch README
            try:
                r_res = await client.get(
                    f"https://api.github.com/repos/{repo_full_name}/readme",
                    headers=self.headers,
                )
                if r_res.status_code == 200:
                    download_url = r_res.json().get("download_url")
                    if download_url:
                        raw_res = await client.get(download_url)
                        if raw_res.status_code == 200:
                            readme_text = raw_res.text[:4000]  # Cap at 4k chars for prompt efficiency
            except Exception:
                readme_text = "README unavailable"

            # 2. Fetch File Tree (metadata only)
            try:
                t_res = await client.get(
                    f"https://api.github.com/repos/{repo_full_name}/git/trees/main?recursive=1",
                    headers=self.headers,
                )
                if t_res.status_code != 200:
                    # Fallback to master
                    t_res = await client.get(
                        f"https://api.github.com/repos/{repo_full_name}/git/trees/master?recursive=1",
                        headers=self.headers,
                    )

                if t_res.status_code == 200:
                    tree_data = t_res.json().get("tree", [])
                    file_tree = [item.get("path", "") for item in tree_data[:150]]  # Cap at 150 entries
            except Exception:
                file_tree = []

            # 3. Fetch Key Manifests
            manifest_files = [
                "package.json",
                "requirements.txt",
                "pyproject.toml",
                "docker-compose.yml",
            ]
            for mfile in manifest_files:
                if mfile in file_tree:
                    try:
                        f_res = await client.get(
                            f"https://raw.githubusercontent.com/{repo_full_name}/main/{mfile}",
                            headers=self.headers,
                        )
                        if f_res.status_code == 200:
                            manifest_contents[mfile] = f_res.text[:2000]
                    except Exception:
                        pass

        return readme_text, file_tree, manifest_contents


class FakeGitHubService:
    """In-memory fake for testing without hitting live GitHub API."""

    def __init__(self, sample_readme: str = "", sample_tree: List[str] = None, sample_manifests: Dict[str, str] = None):
        self.sample_readme = sample_readme or "# DRARA\nAI Co-Founder Platform built with TypeScript, Node.js, and FastAPI."
        self.sample_tree = sample_tree or ["package.json", "docker-compose.yml", "apps/api/src/index.ts", "apps/web/app/page.tsx"]
        self.sample_manifests = sample_manifests or {
            "package.json": '{"dependencies": {"express": "^4.19.2", "next": "14.2.0", "knex": "^3.1.0"}}',
            "docker-compose.yml": "services:\n  postgres:\n    image: postgres:16-alpine",
        }

    async def fetch_repo_architecture(
        self, repo_full_name: str
    ) -> Tuple[str, List[str], Dict[str, str]]:
        return self.sample_readme, self.sample_tree, self.sample_manifests

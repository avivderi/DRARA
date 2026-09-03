import json
from typing import Dict, List, Set


class HeuristicStackDetector:
    """Fast, zero-cost stack detector inspecting file names and manifest contents."""

    @staticmethod
    def detect_from_tree_and_files(file_tree: List[str], file_contents: Dict[str, str]) -> List[str]:
        stack: Set[str] = set()

        tree_str = " ".join(file_tree).lower()

        # Language / Framework detection from tree
        if any(f.endswith(".ts") or f.endswith(".tsx") for f in file_tree):
            stack.add("TypeScript")
        if any(f.endswith(".js") or f.endswith(".jsx") for f in file_tree):
            stack.add("JavaScript")
        if any(f.endswith(".py") for f in file_tree):
            stack.add("Python")
        if any(f.endswith(".go") for f in file_tree):
            stack.add("Go")
        if any(f.endswith(".rs") for f in file_tree):
            stack.add("Rust")
        if any(f.endswith(".dart") for f in file_tree):
            stack.add("Flutter/Dart")

        # Dependency file inspection
        for filename, content in file_contents.items():
            fn_lower = filename.lower()

            if "package.json" in fn_lower:
                stack.add("Node.js")
                try:
                    pkg = json.loads(content)
                    all_deps = {
                        **pkg.get("dependencies", {}),
                        **pkg.get("devDependencies", {}),
                    }
                    if "next" in all_deps:
                        stack.add("Next.js")
                    if "react" in all_deps:
                        stack.add("React")
                    if "react-native" in all_deps or "expo" in all_deps:
                        stack.add("React Native")
                        stack.add("Expo")
                    if "express" in all_deps:
                        stack.add("Express")
                    if "knex" in all_deps or "pg" in all_deps:
                        stack.add("PostgreSQL")
                    if "redis" in all_deps:
                        stack.add("Redis")
                except Exception:
                    pass

            if "requirements.txt" in fn_lower or "pyproject.toml" in fn_lower:
                stack.add("Python")
                content_lower = content.lower()
                if "fastapi" in content_lower:
                    stack.add("FastAPI")
                if "django" in content_lower:
                    stack.add("Django")
                if "flask" in content_lower:
                    stack.add("Flask")

            if "docker-compose" in fn_lower or "dockerfile" in fn_lower:
                stack.add("Docker")
                content_lower = content.lower()
                if "postgres" in content_lower:
                    stack.add("PostgreSQL")
                if "redis" in content_lower:
                    stack.add("Redis")

        return sorted(list(stack))

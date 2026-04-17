#!/usr/bin/env python3
"""
Create a Jira epic and one child issue per learning topic.

Usage:
  export JIRA_BASE_URL="https://your-domain.atlassian.net"
  export JIRA_EMAIL="you@example.com"
  export JIRA_API_TOKEN="your_api_token"
  export JIRA_PROJECT_KEY="ENG"

  python create_learning_epic.py

Optional env vars:
  export JIRA_EPIC_ISSUE_TYPE="Epic"
  export JIRA_CHILD_ISSUE_TYPE="Task"   # change to Story if Task cannot sit under Epic in your project
"""

from __future__ import annotations

import os
import sys
import json
from typing import Any, Dict, List, Optional

import requests
from requests.auth import HTTPBasicAuth


JIRA_BASE_URL = os.environ.get("JIRA_BASE_URL", "").rstrip("/")
JIRA_EMAIL = os.environ.get("JIRA_EMAIL", "")
JIRA_API_TOKEN = os.environ.get("JIRA_API_TOKEN", "")
JIRA_PROJECT_KEY = os.environ.get("JIRA_PROJECT_KEY", "")

EPIC_ISSUE_TYPE = os.environ.get("JIRA_EPIC_ISSUE_TYPE", "Epic")
CHILD_ISSUE_TYPE = os.environ.get("JIRA_CHILD_ISSUE_TYPE", "Task")

# Some Jira setups require the "Epic Name" custom field when creating an Epic.
# If yours does, set this to something like "customfield_10011".
# Leave blank if not needed.
EPIC_NAME_FIELD_ID = os.environ.get("JIRA_EPIC_NAME_FIELD_ID", "")

# Optional label to help organize the created issues.
DEFAULT_LABELS = ["learning", "engineering-fundamentals"]


TOPICS: List[Dict[str, Any]] = [
    {
        "title": "Scalars, vectors, and matrices",
        "area": "Linear Algebra",
        "practical_usage": [
            "Understand coordinates, sensor data, embeddings, image data",
            "Read ML and graphics material without getting lost",
        ],
        "subtopics": [
            "scalar vs vector vs matrix",
            "shape/dimensions",
            "row vector vs column vector",
            "matrix notation",
        ],
        "goal_criteria": [
            "Can explain scalar, vector, and matrix in plain language",
            "Can interpret a shape like (100, 64)",
            "Can model a real dataset as vectors/matrices",
        ],
    },
    {
        "title": "Vector arithmetic",
        "area": "Linear Algebra",
        "practical_usage": [
            "Combine measurements",
            "Represent movement, direction, and feature vectors",
        ],
        "subtopics": [
            "vector addition/subtraction",
            "scalar multiplication",
            "magnitude",
            "normalization",
            "distance intuition",
        ],
        "goal_criteria": [
            "Can compute vector length and normalization",
            "Can explain why normalized vectors are useful",
            "Can implement vector distance in code",
        ],
    },
    {
        "title": "Dot product",
        "area": "Linear Algebra",
        "practical_usage": [
            "Similarity search",
            "Embeddings comparison",
            "Projection intuition",
            "Graphics lighting intuition",
        ],
        "subtopics": [
            "dot product definition",
            "angle intuition",
            "cosine similarity",
            "projection intuition",
        ],
        "goal_criteria": [
            "Can explain why dot product measures alignment",
            "Can compute cosine similarity for small vectors",
            "Can use it in code to rank similar items",
        ],
    },
    {
        "title": "Matrix multiplication",
        "area": "Linear Algebra",
        "practical_usage": [
            "ML basics",
            "Coordinate transforms",
            "Composing transformations",
        ],
        "subtopics": [
            "shape compatibility",
            "matrix x vector",
            "matrix x matrix",
            "composition intuition",
        ],
        "goal_criteria": [
            "Can determine if two matrices can be multiplied",
            "Can manually multiply a small example",
            "Can explain why multiplication order matters",
        ],
    },
    {
        "title": "Linear transformations",
        "area": "Linear Algebra",
        "practical_usage": [
            "2D/3D graphics",
            "Rotation, scaling, reflection",
            "Understanding what matrices do",
        ],
        "subtopics": [
            "transformation as function on vectors",
            "scaling",
            "rotation",
            "reflection",
            "composition of transforms",
        ],
        "goal_criteria": [
            "Can explain a matrix as a vector transformation",
            "Can apply a simple 2D transform to points",
            "Can explain why transform order matters",
        ],
    },
    {
        "title": "Systems of linear equations",
        "area": "Linear Algebra",
        "practical_usage": [
            "Constraint solving",
            "Calibration",
            "Regression intuition",
        ],
        "subtopics": [
            "linear equations",
            "unknowns",
            "Gaussian elimination intuition",
            "unique/no/infinite solutions",
        ],
        "goal_criteria": [
            "Can solve a small 2x2 or 3x3 system",
            "Can explain no solution vs infinite solutions",
            "Can connect systems of equations to matrices",
        ],
    },
    {
        "title": "Transpose, inverse, and identity matrix",
        "area": "Linear Algebra",
        "practical_usage": [
            "Reading ML/stats formulas",
            "Solving matrix equations",
            "Understanding transformations",
        ],
        "subtopics": [
            "transpose",
            "identity matrix",
            "inverse intuition",
            "when inverse exists",
        ],
        "goal_criteria": [
            "Knows what A^T, I, and A^-1 mean",
            "Can verify inverse for a small matrix",
            "Can explain why explicit inverse is often avoided numerically",
        ],
    },
    {
        "title": "Eigenvalues and eigenvectors",
        "area": "Linear Algebra",
        "practical_usage": [
            "PCA intuition",
            "Stability intuition",
            "Reading advanced ML material",
        ],
        "subtopics": [
            "eigenvector meaning",
            "eigenvalue meaning",
            "dominant direction intuition",
        ],
        "goal_criteria": [
            "Can explain eigenvectors in plain language",
            "Can interpret a simple geometric example",
            "Can understand the intuition behind PCA",
        ],
    },
    {
        "title": "Time and space complexity",
        "area": "Algorithms",
        "practical_usage": [
            "Avoid slow code",
            "Compare solutions",
            "Predict scaling issues",
        ],
        "subtopics": [
            "Big-O notation",
            "common growth rates",
            "best/average/worst case",
            "space complexity",
        ],
        "goal_criteria": [
            "Can estimate complexity of common loops",
            "Can explain why O(n^2) becomes dangerous",
            "Can compare two solutions by scaling behavior",
        ],
    },
    {
        "title": "Arrays / dynamic arrays / strings",
        "area": "Algorithms",
        "practical_usage": [
            "Core data representation",
            "Parsing, iteration, buffering, text handling",
        ],
        "subtopics": [
            "indexing",
            "append/access costs",
            "slicing",
            "insertion costs",
            "string scanning basics",
        ],
        "goal_criteria": [
            "Knows when array access is cheap",
            "Knows when insertion is expensive",
            "Can reason about string concatenation costs",
        ],
    },
    {
        "title": "Hash maps and sets",
        "area": "Algorithms",
        "practical_usage": [
            "Fast lookup",
            "Deduplication",
            "Caching",
            "Counting and grouping",
        ],
        "subtopics": [
            "hash table intuition",
            "key lookup",
            "collisions at a high level",
            "frequency counting",
            "set operations",
        ],
        "goal_criteria": [
            "Naturally reaches for map/set when lookup matters",
            "Can solve counting and dedup problems quickly",
            "Can explain why maps beat repeated list scans",
        ],
    },
    {
        "title": "Stacks and queues",
        "area": "Algorithms",
        "practical_usage": [
            "Parsing",
            "Undo/redo",
            "Traversal",
            "Job processing",
        ],
        "subtopics": [
            "LIFO vs FIFO",
            "push/pop",
            "enqueue/dequeue",
            "queue for BFS",
        ],
        "goal_criteria": [
            "Can identify LIFO vs FIFO use cases",
            "Can implement both",
            "Can use them in traversal problems",
        ],
    },
    {
        "title": "Recursion",
        "area": "Algorithms",
        "practical_usage": [
            "Tree traversal",
            "Nested structures",
            "Backtracking",
        ],
        "subtopics": [
            "base case",
            "recursive step",
            "call stack",
            "common mistakes",
        ],
        "goal_criteria": [
            "Can write a correct recursive function",
            "Can trace recursive execution",
            "Can explain stack overflow or repeated work",
        ],
    },
    {
        "title": "Trees",
        "area": "Algorithms",
        "practical_usage": [
            "Hierarchical data",
            "File systems",
            "ASTs",
            "Indexes",
        ],
        "subtopics": [
            "parent/child/leaf",
            "binary tree basics",
            "tree traversal",
            "balanced vs unbalanced intuition",
        ],
        "goal_criteria": [
            "Can traverse a tree in multiple orders",
            "Can explain general tree vs binary tree",
            "Can model hierarchical data as a tree",
        ],
    },
    {
        "title": "Graphs",
        "area": "Algorithms",
        "practical_usage": [
            "Dependencies",
            "Routing",
            "Workflows",
            "Networks",
        ],
        "subtopics": [
            "nodes and edges",
            "directed vs undirected",
            "weighted graphs",
            "adjacency list",
            "DFS",
            "BFS",
        ],
        "goal_criteria": [
            "Can model dependencies as a graph",
            "Can implement DFS and BFS",
            "Can explain when BFS is better than DFS",
        ],
    },
    {
        "title": "Sorting and binary search",
        "area": "Algorithms",
        "practical_usage": [
            "Faster lookups",
            "Ranking",
            "Efficient filtering",
            "Interval problems",
        ],
        "subtopics": [
            "why sorting helps",
            "binary search on sorted data",
            "stable vs unstable sort",
            "custom sort keys",
        ],
        "goal_criteria": [
            "Can use sorting to simplify a problem",
            "Can implement or clearly explain binary search",
            "Can avoid common off-by-one mistakes",
        ],
    },
    {
        "title": "Heaps / priority queues",
        "area": "Algorithms",
        "practical_usage": [
            "Scheduling",
            "Top-k queries",
            "Streaming highest/lowest values",
        ],
        "subtopics": [
            "min-heap / max-heap",
            "push/pop",
            "maintaining top-k",
            "heap vs sorted list tradeoff",
        ],
        "goal_criteria": [
            "Can explain when heap beats sorting everything",
            "Can solve a top-k problem with a heap",
            "Understands efficient root access",
        ],
    },
    {
        "title": "Common algorithmic patterns",
        "area": "Algorithms",
        "practical_usage": [
            "Solve a large share of practical coding problems",
        ],
        "subtopics": [
            "two pointers",
            "sliding window",
            "prefix sums",
            "interval merge",
            "backtracking",
            "dynamic programming basics",
        ],
        "goal_criteria": [
            "Can recognize the right pattern for a problem",
            "Can solve at least one example of each pattern",
            "Can identify overlapping subproblems in simple DP",
        ],
    },
    {
        "title": "Mean, median, variance, standard deviation",
        "area": "Statistics",
        "practical_usage": [
            "Summarize data",
            "Interpret spread and unusual behavior",
            "Compare distributions",
        ],
        "subtopics": [
            "mean",
            "median",
            "mode",
            "variance",
            "standard deviation",
            "outlier sensitivity",
        ],
        "goal_criteria": [
            "Can explain when median is better than mean",
            "Can interpret high variance",
            "Can summarize a small dataset correctly",
        ],
    },
    {
        "title": "Probability basics",
        "area": "Statistics",
        "practical_usage": [
            "Reason about uncertainty",
            "Estimate risk",
            "Understand randomized behavior",
        ],
        "subtopics": [
            "probability rules",
            "independent vs dependent events",
            "joint probability",
            "complement probability",
        ],
        "goal_criteria": [
            "Can compute simple probabilities",
            "Can explain independence with examples",
            "Avoids common probability mistakes",
        ],
    },
    {
        "title": "Conditional probability and Bayes’ rule",
        "area": "Statistics",
        "practical_usage": [
            "Diagnostic reasoning",
            "Classification intuition",
            "Interpreting alerts and test results",
        ],
        "subtopics": [
            "conditional probability",
            "base rate",
            "Bayes’ rule",
            "false positives / false negatives",
        ],
        "goal_criteria": [
            "Can explain why base rates matter",
            "Can work through a simple Bayes example",
            "Can interpret a positive alert more carefully",
        ],
    },
    {
        "title": "Distributions",
        "area": "Statistics",
        "practical_usage": [
            "Understand normal behavior",
            "Choose thresholds",
            "Detect anomalies",
        ],
        "subtopics": [
            "normal distribution",
            "uniform distribution",
            "binomial intuition",
            "skew",
            "percentiles and quantiles",
        ],
        "goal_criteria": [
            "Can read a histogram and describe skew/spread",
            "Knows real data is often not normal",
            "Can use percentiles for thresholding",
        ],
    },
    {
        "title": "Sampling and bias",
        "area": "Statistics",
        "practical_usage": [
            "Avoid misleading conclusions",
            "Interpret metrics and experiments correctly",
        ],
        "subtopics": [
            "sample vs population",
            "sampling bias",
            "survivorship bias",
            "selection bias",
            "sample size intuition",
        ],
        "goal_criteria": [
            "Can explain how biased samples mislead",
            "Can spot obvious bias in a setup",
            "Knows more data does not fix bad sampling",
        ],
    },
    {
        "title": "Correlation vs causation",
        "area": "Statistics",
        "practical_usage": [
            "Avoid wrong product or engineering conclusions",
            "Interpret telemetry more carefully",
        ],
        "subtopics": [
            "correlation",
            "confounding variables",
            "spurious correlation",
            "causation limits",
        ],
        "goal_criteria": [
            "Does not treat correlation alone as causation",
            "Can name plausible confounders",
            "Can explain why observational data is limited",
        ],
    },
    {
        "title": "Regression basics",
        "area": "Statistics",
        "practical_usage": [
            "Trend analysis",
            "Relationship modeling",
            "Forecasting intuition",
        ],
        "subtopics": [
            "linear regression intuition",
            "slope/intercept",
            "residuals",
            "overfitting basics",
        ],
        "goal_criteria": [
            "Can explain what a regression line does",
            "Can interpret slope in a simple example",
            "Understands why training fit alone proves little",
        ],
    },
    {
        "title": "Hypothesis testing and p-values",
        "area": "Statistics",
        "practical_usage": [
            "A/B testing",
            "Evaluating whether changes are noise",
        ],
        "subtopics": [
            "null hypothesis",
            "alternative hypothesis",
            "p-value intuition",
            "Type I / Type II errors",
            "practical vs statistical significance",
        ],
        "goal_criteria": [
            "Can explain p-value in plain language",
            "Knows significance does not guarantee importance",
            "Can read an experiment result critically",
        ],
    },
    {
        "title": "Confidence intervals",
        "area": "Statistics",
        "practical_usage": [
            "Communicate uncertainty",
            "Interpret estimated metrics more honestly",
        ],
        "subtopics": [
            "interval estimate",
            "uncertainty range",
            "width vs sample size",
        ],
        "goal_criteria": [
            "Can explain why a point estimate is incomplete",
            "Understands wider intervals mean more uncertainty",
            "Can interpret a metric reported with an interval",
        ],
    },
    {
        "title": "Expected value",
        "area": "Statistics",
        "practical_usage": [
            "Decision-making under uncertainty",
            "Comparing risky options",
            "Resource allocation intuition",
        ],
        "subtopics": [
            "weighted average of outcomes",
            "long-run intuition",
            "high variance vs high expected value",
        ],
        "goal_criteria": [
            "Can compute expected value for a simple decision",
            "Knows most likely outcome is not always best expected outcome",
            "Can compare two risky choices rationally",
        ],
    },
]


def require_env(name: str, value: str) -> None:
    if not value:
        print(f"Missing required environment variable: {name}", file=sys.stderr)
        sys.exit(1)


def jira_request(
    method: str,
    path: str,
    *,
    json_body: Optional[Dict[str, Any]] = None,
    params: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    url = f"{JIRA_BASE_URL}{path}"
    response = requests.request(
        method=method,
        url=url,
        auth=HTTPBasicAuth(JIRA_EMAIL, JIRA_API_TOKEN),
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        json=json_body,
        params=params,
        timeout=30,
    )

    if response.status_code >= 400:
        print(
            f"Jira API error: {response.status_code} {response.reason}", file=sys.stderr
        )
        try:
            print(
                json.dumps(response.json(), indent=2, ensure_ascii=False),
                file=sys.stderr,
            )
        except Exception:
            print(response.text, file=sys.stderr)
        sys.exit(1)

    if response.text.strip():
        return response.json()
    return {}


def adf_text(text: str) -> Dict[str, Any]:
    return {"type": "text", "text": text}


def adf_paragraph(text: str) -> Dict[str, Any]:
    return {"type": "paragraph", "content": [adf_text(text)]}


def adf_bullet_list(items: List[str]) -> Dict[str, Any]:
    return {
        "type": "bulletList",
        "content": [
            {
                "type": "listItem",
                "content": [
                    {
                        "type": "paragraph",
                        "content": [adf_text(item)],
                    }
                ],
            }
            for item in items
        ],
    }


def build_epic_description() -> Dict[str, Any]:
    return {
        "version": 1,
        "type": "doc",
        "content": [
            adf_paragraph("Learning epic for core engineering fundamentals."),
            adf_paragraph("Areas:"),
            adf_bullet_list(
                [
                    "Linear algebra basics",
                    "Algorithms and data structures basics",
                    "Statistics and probability basics",
                ]
            ),
            adf_paragraph("Each child issue contains:"),
            adf_bullet_list(
                [
                    "Practical usage",
                    "Subtopics to learn",
                    "Explicit goal criteria",
                ]
            ),
        ],
    }


def build_topic_description(topic: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "version": 1,
        "type": "doc",
        "content": [
            adf_paragraph(f"Area: {topic['area']}"),
            adf_paragraph("Practical usage:"),
            adf_bullet_list(topic["practical_usage"]),
            adf_paragraph("Subtopics to learn:"),
            adf_bullet_list(topic["subtopics"]),
            adf_paragraph("Done criteria:"),
            adf_bullet_list(topic["goal_criteria"]),
        ],
    }


def create_issue(fields: Dict[str, Any]) -> Dict[str, Any]:
    payload = {"fields": fields}
    return jira_request("POST", "/rest/api/3/issue", json_body=payload)


def create_epic(summary: str) -> str:
    fields: Dict[str, Any] = {
        "project": {"key": JIRA_PROJECT_KEY},
        "summary": summary,
        "description": build_epic_description(),
        "issuetype": {"name": EPIC_ISSUE_TYPE},
        "labels": DEFAULT_LABELS,
    }

    if EPIC_NAME_FIELD_ID:
        # Some Jira projects require a dedicated Epic Name custom field.
        fields[EPIC_NAME_FIELD_ID] = summary

    result = create_issue(fields)
    epic_key = result["key"]
    print(f"Created epic: {epic_key}")
    return epic_key


def create_child_issue(epic_key: str, topic: Dict[str, Any]) -> str:
    fields: Dict[str, Any] = {
        "project": {"key": JIRA_PROJECT_KEY},
        "summary": f"Learn: {topic['title']}",
        "description": build_topic_description(topic),
        "issuetype": {"name": CHILD_ISSUE_TYPE},
        "parent": {"key": epic_key},
        "labels": DEFAULT_LABELS + [topic["area"].lower().replace(" ", "-")],
    }

    result = create_issue(fields)
    issue_key = result["key"]
    print(f"Created child issue: {issue_key} - {topic['title']}")
    return issue_key


def main() -> None:
    require_env("JIRA_BASE_URL", JIRA_BASE_URL)
    require_env("JIRA_EMAIL", JIRA_EMAIL)
    require_env("JIRA_API_TOKEN", JIRA_API_TOKEN)
    require_env("JIRA_PROJECT_KEY", JIRA_PROJECT_KEY)

    epic_summary = "Engineering Fundamentals Refresh"
    epic_key = create_epic(epic_summary)

    created = []
    for topic in TOPICS:
        key = create_child_issue(epic_key, topic)
        created.append(key)

    print("\nDone.")
    print(f"Epic: {epic_key}")
    print(f"Created {len(created)} child issues.")


if __name__ == "__main__":
    main()

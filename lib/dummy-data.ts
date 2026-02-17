// ============================================================
// DUMMY DATA — swap with real Supabase queries later
// ============================================================

export const DUMMY_USER = {
  id: "u-001",
  email: "rudraksha@devhubb.io",
  fullName: "Rudraksha Sharma",
  handle: "rudraksha",
  college: "IIT Delhi",
  city: "New Delhi",
  bio: "Full-stack developer passionate about open source, competitive programming, and building tools for developers.",
  linkedinUrl: "https://linkedin.com/in/rudraksha",
  twitterUrl: "https://twitter.com/rudraksha_dev",
  githubUrl: "https://github.com/rudraksha",
  phoneNumber: "+91 98765 43210",
  avatarUrl: "",
  isPublic: true,
  createdAt: "2025-06-15T10:00:00Z",
}

export const DUMMY_GITHUB_STATS = {
  username: "rudraksha",
  avatarUrl: "https://avatars.githubusercontent.com/u/1?v=4",
  publicRepos: 47,
  followers: 1243,
  following: 89,
  totalStars: 3820,
  totalCommits: 2847,
  topLanguages: [
    { name: "TypeScript", percentage: 42 },
    { name: "Java", percentage: 28 },
    { name: "Python", percentage: 18 },
    { name: "Go", percentage: 12 },
  ],
  contributionData: [
    { month: "Aug", commits: 120 },
    { month: "Sep", commits: 180 },
    { month: "Oct", commits: 150 },
    { month: "Nov", commits: 220 },
    { month: "Dec", commits: 190 },
    { month: "Jan", commits: 240 },
    { month: "Feb", commits: 160 },
  ],
}

export const DUMMY_LEETCODE_STATS = {
  username: "rudraksha_lc",
  totalSolved: 487,
  easySolved: 162,
  mediumSolved: 248,
  hardSolved: 77,
  acceptanceRate: 68.4,
  ranking: 12450,
  contestRating: 1847,
  streak: 32,
  recentSubmissions: [
    { title: "Two Sum", difficulty: "Easy", status: "Accepted", date: "2026-02-16" },
    { title: "Merge K Sorted Lists", difficulty: "Hard", status: "Accepted", date: "2026-02-15" },
    { title: "LRU Cache", difficulty: "Medium", status: "Accepted", date: "2026-02-14" },
    { title: "Binary Tree Zigzag", difficulty: "Medium", status: "Accepted", date: "2026-02-13" },
    { title: "Trapping Rain Water", difficulty: "Hard", status: "Accepted", date: "2026-02-12" },
  ],
}

export const DUMMY_NOTEBOOKS = [
  {
    id: "nb-001",
    title: "System Design Notes",
    ownerId: "u-001",
    createdAt: "2025-12-01T08:00:00Z",
    updatedAt: "2026-02-15T14:30:00Z",
    pageCount: 5,
  },
  {
    id: "nb-002",
    title: "DSA Patterns",
    ownerId: "u-001",
    createdAt: "2025-11-10T09:00:00Z",
    updatedAt: "2026-02-14T10:20:00Z",
    pageCount: 12,
  },
  {
    id: "nb-003",
    title: "Interview Prep",
    ownerId: "u-001",
    createdAt: "2026-01-05T11:00:00Z",
    updatedAt: "2026-02-13T16:45:00Z",
    pageCount: 8,
  },
  {
    id: "nb-004",
    title: "Project Ideas",
    ownerId: "u-001",
    createdAt: "2026-01-20T07:30:00Z",
    updatedAt: "2026-02-10T09:15:00Z",
    pageCount: 3,
  },
]

export const DUMMY_PAGES: Record<string, Array<{
  id: string
  notebookId: string
  title: string
  slug: string
  contentMd: string
  updatedAt: string
  isPublic: boolean
}>> = {
  "nb-001": [
    {
      id: "pg-001",
      notebookId: "nb-001",
      title: "Load Balancers",
      slug: "load-balancers",
      contentMd: `# Load Balancers

## Overview
A load balancer distributes incoming network traffic across multiple servers to ensure no single server bears too much demand.

## Types
- **Round Robin** — Requests distributed sequentially
- **Least Connections** — Sends to the server with fewest active connections
- **IP Hash** — Routes based on client IP

## Key Metrics
| Metric | Target |
|--------|--------|
| Latency | < 50ms |
| Throughput | > 10k req/s |
| Availability | 99.99% |

## Notes
- Consider health checks every 10s
- Use sticky sessions for stateful apps
- Layer 4 vs Layer 7 trade-offs`,
      updatedAt: "2026-02-15T14:30:00Z",
      isPublic: true,
    },
    {
      id: "pg-002",
      notebookId: "nb-001",
      title: "Database Sharding",
      slug: "database-sharding",
      contentMd: `# Database Sharding

## What is Sharding?
Sharding is a database architecture pattern where data is horizontally partitioned across multiple database instances.

## Strategies
1. **Range-based** — Split by ID ranges
2. **Hash-based** — Consistent hashing
3. **Directory-based** — Lookup table

## Pros & Cons
- **Pro:** Horizontal scalability
- **Pro:** Better query performance
- **Con:** Complex joins
- **Con:** Rebalancing is hard`,
      updatedAt: "2026-02-14T11:00:00Z",
      isPublic: false,
    },
  ],
  "nb-002": [
    {
      id: "pg-003",
      notebookId: "nb-002",
      title: "Sliding Window",
      slug: "sliding-window",
      contentMd: `# Sliding Window Pattern

## When to Use
- Contiguous subarray/substring problems
- Fixed or variable window size
- Optimization problems (max/min)

\`\`\`java
int maxSum(int[] arr, int k) {
    int windowSum = 0, maxSum = 0;
    for (int i = 0; i < arr.length; i++) {
        windowSum += arr[i];
        if (i >= k - 1) {
            maxSum = Math.max(maxSum, windowSum);
            windowSum -= arr[i - (k - 1)];
        }
    }
    return maxSum;
}
\`\`\`

## Common Problems
- Maximum Sum Subarray of Size K
- Longest Substring Without Repeating Characters
- Minimum Window Substring`,
      updatedAt: "2026-02-14T10:20:00Z",
      isPublic: true,
    },
  ],
}

export const DUMMY_COLLAB_ROOMS = [
  {
    id: "rm-001",
    ownerId: "u-001",
    title: "Spring Boot Microservice",
    slug: "spring-boot-ms",
    language: "java",
    participantCount: 3,
    lastSavedAt: "2026-02-16T20:00:00Z",
    content: `import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}

@RestController
@RequestMapping("/api/users")
class UserController {

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        // TODO: Implement user lookup
        return ResponseEntity.ok(new User(id, "John Doe", "john@example.com"));
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        // TODO: Save to database
        return ResponseEntity.status(201).body(user);
    }
}`,
  },
  {
    id: "rm-002",
    ownerId: "u-001",
    title: "Binary Search Tree",
    slug: "bst-impl",
    language: "java",
    participantCount: 2,
    lastSavedAt: "2026-02-15T18:30:00Z",
    content: `public class BinarySearchTree {
    private Node root;

    static class Node {
        int value;
        Node left, right;
        Node(int v) { value = v; }
    }

    public void insert(int value) {
        root = insertRec(root, value);
    }

    private Node insertRec(Node node, int value) {
        if (node == null) return new Node(value);
        if (value < node.value)
            node.left = insertRec(node.left, value);
        else if (value > node.value)
            node.right = insertRec(node.right, value);
        return node;
    }

    public boolean search(int value) {
        return searchRec(root, value);
    }

    private boolean searchRec(Node node, int value) {
        if (node == null) return false;
        if (value == node.value) return true;
        return value < node.value
            ? searchRec(node.left, value)
            : searchRec(node.right, value);
    }
}`,
  },
  {
    id: "rm-003",
    ownerId: "u-001",
    title: "REST API Handler",
    slug: "rest-api-handler",
    language: "java",
    participantCount: 5,
    lastSavedAt: "2026-02-14T15:00:00Z",
    content: `public class ApiHandler {
    // TODO: Implement REST API handler
}`,
  },
]

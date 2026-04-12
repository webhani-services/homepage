import test from "node:test";
import assert from "node:assert/strict";
import { buildTagFilterModel } from "@/lib/blogTagFilters";
import type { BlogFrontmatter } from "@/lib/blog";

function createPost(slug: string, tags: string[]): BlogFrontmatter {
  return {
    title: slug,
    description: `${slug} description`,
    date: "2026-04-12",
    status: "published",
    tags,
    author: "webhani",
    slug,
  };
}

test("buildTagFilterModel prioritizes tags by usage count", () => {
  const posts = [
    createPost("post-1", ["AI", "React"]),
    createPost("post-2", ["AI", "TypeScript"]),
    createPost("post-3", ["DevOps"]),
    createPost("post-4", ["AI", "DevOps"]),
  ];

  const model = buildTagFilterModel({
    posts,
    currentTag: "",
    defaultVisibleCount: 2,
  });

  assert.deepEqual(
    model.visibleTags.map((tag) => tag.name),
    ["AI", "DevOps"]
  );
  assert.deepEqual(
    model.hiddenTags.map((tag) => tag.name),
    ["React", "TypeScript"]
  );
});

test("buildTagFilterModel keeps the selected tag visible when collapsed", () => {
  const posts = [
    createPost("post-1", ["AI"]),
    createPost("post-2", ["AI"]),
    createPost("post-3", ["DevOps"]),
    createPost("post-4", ["TypeScript"]),
  ];

  const model = buildTagFilterModel({
    posts,
    currentTag: "TypeScript",
    defaultVisibleCount: 2,
  });

  assert.deepEqual(
    model.visibleTags.map((tag) => tag.name),
    ["AI", "DevOps", "TypeScript"]
  );
  assert.equal(model.hiddenTags.length, 0);
});

test("buildTagFilterModel exposes all remaining tags in expanded mode", () => {
  const posts = [
    createPost("post-1", ["AI"]),
    createPost("post-2", ["AI"]),
    createPost("post-3", ["DevOps"]),
    createPost("post-4", ["TypeScript"]),
  ];

  const model = buildTagFilterModel({
    posts,
    currentTag: "",
    defaultVisibleCount: 2,
    expanded: true,
  });

  assert.deepEqual(
    model.visibleTags.map((tag) => tag.name),
    ["AI", "DevOps", "TypeScript"]
  );
  assert.equal(model.hiddenTags.length, 0);
  assert.equal(model.hiddenCount, 1);
});

import type { BlogFrontmatter } from "@/lib/blog";

export type TagFilterItem = {
  name: string;
  count: number;
};

type BuildTagFilterModelParams = {
  posts: BlogFrontmatter[];
  currentTag: string;
  defaultVisibleCount: number;
  expanded?: boolean;
};

type TagFilterModel = {
  visibleTags: TagFilterItem[];
  hiddenTags: TagFilterItem[];
  hiddenCount: number;
};

export function buildTagFilterModel({
  posts,
  currentTag,
  defaultVisibleCount,
  expanded = false,
}: BuildTagFilterModelParams): TagFilterModel {
  const tagCounts = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const sortedTags = Array.from(tagCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  if (expanded) {
    return {
      visibleTags: sortedTags,
      hiddenTags: [],
      hiddenCount: Math.max(0, sortedTags.length - defaultVisibleCount),
    };
  }

  const baseVisible = sortedTags.slice(0, defaultVisibleCount);
  const baseVisibleNames = new Set(baseVisible.map((tag) => tag.name));

  if (currentTag && !baseVisibleNames.has(currentTag)) {
    const selectedTag = sortedTags.find((tag) => tag.name === currentTag);

    if (selectedTag) {
      baseVisible.push(selectedTag);
      baseVisibleNames.add(selectedTag.name);
    }
  }

  const hiddenTags = sortedTags.filter((tag) => !baseVisibleNames.has(tag.name));

  return {
    visibleTags: baseVisible,
    hiddenTags,
    hiddenCount: Math.max(0, sortedTags.length - defaultVisibleCount),
  };
}

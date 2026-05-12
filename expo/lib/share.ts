import { Platform, Share } from "react-native";

export type ShareCardData = {
  score?: number;
  total?: number;
  level?: number;
  levelTitle?: string;
  streak?: number;
  passed?: boolean;
};

export function buildShareMessage(data: ShareCardData): string {
  const lines: string[] = [];
  if (typeof data.score === "number" && typeof data.total === "number") {
    const pct = Math.round((data.score / Math.max(1, data.total)) * 100);
    if (data.passed) {
      lines.push(
        `\u{1F389} I just passed a UK theory mock — ${data.score}/${data.total} (${pct}%)!`,
      );
    } else {
      lines.push(
        `\u{1F4DA} Mock test grind: ${data.score}/${data.total} (${pct}%)`,
      );
    }
  } else {
    lines.push("\u{1F697} Levelling up on my UK theory test prep");
  }
  if (typeof data.level === "number") {
    lines.push(
      `Level ${data.level}${data.levelTitle ? ` \u2022 ${data.levelTitle}` : ""}`,
    );
  }
  if (typeof data.streak === "number" && data.streak > 0) {
    lines.push(`\u{1F525} ${data.streak}-day streak`);
  }
  lines.push("");
  lines.push("Practising with The Online Driving Instructor.");
  return lines.join("\n");
}

async function copyToClipboardWeb(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    console.log("[share] navigator.clipboard failed", e);
  }
  return false;
}

export async function shareProgress(
  data: ShareCardData,
): Promise<{ shared: boolean; method: "native" | "clipboard" | "none" }> {
  const message = buildShareMessage(data);
  console.log("[share] sharing", message);

  if (Platform.OS === "web") {
    try {
      const w = typeof window !== "undefined" ? window : null;
      const navAny = (w?.navigator ?? null) as
        | (Navigator & {
            share?: (d: { title: string; text: string }) => Promise<void>;
          })
        | null;
      if (navAny && typeof navAny.share === "function") {
        await navAny.share({
          title: "The Online Driving Instructor",
          text: message,
        });
        return { shared: true, method: "native" };
      }
    } catch (e) {
      console.log("[share] web share failed", e);
    }
    const copied = await copyToClipboardWeb(message);
    return copied
      ? { shared: true, method: "clipboard" }
      : { shared: false, method: "none" };
  }

  try {
    const result = await Share.share({
      title: "The Online Driving Instructor",
      message,
    });
    if (result.action === Share.sharedAction) {
      return { shared: true, method: "native" };
    }
    return { shared: false, method: "none" };
  } catch (e) {
    console.log("[share] native share failed", e);
    return { shared: false, method: "none" };
  }
}

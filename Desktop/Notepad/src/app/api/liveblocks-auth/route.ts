import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";

const secret = process.env.LIVEBLOCKS_SECRET_KEY;
const liveblocks = secret ? new Liveblocks({ secret }) : null;

const PREMIUM_COLORS = [
  "#6366f1", // Indigo
  "#a855f7", // Violet
  "#ec4899", // Rose
  "#06b6d4", // Teal/Cyan
  "#f59e0b", // Amber
  "#10b981", // Emerald
];

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PREMIUM_COLORS.length;
  return PREMIUM_COLORS[index];
}

export async function POST(request: NextRequest) {
  if (!liveblocks) {
    return new Response(
      JSON.stringify({ error: "LIVEBLOCKS_SECRET_KEY is missing. Please set it in your .env.local file." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // 1. Check for authenticated Clerk user session
  const clerkUser = await currentUser();
  let userId: string;
  let userInfo: { name: string; color: string; avatar: string };

  if (clerkUser) {
    userId = clerkUser.id;
    userInfo = {
      name: clerkUser.firstName || clerkUser.username || "User",
      avatar: clerkUser.imageUrl,
      color: stringToColor(clerkUser.id),
    };
  } else {
    // 2. Fallback to Guest Session with persistent cookies
    const cookieStore = await cookies();
    let guestId = cookieStore.get("guest-id")?.value;
    let guestColor = cookieStore.get("guest-color")?.value;
    let guestAvatar = cookieStore.get("guest-avatar")?.value;

    if (!guestId || !guestColor || !guestAvatar) {
      guestId = `Guest #${Math.floor(1000 + Math.random() * 9000)}`;
      guestColor = PREMIUM_COLORS[Math.floor(Math.random() * PREMIUM_COLORS.length)];
      guestAvatar = `https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 8) + 1}.png`;

      // Persist guest credentials in cookies for 1 week
      cookieStore.set("guest-id", guestId, { maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set("guest-color", guestColor, { maxAge: 60 * 60 * 24 * 7 });
      cookieStore.set("guest-avatar", guestAvatar, { maxAge: 60 * 60 * 24 * 7 });
    }

    userId = guestId;
    userInfo = {
      name: guestId,
      color: guestColor,
      avatar: guestAvatar,
    };
  }

  // Create a session for the current user
  const session = liveblocks.prepareSession(userId, { userInfo });

  // Use a naming pattern to allow access to rooms with a wildcard
  session.allow(`liveblocks:examples:*`, ["*:write"]);

  // Authorize the user and return the result
  const { body, status } = await session.authorize();
  return new Response(body, { status });
}

import webpush from "web-push";
import {
  listPushSubscriptions,
  listAllPushSubscriptions,
  deletePushSubscription,
  type PushSub,
} from "./queries";

export function pushConfigured(): boolean {
  return !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY);
}

let ready = false;
function ensure() {
  if (ready || !pushConfigured()) return;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:hello@example.com",
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  ready = true;
}

export type PushPayload = { title: string; body: string; url?: string; tag?: string };

async function sendToSub(sub: PushSub, payload: PushPayload): Promise<boolean> {
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify({ url: "/dashboard", ...payload })
    );
    return true;
  } catch (e: unknown) {
    const code = (e as { statusCode?: number })?.statusCode;
    // 404/410 = subscription gone; prune it so we stop trying.
    if (code === 404 || code === 410) await deletePushSubscription(sub.endpoint).catch(() => {});
    return false;
  }
}

/** Push to every device a mother has subscribed. Returns count delivered. */
export async function sendPushToMother(motherId: string, payload: PushPayload): Promise<number> {
  if (!pushConfigured()) return 0;
  ensure();
  const subs = await listPushSubscriptions(motherId);
  const results = await Promise.all(subs.map((s) => sendToSub(s, payload)));
  return results.filter(Boolean).length;
}

/** Broadcast to all subscribers (admin announcement). Returns count delivered. */
export async function sendPushToAll(payload: PushPayload): Promise<number> {
  if (!pushConfigured()) return 0;
  ensure();
  const subs = await listAllPushSubscriptions();
  const results = await Promise.all(subs.map((s) => sendToSub(s, payload)));
  return results.filter(Boolean).length;
}

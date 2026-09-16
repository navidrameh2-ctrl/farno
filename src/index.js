import { TelegramClient } from "teleproto";
import { StringSession } from "teleproto/sessions";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // تست Worker
    if (url.pathname === "/") {
      return Response.json({
        ok: true,
        farno: "MTProto",
        api_id_configured: !!env.TELEGRAM_API_ID,
        api_hash_configured: !!env.TELEGRAM_API_HASH
      });
    }

    // تست نصب MTProto
    if (url.pathname === "/telegram/test") {
      try {
        const apiId = Number(env.TELEGRAM_API_ID);
        const apiHash = env.TELEGRAM_API_HASH;

        const session = new StringSession("");

        const client = new TelegramClient(
          session,
          apiId,
          apiHash,
          {
            connectionRetries: 1
          }
        );

        return Response.json({
          ok: true,
          mtproto: "loaded",
          client: !!client,
          session: "ready"
        });
      } catch (error) {
        return Response.json({
          ok: false,
          error: error?.message || String(error)
        }, { status: 500 });
      }
    }

    return Response.json({
      ok: false,
      error: "not_found"
    }, { status: 404 });
  }
};

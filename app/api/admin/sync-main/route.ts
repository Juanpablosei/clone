import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { syncContentBase2ToBase1 } from "@/lib/sync-content-base2-to-base1";

export async function POST() {
  const session = await auth();
  if (!session || (session.user.role !== "EDITOR" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[SYNC] Inicio manual desde admin");
    const summary = await syncContentBase2ToBase1((msg) => console.log(`[SYNC] ${msg}`));
    return NextResponse.json({
      ok: true,
      summary,
    });
  } catch (error) {
    console.error("[SYNC] Error:", error);
    return NextResponse.json(
      { ok: false, error: "Sync failed. Check server logs for details." },
      { status: 500 }
    );
  }
}

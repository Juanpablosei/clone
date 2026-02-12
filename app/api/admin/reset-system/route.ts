import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { resetSystemBase1ToBase2 } from "../../../../lib/reset-system-base1-to-base2";

export async function POST() {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const logs: string[] = [];
  const logFn = (message: string) => {
    logs.push(message);
    console.log(message);
  };

  try {
    await resetSystemBase1ToBase2(logFn);
    return NextResponse.json({
      ok: true,
      message: "System reset completed successfully",
      logs: logs.slice(-50), // Últimos 50 logs para no saturar la respuesta
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logFn(`❌ Error: ${errorMessage}`);
    return NextResponse.json(
      {
        ok: false,
        error: errorMessage,
        logs: logs.slice(-50),
      },
      { status: 500 }
    );
  }
}

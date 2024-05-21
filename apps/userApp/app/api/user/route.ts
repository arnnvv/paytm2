import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth";

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    if (session.user)
      return NextResponse.json({ user: session.user }, { status: 200 });
  } catch (error) {
    console.error(`Error in GET /api/auth/verify: ${error}`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 500 });
  }
};

export const dynamic = "force-dynamic";

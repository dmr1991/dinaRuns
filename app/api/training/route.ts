import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const weekId = searchParams.get("weekId");

  try {
    const client = await clientPromise;
    const db = client.db("dinaruns");

    const data = await db.collection("dinaruns").findOne({
      user: "dina",
      weekId: weekId,
    });

    return NextResponse.json(data?.weekData || { days: {}, routines: {} });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Error al conectar con MongoDB" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const { weekId, weekData } = await request.json();
    const client = await clientPromise;
    const db = client.db("dinaruns");

    await db
      .collection("dinaruns")
      .updateOne(
        { user: "dina", weekId: weekId },
        { $set: { weekData, updatedAt: new Date() } },
        { upsert: true },
      );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("dinaruns");
  const data = await db.collection("dinaruns").findOne({ user: "dina" });
  return NextResponse.json(data?.weekData || {});
}

export async function POST(request: Request) {
  const body = await request.json();
  const client = await clientPromise;
  const db = client.db("dinaruns");

  await db.collection("dinaruns").updateOne(
    { user: "dina" },
    { $set: { weekData: body, updatedAt: new Date() } },
    { upsert: true }, // Esto crea el registro si no existe
  );

  return NextResponse.json({ success: true });
}

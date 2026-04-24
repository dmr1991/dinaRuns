import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const weekId = searchParams.get('weekId');
  const month = searchParams.get('month'); // Nuevo parámetro

  const client = await clientPromise;
  const db = client.db("dinaruns");

  // Si pedimos por MES
  if (month) {
    const data = await db.collection("dinaruns")
      .find({ user: "dina", weekId: { $regex: `^${month}` } })
      .toArray();
    return NextResponse.json(data);
  }

  // Si pedimos por SEMANA (como ya lo teníamos)
  const data = await db.collection("dinaruns").findOne({ 
    user: "dina", 
    weekId: weekId 
  });
  
  return NextResponse.json(data?.weekData || { days: {}, routines: {} });
}

// import dbConnect from "@/lib/mongodb";
// import Home from "@/models/Home";
// import { NextResponse } from "next/server";

// export async function GET(req, { params }) {
//   await dbConnect();

//   try {
//     const home = await Home.findById(params.id);

//     if (!home) {
//       return NextResponse.json({ error: "Home not found" }, { status: 404 });
//     }

//     return NextResponse.json(home, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching home:", error);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

import dbConnect from "@/lib/mongodb";
import Home from "@/models/Home";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  await dbConnect();

  try {
    const { id } = await context.params;   // ✅ await params here
    const home = await Home.findById(id);

    if (!home) {
      return NextResponse.json({ error: "Home not found" }, { status: 404 });
    }

    return NextResponse.json(home, { status: 200 });
  } catch (error) {
    console.error("Error fetching home:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    main:{temp:33+(Math.random()-.5)*4,humidity:65+Math.round(Math.random()*20),pressure:1012},
    weather:[{description:"partly cloudy",icon:"02d",id:802}],
    wind:{speed:12+Math.random()*8}, name:"Hyderabad",
  });
}

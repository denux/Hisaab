import {existsSync} from 'node:fs';
import path from 'node:path';
import {geographyStatus,hostedGeographyEnabled} from '@/lib/hosted-geography';
import {historicalCacheHeaders} from '@/lib/historical-cache';
export async function GET(){try{if(!hostedGeographyEnabled()&&!existsSync(path.join(process.cwd(),'data/acquisition/geography/assets.sqlite')))throw new Error('Geography not installed');return Response.json(hostedGeographyEnabled()?await geographyStatus():{count:812976,maxzoom:14,delivery:'local_sqlite',spendingLinked:false},{headers:historicalCacheHeaders(300,300)});}catch{return Response.json({error:'Geography delivery unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}}

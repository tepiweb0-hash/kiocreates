import { ImageResponse } from 'next/og';
import { getPostBySlug } from '../../../lib/data';
import { postTitle } from '../../../lib/format';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post ? postTitle(post) : 'kiocreates.';
  return new ImageResponse(
    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#f3f4f6',fontFamily:'sans-serif'}}>
      <div style={{width:1040,height:500,display:'flex',flexDirection:'column',justifyContent:'space-between',padding:62,borderRadius:44,background:'#ffffff',border:'2px solid #e6e7ea'}}>
        <div style={{display:'flex',alignItems:'center',gap:20}}>
          <div style={{width:70,height:70,borderRadius:22,background:'#645cff',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,fontWeight:900}}>K</div>
          <div style={{fontSize:34,fontWeight:900,letterSpacing:'-1px'}}>kiocreates.</div>
        </div>
        <div style={{fontSize:60,fontWeight:850,letterSpacing:'-3px',lineHeight:1.03,maxWidth:910}}>{title.slice(0,120)}</div>
        <div style={{fontSize:22,color:'#6b7280'}}>kiocreates.vercel.app</div>
      </div>
    </div>,
    size
  );
}

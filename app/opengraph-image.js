import { ImageResponse } from 'next/og';

export const alt = 'kiocreates.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div style={{width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'#f3f4f6',fontFamily:'sans-serif'}}>
      <div style={{width:1020,height:470,display:'flex',flexDirection:'column',justifyContent:'space-between',padding:68,borderRadius:44,background:'#ffffff',border:'2px solid #e6e7ea'}}>
        <div style={{display:'flex',alignItems:'center',gap:24}}>
          <div style={{width:84,height:84,borderRadius:26,background:'#645cff',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:42,fontWeight:900}}>K</div>
          <div style={{fontSize:44,fontWeight:900,letterSpacing:'-2px'}}>kiocreates.</div>
        </div>
        <div style={{fontSize:64,fontWeight:850,letterSpacing:'-3px',lineHeight:1.02,maxWidth:850}}>Things I make, build, and learn.</div>
        <div style={{fontSize:25,color:'#6b7280'}}>One creator. One feed.</div>
      </div>
    </div>,
    size
  );
}

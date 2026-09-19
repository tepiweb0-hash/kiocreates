export default function MediaGrid({ media = [], cover = null }) {
  const items = media.length ? media : cover ? [cover] : [];
  if (!items.length) return null;
  const visible = items.slice(0, 4);
  return (
    <div className={`mediaGrid count${Math.min(visible.length, 4)}`}>
      {visible.map((item, index) => (
        <div className="mediaCell" key={item.id || index}>
          {item.media_type === 'video' ? (
            <video controls preload="metadata" src={item.public_url} />
          ) : (
            <img src={item.public_url} alt={item.alt_text || ''} loading={index === 0 ? 'eager' : 'lazy'} />
          )}
          {index === 3 && items.length > 4 ? <span className="moreMedia">+{items.length - 4}</span> : null}
        </div>
      ))}
    </div>
  );
}

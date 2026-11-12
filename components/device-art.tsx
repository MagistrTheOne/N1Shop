import type { Product } from '@/lib/catalog';
export function DeviceArt({ shape, tone = 'graphite', large = false }: { shape: Product['shape']; tone?: string; large?: boolean }) {
  return <div aria-hidden="true" className={`device-art device-${shape} tone-${tone} ${large ? 'device-large' : ''}`}>
    {shape === 'phone' && <div className="device-phone-frame"><div className="device-phone-back"><span className="camera-cluster"><i/><i/><i/><b/></span><span className="device-symbol"/></div></div>}
    {shape === 'laptop' && <div className="device-laptop"><div className="device-screen"><span className="device-screen-wave"/></div><div className="device-keyboard"/></div>}
    {shape === 'tablet' && <div className="device-tablet"><div className="device-tablet-screen"><span/></div></div>}
    {shape === 'watch' && <div className="device-watch"><div className="watch-strap top"/><div className="watch-face"><div className="watch-display"><span>10:09</span></div></div><div className="watch-strap bottom"/></div>}
    {shape === 'buds' && <div className="device-buds"><div className="earbud left"/><div className="earbud right"/><div className="buds-case"><span/></div></div>}
    {shape === 'tv' && <div className="device-tv"><div className="tv-box"><span>tv</span></div><div className="tv-remote"/></div>}
    {shape === 'accessory' && <div className="device-accessory"><div className="accessory-phone"/><div className="accessory-puck"/><div className="accessory-wire"/></div>}
  </div>;
}

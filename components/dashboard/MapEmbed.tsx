import React from 'react'
import ModalWindow from '../ui/modal-window'

interface Props {
  lat?: number
  lon?: number
  zoom?: number
}

export const MapEmbed: React.FC<Props> = ({ lat = 50.4501, lon = 30.5234, zoom = 12 }) => {
  const bboxSize = 0.05
  const left = lon - bboxSize
  const right = lon + bboxSize
  const top = lat + bboxSize
  const bottom = lat - bboxSize
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&amp;layer=mapnik&amp;marker=${lat}%2C${lon}`

  return (
    <ModalWindow isOpen={true} onClose={() => {}} title="Розташування на карті">
    <div className="w-full rounded-lg overflow-hidden border border-white/5 shadow-sm">
      <iframe
        title="map"
        src={src}
        className="w-full h-80 sm:h-96"
        loading="lazy"
      />
    </div>
    </ModalWindow>
  )
}

export default MapEmbed

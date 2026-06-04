/// <reference types="@types/google.maps" />
"use client"

import React, { useEffect, useRef } from 'react'
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps'
import { APIProvider, Map } from '@vis.gl/react-google-maps'
import ModalWindow from '@/components/ui/modal-window'

interface LatLng {
  lat: number
  lng: number
}

interface DirectionsProps {
  origin: string | LatLng
  destination: string | LatLng
}

interface MapRouteProps {
  origin: string | LatLng
  destination: string | LatLng
  onClose: () => void
}

export const GoogleMapRoute: React.FC<MapRouteProps> = ({ origin, destination, onClose }) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''

  // 💡 Рядки адрес origin та destination вже готові! Створювати їх тут через `const` більше не потрібно.

  return (
    <ModalWindow isOpen={true} onClose={onClose} title="Маршрут на карті">
      <div className="w-full h-80 sm:h-96 rounded-lg overflow-hidden border border-white/5 shadow-sm">
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={{ lat: 48.3794, lng: 31.1656 }}
            defaultZoom={6}
            fullscreenControl={false}
            mapTypeControl={false}
          >
            {/* Передаємо рядки прямо у внутрішній сервіс Directions */}
            <Directions origin={origin} destination={destination} />
          </Map>
        </APIProvider>
      </div>
    </ModalWindow>
  )
}

export const Directions: React.FC<DirectionsProps> = ({ origin, destination }) => {
  const map = useMap()
  const routesLibrary = useMapsLibrary('routes')
  
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null)

  useEffect(() => {
    if (!routesLibrary || !map) return

    const renderer = new routesLibrary.DirectionsRenderer({ 
      map,
      suppressMarkers: false
    })
    
    directionsRendererRef.current = renderer

    // Очищення карти при розмонтуванні компонента
    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null)
        directionsRendererRef.current = null
      }
    }
  }, [routesLibrary, map])

  // 2. Запит та відображення маршруту при зміні точок
  useEffect(() => {
    if (!routesLibrary || !directionsRendererRef.current) return

    const directionsService = new routesLibrary.DirectionsService()

    const formatLocation = (loc: string | LatLng): string | google.maps.LatLng => {
      if (typeof loc === 'string') {
        return loc
      }
      return new google.maps.LatLng(loc.lat, loc.lng)
    }

    directionsService.route(
      {
        origin: formatLocation(origin),
        destination: formatLocation(destination),
        travelMode: 'DRIVING' as google.maps.TravelMode, 
      },
      (result, status) => {
        if (status === 'OK' && result && directionsRendererRef.current) {
          directionsRendererRef.current.setDirections(result)
        } else {
          console.error(`Помилка завантаження маршруту Google Maps: ${status}`)
          console.log('Origin:', origin, 'Destination:', destination)
        }
      }
    )
  }, [routesLibrary, origin, destination]) // Сюди більше не входить стейт рендерера!

  return null
}

export default GoogleMapRoute
import { useTranslations } from "next-intl"
import ModalWindow from "@/components/ui/modal-window"

interface GoogleMapRouteProps {
  origin: string
  destination: string
  onClose: () => void
}

function createGoogleMapsDirectionsEmbedUrl(
  googleMapsApiKey: string,
  origin: string,
  destination: string
): string {
  const directionsSearchParams = new URLSearchParams({
    key: googleMapsApiKey,
    origin,
    destination,
  })
  return `https://www.google.com/maps/embed/v1/directions?${directionsSearchParams.toString()}`
}

export function GoogleMapRoute({
  origin,
  destination,
  onClose,
}: GoogleMapRouteProps) {
  const routeTranslations = useTranslations("routes")
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  return (
    <ModalWindow isOpen onClose={onClose} title={routeTranslations("mapTitle")}>
      {googleMapsApiKey ? (
        <div className="w-full overflow-hidden rounded-lg border border-white/5 shadow-sm">
          <iframe
            title={routeTranslations("mapFrameTitle", { origin, destination })}
            className="h-[500px] w-full border-0"
            src={createGoogleMapsDirectionsEmbedUrl(
              googleMapsApiKey,
              origin,
              destination
            )}
          />
        </div>
      ) : (
        <p className="text-sm text-red-600">
          {routeTranslations("mapKeyMissing")}
        </p>
      )}
    </ModalWindow>
  )
}

export default GoogleMapRoute

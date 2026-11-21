import { useTranslations } from "next-intl"

interface RouteMapFrameProps {
  originName: string
  destinationName: string
  origin: string
  destination: string
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

export function RouteMapFrame({
  originName,
  destinationName,
  origin,
  destination,
}: RouteMapFrameProps) {
  const routeTranslations = useTranslations("routes")
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!googleMapsApiKey) {
    return (
      <p className="text-sm text-red-600">
        {routeTranslations("mapKeyMissing")}
      </p>
    )
  }
  return (
    <div className="w-full overflow-hidden rounded-lg border border-slate-200 shadow-sm">
      <iframe
        title={routeTranslations("mapFrameTitle", {
          origin: originName,
          destination: destinationName,
        })}
        className="h-72 w-full border-0"
        src={createGoogleMapsDirectionsEmbedUrl(
          googleMapsApiKey,
          origin,
          destination
        )}
      />
    </div>
  )
}

import { detectSingleFace, TinyFaceDetectorOptions } from 'face-api.js'
import { type FaceLandmarks68 } from 'face-api.js'

const maskPosition = (landmarks: FaceLandmarks68) => {
  const nose = landmarks.getNose()
  const jawline = landmarks.getJawOutline() // the width of the face
  const jawLeft = jawline[0]
  const jawRight = jawline[jawline.length - 1]
  const adjacent = jawRight.x - jawLeft.x
  const opposite = jawRight.y - jawLeft.y
  // pythagorean theorem formula
  const jawLength = Math.sqrt(Math.pow(adjacent, 2) + Math.pow(opposite, 2))
  // 2.2 is a raw adjustment to include the ears because I can only calculate the jaw length
  const width = jawLength * 2.2

  return {
    width,
    angle: Math.atan2(opposite, adjacent) * (180 / Math.PI),
    // 0.27 is an approximation of the image mask space
    leftOffset: jawLeft.x - width * 0.27,
    topOffset: nose[0].y - width * 0.47
  }
}

export function putMaskOnFace(maskSrc: string, imgRef: HTMLImageElement) {
  // face-api uses the image natural width to make the detection
  const scale = imgRef.width / imgRef.naturalWidth

  return new Promise((resolve, reject) => {
    const handleImage = (newImage: HTMLImageElement) => async () => {
      const detection = await detectSingleFace(
        newImage,
        new TinyFaceDetectorOptions()
      ).withFaceLandmarks(true)

      if (!detection) {
        reject('Face not detected.')
        return
      }

      const overlayValues = maskPosition(detection.landmarks)

      // remove the old mask overlay
      const oldOverlay = imgRef.parentElement?.querySelector('#overlay')
      if (oldOverlay) {
        imgRef.parentElement?.removeChild(oldOverlay)
      }

      // create new mask overlay
      const overlay = document.createElement('img')
      overlay.src = maskSrc
      overlay.id = 'overlay'
      overlay.style.cssText = `
        left: calc(${overlayValues.leftOffset * scale}px + 2.5rem);
        position: absolute;
        top: calc(${overlayValues.topOffset * scale}px + 2.5rem);
        transform: rotate(${overlayValues.angle}deg);
        width: ${overlayValues.width * scale}px;
      `

      imgRef.parentElement?.appendChild(overlay)
      resolve(true)
    }

    const image = new Image()
    image.crossOrigin = 'Anonymous'
    image.addEventListener('load', handleImage(image))
    image.src = imgRef.src
  })
}

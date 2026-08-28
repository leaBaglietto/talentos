export async function detectFace(file: File): Promise<{ detected: boolean; error?: string }> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    
    img.onload = () => {
      // Basic validation: check it's a real image with reasonable dimensions for a portrait
      const { width, height } = img
      
      // Must be at least 100x100
      if (width < 100 || height < 100) {
        URL.revokeObjectURL(url)
        resolve({ detected: false, error: 'La imagen es demasiado pequeña. Subí una foto de mayor resolución.' })
        return
      }
      
      // Use canvas to analyze image content
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      
      // Sample pixels to detect if it's a real photo vs solid color/logo
      const imageData = ctx.getImageData(0, 0, width, height)
      const data = imageData.data
      
      // Check color diversity (photos have lots of color variation, logos often don't)
      const colorSet = new Set<string>()
      const sampleStep = Math.max(1, Math.floor(data.length / 4 / 1000)) // Sample ~1000 pixels
      
      for (let i = 0; i < data.length; i += 4 * sampleStep) {
        const r = Math.floor(data[i] / 32) // Quantize to reduce granularity
        const g = Math.floor(data[i + 1] / 32)
        const b = Math.floor(data[i + 2] / 32)
        colorSet.add(`${r},${g},${b}`)
      }
      
      // Check for skin-tone presence (common in portrait photos)
      let skinTonePixels = 0
      let totalSampled = 0
      
      for (let i = 0; i < data.length; i += 4 * sampleStep) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        totalSampled++
        
        // Basic skin tone detection across various skin colors
        if (r > 60 && g > 40 && b > 20 &&
            r > g && r > b &&
            Math.abs(r - g) > 10 &&
            r - b > 15 && r - b < 180) {
          skinTonePixels++
        }
      }
      
      const skinPercentage = totalSampled > 0 ? skinTonePixels / totalSampled : 0
      const colorDiversity = colorSet.size
      
      URL.revokeObjectURL(url)
      
      // A portrait should have: reasonable color diversity AND some skin tones
      if (colorDiversity < 15) {
        resolve({ detected: false, error: 'La foto debe ser un retrato claro con rostro visible (no se admiten logos ni marcas)' })
      } else if (skinPercentage < 0.03) {
        resolve({ detected: false, error: 'La foto debe ser un retrato claro con rostro visible (no se admiten logos ni marcas)' })
      } else {
        resolve({ detected: true })
      }
    }
    
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve({ detected: false, error: 'No se pudo cargar la imagen. Intentá con otro archivo.' })
    }
    
    img.src = url
  })
}

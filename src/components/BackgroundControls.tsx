import React, { useRef } from 'react'
import { Image, Palette, X } from 'lucide-react'
import { Button } from './ui/button.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx'

interface BackgroundControlsProps {
  backgroundColor?: string
  backgroundImage?: string
  onBackgroundColorChange: (color: string | undefined) => void
  onBackgroundImageChange: (image: string | undefined) => void
}

const predefinedColors = [
  { name: 'Default', value: undefined },
  { name: 'Ocean Blue', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { name: 'Purple Dream', value: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)' },
  { name: 'Carbon Dark', value: 'linear-gradient(135deg, #232526 0%, #414345 100%)' },
  { name: 'Arctic', value: 'linear-gradient(135deg, #e6ddd4 0%, #d5def5 100%)' },
  { name: 'Fire', value: 'linear-gradient(135deg, #ff9a56 0%, #ff6853 100%)' },
  { name: 'Mint', value: 'linear-gradient(135deg, #a8e6cf 0%, #dcedc1 100%)' },
  { name: 'Lavender', value: 'linear-gradient(135deg, #e0c3fc 0%, #9bb5ff 100%)' },
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Pure Black', value: '#000000' },
]

export const BackgroundControls: React.FC<BackgroundControlsProps> = ({
  backgroundColor,
  backgroundImage,
  onBackgroundColorChange,
  onBackgroundImageChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      onBackgroundImageChange(result)
      // Clear color when image is selected
      onBackgroundColorChange(undefined)
    }
    reader.readAsDataURL(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleColorChange = (colorValue: string) => {
    if (colorValue === 'default') {
      onBackgroundColorChange(undefined)
    } else {
      // Find the actual color value from the predefined colors
      const predefinedColor = predefinedColors.find(c => 
        c.name.toLowerCase().replace(/\s+/g, '-') === colorValue
      )
      if (predefinedColor) {
        onBackgroundColorChange(predefinedColor.value)
        // Clear image when color is selected
        onBackgroundImageChange(undefined)
      }
    }
  }

  const clearBackground = () => {
    onBackgroundColorChange(undefined)
    onBackgroundImageChange(undefined)
  }

  const getCurrentColorName = () => {
    if (backgroundImage) return 'Custom Image'
    if (!backgroundColor) return 'default'
    
    const predefined = predefinedColors.find(c => c.value === backgroundColor)
    return predefined ? predefined.name.toLowerCase().replace(/\s+/g, '-') : 'custom'
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2">
        <Palette className="w-4 h-4" />
        <span className="text-sm font-medium">Background:</span>
      </div>

      <Select value={getCurrentColorName()} onValueChange={handleColorChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select background" />
        </SelectTrigger>
        <SelectContent>
          {predefinedColors.map((color) => (
            <SelectItem 
              key={color.name} 
              value={color.value ? color.name.toLowerCase().replace(/\s+/g, '-') : 'default'}
            >
              <div className="flex items-center gap-2">
                {color.value && (
                  <div 
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{ background: color.value }}
                  />
                )}
                {color.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2"
      >
        <Image className="w-4 h-4" />
        Upload Image
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {(backgroundColor || backgroundImage) && (
        <Button
          variant="outline"
          size="sm"
          onClick={clearBackground}
          className="flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Clear
        </Button>
      )}

      {backgroundImage && (
        <div className="text-xs text-gray-500">
          Custom image active
        </div>
      )}
    </div>
  )
}
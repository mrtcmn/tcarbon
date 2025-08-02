import React from 'react'
import { Crop, Eye, EyeOff } from 'lucide-react'
import { Button } from './ui/button.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.tsx'

export interface CropSettings {
  top: number
  right: number
  bottom: number
  left: number
  enabled: boolean
}

interface CropControlsProps {
  cropSettings: CropSettings
  onCropSettingsChange: (settings: CropSettings) => void
}

const marginPresets = [
  { name: 'No Margin', value: { top: 0, right: 0, bottom: 0, left: 0 } },
  { name: 'Small (10px)', value: { top: 10, right: 10, bottom: 10, left: 10 } },
  { name: 'Medium (20px)', value: { top: 20, right: 20, bottom: 20, left: 20 } },
  { name: 'Large (40px)', value: { top: 40, right: 40, bottom: 40, left: 40 } },
  { name: 'Extra Large (60px)', value: { top: 60, right: 60, bottom: 60, left: 60 } },
  { name: 'Tall (20px sides, 40px top/bottom)', value: { top: 40, right: 20, bottom: 40, left: 20 } },
  { name: 'Wide (40px sides, 20px top/bottom)', value: { top: 20, right: 40, bottom: 20, left: 40 } },
]

export const CropControls: React.FC<CropControlsProps> = ({
  cropSettings,
  onCropSettingsChange
}) => {
  const handlePresetChange = (presetName: string) => {
    const preset = marginPresets.find(p => p.name === presetName)
    if (preset) {
      onCropSettingsChange({
        ...preset.value,
        enabled: cropSettings.enabled
      })
    }
  }

  const toggleCropMode = () => {
    onCropSettingsChange({
      ...cropSettings,
      enabled: !cropSettings.enabled
    })
  }

  const getCurrentPresetName = () => {
    const currentPreset = marginPresets.find(preset => 
      preset.value.top === cropSettings.top &&
      preset.value.right === cropSettings.right &&
      preset.value.bottom === cropSettings.bottom &&
      preset.value.left === cropSettings.left
    )
    return currentPreset ? currentPreset.name : 'Custom'
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex items-center gap-2">
        <Crop className="ml-2 size-4" />
        <span className="text-sm font-medium">Export Crop:</span>
      </div>

      <Button
        variant={cropSettings.enabled ? "default" : "outline"}
        size="sm"
        onClick={toggleCropMode}
        className="flex items-center gap-2"
      >
              {cropSettings.enabled ?  <EyeOff className="size-4" /> : <Eye className="size-4" /> }
      </Button>

      <Select 
        value={getCurrentPresetName()} 
        onValueChange={handlePresetChange}
        disabled={!cropSettings.enabled}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select margins" />
        </SelectTrigger>
        <SelectContent>
          {marginPresets.map((preset) => (
            <SelectItem key={preset.name} value={preset.name}>
              {preset.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

    </div>
  )
}
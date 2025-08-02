import React, { useRef, useCallback, useState } from 'react'
import { Upload, Download, Plus, Minus, Palette, Copy, FileImage, RefreshCw, Table, MousePointer2, ArrowBigDown, ArrowBigUp, ArrowBigLeft, ArrowBigRight, Type } from 'lucide-react'
import { FancyTable } from './components/FancyTable.tsx'
import { BackgroundWrapper } from './components/BackgroundWrapper.tsx'
import { BackgroundControls } from './components/BackgroundControls.tsx'
import { ThemeToggle } from './components/ThemeToggle.tsx'
import { Button } from './components/ui/button.tsx'
import { Card, CardContent } from './components/ui/card.tsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select.tsx'
import { useTableData } from './hooks/useTableData.ts'
import { arrayToTableData, parseCSV, parseExcel, tableDataToCSV, tableDataToExcel } from './lib/fileUtils.ts'
import { defaultThemes, getThemeById } from './lib/themes.ts'
import { downloadFile, cn } from './lib/utils.ts'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'

function App() {
  const {
    tableData,
    updateTableData,
    updateTheme,
    resetTable,
    addRow,
    addColumn
  } = useTableData()

  const [backgroundColor, setBackgroundColor] = useState<string | undefined>(undefined)
  const [backgroundImage, setBackgroundImage] = useState<string | undefined>(undefined)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      let data: string[][]

      if (file.name.endsWith('.csv')) {
        const text = await file.text()
        data = parseCSV(text)
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        data = await parseExcel(file)
      } else {
        alert('Please upload a CSV or Excel file')
        return
      }

      const tableData = arrayToTableData(data, file.name)
      updateTableData(tableData)
    } catch (error) {
      console.error('Error parsing file:', error)
      alert('Error parsing file. Please check the file format.')
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [updateTableData])

  const handlePaste = useCallback(async (event: React.ClipboardEvent) => {
    event.preventDefault()

    const text = event.clipboardData.getData('text')
    if (!text) return

    try {
      const data = parseCSV(text)
      const newTableData = arrayToTableData(data, 'Pasted Data')
      updateTableData(newTableData)
    } catch (error) {
      console.error('Error parsing pasted data:', error)
    }
  }, [updateTableData])

  const handleCopyTable = useCallback(async () => {
    try {
      const csv = tableDataToCSV(tableData)
      await navigator.clipboard.writeText(csv)
      alert('Table copied to clipboard!')
    } catch (error) {
      console.error('Error copying table:', error)
      alert('Error copying table to clipboard')
    }
  }, [tableData])

  const handleDownloadCSV = useCallback(() => {
    const csv = tableDataToCSV(tableData)
    downloadFile(csv, `${tableData.name}.csv`, 'text/csv')
  }, [tableData])

  const handleDownloadExcel = useCallback(() => {
    const buffer = tableDataToExcel(tableData)
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    saveAs(blob, `${tableData.name}.xlsx`)
  }, [tableData])

  const handleExportImage = useCallback(async () => {
    if (!tableRef.current) return

    try {
      const canvas = await html2canvas(tableRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true
      })

      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${tableData.name}.png`)
        }
      })
    } catch (error) {
      console.error('Error exporting image:', error)
      alert('Error exporting image')
    }
  }, [tableData.name])

  const handleThemeChange = useCallback((themeId: string) => {
    const theme = getThemeById(themeId)
    updateTheme(theme)
  }, [updateTheme])

  // Font size management
  const getCurrentFontSize = useCallback(() => {
    return parseInt(tableData.theme.fontSize.replace('px', ''))
  }, [tableData.theme.fontSize])

  const updateFontSize = useCallback((newSize: number) => {
    const newTheme = {
      ...tableData.theme,
      fontSize: `${newSize}px`
    }
    updateTheme(newTheme)
  }, [tableData.theme, updateTheme])

  const increaseFontSize = useCallback(() => {
    const currentSize = getCurrentFontSize()
    const newSize = Math.min(currentSize + 2, 32) // Max 32px
    updateFontSize(newSize)
  }, [getCurrentFontSize, updateFontSize])

  const decreaseFontSize = useCallback(() => {
    const currentSize = getCurrentFontSize()
    const newSize = Math.max(currentSize - 2, 10) // Min 10px
    updateFontSize(newSize)
  }, [getCurrentFontSize, updateFontSize])

  const commandButtonClass = cn("size-6 rounded-md border border-gray-300 bg-white p-1 shadow-sm")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Hero Header */}
        <div className="relative flex items-center justify-between px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-2">
              <Table className="size-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  tcarbon
                </span>
              </h1>
              <p className="text-sm text-muted-foreground">Carbon for tables - Create beautiful table presentations</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Toolbar */}
        <Card className="p-0">
          <CardContent className="p-0">
            <div className="flex flex-wrap items-center justify-between gap-4 p-2">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="size-4" />
                  Import File
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyTable}
                  className="flex items-center gap-2"
                >
                  <Copy className="size-4" />
                  Copy
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-2"
                >
                  <Download className="size-4" />
                  CSV
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadExcel}
                  className="flex items-center gap-2"
                >
                  <Download className="size-4" />
                  Excel
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportImage}
                  className="flex items-center gap-2"
                >
                  <FileImage className="size-4" />
                  PNG
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addRow}
                  className="flex items-center gap-2"
                >
                  <Plus className="size-4" />
                  Row
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={addColumn}
                  className="flex items-center gap-2"
                >
                  <Plus className="size-4" />
                  Column
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetTable}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="size-4" />
                  Reset
                </Button>

      

                <div className=" -my-2 w-px self-stretch border-l"></div>
                <div className="flex items-center gap-2">
                  <Type className="size-4" /> Font Size:
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={decreaseFontSize}
                      className="flex size-8 items-center justify-center p-0"
                      disabled={getCurrentFontSize() <= 10}
                    >
                      <Minus className="size-3" />
                    </Button>
                    <span className="min-w-[2.5rem] text-center text-sm font-medium">
                      {getCurrentFontSize()}px
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={increaseFontSize}
                      className="flex size-8 items-center justify-center p-0"
                      disabled={getCurrentFontSize() >= 32}
                    >
                      <Plus className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Controls */}
            <div className="flex flex-row border-t">
              <BackgroundControls
                backgroundColor={backgroundColor}
                backgroundImage={backgroundImage}
                onBackgroundColorChange={setBackgroundColor}
                onBackgroundImageChange={setBackgroundImage}
              />
              <div className="flex items-center gap-2">
                <Palette className="size-4" /> Themes:
                <Select value={tableData.theme.id} onValueChange={handleThemeChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultThemes.map((theme) => (
                      <SelectItem key={theme.id} value={theme.id}>
                        {theme.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mx-2 w-px self-stretch border-l"></div>

            </div>
          </CardContent>
        </Card>

        {/* Table Preview */}

        <div className="flex flex-col items-center space-y-6">
          <div
            ref={tableRef}
            className="w-full"
            onPaste={handlePaste}
            tabIndex={0}
          >
            <BackgroundWrapper
              theme={tableData.theme}
              backgroundColor={backgroundColor}
              backgroundImage={backgroundImage}
              className="w-full"
            >
              <FancyTable
                data={tableData}
                onDataChange={updateTableData}
              />
            </BackgroundWrapper>
          </div>

          <div className="flex max-w-2xl flex-row gap-2 text-center text-xs leading-relaxed text-muted-foreground">
            <Button variant="command" size="command" className="text-xs text-muted-foreground"><MousePointer2 className={commandButtonClass} /><span className="ml-2">Double-click cells to edit</span></Button>
            <Button variant="command" size="command" className="space-x-1 text-xs text-muted-foreground"><ArrowBigUp className={commandButtonClass} /><ArrowBigDown className={commandButtonClass} /><ArrowBigLeft className={commandButtonClass} /><ArrowBigRight className={commandButtonClass} /><span className="ml-2">Navigate</span></Button>
            <Button variant="command" size="command" className="text-xs text-muted-foreground">
              <p className={cn(commandButtonClass, "flex w-12 items-center justify-center")}>
                <span className="text-xs">CTRL</span>
              </p>
              <span className="mx-2 text-xs">+</span>
              <p className={cn(commandButtonClass, "flex w-6 items-center justify-center")}>
                <span className="text-xs">V</span>
              </p>
              <span className="ml-2">Paste data from Excel/CSV</span></Button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
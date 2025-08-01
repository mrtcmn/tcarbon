import React, { useRef, useCallback } from 'react'
import { Upload, Download, Plus, Minus, Palette, Copy, FileImage, RefreshCw } from 'lucide-react'
import { FancyTable } from './components/FancyTable.tsx'
import { Button } from './components/ui/button.tsx'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card.tsx'
import { Input } from './components/ui/input.tsx'
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
    addColumn,
    removeRow,
    removeColumn
  } = useTableData()

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Fancy Table Preview
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Create beautiful table presentations like Carbon.now.sh, but for tables
            </p>
          </CardHeader>
        </Card>

        {/* Toolbar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
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
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  CSV
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadExcel}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Excel
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportImage}
                  className="flex items-center gap-2"
                >
                  <FileImage className="w-4 h-4" />
                  PNG
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addRow}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Row
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={addColumn}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Column
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetTable}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </Button>

                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table Preview */}
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="text-sm text-gray-600 text-center">
                Double-click cells to edit • Use arrow keys to navigate • Paste data from Excel/CSV
              </div>
              
              <div 
                ref={tableRef}
                className="inline-block"
                onPaste={handlePaste}
                tabIndex={0}
              >
                <FancyTable
                  data={tableData}
                  onDataChange={updateTableData}
                />
              </div>
              
              <div className="text-xs text-gray-500 text-center max-w-2xl">
                Import CSV/Excel files or paste data directly. Themes are inspired by Carbon.now.sh 
                for beautiful presentations. Export as image for sharing or documentation.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
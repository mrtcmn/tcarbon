# 🎨 Fancy Table Preview

A beautiful table presentation tool inspired by [Carbon.now.sh](https://carbon.now.sh/) - but for tables! Create stunning, themed table visualizations with Excel-like editing capabilities.

![Fancy Table Preview](https://img.shields.io/badge/React-19.1.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-blue?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-7.0.4-purple?logo=vite)

## ✨ Features

### 🎯 Core Functionality
- **Excel-like Editing**: Double-click cells to edit, navigate with arrow keys
- **File Import/Export**: Support for CSV and Excel (.xlsx/.xls) files
- **Copy & Paste**: Seamlessly paste data from Excel or Google Sheets
- **Multiple Cell Types**: Text, Number, Currency, Percentage formatting
- **Real-time Editing**: Live preview of changes as you type

### 🎨 Beautiful Themes
- **7 Stunning Themes**: Carbon Dark, Carbon Light, Ocean Blue, Forest Green, Sunset Orange, Minimalist, Neon Purple
- **Carbon.now.sh Inspired**: Beautiful gradients, shadows, and typography
- **Custom Styling**: Each theme includes unique fonts, colors, and visual effects
- **Export as Images**: Save your styled tables as high-quality PNG files

### 📊 Data Management
- **Smart Type Detection**: Automatically detects currency, numbers, percentages
- **Flexible Grid**: Add/remove rows and columns dynamically
- **Data Persistence**: Maintains formatting and structure
- **Multiple Export Formats**: CSV, Excel, PNG images

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 💡 How to Use

### 1. **Import Data**
- Click "Import File" to upload CSV or Excel files
- Or paste data directly from Excel/Google Sheets (Ctrl+V)
- Data types are automatically detected and formatted

### 2. **Edit Tables**
- **Double-click** any cell to start editing
- Use **arrow keys** to navigate between cells
- **Enter** to confirm edits, **Escape** to cancel
- **Delete/Backspace** to clear cell contents

### 3. **Customize Appearance**
- Choose from 7 beautiful themes in the theme selector
- Each theme features unique typography and color schemes
- Inspired by Carbon.now.sh for professional presentations

### 4. **Export & Share**
- **Copy**: Copy table data to clipboard
- **CSV/Excel**: Download in spreadsheet formats
- **PNG**: Export as beautiful images for presentations

## 🎨 Available Themes

| Theme | Description |
|-------|-------------|
| **Carbon Dark** | Dark theme with modern monospace fonts |
| **Carbon Light** | Clean light theme with professional styling |
| **Ocean Blue** | Blue gradient with elegant typography |
| **Forest Green** | Nature-inspired green gradients |
| **Sunset Orange** | Warm orange tones with modern fonts |
| **Minimalist** | Clean, minimal black and white design |
| **Neon Purple** | Vibrant purple gradients with space mono font |

## 🛠️ Tech Stack

- **React 19.1.0** - Latest React with modern features
- **TypeScript 5.8.3** - Full type safety
- **Tailwind CSS 4.1.11** - Modern utility-first styling
- **ShadCN/UI** - Beautiful, accessible components
- **Vite 7.0.4** - Lightning-fast build tool
- **Additional Libraries**:
  - `@tanstack/react-table` - Table state management
  - `xlsx` - Excel file handling
  - `papaparse` - CSV parsing
  - `html2canvas` - Image export
  - `lucide-react` - Beautiful icons

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── FancyTable.tsx  # Main table component
│   └── TableCell.tsx   # Individual cell component
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
│   ├── utils.ts        # Common utilities
│   ├── themes.ts       # Theme definitions
│   └── fileUtils.ts    # File import/export
├── types/              # TypeScript type definitions
└── App.tsx            # Main application component
```

## 🎯 Key Features in Detail

### Excel-like Editing Experience
- Real-time cell editing with proper input handling
- Keyboard navigation (arrows, Enter, Escape, Tab)
- Cell selection with visual feedback
- Support for different data types with smart formatting

### Professional Themes
Each theme includes:
- Custom color palettes and gradients
- Typography choices (monospace, sans-serif, etc.)
- Border styles and shadows
- Responsive design elements

### Advanced Data Handling
- Automatic type detection for imported data
- Currency formatting with customizable symbols
- Number formatting with decimal precision
- Percentage display with proper conversion

### Export Capabilities
- High-quality PNG export with theme styling
- CSV export preserving data formatting
- Excel export with proper data types
- Clipboard integration for easy sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Made with ❤️ for beautiful data presentations**

*Inspired by the amazing work of [Carbon.now.sh](https://carbon.now.sh/) for code snippets*
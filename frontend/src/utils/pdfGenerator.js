import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Generate PDF from the analysis results
 * @param {Object} analysis - Analysis data object
 * @param {string} primaryRasa - Primary emotion rasa
 * @param {Array} chartData - Chart data array
 */
export const downloadResultsAsPDF = async (analysis, primaryRasa, chartData) => {
  try {
    // Create a new jsPDF instance
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 15
    let yPosition = margin

    // Add header with gradient background simulation
    pdf.setFillColor(236, 72, 153) // Pink color
    pdf.rect(0, 0, pageWidth, 40, 'F')
    
    // Add title
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(28)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Navarasa Music Analysis', pageWidth / 2, 20, { align: 'center' })
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text('AI-Powered Emotion Detection', pageWidth / 2, 30, { align: 'center' })
    
    yPosition = 50

    // Primary Emotion Section
    // Note: We're drawing just the border, not filling with color
    
    // Primary emotion box
    pdf.setDrawColor(200, 200, 200)
    pdf.setLineWidth(0.5)
    pdf.roundedRect(margin, yPosition, pageWidth - 2 * margin, 60, 5, 5, 'S')
    
    // Emoji and emotion name (emojis may not render properly in PDF, showing text instead)
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(100, 100, 100)
    pdf.text(primaryRasa.emoji, pageWidth / 2, yPosition + 15, { align: 'center' })
    
    pdf.setTextColor(50, 50, 50)
    pdf.setFontSize(24)
    pdf.setFont('helvetica', 'bold')
    pdf.text(primaryRasa.name, pageWidth / 2, yPosition + 35, { align: 'center' })
    
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`${primaryRasa.sanskrit} • ${primaryRasa.english}`, pageWidth / 2, yPosition + 43, { align: 'center' })
    
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    const confidence = analysis.confidence || 0
    const confidenceText = `${(confidence * 100).toFixed(1)}%`
    pdf.text(confidenceText, pageWidth / 2, yPosition + 55, { align: 'center' })
    
    yPosition += 70

    // Description
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(100, 100, 100)
    const description = pdf.splitTextToSize(primaryRasa.description, pageWidth - 2 * margin - 10)
    pdf.text(description, pageWidth / 2, yPosition, { align: 'center', maxWidth: pageWidth - 2 * margin - 10 })
    
    yPosition += description.length * 5 + 10

    // Emotion Distribution Table
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(50, 50, 50)
    pdf.text('Emotion Distribution', margin, yPosition)
    
    yPosition += 10

    // Table header
    pdf.setFillColor(240, 240, 240)
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 10, 'F')
    
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Emotion (Rasa)', margin + 5, yPosition + 7)
    pdf.text('Percentage', pageWidth - margin - 30, yPosition + 7)
    
    yPosition += 10

    // Table rows
    pdf.setFont('helvetica', 'normal')
    chartData.forEach((item, index) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage()
        yPosition = margin
      }

      // Alternate row colors
      if (index % 2 === 0) {
        pdf.setFillColor(250, 250, 250)
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F')
      }

      // Emotion name
      pdf.setTextColor(50, 50, 50)
      pdf.text(item.name, margin + 5, yPosition + 6)
      
      // Percentage bar
      const barWidth = 30
      const barHeight = 5
      const barX = pageWidth - margin - 35
      const barY = yPosition + 2
      
      // Background bar
      pdf.setFillColor(220, 220, 220)
      pdf.rect(barX, barY, barWidth, barHeight, 'F')
      
      // Filled bar (based on percentage)
      const fillWidth = (item.value / 100) * barWidth
      const color = hexToRgb(item.color)
      pdf.setFillColor(color.r, color.g, color.b)
      pdf.rect(barX, barY, fillWidth, barHeight, 'F')
      
      // Percentage text
      pdf.setFontSize(9)
      pdf.text(`${item.percentage}%`, pageWidth - margin - 5, yPosition + 6, { align: 'right' })
      
      yPosition += 8
    })

    yPosition += 10

    // Analysis Details
    if (yPosition > pageHeight - 50) {
      pdf.addPage()
      yPosition = margin
    }

    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(50, 50, 50)
    pdf.text('Analysis Details', margin, yPosition)
    
    yPosition += 10

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Analysis ID: ${analysis._id || 'N/A'}`, margin, yPosition)
    yPosition += 6
    
    if (analysis.filename) {
      pdf.text(`File: ${analysis.filename}`, margin, yPosition)
      yPosition += 6
    }
    
    if (analysis.createdAt) {
      const date = new Date(analysis.createdAt).toLocaleString()
      pdf.text(`Date: ${date}`, margin, yPosition)
      yPosition += 6
    }

    // Footer
    const footerY = pageHeight - 20
    pdf.setDrawColor(200, 200, 200)
    pdf.line(margin, footerY, pageWidth - margin, footerY)
    
    pdf.setFontSize(9)
    pdf.setTextColor(100, 100, 100)
    pdf.text('Generated by Navarasa Music Analyzer', pageWidth / 2, footerY + 6, { align: 'center' })
    pdf.text('Created by Himanshu Ganesh Firke', pageWidth / 2, footerY + 11, { align: 'center' })
    
    pdf.setTextColor(236, 72, 153)
    pdf.textWithLink('himanshufirke04@gmail.com', pageWidth / 2, footerY + 16, { 
      align: 'center',
      url: 'mailto:himanshufirke04@gmail.com'
    })

    // Save the PDF
    const filename = `navarasa-analysis-${analysis._id || Date.now()}.pdf`
    pdf.save(filename)
    
    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}

/**
 * Alternative method: Capture the entire results page as an image and convert to PDF
 * @param {string} elementId - ID of the element to capture
 */
export const downloadResultsAsImagePDF = async (elementId = 'results-container') => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('Results container not found')
    }

    // Capture the element as canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    const imgWidth = pageWidth - 20 // 10mm margin on each side
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    let heightLeft = imgHeight
    let position = 10 // Top margin

    // Add first page
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight + 10
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    const filename = `navarasa-analysis-${Date.now()}.pdf`
    pdf.save(filename)
    
    return true
  } catch (error) {
    console.error('Error generating image PDF:', error)
    throw error
  }
}

// Helper function to convert hex color to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 }
}

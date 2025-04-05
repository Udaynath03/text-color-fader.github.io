document.addEventListener("DOMContentLoaded", () => {
  // Get DOM elements
  const inputText = document.getElementById("inputText")
  const startColor = document.getElementById("startColor")
  const endColor = document.getElementById("endColor")
  const startColorHex = document.getElementById("startColorHex")
  const endColorHex = document.getElementById("endColorHex")
  const generateBtn = document.getElementById("generateBtn")
  const previewArea = document.getElementById("previewArea")
  const outputCode = document.getElementById("outputCode")
  const copyBtn = document.getElementById("copyBtn")
  const formatHTML = document.getElementById("formatHTML")
  const formatBBCode = document.getElementById("formatBBCode")
  const presetButtons = document.querySelectorAll(".color-preset")

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))

  // Sync color inputs
  startColor.addEventListener("input", function () {
    startColorHex.value = this.value
  })

  startColorHex.addEventListener("input", function () {
    if (isValidHexColor(this.value)) {
      startColor.value = this.value
    }
  })

  endColor.addEventListener("input", function () {
    endColorHex.value = this.value
  })

  endColorHex.addEventListener("input", function () {
    if (isValidHexColor(this.value)) {
      endColor.value = this.value
    }
  })

  // Generate button click handler
  generateBtn.addEventListener("click", () => {
    generateFadedText()
    animateElement(previewArea)
    animateElement(outputCode)
  })

  // Copy button click handler
  copyBtn.addEventListener("click", () => {
    outputCode.select()
    document.execCommand("copy")

    // Change button text temporarily
    const originalText = copyBtn.textContent
    copyBtn.textContent = "Copied!"
    copyBtn.classList.add("btn-success")
    copyBtn.classList.remove("btn-secondary")

    setTimeout(() => {
      copyBtn.textContent = originalText
      copyBtn.classList.remove("btn-success")
      copyBtn.classList.add("btn-secondary")
    }, 2000)
  })

  // Format change handler
  formatHTML.addEventListener("change", generateFadedText)
  formatBBCode.addEventListener("change", generateFadedText)

  // Color preset handlers
  presetButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const colors = this.dataset.colors.split(",")
      startColor.value = colors[0]
      endColor.value = colors[1]
      startColorHex.value = colors[0]
      endColorHex.value = colors[1]
      generateFadedText()
      animateElement(previewArea)
    })
  })

  // Initial generation
  generateFadedText()

  // Function to generate faded text
  function generateFadedText() {
    const text = inputText.value || "Hello World"
    const start = startColor.value
    const end = endColor.value
    const format = document.querySelector('input[name="outputFormat"]:checked').value

    const result = createFadedText(text, start, end, format)

    // Update preview
    previewArea.innerHTML = result.html

    // Update output code
    outputCode.value = result.code
  }

  // Function to create faded text
  function createFadedText(text, startColor, endColor, format) {
    const chars = text.split("")
    const len = chars.length

    let html = ""
    let code = ""

    // Convert hex to RGB
    const startRGB = hexToRgb(startColor)
    const endRGB = hexToRgb(endColor)

    // Calculate step for each color component
    const stepR = (endRGB.r - startRGB.r) / (len - 1 || 1)
    const stepG = (endRGB.g - startRGB.g) / (len - 1 || 1)
    const stepB = (endRGB.b - startRGB.b) / (len - 1 || 1)

    // Generate colored text
    chars.forEach((char, i) => {
      // Calculate current color
      const r = Math.round(startRGB.r + stepR * i)
      const g = Math.round(startRGB.g + stepG * i)
      const b = Math.round(startRGB.b + stepB * i)
      const hexColor = rgbToHex(r, g, b)

      if (format === "html") {
        const span = `<span style="color:${hexColor}">${escapeHTML(char)}</span>`
        html += span
        code += span
      } else if (format === "bbcode") {
        const bbcode = `[color=${hexColor}]${char}[/color]`
        html += `<span style="color:${hexColor}">${escapeHTML(char)}</span>`
        code += bbcode
      }
    })

    return { html, code }
  }

  // Helper function to convert hex to RGB
  function hexToRgb(hex) {
    hex = hex.replace(/^#/, "")

    // Handle shorthand hex
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
    }

    const bigint = Number.parseInt(hex, 16)
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    }
  }

  // Helper function to convert RGB to hex
  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  // Helper function to check if a string is a valid hex color
  function isValidHexColor(hex) {
    return /^#?([0-9A-F]{3}){1,2}$/i.test(hex)
  }

  // Helper function to escape HTML
  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  // Helper function to animate elements
  function animateElement(element) {
    element.classList.remove("fade-in")
    void element.offsetWidth // Trigger reflow
    element.classList.add("fade-in")
  }

  // Add input event listeners for real-time preview
  inputText.addEventListener("input", debounce(generateFadedText, 300))
  startColor.addEventListener("input", debounce(generateFadedText, 300))
  endColor.addEventListener("input", debounce(generateFadedText, 300))

  // Debounce function to limit how often a function is called
  function debounce(func, wait) {
    let timeout
    return function () {
      
      const args = arguments
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        func.apply(this, args)
      }, wait)
    }
  }
})


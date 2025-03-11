export function formatCurrency(value) {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '')
  
  // Convert to number and format
  const number = parseInt(digits, 10) / 100
  return new Intl.NumberFormat('vi-VI', {
    style: 'currency',
    currency: 'VND',
  }).format(number || 0)
}

export function parseCurrencyInput(value) {
  // Remove all non-digit characters
  return value.replace(/\D/g, '')
}


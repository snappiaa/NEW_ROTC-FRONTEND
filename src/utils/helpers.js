// Convert camelCase to snake_case
export function camelToSnake(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(camelToSnake)
  }

  const result = {}
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    result[snakeKey] = camelToSnake(obj[key])
  }
  return result
}

// Convert snake_case to camelCase
export function snakeToCamel(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel)
  }

  const result = {}
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
    result[camelKey] = snakeToCamel(obj[key])
  }
  return result
}

// Format date to readable string
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format time to readable string
export function formatTime(time) {
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Validate email format
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Get status color
export function getStatusColor(status) {
  const colors = {
    present: '#4CAF50',
    late: '#FFC107',
    absent: '#ec003f',
  }
  return colors[status] || '#999999'
}

// Get status tag type for Element Plus
export function getStatusTagType(status) {
  const types = {
    present: 'success',
    late: 'warning',
    absent: 'danger',
  }
  return types[status] || 'info'
}

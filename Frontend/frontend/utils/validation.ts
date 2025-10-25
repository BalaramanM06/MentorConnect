export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long")
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter")
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter")
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number")
  }

  return { valid: errors.length === 0, errors }
}

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100
}

export const validateCourseData = (data: {
  title: string
  description: string
  duration: number
  fees: number
}): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!data.title || data.title.trim().length < 3) {
    errors.push("Course title must be at least 3 characters")
  }
  if (!data.description || data.description.trim().length < 10) {
    errors.push("Course description must be at least 10 characters")
  }
  if (data.duration < 1 || data.duration > 365) {
    errors.push("Course duration must be between 1 and 365 days")
  }
  if (data.fees < 0 || data.fees > 10000) {
    errors.push("Course fees must be between 0 and 10000")
  }

  return { valid: errors.length === 0, errors }
}

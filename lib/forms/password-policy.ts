import { accountPasswordConstraints } from "@/lib/constants"
import { PasswordPolicyViolation } from "@/lib/types"

export function getPasswordPolicyViolation(
  password: string
): PasswordPolicyViolation | null {
  if (password.length < accountPasswordConstraints.minLength) {
    return PasswordPolicyViolation.TooShort
  }
  if (password.length > accountPasswordConstraints.maxLength) {
    return PasswordPolicyViolation.TooLong
  }
  if (!accountPasswordConstraints.digitPattern.test(password)) {
    return PasswordPolicyViolation.DigitMissing
  }
  if (!accountPasswordConstraints.uppercaseLetterPattern.test(password)) {
    return PasswordPolicyViolation.UppercaseLetterMissing
  }
  if (!accountPasswordConstraints.lowercaseLetterPattern.test(password)) {
    return PasswordPolicyViolation.LowercaseLetterMissing
  }
  return null
}

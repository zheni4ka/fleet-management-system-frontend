import {
  accountPasswordConstraints,
  passwordPolicyMessages,
} from "@/lib/constants"

export function getPasswordPolicyViolationMessage(
  password: string
): string | null {
  if (password.length < accountPasswordConstraints.minLength) {
    return passwordPolicyMessages.tooShort
  }
  if (password.length > accountPasswordConstraints.maxLength) {
    return passwordPolicyMessages.tooLong
  }
  if (!accountPasswordConstraints.digitPattern.test(password)) {
    return passwordPolicyMessages.digitMissing
  }
  if (!accountPasswordConstraints.uppercaseLetterPattern.test(password)) {
    return passwordPolicyMessages.uppercaseLetterMissing
  }
  if (!accountPasswordConstraints.lowercaseLetterPattern.test(password)) {
    return passwordPolicyMessages.lowercaseLetterMissing
  }
  return null
}

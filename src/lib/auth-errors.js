// Maps the `code` Auth.js returns for a failed credentials sign-in (see
// CredentialsError in auth.config.js) to a translated message from messages/*/Auth.json.
export function getAuthErrorMessage(t, code) {
  return code && t.has(`ERRORS.${code}`) ? t(`ERRORS.${code}`) : t("AUTH_ERROR");
}

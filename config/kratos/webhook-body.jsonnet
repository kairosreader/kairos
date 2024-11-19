function(ctx) {
  local identity = ctx.identity,
  local defaultPreferences = {
    theme: "system",
    fontSize: 16,
    lineSpacing: 1.5,
    defaultHighlightColor: "yellow"
  },
  id: identity.id,
  email: identity.traits.email,
  name: identity.traits.name,
  preferences: defaultPreferences
}
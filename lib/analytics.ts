// Centralized Plausible event names. Using these constants in className
// strings keeps every conversion point spelled identically across the codebase
// — change the label once here, every link picks it up.
//
// Plausible reads the class name `plausible-event-name=<event>` and emits the
// event when the element is clicked. Spaces are encoded as `+`. See:
// https://plausible.io/docs/custom-event-goals#tagged-events
export const plausibleEvent = {
  call: "plausible-event-name=Call+click",
  email: "plausible-event-name=Email+click",
  sms: "plausible-event-name=SMS+click",
  quoteSubmit: "plausible-event-name=Quote+submit",
} as const;

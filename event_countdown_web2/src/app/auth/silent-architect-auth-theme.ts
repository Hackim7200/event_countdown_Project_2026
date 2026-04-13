import { createTheme } from "@aws-amplify/ui";

/**
 * Amplify UI tokens aligned with todo/events chrome (#1A1A1A, #F8F9FA, #E8EAED).
 */
export const silentArchitectAuthTheme = createTheme({
  name: "silent-architect-auth",
  tokens: {
    colors: {
      primary: {
        10: { value: "#F3F4F6" },
        20: { value: "#E5E7EB" },
        40: { value: "#9CA3AF" },
        60: { value: "#6B7280" },
        80: { value: "#1A1A1A" },
        90: { value: "#141414" },
        100: { value: "#0D0D0D" },
      },
      background: {
        primary: { value: "#F8F9FA" },
        secondary: { value: "#FFFFFF" },
      },
      font: {
        primary: { value: "#1A1A1A" },
        secondary: { value: "#6B7280" },
        tertiary: { value: "#9CA3AF" },
        interactive: { value: "#1A1A1A" },
        hover: { value: "#374151" },
        focus: { value: "#1A1A1A" },
        active: { value: "#1A1A1A" },
      },
      border: {
        primary: { value: "#D1D5DB" },
        secondary: { value: "#E8EAED" },
        tertiary: { value: "#E8EAED" },
        focus: { value: "#1A1A1A" },
        pressed: { value: "#1A1A1A" },
      },
    },
    radii: {
      small: { value: "0.375rem" },
      medium: { value: "0.5rem" },
      large: { value: "0.5rem" },
    },
    components: {
      authenticator: {
        router: {
          backgroundColor: { value: "#FFFFFF" },
          borderColor: { value: "#E8EAED" },
          boxShadow: { value: "0 1px 3px rgba(15, 23, 42, 0.07)" },
        },
        container: {
          widthMax: { value: "22rem" },
        },
      },
      tabs: {
        item: {
          color: { value: "#A0A0A0" },
          fontSize: { value: "0.6875rem" },
          fontWeight: { value: "{fontWeights.semibold.value}" },
          _hover: {
            color: { value: "#6B7280" },
          },
          _active: {
            color: { value: "#1A1A1A" },
            borderColor: { value: "#1A1A1A" },
          },
          _focus: {
            color: { value: "#1A1A1A" },
          },
        },
      },
      fieldcontrol: {
        borderRadius: { value: "{radii.medium.value}" },
      },
    },
  },
});

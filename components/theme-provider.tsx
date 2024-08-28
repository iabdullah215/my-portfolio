"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider defaultTheme="light" {...props}>
      {children}
    </NextThemesProvider>
  )
}

const ThemedComponent = () => {
  const { theme } = useTheme()

  return (
    <div
      style={{
        backgroundColor: theme === "dark" ? "#3a3b3c" : "#f7fafc",
        color: theme === "dark" ? "#f7fafc" : "#1a202c",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      This is some themed content with a custom dark background color.
    </div>
  )
}

export default ThemedComponent

// lib/theme.ts

export const lightTheme = {
    colors: {
      primary: '#8B4513', // Warm brown for key elements
      secondary: '#FFD700', // Gold for highlights
      background: '#FDF5E6', // Soft cream for backgrounds
      text: '#3C2F2F', // Dark brown for text
      muted: '#A9A9A9', // Gray for secondary text or borders
      error: '#DC143C', // Crimson for errors
      success: '#228B22', // Forest green for success
    },
    fonts: {
      heading: 'Georgia, serif', // Serif for titles
      body: 'Arial, sans-serif', // Sans-serif for content
    },
    fontSizes: {
      sm: '0.875rem', // 14px
      md: '1rem', // 16px
      lg: '1.25rem', // 20px
      xl: '1.5rem', // 24px
    },
    spacing: {
      xs: '0.25rem', // 4px
      sm: '0.5rem', // 8px
      md: '1rem', // 16px
      lg: '1.5rem', // 24px
      xl: '2rem', // 32px
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    borderRadius: {
      sm: '0.25rem', // 4px
      md: '0.5rem', // 8px
    },
  };
  
  export const darkTheme = {
    colors: {
      primary: '#DAA520', // Goldenrod for key elements (brighter for dark mode)
      secondary: '#FFD700', // Gold for highlights (same as light)
      background: '#2F2F2F', // Dark gray for backgrounds
      text: '#F5F5F5', // Off-white for text
      muted: '#808080', // Medium gray for secondary text or borders
      error: '#FF4040', // Bright red for errors
      success: '#32CD32', // Lime green for success
    },
    fonts: {
      heading: 'Georgia, serif', // Same as light theme
      body: 'Arial, sans-serif', // Same as light theme
    },
    fontSizes: {
      sm: '0.875rem', // 14px
      md: '1rem', // 16px
      lg: '1.25rem', // 20px
      xl: '1.5rem', // 24px
    },
    spacing: {
      xs: '0.25rem', // 4px
      sm: '0.5rem', // 8px
      md: '1rem', // 16px
      lg: '1.5rem', // 24px
      xl: '2rem', // 32px
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.5)', // Darker shadow for contrast
      md: '0 4px 6px rgba(0, 0, 0, 0.5)',
    },
    borderRadius: {
      sm: '0.25rem', // 4px
      md: '0.5rem', // 8px
    },
  };
  
  // Default export for convenience (e.g., if you want a default theme)
  export const theme = {
    light: lightTheme,
    dark: darkTheme,
  };
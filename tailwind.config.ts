
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Educational theme colors
				'edu-blue': 'hsl(var(--edu-blue))',
				'edu-orange': 'hsl(var(--edu-orange))',
				'edu-light-blue': 'hsl(var(--edu-light-blue))',
				'edu-dark-blue': 'hsl(var(--edu-dark-blue))',
				'edu-purple': 'hsl(var(--edu-purple))',
				'success-green': 'hsl(var(--success-green))',
				'warning-yellow': 'hsl(var(--warning-yellow))',
				// Hover colors
				'hover-bg': 'hsl(var(--hover-bg))',
				'hover-card': 'hsl(var(--hover-card))',
				'hover-muted': 'hsl(var(--hover-muted))',
				// Scrollbar colors
				'scrollbar-track': 'hsl(var(--scrollbar-track))',
				'scrollbar-thumb': 'hsl(var(--scrollbar-thumb))',
				'scrollbar-thumb-hover': 'hsl(var(--scrollbar-thumb-hover))'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				'slide-in-right': {
					'0%': {
						transform: 'translateX(100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				'slide-in-left': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.9)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				},
				'bounce-subtle': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				},
				'pulse-slow': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.7'
					}
				},
				'glow': {
					'0%, 100%': {
						boxShadow: '0 0 5px hsl(var(--edu-blue))'
					},
					'50%': {
						boxShadow: '0 0 20px hsl(var(--edu-blue)), 0 0 30px hsl(var(--edu-blue))'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'blob': {
					'0%': {
						transform: 'translate(0px, 0px) scale(1)'
					},
					'33%': {
						transform: 'translate(30px, -50px) scale(1.1)'
					},
					'66%': {
						transform: 'translate(-20px, 20px) scale(0.9)'
					},
					'100%': {
						transform: 'translate(0px, 0px) scale(1)'
					}
				},
				'shimmer': {
					'0%': {
						transform: 'translateX(-100%)'
					},
					'100%': {
						transform: 'translateX(100%)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'fade-in': 'fade-in 0.4s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'slide-in-left': 'slide-in-left 0.3s ease-out',
				'scale-in': 'scale-in 0.3s ease-out',
				'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'float': 'float 3s ease-in-out infinite',
				'blob': 'blob 7s infinite',
				'shimmer': 'shimmer 2s infinite'
			},
			backdropBlur: {
				xs: '2px'
			},
			boxShadow: {
				'glow': '0 0 20px hsl(var(--edu-blue) / 0.3)',
				'glow-lg': '0 0 40px hsl(var(--edu-blue) / 0.4)',
				'modern': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
				'modern-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
			},
			fontFamily: {
				'armenian': ['Noto Sans Armenian', 'system-ui', 'sans-serif']
			},
			spacing: {
				'18': '4.5rem',
				'88': '22rem',
				'128': '32rem'
			}
		}
	},
	plugins: [
		require("tailwindcss-animate"),
		function({ addUtilities }: any) {
			const newUtilities = {
				'.animation-delay-2000': {
					'animation-delay': '2s'
				},
				'.animation-delay-4000': {
					'animation-delay': '4s'
				},
				'.smooth-transition': {
					'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
				},
				'.text-shadow': {
					'text-shadow': '0 2px 4px rgb(0 0 0 / 0.1)'
				},
				'.text-shadow-lg': {
					'text-shadow': '0 4px 8px rgb(0 0 0 / 0.15)'
				}
			}
			addUtilities(newUtilities)
		}
	],
} satisfies Config;

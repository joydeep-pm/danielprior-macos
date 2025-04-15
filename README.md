# 🍎 macOS Portfolio

A stunning, interactive macOS-inspired portfolio website built with Next.js and Tailwind CSS.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13%2B-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)

![macOS Portfolio Demo](public/macos-portfolio-demo.png)

## ✨ Features

- 🖥️ Realistic macOS interface with dark/light mode
- 🚀 Interactive desktop experience with working windows
- 🔍 Spotlight search functionality
- 🧩 Multiple apps to showcase your skills and projects:
  - Safari (for web browsing)
  - Notes (for bio/resume)
  - Terminal (interactive command line)
  - VSCode (code samples)
  - Mail (contact link)
  - GitHub (profile link)
  - Spotify (music player)
  - YouTube (video channel)
  - FaceTime (video chat demo)
- 🎛️ Working Control Center with brightness and volume controls
- 🔄 Boot, login, sleep, and shutdown sequences
- 📱 Fully responsive design
- ⚡ Fast and optimized performance

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/macos-portfolio.git
cd macos-portfolio
npm install
# or
yarn install

3. Run the development server:

npm run dev
# or
yarn dev

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.


## 🎨 Customization

### Personal Information

Edit the following files to customize your portfolio:

- `components/apps/about-me.tsx` - Your bio and personal information
- `components/apps/projects.tsx` - Your projects showcase
- `components/apps/skills.tsx` - Your skills and expertise
- `components/apps/resume.tsx` - Your education and work experience
- `components/apps/contact.tsx` - Your contact information
- `components/apps/terminal.tsx` - Custom terminal commands and responses


### Social Links

Update your social media links in:

- `components/apps/github.tsx` - GitHub profile URL
- `components/apps/youtube.tsx` - YouTube channel URL
- `components/apps/mail.tsx` - Email address
- `components/apps/safari.tsx` - Featured websites and social links


### Appearance

- Replace wallpapers in `public/wallpaper-day.jpg` and `public/wallpaper-night.jpg`
- Update app icons in the `public` folder
- Modify the color scheme in `tailwind.config.ts`


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Important**: If you use this template for your own portfolio, you must include attribution to the original author. Please keep the attribution in the footer or about section of your site.

## 🙏 Acknowledgments

- Special thanks to [Renovamen](https://github.com/Renovamen/playground-macos) for the original inspiration for this macOS-themed portfolio concept.
- Icons from [Lucide React](https://lucide.dev/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/)


## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/macos-portfolio/issues).

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - [your.email@example.com](mailto:your.email@example.com)

Project Link: [https://github.com/yourusername/macos-portfolio](https://github.com/yourusername/macos-portfolio)

---

`<p align="center">`Made with ❤️ by Your Name`</p>`

```plaintext

To see how this README will look when rendered on GitHub:

1. Create a file named `README.md` in the root of your project
2. Copy and paste the entire content above into that file
3. Push it to your GitHub repository

The rendered version on GitHub will include:
- Properly formatted headings
- Colorful badges at the top
- Emoji icons throughout the document
- Proper code block formatting
- Centered text at the bottom

Remember to replace the placeholder information (like "yourusername" and "Your Name") with your actual details before publishing.
```